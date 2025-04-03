export interface Tool {
    name: string;
    [key: string]: any;
}

export interface Resource {
    uri: string;
    [key: string]: any;
}

export interface ResourceTemplate {
    uriTemplate: string;
    [key: string]: any;
}

export interface Prompt {
    name: string;
    [key: string]: any;
}

export interface MCPClientConfig {
    onPromptsReady?: (prompts: Prompt[]) => void;
    onError?: (error: Error) => void;
    onReady?: (data: any) => void;
}