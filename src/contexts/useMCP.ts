import * as React from "react";
import { useContext } from "react";
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


export const MCPContext = React.createContext<MCPContextType>({
    mcpClient: null,
    loading: false,
    error: null,
    reconnect: async () => { },
    connect: async () => { },
    tools: [],
    resources: [],
    resourceTemplates: [],
    prompts: [],
    serverInfo: null,
    notifications: []
});

export const useMCP = () => useContext(MCPContext);