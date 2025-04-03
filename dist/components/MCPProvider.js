"use strict";
"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMCP = void 0;
exports.MCPProvider = MCPProvider;
var react_1 = __importDefault(require("react"));
var react_2 = require("react");
var useMCP_1 = require("../hooks/useMCP");
var MCPContext = (0, react_2.createContext)({
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
var useMCP = function () { return (0, react_2.useContext)(MCPContext); };
exports.useMCP = useMCP;
function MCPProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, react_2.useState)(null), mcpClient = _b[0], setMcpClient = _b[1];
    var _c = (0, react_2.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_2.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_2.useState)([]), tools = _e[0], setTools = _e[1];
    var _f = (0, react_2.useState)([]), resources = _f[0], setResources = _f[1];
    var _g = (0, react_2.useState)([]), resourceTemplates = _g[0], setResourceTemplates = _g[1];
    var _h = (0, react_2.useState)([]), prompts = _h[0], setPrompts = _h[1];
    var _j = (0, react_2.useState)(null), lastConnectedUrl = _j[0], setLastConnectedUrl = _j[1];
    var _k = (0, react_2.useState)(""), lastResourceFilter = _k[0], setLastResourceFilter = _k[1];
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
                    client = new useMCP_1.MCPClient({
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
    (0, react_2.useEffect)(function () {
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
    (0, react_2.useEffect)(function () {
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
    return (react_1.default.createElement(MCPContext.Provider, { value: {
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
