import * as React from "react";
import { MCPClient } from "../MCPClient";
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
    notifications: any[];
}
export declare const MCPContext: React.Context<MCPContextType>;
export declare const useMCP: () => MCPContextType;
export {};
