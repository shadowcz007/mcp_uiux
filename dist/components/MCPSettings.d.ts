import React from 'react';
import './MCPSettings.css';
interface MCPSettingsProps {
    serverUrl: string;
    resourcePath: string;
    onServerUrlChange: (url: string) => void;
    onResourcePathChange: (path: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare const MCPSettings: React.FC<MCPSettingsProps>;
export {};
