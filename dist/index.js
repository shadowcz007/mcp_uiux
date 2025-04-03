'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// MCPClient 类的错误类型
var MCPError = /** @class */ (function (_super) {
    __extends(MCPError, _super);
    function MCPError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = 'MCPError';
        return _this;
    }
    return MCPError;
}(Error));
var MCPClient = /** @class */ (function () {
    function MCPClient(_a) {
        var _b = _a.url, url = _b === void 0 ? 'http://localhost:8000' : _b, onToolsReady = _a.onToolsReady, onToolResult = _a.onToolResult, onError = _a.onError, onResourcesReady = _a.onResourcesReady, onResourceTemplatesReady = _a.onResourceTemplatesReady, onPromptsReady = _a.onPromptsReady, onReady = _a.onReady;
        this.sessionId = null;
        this.messageEndpoint = null;
        this.eventSource = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 99;
        this.reconnectTimeout = 1000;
        this.reconnectTimer = null;
        this.pendingCalls = new Map();
        this.callIdCounter = 0;
        this.serverName = null;
        this.protocolVersion = null;
        this.capabilities = null;
        this.url = url;
        this.onToolsReady = onToolsReady;
        this.onToolResult = onToolResult;
        this.onError = onError;
        this.onResourcesReady = onResourcesReady;
        this.onResourceTemplatesReady = onResourceTemplatesReady;
        this.onPromptsReady = onPromptsReady;
        this.onReady = onReady;
    }
    // 发送 JSON-RPC 请求
    MCPClient.prototype.sendJsonRpcRequest = function (method, params, id) {
        if (id === void 0) { id = null; }
        return __awaiter(this, void 0, void 0, function () {
            var jsonRpcRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log('发送JSON-RPC请求', method, this.sessionId, this.messageEndpoint)
                        if (!this.messageEndpoint)
                            throw new Error(method + this.sessionId + this.messageEndpoint + '未获取到消息端点');
                        jsonRpcRequest = __assign({ jsonrpc: '2.0', method: method, params: params }, (id !== null && { id: id }));
                        return [4 /*yield*/, fetch(this.messageEndpoint, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(jsonRpcRequest)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("\u8BF7\u6C42\u5931\u8D25: ".concat(response.status));
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // 添加错误处理的辅助方法
    MCPClient.prototype.handleError = function (error, customMessage) {
        var _a;
        var mcpError = error instanceof MCPError
            ? error
            : new MCPError(error instanceof Error ? error.message : customMessage);
        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, mcpError);
        throw mcpError;
    };
    // 执行工具的公共方法
    MCPClient.prototype.executeTool = function (toolName, args) {
        return __awaiter(this, void 0, void 0, function () {
            var callId_1, resultPromise, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        callId_1 = "".concat(toolName, "_").concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_1, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_1)) {
                                    _this.pendingCalls.delete(callId_1);
                                    reject(new Error("\u5DE5\u5177\u6267\u884C\u8D85\u65F6: ".concat(toolName)));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求，添加callId作为元数据
                        return [4 /*yield*/, this.sendJsonRpcRequest('tools/call', {
                                name: toolName,
                                arguments: args
                            }, callId_1)];
                    case 1:
                        // 发送请求，添加callId作为元数据
                        _a.sent();
                        return [2 /*return*/, resultPromise];
                    case 2:
                        error_1 = _a.sent();
                        this.handleError(error_1, "\u6267\u884C\u5DE5\u5177\u5931\u8D25: ".concat(toolName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 连接 SSE
    MCPClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sseUrl, initialized, toolsRequested;
            var _this = this;
            return __generator(this, function (_a) {
                sseUrl = "".concat(this.url);
                console.log('正在连接 SSE:', sseUrl);
                this.eventSource = new EventSource(sseUrl);
                initialized = false;
                toolsRequested = false;
                this.eventSource.onopen = function () {
                    console.log('SSE 连接已建立');
                    // 重置重连计数器
                    _this.reconnectAttempts = 0;
                };
                this.eventSource.onerror = function (error) {
                    var _a, _b, _c;
                    console.error('SSE 连接错误:', error);
                    (_a = _this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
                    _this.eventSource = null;
                    (_b = _this.onError) === null || _b === void 0 ? void 0 : _b.call(_this, new Error('SSE 连接失败'));
                    // 自动重连逻辑
                    if (_this.reconnectAttempts < _this.maxReconnectAttempts) {
                        var delay = _this.reconnectTimeout * Math.pow(2, _this.reconnectAttempts);
                        console.log("\u5C06\u5728 ".concat(delay, "ms \u540E\u5C1D\u8BD5\u91CD\u8FDE (").concat(_this.reconnectAttempts + 1, "/").concat(_this.maxReconnectAttempts, ")"));
                        _this.reconnectTimer = setTimeout(function () {
                            _this.reconnectAttempts++;
                            _this.connect();
                        }, delay);
                    }
                    else {
                        console.error('已达到最大重连次数');
                        (_c = _this.onError) === null || _c === void 0 ? void 0 : _c.call(_this, new Error('SSE 连接失败，已达到最大重连次数'));
                    }
                };
                // 处理 endpoint 事件
                this.eventSource.addEventListener('endpoint', function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var sessionUri, baseUrl, sessionIdMatch;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log('收到 endpoint 事件:', event.data);
                                sessionUri = event.data;
                                // 修改这里：正确处理 URL 拼接
                                // 检查 sessionUri 是否已经包含完整 URL
                                if (sessionUri.startsWith('http://') ||
                                    sessionUri.startsWith('https://')) {
                                    this.messageEndpoint = sessionUri;
                                }
                                else {
                                    baseUrl = new URL(this.url);
                                    // 如果 sessionUri 以 / 开头，则直接使用主机名
                                    if (sessionUri.startsWith('/')) {
                                        this.messageEndpoint = "".concat(baseUrl.origin).concat(sessionUri);
                                    }
                                    else {
                                        this.messageEndpoint = "".concat(baseUrl.origin, "/").concat(sessionUri);
                                    }
                                }
                                sessionIdMatch = sessionUri.match(/session_id=([^&]+)/) ||
                                    sessionUri.match(/sessionId=([^&]+)/);
                                if (!sessionIdMatch) return [3 /*break*/, 4];
                                this.sessionId = sessionIdMatch[1];
                                if (!!initialized) return [3 /*break*/, 4];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.initializeSession()];
                            case 2:
                                _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _b.sent();
                                (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, new Error('初始化会话失败'));
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                // 处理 message 事件
                this.eventSource.addEventListener('message', function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var message, _a, name_1, version, capabilities, toolsWithExecute, resourceTemplates, index, uri, error_3;
                    var _this = this;
                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    return __generator(this, function (_q) {
                        switch (_q.label) {
                            case 0:
                                _q.trys.push([0, 4, , 5]);
                                message = JSON.parse(event.data);
                                console.log('收到消息:', message);
                                if (!(message.jsonrpc === '2.0')) return [3 /*break*/, 3];
                                if (!(message.id === 1 && message.result && !initialized)) return [3 /*break*/, 2];
                                initialized = true;
                                _a = message.result.serverInfo, name_1 = _a.name, version = _a.version;
                                capabilities = message.result.capabilities;
                                this.serverName = name_1;
                                this.protocolVersion = message.result.protocolVersion;
                                this.capabilities = capabilities;
                                console.log('MCP capabilities:', capabilities);
                                return [4 /*yield*/, this.handleInitialized(toolsRequested)];
                            case 1:
                                toolsRequested = _q.sent();
                                (_b = this.onReady) === null || _b === void 0 ? void 0 : _b.call(this, {
                                    name: name_1,
                                    protocolVersion: this.protocolVersion || '',
                                    version: version,
                                    capabilities: capabilities
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                if ((_c = message.result) === null || _c === void 0 ? void 0 : _c.tools) {
                                    console.log('获取到工具列表:', this.sessionId, message.result.tools);
                                    toolsWithExecute = message.result.tools.map(function (tool) { return (__assign(__assign({}, tool), { fromServerName: _this.serverName, execute: function (args) { return _this.executeTool(tool.name, args); } })); });
                                    (_d = this.onToolsReady) === null || _d === void 0 ? void 0 : _d.call(this, toolsWithExecute);
                                    this.handleCallback(message);
                                }
                                else if ((_e = message.result) === null || _e === void 0 ? void 0 : _e.resources) {
                                    console.log('获取到资源列表:', message.result.resources);
                                    (_f = this.onResourcesReady) === null || _f === void 0 ? void 0 : _f.call(this, message.result.resources);
                                    this.handleCallback(message);
                                }
                                else if ((_g = message.result) === null || _g === void 0 ? void 0 : _g.resourceTemplates) {
                                    console.log('获取到资源模板列表:', message.result.resourceTemplates);
                                    resourceTemplates = message.result.resourceTemplates;
                                    if (resourceTemplates && Array.isArray(resourceTemplates)) {
                                        for (index = 0; index < resourceTemplates.length; index++) {
                                            uri = resourceTemplates[index].uri;
                                            resourceTemplates[index] = __assign(__assign({}, resourceTemplates[index]), { uri: uri, _variables: this.getTemplateVariables(resourceTemplates[index]), _expandUriByVariables: this.expandUriByVariables });
                                        }
                                        //fixbug ， 如果capabilities没有resourceTemplates，则直接赋值
                                        if (this.capabilities && !this.capabilities.resourceTemplates) {
                                            this.capabilities.resourceTemplates = resourceTemplates;
                                        }
                                        console.log('缓存资源模板到capabilities:', this.capabilities.resourceTemplates);
                                    }
                                    (_h = this.onResourceTemplatesReady) === null || _h === void 0 ? void 0 : _h.call(this, this.processResourceTemplates(resourceTemplates));
                                    this.handleCallback(message);
                                }
                                else if ((_j = message.result) === null || _j === void 0 ? void 0 : _j.prompts) {
                                    console.log('获取到提示列表:', message.result.prompts);
                                    (_k = this.onPromptsReady) === null || _k === void 0 ? void 0 : _k.call(this, message.result.prompts);
                                    this.handleCallback(message);
                                }
                                // 处理工具执行结果
                                else if ((_l = message.result) === null || _l === void 0 ? void 0 : _l.content) {
                                    console.log('工具执行结果:', message);
                                    this.handleCallback(message);
                                    // 仍然调用回调函数
                                    (_m = this.onToolResult) === null || _m === void 0 ? void 0 : _m.call(this, message.result.content, message.result.isError || false);
                                }
                                else if (message.method == 'sampling/createMessage') {
                                    console.log('收到采样消息:', message);
                                    if ((_p = (_o = message === null || message === void 0 ? void 0 : message.params) === null || _o === void 0 ? void 0 : _o.metadata) === null || _p === void 0 ? void 0 : _p.request_id) {
                                        //fixbug , mcp server 里的 需要注意 metadata的处理， 用于更新id
                                        message.id = message.params.metadata.request_id;
                                        console.log('fix收到采样消息:', message);
                                        this.handleCallback(message);
                                    }
                                }
                                // 添加这个部分：处理任何其他类型的响应
                                else if (message.id != undefined) {
                                    // 确保任何带有 ID 的响应都能触发回调
                                    console.log('#callback:', message);
                                    this.handleCallback(message);
                                }
                                _q.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                error_3 = _q.sent();
                                console.error('解析消息失败:', error_3);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    // 初始化会话
    MCPClient.prototype.initializeSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('初始化会话');
                return [2 /*return*/, this.sendJsonRpcRequest('initialize', {
                        protocolVersion: '0.1.0',
                        capabilities: {},
                        clientInfo: {
                            name: 'MixCopilot MCP Client',
                            version: '1.0.0'
                        }
                    }, 1)];
            });
        });
    };
    // 处理初始化完成后的操作
    MCPClient.prototype.handleInitialized = function (toolsRequested) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.sendJsonRpcRequest('notifications/initialized', {}, null)];
                    case 1:
                        _b.sent();
                        console.log('handleInitialized', toolsRequested);
                        if (!!toolsRequested) return [3 /*break*/, 6];
                        // 获取工具列表
                        return [4 /*yield*/, this.getToolsList()];
                    case 2:
                        // 获取工具列表
                        _b.sent();
                        return [4 /*yield*/, this.getResources()
                            // 获取并缓存资源模板
                        ];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.getResourceTemplates()
                            // 注意：getResourceTemplates 方法内部已经处理了缓存，这里不需要额外设置
                        ];
                    case 4:
                        _b.sent();
                        // 注意：getResourceTemplates 方法内部已经处理了缓存，这里不需要额外设置
                        return [4 /*yield*/, this.getPromptsList()];
                    case 5:
                        // 注意：getResourceTemplates 方法内部已经处理了缓存，这里不需要额外设置
                        _b.sent();
                        return [2 /*return*/, true];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_4 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, toolsRequested];
                }
            });
        });
    };
    // 添加类型安全的回调处理
    MCPClient.prototype.handleCallback = function (message) {
        var _a, _b, _c;
        var callId = message.id;
        if (!callId || !this.pendingCalls.has(callId))
            return;
        var resolve = this.pendingCalls.get(callId).resolve;
        this.pendingCalls.delete(callId);
        var result = (_c = (_b = (_a = message.result) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : message.result) !== null && _c !== void 0 ? _c : {
            method: message.method,
            params: message.params
        };
        resolve(result);
    };
    // 添加类型安全的资源模板处理
    MCPClient.prototype.processResourceTemplates = function (templates) {
        var _this = this;
        return templates.map(function (template) { return (__assign(__assign({}, template), { _variables: _this.getTemplateVariables(template), _expandUriByVariables: _this.expandUriByVariables })); });
    };
    // 获取工具列表
    MCPClient.prototype.getToolsList = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var callId_2, resultPromise, error_5;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        callId_2 = "tools_list_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_2, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_2)) {
                                    _this.pendingCalls.delete(callId_2);
                                    reject(new Error("\u83B7\u53D6\u5DE5\u5177\u5217\u8868\u8D85\u65F6"));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('tools/list', {}, callId_2)];
                    case 1:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 2:
                        error_5 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_5 instanceof Error ? error_5 : new Error('获取工具列表失败'));
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取资源列表
    MCPClient.prototype.getResources = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var callId_3, resultPromise, error_6;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.capabilities)
                            return [2 /*return*/, []];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        callId_3 = "resources_list_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_3, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_3)) {
                                    _this.pendingCalls.delete(callId_3);
                                    reject(new Error("\u83B7\u53D6\u8D44\u6E90\u5217\u8868\u8D85\u65F6"));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('resources/list', {}, callId_3)];
                    case 2:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 3:
                        error_6 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_6 instanceof Error ? error_6 : new Error('获取资源列表失败'));
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 获取资源列表
    MCPClient.prototype.getResourceTemplates = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var callId_4, resultPromise, error_7;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.capabilities)
                            return [2 /*return*/, []];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        callId_4 = "resources_templates_list_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_4, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_4)) {
                                    _this.pendingCalls.delete(callId_4);
                                    reject(new Error("\u83B7\u53D6\u52A8\u6001\u8D44\u6E90\u5217\u8868\u8D85\u65F6"));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('resources/templates/list', {}, callId_4)];
                    case 2:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 3:
                        error_7 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_7 instanceof Error ? error_7 : new Error('获取资源列表失败'));
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 解析URI模板
    MCPClient.prototype.expandUriByVariables = function (uri, variables) {
        // 实现RFC 6570的基本功能，支持{var}简单变量替换
        console.log('expandUriByVariables:', uri, variables);
        return uri.replace(/{([^}]+)}/g, function (match, varName) {
            if (variables[varName] !== undefined) {
                return encodeURIComponent(variables[varName]);
            }
            return '';
        });
    };
    // 获取模板所需的变量列表
    MCPClient.prototype.getTemplateVariables = function (template) {
        if (!template) {
            return [];
        }
        var variables = [];
        var regex = /{([^}]+)}/g;
        var match;
        while ((match = regex.exec(template.uriTemplate)) !== null) {
            variables.push(match[1]);
        }
        return variables;
    };
    // 读取特定资源
    MCPClient.prototype.readResource = function (uri) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var callId_5, resultPromise, error_8;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        callId_5 = "resources_read_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_5, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_5)) {
                                    _this.pendingCalls.delete(callId_5);
                                    reject(new Error("\u8BFB\u53D6\u8D44\u6E90\u8D85\u65F6: ".concat(uri)));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('resources/read', { uri: uri }, callId_5)];
                    case 1:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 2:
                        error_8 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_8 instanceof Error ? error_8 : new Error("\u8BFB\u53D6\u8D44\u6E90\u5931\u8D25: ".concat(uri)));
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取提示列表
    MCPClient.prototype.getPromptsList = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var callId_6, resultPromise, error_9;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        callId_6 = "prompts_list_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_6, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_6)) {
                                    _this.pendingCalls.delete(callId_6);
                                    reject(new Error("\u83B7\u53D6\u63D0\u793A\u5217\u8868\u8D85\u65F6"));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('prompts/list', {}, callId_6)];
                    case 1:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 2:
                        error_9 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_9 instanceof Error ? error_9 : new Error('获取提示列表失败'));
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 获取特定提示
    MCPClient.prototype.getPrompt = function (name, args) {
        var _a;
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var callId_7, resultPromise, error_10;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        callId_7 = "prompts_get_".concat(this.callIdCounter++);
                        resultPromise = new Promise(function (resolve, reject) {
                            _this.pendingCalls.set(callId_7, { resolve: resolve, reject: reject });
                            // 设置超时
                            setTimeout(function () {
                                if (_this.pendingCalls.has(callId_7)) {
                                    _this.pendingCalls.delete(callId_7);
                                    reject(new Error("\u83B7\u53D6\u63D0\u793A\u8D85\u65F6: ".concat(name)));
                                }
                            }, 30000); // 30秒超时
                        });
                        // 发送请求
                        return [4 /*yield*/, this.sendJsonRpcRequest('prompts/get', {
                                name: name,
                                arguments: args
                            }, callId_7)];
                    case 1:
                        // 发送请求
                        _b.sent();
                        return [2 /*return*/, resultPromise];
                    case 2:
                        error_10 = _b.sent();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error_10 instanceof Error ? error_10 : new Error("\u83B7\u53D6\u63D0\u793A\u5931\u8D25: ".concat(name)));
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 重新连接方法
    MCPClient.prototype.reconnect = function () {
        var _a;
        console.log('手动重新连接...');
        // 清除任何现有的重连计时器
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        // 重置重连计数
        this.reconnectAttempts = 0;
        (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
        this.eventSource = null;
        this.sessionId = null;
        this.connect();
    };
    // 断开连接
    MCPClient.prototype.disconnect = function () {
        var _a;
        this.maxReconnectAttempts = -1;
        // 清除任何现有的重连计时器
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
        this.eventSource = null;
        this.sessionId = null;
    };
    return MCPClient;
}());

var MCPContext = React__namespace.createContext({
    mcpClient: null,
    loading: false,
    error: null,
    reconnect: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    connect: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    tools: [],
    resources: [],
    resourceTemplates: [],
    prompts: []
});
var useMCP = function () { return React.useContext(MCPContext); };
function MCPProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = React.useState(null), mcpClient = _b[0], setMcpClient = _b[1];
    var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = React.useState(null), error = _d[0], setError = _d[1];
    var _e = React.useState([]), tools = _e[0], setTools = _e[1];
    var _f = React.useState([]), resources = _f[0], setResources = _f[1];
    var _g = React.useState([]), resourceTemplates = _g[0], setResourceTemplates = _g[1];
    var _h = React.useState([]), prompts = _h[0], setPrompts = _h[1];
    var _j = React.useState(null), lastConnectedUrl = _j[0], setLastConnectedUrl = _j[1];
    var _k = React.useState(""), lastResourceFilter = _k[0], setLastResourceFilter = _k[1];
    // 创建MCP客户端的函数
    var createClient = function (sseUrl, currentFilter) { return __awaiter(_this, void 0, void 0, function () {
        var client, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    // 清空之前的数据
                    setTools([]);
                    setResources([]);
                    setResourceTemplates([]);
                    setPrompts([]);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    client = new MCPClient({
                        url: sseUrl,
                        onToolsReady: function (toolsList) {
                            console.log('获取到工具列表:', toolsList);
                            setTools(Array.from(toolsList || [], function (t) {
                                return __assign(__assign({}, t), { _type: 'tool' });
                            }));
                        },
                        onResourcesReady: function (resourcesList) {
                            console.log('获取到资源列表:', currentFilter, resourcesList);
                            setResources(Array.from(resourcesList || [], function (r) {
                                var _a;
                                if (!currentFilter || ((_a = r.uri) === null || _a === void 0 ? void 0 : _a.startsWith(currentFilter))) {
                                    return __assign(__assign({}, r), { _type: 'resource' });
                                }
                            }).filter(Boolean));
                        },
                        onResourceTemplatesReady: function (resourceTemplatesList) {
                            console.log('获取到资源变量列表:', currentFilter, resourceTemplatesList);
                            setResourceTemplates(Array.from(resourceTemplatesList || [], function (rt) {
                                var _a;
                                if (!currentFilter || ((_a = rt.uriTemplate) === null || _a === void 0 ? void 0 : _a.startsWith(currentFilter))) {
                                    return __assign(__assign({}, rt), { _type: 'resourceTemplate' });
                                }
                            }).filter(Boolean));
                        },
                        onPromptsReady: function (promptsList) {
                            console.log('获取到提示列表:', promptsList);
                            setPrompts(Array.from(promptsList || [], function (p) {
                                return __assign(__assign({}, p), { _type: 'prompt' });
                            }).filter(Boolean));
                        },
                        onError: function (err) {
                            var errorMessage = err.message || '未知错误';
                            console.error('MCP客户端连接失败:', err);
                            setError("\u8FDE\u63A5\u5931\u8D25: ".concat(errorMessage));
                        },
                        onReady: function (data) {
                            console.log('MCP客户端连接成功', data);
                        }
                    });
                    // 连接到服务器
                    return [4 /*yield*/, client.connect()];
                case 2:
                    // 连接到服务器
                    _a.sent();
                    // @ts-ignore
                    window.mcpClient = client;
                    setMcpClient(client);
                    setLoading(false);
                    return [2 /*return*/, client];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : '未知错误';
                    console.error('MCP客户端连接失败:', error_1);
                    setError("\u8FDE\u63A5\u5931\u8D25: ".concat(errorMessage));
                    setLoading(false);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // 初始连接函数
    var connect = function (sseUrl, resourceFilter) { return __awaiter(_this, void 0, void 0, function () {
        var filter, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(mcpClient);
                    if (mcpClient) {
                        try {
                            mcpClient.disconnect();
                        }
                        catch (e) {
                            console.warn('关闭旧连接时出错:', e);
                        }
                    }
                    filter = resourceFilter || "";
                    console.log('正在连接MCP服务...');
                    return [4 /*yield*/, createClient(sseUrl, filter)];
                case 1:
                    client = _a.sent();
                    if (client) {
                        setLastConnectedUrl(sseUrl);
                        setLastResourceFilter(filter);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // 重连函数
    var reconnect = function (sseUrl, resourceFilter) { return __awaiter(_this, void 0, void 0, function () {
        var connectionUrl, filter, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connectionUrl = sseUrl || lastConnectedUrl || (mcpClient === null || mcpClient === void 0 ? void 0 : mcpClient.url) || 'http://127.0.0.1:8080';
                    filter = resourceFilter !== undefined ? resourceFilter : lastResourceFilter;
                    if (mcpClient) {
                        try {
                            mcpClient.disconnect();
                        }
                        catch (e) {
                            console.warn('关闭旧连接时出错:', e);
                        }
                    }
                    console.log('正在重新连接MCP服务...');
                    return [4 /*yield*/, createClient(connectionUrl, filter)];
                case 1:
                    client = _a.sent();
                    if (client && !sseUrl) {
                        // 只有在使用保存的URL重连时才更新lastConnectedUrl
                        setLastConnectedUrl(connectionUrl);
                        setLastResourceFilter(filter);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // 添加自动重连逻辑
    React.useEffect(function () {
        // 当连接出错时自动尝试重连
        if (error && lastConnectedUrl) {
            var timer_1 = setTimeout(function () {
                console.log('检测到连接错误，尝试自动重连...');
                reconnect();
            }, 5000); // 5秒后尝试重连
            return function () { return clearTimeout(timer_1); };
        }
    }, [error, lastConnectedUrl]);
    // 组件卸载时清理连接
    React.useEffect(function () {
        return function () {
            if (mcpClient) {
                try {
                    mcpClient.disconnect();
                }
                catch (e) {
                    console.warn('关闭连接时出错:', e);
                }
            }
        };
    }, [mcpClient]);
    return (React__namespace.createElement(MCPContext.Provider, { value: {
            mcpClient: mcpClient,
            loading: loading,
            error: error,
            reconnect: reconnect,
            connect: connect,
            tools: tools,
            resources: resources,
            resourceTemplates: resourceTemplates,
            prompts: prompts
        } }, children));
}

var MCPStatus = function (_a) {
    var _b = _a.serverUrl, serverUrl = _b === void 0 ? 'http://localhost:8080' : _b, _c = _a.resourcePath, resourcePath = _c === void 0 ? '' : _c, className = _a.className, style = _a.style;
    var _d = useMCP(), connect = _d.connect, loading = _d.loading, error = _d.error, tools = _d.tools, resources = _d.resources, resourceTemplates = _d.resourceTemplates, prompts = _d.prompts;
    React.useEffect(function () {
        connect(serverUrl, resourcePath);
    }, [serverUrl, resourcePath]);
    if (loading) {
        return React__default["default"].createElement("div", { className: className, style: style }, "\u6B63\u5728\u8FDE\u63A5 MCP \u670D\u52A1...");
    }
    if (error) {
        return React__default["default"].createElement("div", { className: className, style: style },
            "\u8FDE\u63A5\u9519\u8BEF: ",
            error);
    }
    return (React__default["default"].createElement("div", { className: className, style: style },
        React__default["default"].createElement("h2", null, "MCP \u8FDE\u63A5\u72B6\u6001"),
        React__default["default"].createElement("h3", null,
            "\u5DE5\u5177\u5217\u8868 (",
            tools.length,
            ")"),
        React__default["default"].createElement("ul", null, tools.map(function (tool, index) { return (React__default["default"].createElement("li", { key: index }, tool.name)); })),
        React__default["default"].createElement("h3", null,
            "\u8D44\u6E90\u5217\u8868 (",
            resources.length,
            ")"),
        React__default["default"].createElement("ul", null, resources.map(function (resource, index) { return (React__default["default"].createElement("li", { key: index }, decodeURIComponent(resource.uri))); })),
        React__default["default"].createElement("h3", null,
            "\u8D44\u6E90\u6A21\u677F (",
            resourceTemplates.length,
            ")"),
        React__default["default"].createElement("ul", null, resourceTemplates.map(function (template, index) { return (React__default["default"].createElement("li", { key: index }, decodeURIComponent(template.uriTemplate))); })),
        React__default["default"].createElement("h3", null,
            "\u63D0\u793A\u5217\u8868 (",
            prompts.length,
            ")"),
        React__default["default"].createElement("ul", null, prompts.map(function (prompt, index) { return (React__default["default"].createElement("li", { key: index }, prompt.name)); }))));
};

exports.MCPProvider = MCPProvider;
exports.MCPStatus = MCPStatus;
exports.useMCP = useMCP;
//# sourceMappingURL=index.js.map
