import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MCPProvider, useMCP, MCPStatus } from 'mcp-uiux';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey-core.min.css';

// 将 JSON Schema 转换为 SurveyJS 元素
const convertSchemaToSurveyElement = (schema: any, name: string = '', title: string = ''): any => {
  if (!schema) return null;

  // 使用传入的名称或生成一个默认名称
  const elementName = name || 'field_' + Math.random().toString(36).substr(2, 9);
  // 使用传入的标题或将名称转换为更可读的形式
  const elementTitle = title || name?.replace(/_/g, ' ') || elementName;

  switch (schema.type) {
    case 'string':
      return {
        type: 'text',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'number':
    case 'integer':
      return {
        type: 'number',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'boolean':
      return {
        type: 'boolean',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'array':
      if (schema.items.type === 'string' || schema.items.type === 'number' || schema.items.type === 'integer') {
        return {
          type: 'matrixdynamic',
          name: elementName,
          title: elementTitle,
          columns: [
            {
              cellType: schema.items.type === 'number' || schema.items.type === 'integer' ? 'number' : 'text',
              name: "value",
              title: ' '
            }
          ],
          rowCount: 1,
          minRowCount: 0,
          addRowText: `添加${elementTitle}`,
          removeRowText: '删除',
          isRequired: schema.required || false,
          showHeader: false,
          confirmDelete: false
        };
      } else {
        // 复杂类型的数组保持原来的 paneldynamic 处理方式
        return {
          type: 'paneldynamic',
          name: elementName,
          title: elementTitle,
          templateElements: [convertSchemaToSurveyElement(schema.items, 'item')],
          panelCount: 1,
          minPanelCount: 1,
          addPanelText: `添加${elementTitle}`,
          removePanelText: '删除',
          isRequired: schema.required || false
        };
      }

    case 'object':
      const elements = Object.entries(schema.properties || {}).map(([propName, propSchema]: [string, any]) =>
        convertSchemaToSurveyElement(propSchema, propName)
      ).filter(Boolean);

      if (name) {
        // 如果是嵌套对象，使用 panel
        return {
          type: 'panel',
          name: elementName,
          title: elementTitle,
          elements: elements,
          isRequired: schema.required || false
        };
      } else {
        // 如果是根对象，直接返回元素数组
        return elements;
      }

    default:
      console.warn(`Unsupported schema type: ${schema.type}`);
      return null;
  }
};

// 将工具参数转换为SurveyJS格式
const mapToolParamsToSurveyJson = (tool: any) => {
  if (!tool || !tool.inputSchema) return { elements: [] };

  console.log('tool.inputSchema', tool.inputSchema);

  // 检查是否为空对象 schema
  if (tool.inputSchema.type === 'object' &&
    (!tool.inputSchema.properties || Object.keys(tool.inputSchema.properties).length === 0)) {
    return {
      elements: [{
        type: 'text',
        name: '_',
        title: '_',
        isRequired: false
      }],
      showQuestionNumbers: false,
      showNavigationButtons: true,
      completeText: "执行",
      pageNextText: "下一步",
      pagePrevText: "上一步"
    };
  }

  const elements = convertSchemaToSurveyElement(tool.inputSchema);

  return {
    elements: Array.isArray(elements) ? elements : [elements],
    showQuestionNumbers: false,
    completeText: "执行",
    pageNextText: "下一步",
    pagePrevText: "上一步"
  };
};

// 工具表单组件
const ToolSurveyForm = ({ tool, onComplete }) => {
  const [survey, setSurvey] = useState(null);
  // console.log('ToolSurveyForm', tool);
  useEffect(() => {
    if (!tool) return;

    const surveyJson = mapToolParamsToSurveyJson(tool);

    const surveyModel: any = new Model(surveyJson);

    // 设置完成事件
    surveyModel.onComplete.add(async (sender) => {
      if (onComplete) {
        const data = { ...sender.data };

        // 处理数组格式
        if (tool.inputSchema && tool.inputSchema.type === 'object' && tool.inputSchema.properties) {
          Object.entries(tool.inputSchema.properties).forEach(([key, prop]: [string, any]) => {
            if (prop.type === 'array' &&
              (prop.items.type === 'string' || prop.items.type === 'number' || prop.items.type === 'integer') &&
              Array.isArray(data[key])) {
              // 将 [{value: 'a'}, {value: 'b'}] 转换为 ['a', 'b']
              data[key] = data[key].map(item => item.value);
            }
          });
        }

        // console.log('sender.data', data);
        const result = await tool.execute(data);
        onComplete({
          input: data,
          output: result
        });
      }
    });

    setSurvey(surveyModel);
  }, [tool, onComplete]);

  if (!survey) return null;

  return <Survey model={survey} />;
};



const AppContent: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [resourcePath, setResourcePath] = useState('');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

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

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
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
        </div>

        <div style={{ flex: '2' }}>
          {selectedTool && (
            <div>
              <h3>工具：{selectedTool.name}</h3>
              <div style={{ marginBottom: '20px' }}>
                <ToolSurveyForm tool={selectedTool}
                  onComplete={handleFormComplete} />
              </div>
            </div>
          )}
          {formData && (
            <div>
              <h4>表单数据</h4>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

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