import React from 'react';
import './SciFiMCPStatus.css';
export declare const SciFiMCPStatus: React.FC<{
    serverInfo: any | null;
    loading: boolean;
    error: string | null;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
    notifications: any;
    onSettingsOpen?: () => void;
}>;
