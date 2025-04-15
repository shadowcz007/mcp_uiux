const {
  prepareTools,
  callOpenAIFunctionAndProcessToolCalls
} = require('mcp-uiux/dist/MCPClient.js')

;(async () => {
  // 使用memory mcp测试
  // win  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory.exe
  // mac  -  https://github.com/shadowcz007/aio_mcp_exe/releases/download/0.1/mcp_server_memory

  const url = 'http://127.0.0.1:8080'

  let { mcpClient, tools, toolsFunctionCall, systemPrompts } =
    await prepareTools(url)

  const knowledgeExtractorPrompt = systemPrompts.find(
    s => s.name === 'knowledge_extractor'
  )

  const knowledgeTools = toolsFunctionCall.filter(t =>
    ['create_relations', 'create_entities'].includes(t.function.name)
  )

  console.log(knowledgeTools)
  console.log(
    '---------------',
    knowledgeExtractorPrompt?.systemPrompt,
    '---------------'
  )

  // 调用函数
  let toolsResult = await callOpenAIFunctionAndProcessToolCalls(
    knowledgeExtractorPrompt?.systemPrompt,
    `mixlab的AI编程训练营，助力每一位新时代的创作者。` +
      `What?

Yes. The first Mac I have ever owned: this beautiful beast, a PowerMac G4 MDD: specifically a top-of-the-line dual 1.25 GHz FireWire 400 model circa 2002.

Here's the full specs if you're curious.
So, how did such an icon of early 2000s Apple fall into my grubby hands? Well, it all started with the Wii U. I'm not joking.

For a while now, I have been working intermittently on the Wii U Linux kernel. In December, for reasons that aren't important right now3, I turned my attention towards fixing KVM on the Wii U, but in order to fix it, I needed to figure when and why it broke, and the easiest way I could think to do that was with a PowerMac.4 Fortunately, my roommate already had a 233 MHz Bondi Blue iMac G3, which he very kindly agreed to lend me. However, when I tried to use it, it was so slow that I couldn't even get Linux installed. After that, I decided I'd rather get crushed by a crane then do kernel debugging on a 233 MHz G3. I realized, somewhere, something needed a change.5`,
    knowledgeTools,
    'Qwen/Qwen2.5-7B-Instruct', // 或其他支持 function calling 的模型
    'sk-miiciyfktmetnvvqptyukjiqbmjdybvvhvcetscitwazxzgl', // 替换为你的 OpenAI API Key
    'https://api.siliconflow.cn/v1/chat/completions',
    chunk => {
      // console.log(chunk)
    }
  )

  console.log('#工具调用结果:', JSON.stringify(toolsResult, null, 2))
  if (toolsResult?.length > 0) {
    for (const item of toolsResult) {
      let tool = tools.find(t => t.name == item.name)
      let result = await tool.execute(item.arguments)
      console.log('工具执行结果', item.name, result)
    }
  }

  await mcpClient.disconnect()
})()
