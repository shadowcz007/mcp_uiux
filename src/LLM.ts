import { jsonrepair } from 'jsonrepair'

export const callOpenAIFunctionAndProcessToolCalls = async (
  systemPrompt: string,
  userContent: string,
  tools: [],
  model = 'Qwen/Qwen2.5-7B-Instruct',
  apiKey = 'sk-',
  apiUrl = 'https://api.siliconflow.cn/v1/chat/completions',
  callback: any
) => {
  let messages = systemPrompt
    ? [
        {
          role: 'system',
          content: systemPrompt
        }
      ]
    : []

  const requestBody = {
    model,
    messages: [
      ...messages,
      {
        role: 'user',
        content: userContent
      }
    ],
    tools,
    tool_choice: 'auto',
    stream: Boolean(callback)
  };
 
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`API请求失败，状态码: ${response.status}`)
    }

    let finalData: any = null

    if (callback && requestBody.stream) {
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('无法获取响应流')

      let buffer = ''
      let accumulatedData = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data.trim() === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              callback(parsed)
              // console.log(JSON.stringify(parsed.choices[0].delta, null, 2))
              accumulatedData.push(parsed)
            } catch (e) {
              console.error('解析流式数据失败:', e)
            }
          }
        }
      }

      // 将流式数据合并为最终数据结构，模拟非流式响应的格式
      if (accumulatedData.length > 0) {
        finalData = {
          choices: [
            {
              message: {
                content: '',
                tool_calls: []
              }
            }
          ]
        }

        // 合并所有流式数据的消息内容和工具调用
        accumulatedData.forEach(chunk => {
          if (chunk.choices && chunk.choices[0].delta) {
            const delta = chunk.choices[0].delta
            if (delta.content) {
              finalData.choices[0].message.content += delta.content
            }
            if (delta.tool_calls) {
              for (const tool_call of delta.tool_calls) {
                const existingCall =
                  finalData.choices[0].message.tool_calls[tool_call.index]

                if (!existingCall) {
                  // 如果是新的工具调用，直接添加
                  finalData.choices[0].message.tool_calls[tool_call.index] = {
                    id: tool_call.id,
                    function: {
                      name: tool_call.function?.name,
                      arguments: tool_call.function?.arguments || ''
                    },
                    index: tool_call.index
                  }
                } else {
                  // 如果已存在，只追加参数
                  if (tool_call.function?.arguments) {
                    existingCall.function.arguments +=
                      tool_call.function.arguments
                  }
                }

                // console.log(
                //   JSON.stringify(
                //     finalData.choices[0].message.tool_calls[tool_call.index],
                //     null,
                //     2
                //   )
                // )
              }
            }
          }
        })
        // console.log(
        //   ' finalData.choices[0].message.tool_calls:',
        //   finalData.choices[0].message.tool_calls
        // )
      }
    } else {
      // 非流式模式直接获取数据
      finalData = await response.json()
    }

    // console.log('最终数据:', JSON.stringify(finalData, null, 2))

    // 继续处理工具调用或内容解析逻辑
    const toolCalls = finalData.choices[0].message.tool_calls
    if (toolCalls && toolCalls.length > 0) {
      const processedToolCalls = toolCalls
        .map((toolCall: any) => {
          const functionName = toolCall.function.name
          try {
            let json = toolCall.function.arguments.trim()
            try {
              return {
                id: toolCall.id,
                name: functionName,
                arguments: JSON.parse(json)
              }
            } catch (parseError) {
              const repaired = jsonrepair(json)
              try {
                return {
                  id: toolCall.id,
                  name: functionName,
                  arguments: JSON.parse(repaired)
                }
              } catch (repairError) {
                console.error('无法修复工具调用参数JSON:', repairError)
                return null
              }
            }
          } catch (error) {
            console.error('处理工具调用时出错:', error)
            return null
          }
        })
        .filter(Boolean)
      return processedToolCalls
    } else {
      return null
    }
  } catch (error) {
    console.error('函数执行出错:', error)
    return null
  }
}
