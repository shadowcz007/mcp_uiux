"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPStatus = MCPStatus;
var react_1 = __importStar(require("react"));
var useMCP_1 = require("../hooks/useMCP");
function MCPStatus() {
    var _a = (0, useMCP_1.useMCP)({}), connect = _a.connect, loading = _a.loading, error = _a.error, tools = _a.tools, resources = _a.resources, resourceTemplates = _a.resourceTemplates, prompts = _a.prompts;
    (0, react_1.useEffect)(function () {
        // 组件加载时连接到 MCP 服务
        connect('http://localhost:8080', '/my-resources');
    }, [connect]);
    if (loading) {
        return react_1.default.createElement("div", null, "\u6B63\u5728\u8FDE\u63A5 MCP \u670D\u52A1...");
    }
    if (error) {
        return react_1.default.createElement("div", null,
            "\u8FDE\u63A5\u9519\u8BEF: ",
            error);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "MCP \u8FDE\u63A5\u72B6\u6001"),
        react_1.default.createElement("h3", null,
            "\u5DE5\u5177\u5217\u8868 (",
            tools.length,
            ")"),
        react_1.default.createElement("ul", null, tools.map(function (tool, index) { return (react_1.default.createElement("li", { key: index }, tool.name)); })),
        react_1.default.createElement("h3", null,
            "\u8D44\u6E90\u5217\u8868 (",
            resources.length,
            ")"),
        react_1.default.createElement("ul", null, resources.map(function (resource, index) { return (react_1.default.createElement("li", { key: index }, resource.uri)); })),
        react_1.default.createElement("h3", null,
            "\u8D44\u6E90\u6A21\u677F (",
            resourceTemplates.length,
            ")"),
        react_1.default.createElement("ul", null, resourceTemplates.map(function (template, index) { return (react_1.default.createElement("li", { key: index }, template.uriTemplate)); })),
        react_1.default.createElement("h3", null,
            "\u63D0\u793A\u5217\u8868 (",
            prompts.length,
            ")"),
        react_1.default.createElement("ul", null, prompts.map(function (prompt, index) { return (react_1.default.createElement("li", { key: index }, prompt.name)); }))));
}
