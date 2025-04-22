import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view'
import './SciFiMCPStatus.css'

import InputSchemaForm from './InputSchemaForm';
import PromptArgumentsForm from './PromptArgumentsForm';

export const SciFiMCPStatus: React.FC<{
    serverInfo: any | null;
    loading: boolean;
    error: string | null;
    tools: any[];
    resources: any[];
    resourceTemplates: any[];
    prompts: any[];
    notifications: any;
    onSettingsOpen?: () => void;
}> = ({ serverInfo, loading, error, tools, resources, resourceTemplates, prompts, notifications, onSettingsOpen }) => {

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>(null);
    const [resourceLoading, setResourceLoading] = useState<boolean>(false);

    const handleToolSelect = (item: any) => {
        setSelectedItem(item);
        setFormData(null);
    };

    const handleResourceSelect = (item: any) => {
        setSelectedItem(item);
        setFormData(null);
    };

    const handleFormComplete = (data: any) => {
        setFormData(data);
        setSelectedItem(null);
    };

    useEffect(() => {
        const executeResource = async () => {
            if (selectedItem?._type === 'resource') {
                setResourceLoading(true);
                try {
                    let result = await selectedItem.execute({}, 5*60000);
                    
                    if (Array.isArray(result) && result[0]?.type === 'text') {
                        result = result.map((item: any) => {
                            if (item.type === 'text') {
                                let json = null;
                                try {
                                    json = JSON.parse(item.text);
                                } catch (error) {
                                    console.log(error);
                                }
                                if (json) {
                                    item.type = 'json';
                                    item.json = json;
                                    delete item.text;
                                }
                            }
                            return {
                                ...item
                            };
                        });
                    }
                    
                    setFormData({
                        input: {},
                        output: result
                    });
                } catch (error: any) {
                    console.error('执行资源时出错:', error);
                    setFormData({
                        input: {},
                        output: [{ type: 'text', text: `执行出错: ${error.message || '未知错误'}` }]
                    });
                } finally {
                    setResourceLoading(false);
                }
            }
        };

        executeResource();
    }, [selectedItem]);

    return (
        <div className="sci-fi-container">
            {/* 全息投影效果的标题 */}
            <div className="hologram-title">
                <h1 style={{ display: 'flex', alignItems: 'center' }}>MCP 系统状态监控 {onSettingsOpen && <button
                    onClick={() => onSettingsOpen()} className='item'
                    style={{
                        fontSize: 12, marginLeft: 10, color: 'white',
                        border: 'none',
                    }}
                >设置</button>}</h1>

                <div className="status-indicator" style={{ display: 'flex', alignItems: 'center' }}>
                    {loading ? (
                        <span className="pulse loading">系统扫描中...</span>
                    ) : error ? (
                        <span className="pulse error">警告：系统异常</span>
                    ) : (
                        <span className="pulse active">系统在线 {serverInfo?.name && `- ${serverInfo.name}`}</span>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-panel">
                    <div className="error-icon">⚠</div>
                    <div className="error-message">{error}</div>
                </div>
            )}

            {Object.keys(notifications).length > 0 && <div className='module' style={{ margin: 20 }}>
                {
                    Object.keys(notifications).map((key, index) => (
                        <div key={index}>
                            {key}: {notifications[key]}
                        </div>
                    ))
                }
            </div>}
            {!loading && !error && (<div style={{ display: 'flex' }}>
                <div className="data-grid">
                    {/* 工具模块 */}
                    {tools.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">⚡</span>
                            <h2>系统工具库</h2>
                            <span className="count">{tools.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {tools.map((tool, index) => (
                                <div key={index} className="item"
                                    onClick={() => handleToolSelect(tool)}
                                >
                                    <span className="item-indicator"></span>
                                    {tool.name}
                                </div>
                            ))}
                        </div>
                    </div>}

                    {/* 资源模块 */}
                    {resources.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">📦</span>
                            <h2>资源矩阵</h2>
                            <span className="count">{resources.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {resources.map((resource, index) => (
                                <div key={index} className="item"
                                    onClick={() => handleResourceSelect(resource)}
                                >
                                    <span className="item-indicator"></span>
                                    {decodeURIComponent(resource.uri)}
                                </div>
                            ))}
                        </div>
                    </div>}

                    {/* 提示模块 */}
                    {prompts.length > 0 && <div className="module">
                        <div className="module-header">
                            <span className="module-icon">💡</span>
                            <h2>AI 提示库</h2>
                            <span className="count">{prompts.length}</span>
                        </div>
                        <div className="scrollable-content">
                            {prompts.map((prompt, index) => (
                                <div key={index} className="item"
                                    onClick={() => handleToolSelect(prompt)}
                                >
                                    <span className="item-indicator"></span>
                                    {prompt.name}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
                {selectedItem?._type === 'tool' && <div className='module' style={{ width: '100%' }}>
                    <InputSchemaForm tool={selectedItem} onComplete={handleFormComplete} />
                </div>}

                {selectedItem?._type === 'prompt' && selectedItem?.arguments && <div className='module' style={{ width: '100%' }}>
                    <PromptArgumentsForm prompt={selectedItem} onComplete={handleFormComplete} />
                </div>}
           
                {selectedItem?._type === 'resource' && resourceLoading && <div className='module' style={{ width: '100%' }}>
                    <div className="loading-indicator">资源加载中...</div>
                </div>}
                
                {formData && <div className='module' style={{ margin: '0 20px' }}>
                    <h4>数据</h4>
                    <ReactJson src={formData} theme="colors" />
                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                </div>}
            </div>
            )}
        </div>
    );
};