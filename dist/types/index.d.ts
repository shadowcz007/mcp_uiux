export interface MCPClientConfig {
    onPromptsReady?: (prompts: Prompt[]) => void;
    onError?: (error: Error) => void;
    onReady?: (data: any) => void;
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
export declare class MCPError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export interface MCPProps {
    url?: string;
    onToolsReady?: (tools: Tool[]) => void;
    onToolResult?: (content: any, isError: boolean) => void;
    onError?: (error: Error) => void;
    onResourcesReady?: (resources: Resource[]) => void;
    onResourceTemplatesReady?: (resourceTemplates: ResourceTemplate[]) => void;
    onPromptsReady?: (prompts: Prompt[]) => void;
    onReady?: (data: ServerInfo) => void;
    onNotifications?: (data: any) => void;
}
