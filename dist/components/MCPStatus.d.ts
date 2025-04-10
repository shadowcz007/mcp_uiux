import React from 'react';
export interface MCPStatusProps {
    serverUrl?: string;
    resourcePath?: string;
    className?: string;
    style?: React.CSSProperties;
    showSettings?: boolean;
    render?: (props: {
        loading: boolean;
        error: string | null;
        tools: any[];
        resources: any[];
        resourceTemplates: any[];
        prompts: any[];
        notifications: any;
    }) => React.ReactNode;
}
export declare const MCPStatus: React.FC<MCPStatusProps>;
