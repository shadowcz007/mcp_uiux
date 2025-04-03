import React from 'react';
import { ReactNode } from 'react';
import { MCPClient } from '../hooks/useMCP';
export interface MCPContextType {
    mcpClient: MCPClient | null;
    loading: boolean;
    error: string | null;
    reconnect: (sseUrl?: string, resourceFilter?: string) => Promise<void>;
    connect: (sseUrl: string, resourceFilter?: string) => Promise<void>;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
}
export interface MCPProviderProps {
    children: ReactNode;
}
export declare const useMCP: () => MCPContextType;
export declare function MCPProvider({ children }: {
    children: ReactNode;
}): React.JSX.Element;
