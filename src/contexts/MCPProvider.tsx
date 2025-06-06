import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { MCPClient, transformToolsToOpenAIFunctions } from '../MCPClient';
import { MCPContext } from './useMCP';

export function MCPProvider({ children }: { children: React.ReactNode }) {
    const mcpClientRef = useRef<MCPClient | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<any>({});
    const [notifications, setNotifications] = useState<any>({});
    const [tools, setTools] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [resourceTemplates, setResourceTemplates] = useState<any[]>([]);
    const [prompts, setPrompts] = useState<any[]>([]);
    const [serverInfo, setServerInfo] = useState<any | null>(null);

    const [lastConnectedUrl, setLastConnectedUrl] = useState<string | null>(null);
    const [lastResourceFilter, setLastResourceFilter] = useState<string>("");

    // 添加节流相关的状态和引用
    const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingConnectParamsRef = useRef<{ url: string, filter: string } | null>(null);

    // 添加一个内部断开连接函数，不清除URL信息
    const disconnectInternal = async () => {
        if (mcpClientRef.current) {
            try {
                mcpClientRef.current.disconnect();
                mcpClientRef.current = null;
                // 只清空数据，不清除URL信息
                setTools([]);
                setResources([]);
                setResourceTemplates([]);
                setPrompts([]);
                setServerInfo(null);
            } catch (e) {
                console.warn('关闭连接时出错:', e);
            }
            // 返回一个Promise，延迟200ms后解析，确保连接完全关闭
            return new Promise(resolve => setTimeout(resolve, 200));
        }
        return Promise.resolve();
    };

    // 保持原有的disconnect函数，它会清除URL信息
    const disconnect = async () => {
        if (mcpClientRef.current) {
            try {
                mcpClientRef.current.disconnect();
                mcpClientRef.current = null;
                // 清空所有状态数据
                setTools([]);
                setResources([]);
                setResourceTemplates([]);
                setPrompts([]);
                setServerInfo(null);
                // 清除上次连接的URL，防止自动重连
                setLastConnectedUrl(null);
                setLastResourceFilter("");
            } catch (e) {
                console.warn('关闭连接时出错:', e);
            }
            // 返回一个Promise，延迟200ms后解析，确保连接完全关闭
            return new Promise(resolve => setTimeout(resolve, 200));
        }
        return Promise.resolve();
    };

    // 创建MCP客户端的函数
    const createClient = async (sseUrl: string, currentFilter: string) => {
        setLoading(true);
        setError(null);

        // 确保先断开任何现有连接，但不清除URL信息
        if (mcpClientRef.current) {
            await disconnectInternal();
        }

        // 清空之前的数据
        setTools([]);
        setResources([]);
        setResourceTemplates([]);
        setPrompts([]);
        setServerInfo(null);

        try {
            const client = new MCPClient({
                url: sseUrl,
                onToolsReady: (toolsList) => {
                    console.log('获取到工具列表:', toolsList);
                    setTools(Array.from(toolsList || [], t => {
                        return {
                            ...t,
                            _type: 'tool'
                        }
                    }));
                },
                onResourcesReady: (resourcesList) => {
                    console.log('获取到资源列表:', currentFilter, resourcesList);

                    setResources(Array.from(resourcesList || [], r => {
                        if (!currentFilter || r.uri?.startsWith(currentFilter)) {
                            return {
                                ...r,
                                _type: 'resource'
                            }
                        }
                    }).filter(Boolean));
                },
                onResourceTemplatesReady: (resourceTemplatesList) => {
                    console.log('获取到资源变量列表:', currentFilter, resourceTemplatesList);

                    setResourceTemplates(Array.from(resourceTemplatesList || [], rt => {
                        if (!currentFilter || rt.uriTemplate?.startsWith(currentFilter)) {
                            return {
                                ...rt,
                                _type: 'resourceTemplate'
                            }
                        }
                    }).filter(Boolean));
                },
                onPromptsReady: (promptsList) => {
                    console.log('获取到提示列表:', promptsList);

                    setPrompts(Array.from(promptsList || [], p => {
                        return {
                            ...p,
                            _type: 'prompt'
                        }
                    }).filter(Boolean));
                },
                onError: (err) => {
                    const errorMessage = err.message || '未知错误';
                    console.error('MCP客户端连接失败:', err);
                    setError(`连接失败: ${errorMessage}`);
                    setServerInfo(null);
                },
                onReady: (data) => {
                    console.log('MCP客户端连接成功', data);
                    // 保存 serverInfo
                    setServerInfo(data);
                    setError(null);
                },
                onNotification: (data) => {
                    console.log('onNotification 收到通知消息:', data);
                    setNotification(data);

                    setNotifications((prev:any) => [...prev, {
                        ...data,
                        id: Date.now(), // 添加唯一ID
                        timestamp: new Date()
                    }]);
                    
                }
            });

            // 连接到服务器
            await client.connect();

            // @ts-ignore
            window.mcpClient = client;

            mcpClientRef.current = client;
            setLoading(false);
            setError(null);
            return client;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('MCP客户端连接失败:', error);
            setError(`连接失败: ${errorMessage}`);
            setLoading(false);
            setServerInfo(null);
            return null;
        }
    };

    // 修改初始连接函数，添加节流逻辑
    const connect = async (sseUrl: string, resourceFilter?: string) => {
        if (!(sseUrl && sseUrl.match('http'))) return;

        const filter = resourceFilter || "";

        // 存储最新的连接参数
        pendingConnectParamsRef.current = { url: sseUrl, filter };

        // 如果已经有一个定时器在等待，则清除它
        if (connectTimeoutRef.current) {
            clearTimeout(connectTimeoutRef.current);
        }

        // 设置一个新的定时器，300ms后执行实际的连接操作
        connectTimeoutRef.current = setTimeout(async () => {
            // 确保使用最新的连接参数
            const params = pendingConnectParamsRef.current;
            if (!params) return;

            // 重置待处理的连接参数
            pendingConnectParamsRef.current = null;

            // 确保先断开现有连接
            await disconnect();

            console.log('正在连接MCP服务...', params.url);
            const client = await createClient(params.url, params.filter);
            if (client) {
                setLastConnectedUrl(params.url);
                setLastResourceFilter(params.filter);
            }

            // 清除定时器引用
            connectTimeoutRef.current = null;
        }, 300);
    };

    // 修改重连函数，也应用节流逻辑
    const reconnect = async (sseUrl?: string, resourceFilter?: string) => {
        // 先检查连接是否已经正常，如果已经正常连接，则不需要重连
        if (mcpClientRef.current && !error && !loading) {
            console.log('当前连接正常，无需重连');
            return;
        }

        // 使用提供的URL，或最后成功连接的URL，或当前客户端URL，或默认URL
        const connectionUrl = sseUrl || lastConnectedUrl || mcpClientRef.current?.url || 'http://127.0.0.1:8080';
        // 使用提供的过滤器或最后使用的过滤器
        const filter = resourceFilter !== undefined ? resourceFilter : lastResourceFilter;

        // 存储最新的连接参数
        pendingConnectParamsRef.current = { url: connectionUrl, filter };

        // 如果已经有一个定时器在等待，则清除它
        if (connectTimeoutRef.current) {
            clearTimeout(connectTimeoutRef.current);
        }

        // 设置一个新的定时器，300ms后执行实际的重连操作
        connectTimeoutRef.current = setTimeout(async () => {
            // 确保使用最新的连接参数
            const params = pendingConnectParamsRef.current;
            if (!params) return;

            // 重置待处理的连接参数
            pendingConnectParamsRef.current = null;

            // 再次检查连接状态，防止在等待过程中连接已恢复
            if (mcpClientRef.current && !error && !loading) {
                console.log('连接已恢复正常，取消重连');
                connectTimeoutRef.current = null;
                setError(null);
                return;
            }

            // 使用内部断开函数，不清除URL信息
            await disconnectInternal();

            console.log('正在重新连接MCP服务...', params.url);
            const client = await createClient(params.url, params.filter);
            if (client && !sseUrl) {
                // 只有在使用保存的URL重连时才更新lastConnectedUrl
                setLastConnectedUrl(params.url);
                setLastResourceFilter(params.filter);
            }

            // 清除定时器引用
            connectTimeoutRef.current = null;
        }, 300);
    };
    // 添加自动重连逻辑
    useEffect(() => {
        // 当连接出错时自动尝试重连
        if (error && lastConnectedUrl && !serverInfo) {
            const timer = setTimeout(() => {
                console.log('检测到连接错误，尝试自动重连...', error, lastConnectedUrl);
                reconnect();
            }, 5000); // 5秒后尝试重连
            return () => clearTimeout(timer);
        }
    }, [error, lastConnectedUrl]);

    // 组件卸载时清理连接和定时器
    useEffect(() => {
        return () => {
            if (mcpClientRef.current) {
                try {
                    mcpClientRef.current.disconnect();
                } catch (e) {
                    console.warn('关闭连接时出错:', e);
                }
            }

            // 清理可能存在的定时器
            if (connectTimeoutRef.current) {
                clearTimeout(connectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <MCPContext.Provider value={{
            mcpClient: mcpClientRef.current,
            loading,
            error,
            reconnect,
            connect,
            disconnect,
            tools,
            toolsFunctionCall: transformToolsToOpenAIFunctions(tools),
            resources,
            resourceTemplates,
            prompts,
            serverInfo,
            notification,
            notifications
        }}>
            {children}
        </MCPContext.Provider>
    );
}