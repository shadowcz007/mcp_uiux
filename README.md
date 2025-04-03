# MCP UIUX

Use and manage MCP with elegance and precision.

MCP UIUX 是一个 React 组件库，专门用于实现模型上下文协议(Model Context Protocol)中的工具(Tools)、提示(Prompts)和资源(Resources)管理。它提供了直观的界面来连接和展示 MCP 服务器的状态和数据。

[关注 https://codenow.wiki/ 获得更多](https://codenow.wiki/)

## 主要功能

- Tools 工具管理：集成和调用 MCP 服务器提供的各类工具
- Prompts 提示管理：创建和维护 AI 提示模板
- Resources 资源管理：处理和展示各类资源数据
- 实时连接：与 MCP 服务器保持实时数据同步
- 科幻界面：提供现代化的用户交互体验

## 安装
```bash
npm install mcp-uiux
```

## 功能特点

- 实时连接 MCP 服务器
- 展示系统工具库状态
- 显示资源矩阵信息
- 管理 AI 提示库
- 科幻风格的 UI 界面
- 支持错误处理和加载状态

## 使用示例

```typescript
import React from 'react';
import { MCPProvider, useMCP } from 'mcp-uiux';

const App = () => {
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
    // 连接到 MCP 服务器
    connect('http://localhost:8080', '');
  }, []);

  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误：{error}</div>}
      
      <div>
        <h3>工具列表 ({tools.length})</h3>
        <ul>
          {tools.map((tool, index) => (
            <li key={index}>{tool.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 使用 MCPProvider 包装应用
const Root = () => {
  return (
    <MCPProvider>
      <App />
    </MCPProvider>
  );
};

export default Root;
```

## 配置参数

- `serverUrl`: MCP 服务器地址，默认为 `http://localhost:8080`
- `resourcePath`: 资源路径过滤器，默认为空字符串 `""`

## 配套服务器

本组件库可以与 [Memory MCP Server](https://github.com/shadowcz007/memory_mcp) 配合使用。

## 完整示例

参考示例代码：[example](./example)

## API 参考

### useMCP Hook

返回值：
- `connect`: 连接服务器的函数
- `loading`: 加载状态
- `error`: 错误信息
- `tools`: 工具列表
- `resources`: 资源列表
- `resourceTemplates`: 资源模板
- `prompts`: AI 提示列表

### SciFiMCPStatus 组件

科幻风格的状态展示组件，包含：
- 系统状态监控
- 工具库展示
- 资源矩阵
- AI 提示库

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！



