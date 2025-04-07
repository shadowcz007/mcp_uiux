import React, { useEffect, useState } from 'react';
import './MCPSettings.css';

interface MCPSettingsProps {
  serverUrl: string;
  resourcePath: string;
  onServerUrlChange: (url: string) => void;
  onResourcePathChange: (path: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MCPSettings: React.FC<MCPSettingsProps> = ({
  serverUrl: initialServerUrl = 'http://localhost:8080',
  resourcePath: initialResourcePath = '',
  onServerUrlChange,
  onResourcePathChange,
  className,
  style
}) => {
  const [serverUrl, setServerUrl] = useState(initialServerUrl);
  const [resourcePath, setResourcePath] = useState(initialResourcePath);

  useEffect(() => {
    setServerUrl(initialServerUrl);
    setResourcePath(initialResourcePath);
  }, [initialServerUrl, initialResourcePath]);

  return (
    <div className={`mcp-settings-container ${className || ''}`} style={style}>
      <div className="settings-group">
        <div className="settings-field">
          <label className="settings-label">服务器地址</label>
          <input
            className="settings-input"
            type="text"
            value={serverUrl}
            onChange={(e) => { onServerUrlChange(e.target.value); setServerUrl(e.target.value) }}
            placeholder="输入服务器地址..."
          />
        </div>
        <div className="settings-field">
          <label className="settings-label">资源路径过滤</label>
          <input
            className="settings-input"
            type="text"
            value={resourcePath}
            onChange={(e) => { onResourcePathChange(e.target.value); setResourcePath(e.target.value) }}
            placeholder="输入资源路径过滤条件..."
          />
        </div>
      </div>
    </div>
  );
}; 