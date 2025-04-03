import React, { useEffect } from 'react';
import { useMCP } from '../hooks/useMCP';

interface Tool {
    name: string;
    description?: string;
}

interface Resource {
    uri: string;
}

interface ResourceTemplate {
    uriTemplate: string;
}

interface Prompt {
    name: string;
}

export function MCPStatus() {
    const {
        connect,
        loading,
        error,
        tools,
        resources,
        resourceTemplates,
        prompts
    } = useMCP({});

    useEffect(() => {
        // 组件加载时连接到 MCP 服务
        connect('http://localhost:8080', '/my-resources');
    }, [connect]);

    if (loading) {
        return <div>正在连接 MCP 服务...</div>;
    }

    if (error) {
        return <div>连接错误: {error}</div>;
    }

    return (
        <div>
            <h2>MCP 连接状态</h2>

            <h3>工具列表 ({tools.length})</h3>
            <ul>
                {tools.map((tool, index) => (
                    <li key={index}>{tool.name}</li>
                ))}
            </ul>

            <h3>资源列表 ({resources.length})</h3>
            <ul>
                {resources.map((resource, index) => (
                    <li key={index}>{resource.uri}</li>
                ))}
            </ul>

            <h3>资源模板 ({resourceTemplates.length})</h3>
            <ul>
                {resourceTemplates.map((template, index) => (
                    <li key={index}>{template.uriTemplate}</li>
                ))}
            </ul>

            <h3>提示列表 ({prompts.length})</h3>
            <ul>
                {prompts.map((prompt, index) => (
                    <li key={index}>{prompt.name}</li>
                ))}
            </ul>
        </div>
    );

}