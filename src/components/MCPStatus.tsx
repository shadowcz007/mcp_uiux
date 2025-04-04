import React from 'react';
import { useMCP } from '../contexts/MCPProvider';
import { useEffect } from 'react';
import { SciFiMCPStatus } from './SciFiMCPStatus';

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

  return (
    <div className={className} style={style}>
      <SciFiMCPStatus
        loading={loading}
        error={error}
        tools={tools}
        resources={resources}
        resourceTemplates={resourceTemplates}
        prompts={prompts}
      />
    </div>
  );
};