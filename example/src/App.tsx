import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP, MCPStatus } from 'mcp-uiux';


const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [resourcePath, setResourcePath] = useState('');
  const {
    connect,
    loading,
    error,
    tools,
    resources,
    resourceTemplates,
    prompts,
  } = useMCP();

  useEffect(() => {
    if (localStorage.getItem('mcp-uiux-serverUrl')) {
      setServerUrl(localStorage.getItem('mcp-uiux-serverUrl') || 'http://localhost:8080');
    } else {
      setServerUrl('http://localhost:8080');
    }
    if (localStorage.getItem('mcp-uiux-resourcePath')) {
      setResourcePath(localStorage.getItem('mcp-uiux-resourcePath') || '');
    }
  }, [])

  useEffect(() => {
    connect(serverUrl, resourcePath);
  }, [serverUrl, resourcePath]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>MCP UIUX 示例</h1>

      <div style={{ marginBottom: '20px' }}>
        <div>
          <label>服务器地址：</label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => {
              setServerUrl(e.target.value);
              localStorage.setItem('mcp-uiux-serverUrl', e.target.value); 

            }}
            style={{ width: '300px', marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>资源路径过滤：</label>
          <input
            type="text"
            value={resourcePath}
            onChange={(e) => {
              setResourcePath(e.target.value); 
              localStorage.setItem('mcp-uiux-resourcePath', e.target.value); 
            }}
            style={{ width: '300px', marginLeft: '10px' }}
          />
        </div>
      </div>


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


      <MCPStatus
        serverUrl={serverUrl}
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <MCPProvider>
      <AppContent />
    </MCPProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);