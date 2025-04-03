import React from 'react';
import { useMCP } from '../contexts/MCPProvider';
import { useEffect } from 'react';


export interface MCPStatusProps {
  serverUrl?: string;
  resourcePath?: string;
  className?: string;
  style?: React.CSSProperties;
  render?: (props: {
    loading: boolean;
    error: string | null;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
  }) => React.ReactNode;
}

export const MCPStatus: React.FC<MCPStatusProps> = ({
  serverUrl = 'http://localhost:8080',
  resourcePath = '',
  className,
  style,
  render
}) => {
  const { 
    connect, 
    loading, 
    error, 
    tools, 
    resources, 
    resourceTemplates, 
    prompts 
  } = useMCP();

  useEffect(() => {
    connect(serverUrl, resourcePath);
  }, [serverUrl, resourcePath]);

  if (render) {
    return render({ loading, error, tools, resources, resourceTemplates, prompts }) as JSX.Element;
  }

  if (loading) {
    return <div className={className} style={style}>正在连接 MCP 服务...</div>;
  }

  if (error) {
    return <div className={className} style={style}>连接错误: {error}</div>;
  }

  return (
    <div className={className} style={style}>
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
          <li key={index}>{decodeURIComponent(resource.uri)}</li>
        ))}
      </ul>

      <h3>资源模板 ({resourceTemplates.length})</h3>
      <ul>
        {resourceTemplates.map((template, index) => (
          <li key={index}>{decodeURIComponent(template.uriTemplate)}</li>
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
};