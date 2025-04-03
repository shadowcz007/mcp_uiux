import React, { useEffect, useCallback, useRef, useState } from 'react'

interface MCPProps {
  url?: string
  onToolsReady?: (tools: any[]) => void
  onToolResult?: (content: any, isError: boolean) => void
  onError?: (error: Error) => void
  onResourcesReady?: (resources: any[]) => void
  onResourceTemplatesReady?: (resourceTemplates: any[]) => void
  onPromptsReady?: (prompts: any[]) => void
  onReady?: (data: any) => void
}

export class MCPClient {
  public url: string
  private onToolsReady?: (tools: any[]) => void
  private onToolResult?: (content: any, isError: boolean) => void
  private onError?: (error: Error) => void
  private onResourcesReady?: (resources: any[]) => void
  private onResourceTemplatesReady?: (resourceTemplates: any[]) => void
  private onPromptsReady?: (prompts: any[]) => void
  private onReady?: (data: any) => void
  private sessionId: string | null = null
  private messageEndpoint: string | null = null
  private eventSource: EventSource | null = null
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 99
  private reconnectTimeout: number = 1000
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private pendingCalls: Map<
    string,
    { resolve: (value: any) => void; reject: (reason: any) => void }
  > = new Map()
  private callIdCounter: number = 0
  public serverName?: string | null = null
  public protocolVersion?: string | null = null
  public capabilities?: any = null

  constructor ({
    url = 'http://localhost:8000',
    onToolsReady,
    onToolResult,
    onError,
    onResourcesReady,
    onResourceTemplatesReady,
    onPromptsReady,
    onReady
  }: MCPProps) {
    this.url = url
    this.onToolsReady = onToolsReady
    this.onToolResult = onToolResult
    this.onError = onError
    this.onResourcesReady = onResourcesReady
    this.onResourceTemplatesReady = onResourceTemplatesReady
    this.onPromptsReady = onPromptsReady
    this.onReady = onReady
  }

  // 发送 JSON-RPC 请求
  private async sendJsonRpcRequest (
    method: string,
    params: any,
    id: any | null = null
  ) {
    // console.log('发送JSON-RPC请求', method, this.sessionId, this.messageEndpoint)
    if (!this.messageEndpoint)
      throw new Error(
        method + this.sessionId + this.messageEndpoint + '未获取到消息端点'
      )

    const jsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      ...(id !== null && { id })
    }

    const response = await fetch(this.messageEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonRpcRequest)
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    return response
  }

  // 执行工具的公共方法
  public async executeTool (toolName: string, args: any): Promise<any> {
    try {
      const callId = `${toolName}_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`工具执行超时: ${toolName}`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求，添加callId作为元数据
      await this.sendJsonRpcRequest(
        'tools/call',
        {
          name: toolName,
          arguments: args
        },
        callId
      )

      return resultPromise
    } catch (error) {
      this.onError?.(error instanceof Error ? error : new Error('工具执行失败'))
      throw error
    }
  }

  // 连接 SSE
  public async connect () {
    const sseUrl = `${this.url}`
    console.log('正在连接 SSE:', sseUrl)

    this.eventSource = new EventSource(sseUrl)
    let initialized = false
    let toolsRequested = false

    this.eventSource.onopen = () => {
      console.log('SSE 连接已建立')
      // 重置重连计数器
      this.reconnectAttempts = 0
    }

    this.eventSource.onerror = error => {
      console.error('SSE 连接错误:', error)
      this.eventSource?.close()
      this.eventSource = null
      this.onError?.(new Error('SSE 连接失败'))
      // 自动重连逻辑
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay =
          this.reconnectTimeout * Math.pow(2, this.reconnectAttempts)
        console.log(
          `将在 ${delay}ms 后尝试重连 (${this.reconnectAttempts + 1}/${
            this.maxReconnectAttempts
          })`
        )

        this.reconnectTimer = setTimeout(() => {
          this.reconnectAttempts++
          this.connect()
        }, delay)
      } else {
        console.error('已达到最大重连次数')
        this.onError?.(new Error('SSE 连接失败，已达到最大重连次数'))
      }
    }

    // 处理 endpoint 事件
    this.eventSource.addEventListener('endpoint', async event => {
      console.log('收到 endpoint 事件:', event.data)
      const sessionUri = event.data

      // 修改这里：正确处理 URL 拼接
      // 检查 sessionUri 是否已经包含完整 URL
      if (
        sessionUri.startsWith('http://') ||
        sessionUri.startsWith('https://')
      ) {
        this.messageEndpoint = sessionUri
      } else {
        // 确保 URL 正确拼接，避免路径重复
        const baseUrl = new URL(this.url)
        // 如果 sessionUri 以 / 开头，则直接使用主机名
        if (sessionUri.startsWith('/')) {
          this.messageEndpoint = `${baseUrl.origin}${sessionUri}`
        } else {
          this.messageEndpoint = `${baseUrl.origin}/${sessionUri}`
        }
      }

      const sessionIdMatch =
        sessionUri.match(/session_id=([^&]+)/) ||
        sessionUri.match(/sessionId=([^&]+)/)

      if (sessionIdMatch) {
        this.sessionId = sessionIdMatch[1]
        if (!initialized) {
          try {
            await this.initializeSession()
          } catch (error) {
            this.onError?.(new Error('初始化会话失败'))
          }
        }
      }
    })

    // 处理 message 事件
    this.eventSource.addEventListener('message', async event => {
      try {
        const message = JSON.parse(event.data)
        console.log('收到消息:', message)

        if (message.jsonrpc === '2.0') {
          // 处理初始化完成
          if (message.id === 1 && message.result && !initialized) {
            initialized = true

            const { name, version } = message.result.serverInfo
            const capabilities = message.result.capabilities
            this.serverName = name
            this.protocolVersion = message.result.protocolVersion
            this.capabilities = capabilities
            console.log('MCP capabilities:', capabilities)
            toolsRequested = await this.handleInitialized(toolsRequested)

            this.onReady?.({
              name,
              protocolVersion: this.protocolVersion || '',
              version,
              capabilities
            })
          }
          // 处理工具列表
          else if (message.result?.tools) {
            console.log('获取到工具列表:', this.sessionId, message.result.tools)
            // 为每个工具添加执行方法
            const toolsWithExecute = message.result.tools.map((tool: any) => ({
              ...tool,
              fromServerName: this.serverName,
              execute: (args: any) => this.executeTool(tool.name, args)
            }))
            this.onToolsReady?.(toolsWithExecute)

            this.callback(message)
          } else if (message.result?.resources) {
            console.log('获取到资源列表:', message.result.resources)
            this.onResourcesReady?.(message.result.resources)
            this.callback(message)
          } else if (message.result?.resourceTemplates) {
            console.log('获取到资源模板列表:', message.result.resourceTemplates)
            let resourceTemplates = message.result.resourceTemplates

            if (resourceTemplates && Array.isArray(resourceTemplates)) {
              for (let index = 0; index < resourceTemplates.length; index++) {
                const uri = resourceTemplates[index].uri
                resourceTemplates[index] = {
                  ...resourceTemplates[index],
                  uri,
                  _variables: this.getTemplateVariables(
                    resourceTemplates[index]
                  ),
                  _expandUriByVariables: this.expandUriByVariables
                }
              }
              //fixbug ， 如果capabilities没有resourceTemplates，则直接赋值
              if (this.capabilities && !this.capabilities.resourceTemplates) {
                this.capabilities.resourceTemplates = resourceTemplates
              }

              console.log(
                '缓存资源模板到capabilities:',
                this.capabilities.resourceTemplates
              )
            }

            this.onResourceTemplatesReady?.(resourceTemplates)

            this.callback(message)
          } else if (message.result?.prompts) {
            console.log('获取到提示列表:', message.result.prompts)
            this.onPromptsReady?.(message.result.prompts)
            this.callback(message)
          }
          // 处理工具执行结果
          else if (message.result?.content) {
            console.log('工具执行结果:', message)
            this.callback(message)
            // 仍然调用回调函数
            this.onToolResult?.(
              message.result.content,
              message.result.isError || false
            )
          } else if (message.method == 'sampling/createMessage') {
            console.log('收到采样消息:', message)
            if (message?.params?.metadata?.request_id) {
              //fixbug , mcp server 里的 需要注意 metadata的处理， 用于更新id
              message.id = message.params.metadata.request_id
              console.log('fix收到采样消息:', message)
              this.callback(message)
            }
          }

          // 添加这个部分：处理任何其他类型的响应
          else if (message.id != undefined) {
            // 确保任何带有 ID 的响应都能触发回调
            console.log('#callback:', message)
            this.callback(message)
          }
        }
      } catch (error) {
        console.error('解析消息失败:', error)
      }
    })
  }

  // 初始化会话
  private async initializeSession () {
    console.log('初始化会话')
    return this.sendJsonRpcRequest(
      'initialize',
      {
        protocolVersion: '0.1.0',
        capabilities: {},
        clientInfo: {
          name: 'MixCopilot MCP Client',
          version: '1.0.0'
        }
      },
      1
    )
  }

  // 处理初始化完成后的操作
  private async handleInitialized (toolsRequested: boolean) {
    try {
      await this.sendJsonRpcRequest('notifications/initialized', {}, null)
      console.log('handleInitialized', toolsRequested)
      if (!toolsRequested) {
        // 获取工具列表
        await this.getToolsList()
        await this.getResources()

        // 获取并缓存资源模板
        const resourceTemplates = await this.getResourceTemplates()
        // 注意：getResourceTemplates 方法内部已经处理了缓存，这里不需要额外设置

        await this.getPromptsList()
        return true
      }
    } catch (error: any) {
      this.onError?.(error)
    }
    return toolsRequested
  }

  private callback (message: any = {}) {
    // 检查是否有callId
    const callId = message.id
    if (callId && this.pendingCalls.has(callId)) {
      // 解析对应的Promise
      const { resolve } = this.pendingCalls.get(callId)!
      this.pendingCalls.delete(callId)
      resolve(
        message.result?.content ||
          message.result || {
            method: message.method,
            params: message.params
          }
      )
    }
  }

  // 获取工具列表
  public async getToolsList (): Promise<any> {
    try {
      const callId = `tools_list_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`获取工具列表超时`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest('tools/list', {}, callId)

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error('获取工具列表失败')
      )
      throw error
    }
  }

  // 获取资源列表
  public async getResources (): Promise<any> {
    if (!this.capabilities) return []
    try {
      const callId = `resources_list_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`获取资源列表超时`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest('resources/list', {}, callId)

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error('获取资源列表失败')
      )
      throw error
    }
  }

  // 获取资源列表
  public async getResourceTemplates (): Promise<any> {
    if (!this.capabilities) return []
    try {
      const callId = `resources_templates_list_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`获取动态资源列表超时`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest('resources/templates/list', {}, callId)

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error('获取资源列表失败')
      )
      throw error
    }
  }

  // 解析URI模板
  public expandUriByVariables (
    uri: string,
    variables: Record<string, string>
  ): string {
    // 实现RFC 6570的基本功能，支持{var}简单变量替换
    console.log('expandUriByVariables:', uri, variables)
    return uri.replace(/{([^}]+)}/g, (match, varName) => {
      if (variables[varName] !== undefined) {
        return encodeURIComponent(variables[varName])
      }
      return ''
    })
  }

  // 获取模板所需的变量列表
  public getTemplateVariables (template: any): string[] {
    if (!template) {
      return []
    }

    const variables: string[] = []
    const regex = /{([^}]+)}/g
    let match

    while ((match = regex.exec(template.uriTemplate)) !== null) {
      variables.push(match[1])
    }

    return variables
  }

  // 读取特定资源
  public async readResource (uri: string): Promise<any> {
    try {
      const callId = `resources_read_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`读取资源超时: ${uri}`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest('resources/read', { uri }, callId)

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error(`读取资源失败: ${uri}`)
      )
      throw error
    }
  }

  // 获取提示列表
  public async getPromptsList (): Promise<any> {
    try {
      const callId = `prompts_list_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`获取提示列表超时`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest('prompts/list', {}, callId)

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error('获取提示列表失败')
      )
      throw error
    }
  }

  // 获取特定提示
  public async getPrompt (name: string, args: any = {}): Promise<any> {
    try {
      const callId = `prompts_get_${this.callIdCounter++}`

      // 创建一个Promise，稍后在收到结果时解析
      const resultPromise = new Promise((resolve, reject) => {
        this.pendingCalls.set(callId, { resolve, reject })

        // 设置超时
        setTimeout(() => {
          if (this.pendingCalls.has(callId)) {
            this.pendingCalls.delete(callId)
            reject(new Error(`获取提示超时: ${name}`))
          }
        }, 30000) // 30秒超时
      })

      // 发送请求
      await this.sendJsonRpcRequest(
        'prompts/get',
        {
          name,
          arguments: args
        },
        callId
      )

      return resultPromise
    } catch (error) {
      this.onError?.(
        error instanceof Error ? error : new Error(`获取提示失败: ${name}`)
      )
      throw error
    }
  }

  // 重新连接方法
  public reconnect () {
    console.log('手动重新连接...')
    // 清除任何现有的重连计时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    // 重置重连计数
    this.reconnectAttempts = 0
    this.eventSource?.close()
    this.eventSource = null
    this.sessionId = null
    this.connect()
  }

  // 断开连接
  public disconnect () {
    this.maxReconnectAttempts = -1
    // 清除任何现有的重连计时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.eventSource?.close()
    this.eventSource = null
    this.sessionId = null
  }
}

export const useMCP = ({
  url = 'http://localhost:8000',
  onToolsReady,
  onToolResult,
  onError,
  onReady
}: MCPProps = {}) => {
  const mcpClientRef = useRef<MCPClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tools, setTools] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [resourceTemplates, setResourceTemplates] = useState<any[]>([])
  const [prompts, setPrompts] = useState<any[]>([])
  
  useEffect(() => {
    mcpClientRef.current = new MCPClient({
      url,
      onToolsReady,
      onToolResult,
      onError
    })
    mcpClientRef.current.connect()

    return () => {
      mcpClientRef.current?.disconnect()
    }
  }, [url, onToolsReady, onToolResult, onError, onReady])

  return {   mcpClient: mcpClientRef.current,
    loading,
    error,
    tools,
    resources, 
    resourceTemplates,
    prompts,
    connect: useCallback(async (sseUrl: string,resourceFilter:string) => {
      try {
        setLoading(true)
        setError(null)
        
        // 如果已存在客户端实例，先断开连接
        if (mcpClientRef.current) {
          mcpClientRef.current.disconnect()
        }

        // 创建新的客户端实例
        mcpClientRef.current = new MCPClient({
          url: sseUrl,
          onToolsReady: (newTools) => {
            setTools(newTools)
            onToolsReady?.(newTools)
          },
          onToolResult,
          onError: (err) => {
            setError(err.message)
            onError?.(err)
          },
          onResourcesReady: (newResources) => {
            setResources(newResources)
          },
          onResourceTemplatesReady: (newTemplates) => {
            setResourceTemplates(newTemplates)
          },
          onPromptsReady: (newPrompts) => {
            setPrompts(newPrompts)
          },
          onReady
        })

        // 连接到服务器
        await mcpClientRef.current.connect()
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '连接失败')
        setLoading(false)
        throw err
      }
    }, [onToolsReady, onToolResult, onError, onReady]),
    executeTool: useCallback(async (toolName: string, args: any) => {
      return mcpClientRef.current?.executeTool(toolName, args)
    }, []),
    reconnect: useCallback(() => {
      mcpClientRef.current?.reconnect()
    }, []),
    getResources: useCallback(async () => {
      return mcpClientRef.current?.getResources()
    }, []),

    readResource: useCallback(async (uri: string) => {
      return mcpClientRef.current?.readResource(uri)
    }, []),
    getToolsList: useCallback(async () => {
      return mcpClientRef.current?.getToolsList()
    }, []),
    getPromptsList: useCallback(async () => {
      return mcpClientRef.current?.getPromptsList()
    }, []),
    getPrompt: useCallback(async (name: string, args: any = {}) => {
      return mcpClientRef.current?.getPrompt(name, args)
    }, []),
    getResourceTemplates: useCallback(async () => {
      return mcpClientRef.current?.getResourceTemplates()
    }, []),
    expandUriByVariables: useCallback(
      (template: string, variables: Record<string, string>) => {
        return mcpClientRef.current?.expandUriByVariables(template, variables)
      },
      []
    ),
    getTemplateVariables: useCallback((template: any) => {
      return mcpClientRef.current?.getTemplateVariables(template) || []
    }, [])
  }
}
export const MCP: React.FC<MCPProps> = props => {
  useMCP(props)
  return null // 这是一个无渲染组件
}
