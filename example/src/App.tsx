import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP, MCPStatus, InputSchemaForm, ReactJson } from 'mcp-uiux';
const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [resourcePath, setResourcePath] = useState('');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [debug, setDebug] = useState(false);

  const {
    connect,
    loading,
    error,
    tools,
    resources,
    resourceTemplates,
    prompts,
    notifications
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

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setFormData(null);
  };

  const handleFormComplete = (data: any) => {
    setFormData(data);
    setSelectedTool(null);
    // console.log('表单数据：', data);
    // 这里可以添加调用工具的逻辑
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MCP UIUX 示例 <button onClick={()=>setDebug(!debug)}>测试</button></h1>

      {
       debug&& Object.keys(notifications).map((key, index) => (
          <div key={index}>
            {key}: {notifications[key]}
          </div>
        ))
      }

      {debug&& <div style={{ display: 'flex' }}>
        {tools.length > 0 && <div style={{ flex: '1', marginRight: '20px' }}>
          <h3>工具列表 ({tools.length})</h3>
          <ul style={{ cursor: 'pointer' }}>
            {tools.map((tool, index) => (
              <li
                key={index}
                onClick={() => handleToolSelect(tool)}
                style={{
                  padding: '8px',
                  backgroundColor: selectedTool && selectedTool.name === tool.name ? '#e6f7ff' : 'transparent',
                  borderRadius: '4px'
                }}
              >
                {tool.name}
              </li>
            ))}
          </ul>
        </div>}

        <div style={{ flex: '2' }}>
          {selectedTool && (
            <div>
              <h3>工具：{selectedTool.name}</h3>
              <div style={{ marginBottom: '20px' }}>
                <InputSchemaForm tool={selectedTool}
                  onComplete={handleFormComplete} />
              </div>
            </div>
          )}
          {formData && (
            <div>
              <h4>表单数据</h4>
              <ReactJson src={formData} />
              {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
            </div>
          )}
        </div>
      </div>}

      {debug&& resources.length > 0 && <div>
        <h3>资源列表 ({resources.length})</h3>
        <ul>
          {resources.map((resource, index) => (
            <li key={index}>{decodeURIComponent(resource.uri)}</li>
          ))}
        </ul>
      </div>}

      <MCPStatus
        serverUrl={serverUrl}
        showSettings={true}
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