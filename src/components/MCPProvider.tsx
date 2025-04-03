"use client";
import React from 'react';
import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { MCPClient } from '../hooks/useMCP';

export interface MCPContextType {
    mcpClient: MCPClient | null;
    loading: boolean;
    error: string | null;
    reconnect: (sseUrl?: string, resourceFilter?: string) => Promise<void>;
    connect: (sseUrl: string, resourceFilter?: string) => Promise<void>;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
}
export interface MCPProviderProps {
    children: ReactNode;
  }
const MCPContext = createContext<MCPContextType>({
    mcpClient: null,
    loading: false,
    error: null,
    reconnect: async () => { },
    connect: async () => { },
    tools: [],
    resources: [],
    resourceTemplates: [],
    prompts: []
});

export const useMCP = () => useContext(MCPContext);

export function MCPProvider({ children }: { children: ReactNode }) {
    const [mcpClient, setMcpClient] = useState<MCPClient | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tools, setTools] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [resourceTemplates, setResourceTemplates] = useState<any[]>([]);
    const [prompts, setPrompts] = useState<any[]>([]);

    const [lastConnectedUrl, setLastConnectedUrl] = useState<string | null>(null);
    const [lastResourceFilter, setLastResourceFilter] = useState<string>("");

    // 创建MCP客户端的函数
    const createClient = async (sseUrl: string, currentFilter: string) => {
        setLoading(true);
        setError(null);
        // 清空之前的数据
        setTools([]);
        setResources([]);
        setResourceTemplates([]);
        setPrompts([]);

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
                },
                onReady: (data) => {
                    console.log('MCP客户端连接成功', data);
                }
            });

            // 连接到服务器
            await client.connect();

            // @ts-ignore
            window.mcpClient = client;

            setMcpClient(client);
            setLoading(false);
            return client;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('MCP客户端连接失败:', error);
            setError(`连接失败: ${errorMessage}`);
            setLoading(false);

            return null;
        }
    };

    // 初始连接函数
    const connect = async (sseUrl: string, resourceFilter?: string) => {
        console.log(mcpClient);
        if (mcpClient) {
            try {
                mcpClient.disconnect();
            } catch (e) {
                console.warn('关闭旧连接时出错:', e);
            }
        }

        const filter = resourceFilter || "";
        console.log('正在连接MCP服务...');
        const client = await createClient(sseUrl, filter);
        if (client) {
            setLastConnectedUrl(sseUrl);
            setLastResourceFilter(filter);
        }
    };

    // 重连函数
    const reconnect = async (sseUrl?: string, resourceFilter?: string) => {
        // 使用提供的URL，或最后成功连接的URL，或当前客户端URL，或默认URL
        const connectionUrl = sseUrl || lastConnectedUrl || mcpClient?.url || 'http://127.0.0.1:8080';
        // 使用提供的过滤器或最后使用的过滤器
        const filter = resourceFilter !== undefined ? resourceFilter : lastResourceFilter;

        if (mcpClient) {
            try {
                mcpClient.disconnect();
            } catch (e) {
                console.warn('关闭旧连接时出错:', e);
            }
        }

        console.log('正在重新连接MCP服务...');
        const client = await createClient(connectionUrl, filter);
        if (client && !sseUrl) {
            // 只有在使用保存的URL重连时才更新lastConnectedUrl
            setLastConnectedUrl(connectionUrl);
            setLastResourceFilter(filter);
        }
    };

    // 添加自动重连逻辑
    useEffect(() => {
        // 当连接出错时自动尝试重连
        if (error && lastConnectedUrl) {
            const timer = setTimeout(() => {
                console.log('检测到连接错误，尝试自动重连...');
                reconnect();
            }, 5000); // 5秒后尝试重连

            return () => clearTimeout(timer);
        }
    }, [error, lastConnectedUrl]);

    // 组件卸载时清理连接
    useEffect(() => {
        return () => {
            if (mcpClient) {
                try {
                    mcpClient.disconnect();
                } catch (e) {
                    console.warn('关闭连接时出错:', e);
                }
            }
        };
    }, [mcpClient]);


    return (
        <MCPContext.Provider value={{
            mcpClient,
            loading,
            error,
            reconnect,
            connect,
            tools,
            resources,
            resourceTemplates,
            prompts
        }}>
            {children}
        </MCPContext.Provider>
    );
}