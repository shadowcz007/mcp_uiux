import React, { useEffect, useCallback, useRef } from 'react'

import { Resource, ResourceTemplate, Tool, Prompt, MCPProps, MCPError } from '../types'

import { MCPClient } from '../MCPClient'

// useMCP hook 的类型定义
export interface MCPHookResult {
  executeTool: (toolName: string, args: any) => Promise<any>
  reconnect: () => void
  getResources: () => Promise<Resource[]>
  readResource: (uri: string) => Promise<any>
  getToolsList: () => Promise<Tool[]>
  getPromptsList: () => Promise<Prompt[]>
  getPrompt: (name: string, args?: any) => Promise<any>
  getResourceTemplates: () => Promise<ResourceTemplate[]>
  expandUriByVariables: (
    template: string,
    variables: Record<string, string>
  ) => string | undefined
  getTemplateVariables: (template: any) => string[]
}

// 优化后的 useMCP hook
export const useMCP = ({
  url = 'http://localhost:8000',
  onToolsReady,
  onToolResult,
  onError,
  onReady,
  onNotification
}: MCPProps): MCPHookResult => {
  const mcpClientRef = useRef<MCPClient | null>(null)

  useEffect(() => {
    mcpClientRef.current = new MCPClient({
      url,
      onToolsReady,
      onToolResult,
      onError,
      onReady,
      onNotification
    })
    mcpClientRef.current.connect()

    return () => {
      mcpClientRef.current?.disconnect()
    }
  }, [url, onToolsReady, onToolResult, onError, onReady, onNotification])

  return {
    executeTool: useCallback(async (toolName: string, args: any) => {
      if (!mcpClientRef.current) throw new MCPError('MCP客户端未初始化')
      return mcpClientRef.current.executeTool(toolName, args)
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
