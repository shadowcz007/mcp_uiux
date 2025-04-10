const { prepareTools } = require('mcp-uiux/dist/MCPClient.js')

// 使用 fetch 调用 OpenAI API 并处理工具调用结果
async function callOpenAIFunctionAndProcessToolCalls(tools) {
    const apiKey = "sk-xxx"; // 替换为你的 OpenAI API Key
    const url = "https://api.siliconflow.cn/v1/chat/completions";

    const requestBody = {
        model: "Qwen/Qwen2.5-7B-Instruct", // 或其他支持 function calling 的模型
        messages: [{
            role: "user",
            content: `MCP UIUX 是一个 React 组件库，专门用于实现模型上下文协议(Model Context Protocol)中的工具(Tools)、提示(Prompts)和资源(Resources)管理。它提供了直观的界面来连接和展示 MCP 服务器的状态和数据。

关注 https://codenow.wiki/ 获得更多

主要功能
Tools 工具管理：集成和调用 MCP 服务器提供的各类工具
Prompts 提示管理：创建和维护 AI 提示模板
Resources 资源管理：处理和展示各类资源数据
实时连接：与 MCP 服务器保持实时数据同步
科幻界面：提供现代化的用户交互体验`
        }],
        tools,
        tool_choice: "auto",
    };

    try {
        // 发送请求
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // 处理工具调用结果
        const toolCalls = data.choices[0].message.tool_calls;
        if (!toolCalls || toolCalls.length === 0) {
            console.log("No tool calls in response.");
            return null;
        }

        // 转换工具调用结果
        const processedToolCalls = toolCalls.map(toolCall => {
            const functionName = toolCall.function.name;
            try {
                const functionArgs = JSON.parse(toolCall.function.arguments.trim()); // arguments 是字符串，需要解析为对象
                return {
                    id: toolCall.id,
                    name: functionName,
                    arguments: functionArgs
                };
            } catch (error) {
                console.log(error)
            }
        }).filter(Boolean)

        // 返回处理后的结果
        // console.log("Processed Tool Calls:", JSON.stringify(processedToolCalls, null, 2));
        return processedToolCalls;

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

(async() => {
    // 使用memory mcp测试
    // win  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory.exe
    // mac  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory

    const url = "http://127.0.0.1:8080";

    let { mcpClient, tools, toolsFunctionCall } = await prepareTools(url);

    const knowledgeTools = toolsFunctionCall.filter(t => [
        'create_relations',
        'create_entities'
    ].includes(t.function.name))

    console.log(knowledgeTools);
    console.log("---------------")

    // 调用函数
    let toolsResult = await callOpenAIFunctionAndProcessToolCalls(knowledgeTools);
    console.log(JSON.stringify(toolsResult, null, 2));

    for (const item of toolsResult) {
        let tool = tools.find(t => t.name == item.name)
        let result = await tool.execute(item.arguments)
        console.log("工具执行结果", item.name, result)
    }

    await mcpClient.disconnect();
})()