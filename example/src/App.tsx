import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP } from 'mcp-uiux';
import './SciFiMCPStatus.css';
const SciFiMCPStatus: React.FC<{
  loading: boolean;
  error: string | null;
  tools: any[];
  resources: any[];
  resourceTemplates: any[];
  prompts: any[];
}> = ({ loading, error, tools, resources, resourceTemplates, prompts }) => {
  return (
    <div className="sci-fi-container">
      {/* 全息投影效果的标题 */}
      <div className="hologram-title">
        <h1>MCP 系统状态监控</h1>
        <div className="status-indicator">
          {loading ? (
            <span className="pulse loading">系统扫描中...</span>
          ) : error ? (
            <span className="pulse error">警告：系统异常</span>
          ) : (
            <span className="pulse active">系统在线</span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-panel">
          <div className="error-icon">⚠</div>
          <div className="error-message">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <div className="data-grid">
          {/* 工具模块 */}
          <div className="module">
            <div className="module-header">
              <span className="module-icon">⚡</span>
              <h2>系统工具库</h2>
              <span className="count">{tools.length}</span>
            </div>
            <div className="scrollable-content">
              {tools.map((tool, index) => (
                <div key={index} className="item">
                  <span className="item-indicator"></span>
                  {tool.name}
                </div>
              ))}
            </div>
          </div>

          {/* 资源模块 */}
          <div className="module">
            <div className="module-header">
              <span className="module-icon">📦</span>
              <h2>资源矩阵</h2>
              <span className="count">{resources.length}</span>
            </div>
            <div className="scrollable-content">
              {resources.map((resource, index) => (
                <div key={index} className="item">
                  <span className="item-indicator"></span>
                  {decodeURIComponent(resource.uri)}
                </div>
              ))}
            </div>
          </div>

          {/* 提示模块 */}
          <div className="module">
            <div className="module-header">
              <span className="module-icon">💡</span>
              <h2>AI 提示库</h2>
              <span className="count">{prompts.length}</span>
            </div>
            <div className="scrollable-content">
              {prompts.map((prompt, index) => (
                <div key={index} className="item">
                  <span className="item-indicator"></span>
                  {prompt.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8080');
  const [resourcePath, setResourcePath] = useState('');
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

  return (
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