import React from 'react';
import { Resource, ResourceTemplate, Tool, Prompt, MCPProps } from '../types';
export interface MCPHookResult {
    executeTool: (toolName: string, args: any) => Promise<any>;
    reconnect: () => void;
    getResources: () => Promise<Resource[]>;
    readResource: (uri: string) => Promise<any>;
    getToolsList: () => Promise<Tool[]>;
    getPromptsList: () => Promise<Prompt[]>;
    getPrompt: (name: string, args?: any) => Promise<any>;
    getResourceTemplates: () => Promise<ResourceTemplate[]>;
    expandUriByVariables: (template: string, variables: Record<string, string>) => string | undefined;
    getTemplateVariables: (template: any) => string[];
}
export declare const useMCP: ({ url, onToolsReady, onToolResult, onError, onReady, onNotifications }: MCPProps) => MCPHookResult;
export declare const MCP: React.FC<MCPProps>;
