import React, { useState } from 'react';
import { useMCP } from '../contexts/useMCP';
import { useEffect } from 'react';
import { SciFiMCPStatus } from './SciFiMCPStatus';
import { MCPSettings } from './MCPSettings';

export interface MCPStatusProps {
  serverUrl?: string;
  resourcePath?: string;
  className?: string;
  style?: React.CSSProperties;
  showSettings?: boolean;
  render?: (props: {
    loading: boolean;
    error: string | null;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
    notifications: any;
  }) => React.ReactNode;
}

export const MCPStatus: React.FC<MCPStatusProps> = ({
  serverUrl: initialServerUrl = 'http://localhost:8080',
  resourcePath: initialResourcePath = '',
  className,
  style,
  showSettings: initialShowSettings = false,
  render
}) => {
  const [serverUrl, setServerUrl] = useState(initialServerUrl);
  const [resourcePath, setResourcePath] = useState(initialResourcePath);
  const [showSettings, setShowSettings] = useState(initialShowSettings);

  useEffect(() => {
    setServerUrl(localStorage.getItem('mcp-uiux-serverUrl') || initialServerUrl);
    setResourcePath(localStorage.getItem('mcp-uiux-resourcePath') || initialResourcePath);
  }, []);

  const {
    connect,
    loading,
    error,
    tools,
    resources,
    resourceTemplates,
    prompts,
    serverInfo,
    notifications
  } = useMCP();

  useEffect(() => {
    connect(serverUrl, resourcePath);
  }, [serverUrl, resourcePath]);

  if (render) {
    return render({ loading, error, tools, resources, resourceTemplates, prompts, notifications }) as JSX.Element;
  }

  return (
    <div className={className} style={style}>
      {showSettings && (
        <MCPSettings
          serverUrl={serverUrl}
          resourcePath={resourcePath}
          onServerUrlChange={(url: string) => { setServerUrl(url); localStorage.setItem('mcp-uiux-serverUrl', url) }}
          onResourcePathChange={(path: string) => { setResourcePath(path); localStorage.setItem('mcp-uiux-resourcePath', path) }}
          style={{ marginBottom: '20px' }}
        />
      )}
      <SciFiMCPStatus
        serverInfo={serverInfo}
        loading={loading}
        error={error}
        tools={tools}
        resources={resources}
        resourceTemplates={resourceTemplates}
        prompts={prompts}
        notifications={notifications}
        onSettingsOpen={() => setShowSettings(!showSettings)}
      />
    </div>
  );
};