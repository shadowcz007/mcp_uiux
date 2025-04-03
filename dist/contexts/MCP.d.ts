import React from 'react';
export interface MCPProps {
    url?: string;
    onToolsReady?: (tools: Tool[]) => void;
    onToolResult?: (content: any, isError: boolean) => void;
    onError?: (error: Error) => void;
    onResourcesReady?: (resources: Resource[]) => void;
    onResourceTemplatesReady?: (resourceTemplates: ResourceTemplate[]) => void;
    onPromptsReady?: (prompts: Prompt[]) => void;
    onReady?: (data: ServerInfo) => void;
}
export interface Tool {
    name: string;
    fromServerName?: string;
    execute?: (args: any) => Promise<any>;
    [key: string]: any;
}
export interface Resource {
    uri?: string;
    [key: string]: any;
}
export interface ResourceTemplate {
    uri?: string;
    uriTemplate?: string;
    _variables?: string[];
    _expandUriByVariables?: (uri: string, variables: Record<string, string>) => string;
    [key: string]: any;
}
export interface Prompt {
    name: string;
    [key: string]: any;
}
export interface ServerInfo {
    name: string;
    protocolVersion: string;
    version: string;
    capabilities: any;
}
export declare class MCPError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class MCPClient {
    url: string;
    private onToolsReady?;
    private onToolResult?;
    private onError?;
    private onResourcesReady?;
    private onResourceTemplatesReady?;
    private onPromptsReady?;
    private onReady?;
    private sessionId;
    private messageEndpoint;
    private eventSource;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectTimeout;
    private reconnectTimer;
    private pendingCalls;
    private callIdCounter;
    serverName?: string | null;
    protocolVersion?: string | null;
    capabilities?: any;
    constructor({ url, onToolsReady, onToolResult, onError, onResourcesReady, onResourceTemplatesReady, onPromptsReady, onReady }: MCPProps);
    private sendJsonRpcRequest;
    private handleError;
    executeTool(toolName: string, args: any): Promise<any>;
    connect(): Promise<void>;
    private initializeSession;
    private handleInitialized;
    private handleCallback;
    private processResourceTemplates;
    getToolsList(): Promise<any>;
    getResources(): Promise<any>;
    getResourceTemplates(): Promise<any>;
    expandUriByVariables(uri: string, variables: Record<string, string>): string;
    getTemplateVariables(template: any): string[];
    readResource(uri: string): Promise<any>;
    getPromptsList(): Promise<any>;
    getPrompt(name: string, args?: any): Promise<any>;
    reconnect(): void;
    disconnect(): void;
}
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
export declare const useMCP: ({ url, onToolsReady, onToolResult, onError, onReady }: MCPProps) => MCPHookResult;
export declare const MCP: React.FC<MCPProps>;
