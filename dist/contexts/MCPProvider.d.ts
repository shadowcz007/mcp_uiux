import * as React from 'react';
import { MCPClient } from './MCP';
interface MCPContextType {
    mcpClient: MCPClient | null;
    loading: boolean;
    error: string | null;
    reconnect: (sseUrl?: string, resourceFilter?: string) => Promise<void>;
    connect: (sseUrl: string, resourceFilter?: string) => Promise<void>;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
    serverInfo: any | null;
}
export declare const useMCP: () => MCPContextType;
export declare function MCPProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
