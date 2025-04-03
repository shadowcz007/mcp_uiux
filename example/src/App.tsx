import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, MCPStatus, useMCP } from 'mcp-uiux';

const App: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8080');
  const [resourcePath, setResourcePath] = useState('');

  return (
    <MCPProvider>
      <div style={{ padding: '20px' }}>
        <h1>MCP UIUX 示例</h1>

        <div style={{ marginBottom: '20px' }}>
          <div>
            <label>服务器地址：</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              style={{ width: '300px', marginLeft: '10px' }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>资源路径过滤：</label>
            <input
              type="text"
              value={resourcePath}
              onChange={(e) => setResourcePath(e.target.value)}
              style={{ width: '300px', marginLeft: '10px' }}
            />
          </div>
        </div>

        <MCPStatus
          serverUrl={serverUrl}
          resourcePath={resourcePath}
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
    </MCPProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);