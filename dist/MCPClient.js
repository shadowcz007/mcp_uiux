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

class ParseError extends Error {
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
}
function noop(_arg) {
}
function createParser(callbacks) {
  if (typeof callbacks == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = !0, id, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = !1;
  }
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id = void 0, data = "", eventType = "";
  }
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = !0, id = void 0, data = "", eventType = "", incompleteLine = "";
  }
  return { feed, reset };
}
function splitLines(chunk) {
  const lines = [];
  let incompleteLine = "", searchIndex = 0;
  for (; searchIndex < chunk.length; ) {
    const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}

class ErrorEvent extends Event {
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(type, errorEventInitDict) {
    var _a, _b;
    super(type), this.code = (_a = errorEventInitDict == null ? void 0 : errorEventInitDict.code) != null ? _a : void 0, this.message = (_b = errorEventInitDict == null ? void 0 : errorEventInitDict.message) != null ? _b : void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [Symbol.for("nodejs.util.inspect.custom")](_depth, options, inspect) {
    return inspect(inspectableError(this), options);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [Symbol.for("Deno.customInspect")](inspect, options) {
    return inspect(inspectableError(this), options);
  }
}
function syntaxError(message) {
  const DomException = globalThis.DOMException;
  return typeof DomException == "function" ? new DomException(message, "SyntaxError") : new SyntaxError(message);
}
function flattenError(err) {
  return err instanceof Error ? "errors" in err && Array.isArray(err.errors) ? err.errors.map(flattenError).join(", ") : "cause" in err && err.cause instanceof Error ? `${err}: ${flattenError(err.cause)}` : err.message : `${err}`;
}
function inspectableError(err) {
  return {
    type: err.type,
    message: err.message,
    code: err.code,
    defaultPrevented: err.defaultPrevented,
    cancelable: err.cancelable,
    timeStamp: err.timeStamp
  };
}
var __typeError = (msg) => {
  throw TypeError(msg);
}, __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value), __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method), _readyState, _url, _redirectUrl, _withCredentials, _fetch, _reconnectInterval, _reconnectTimer, _lastEventId, _controller, _parser, _onError, _onMessage, _onOpen, _EventSource_instances, connect_fn, _onFetchResponse, _onFetchError, getRequestOptions_fn, _onEvent, _onRetryChange, failConnection_fn, scheduleReconnect_fn, _reconnect;
class EventSource extends EventTarget {
  constructor(url, eventSourceInitDict) {
    var _a, _b;
    super(), __privateAdd(this, _EventSource_instances), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, __privateAdd(this, _readyState), __privateAdd(this, _url), __privateAdd(this, _redirectUrl), __privateAdd(this, _withCredentials), __privateAdd(this, _fetch), __privateAdd(this, _reconnectInterval), __privateAdd(this, _reconnectTimer), __privateAdd(this, _lastEventId, null), __privateAdd(this, _controller), __privateAdd(this, _parser), __privateAdd(this, _onError, null), __privateAdd(this, _onMessage, null), __privateAdd(this, _onOpen, null), __privateAdd(this, _onFetchResponse, async (response) => {
      var _a2;
      __privateGet(this, _parser).reset();
      const { body, redirected, status, headers } = response;
      if (status === 204) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
        return;
      }
      if (redirected ? __privateSet(this, _redirectUrl, new URL(response.url)) : __privateSet(this, _redirectUrl, void 0), status !== 200) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, `Non-200 status code (${status})`, status);
        return;
      }
      if (!(headers.get("content-type") || "").startsWith("text/event-stream")) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, 'Invalid content type, expected "text/event-stream"', status);
        return;
      }
      if (__privateGet(this, _readyState) === this.CLOSED)
        return;
      __privateSet(this, _readyState, this.OPEN);
      const openEvent = new Event("open");
      if ((_a2 = __privateGet(this, _onOpen)) == null || _a2.call(this, openEvent), this.dispatchEvent(openEvent), typeof body != "object" || !body || !("getReader" in body)) {
        __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid response body, expected a web ReadableStream", status), this.close();
        return;
      }
      const decoder = new TextDecoder(), reader = body.getReader();
      let open = !0;
      do {
        const { done, value } = await reader.read();
        value && __privateGet(this, _parser).feed(decoder.decode(value, { stream: !done })), done && (open = !1, __privateGet(this, _parser).reset(), __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this));
      } while (open);
    }), __privateAdd(this, _onFetchError, (err) => {
      __privateSet(this, _controller, void 0), !(err.name === "AbortError" || err.type === "aborted") && __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this, flattenError(err));
    }), __privateAdd(this, _onEvent, (event) => {
      typeof event.id == "string" && __privateSet(this, _lastEventId, event.id);
      const messageEvent = new MessageEvent(event.event || "message", {
        data: event.data,
        origin: __privateGet(this, _redirectUrl) ? __privateGet(this, _redirectUrl).origin : __privateGet(this, _url).origin,
        lastEventId: event.id || ""
      });
      __privateGet(this, _onMessage) && (!event.event || event.event === "message") && __privateGet(this, _onMessage).call(this, messageEvent), this.dispatchEvent(messageEvent);
    }), __privateAdd(this, _onRetryChange, (value) => {
      __privateSet(this, _reconnectInterval, value);
    }), __privateAdd(this, _reconnect, () => {
      __privateSet(this, _reconnectTimer, void 0), __privateGet(this, _readyState) === this.CONNECTING && __privateMethod(this, _EventSource_instances, connect_fn).call(this);
    });
    try {
      if (url instanceof URL)
        __privateSet(this, _url, url);
      else if (typeof url == "string")
        __privateSet(this, _url, new URL(url, getBaseURL()));
      else
        throw new Error("Invalid URL");
    } catch {
      throw syntaxError("An invalid or illegal string was specified");
    }
    __privateSet(this, _parser, createParser({
      onEvent: __privateGet(this, _onEvent),
      onRetry: __privateGet(this, _onRetryChange)
    })), __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _reconnectInterval, 3e3), __privateSet(this, _fetch, (_a = eventSourceInitDict == null ? void 0 : eventSourceInitDict.fetch) != null ? _a : globalThis.fetch), __privateSet(this, _withCredentials, (_b = eventSourceInitDict == null ? void 0 : eventSourceInitDict.withCredentials) != null ? _b : !1), __privateMethod(this, _EventSource_instances, connect_fn).call(this);
  }
  /**
   * Returns the state of this EventSource object's connection. It can have the values described below.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
   *
   * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
   * defined in the TypeScript `dom` library.
   *
   * @public
   */
  get readyState() {
    return __privateGet(this, _readyState);
  }
  /**
   * Returns the URL providing the event stream.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
   *
   * @public
   */
  get url() {
    return __privateGet(this, _url).href;
  }
  /**
   * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
   */
  get withCredentials() {
    return __privateGet(this, _withCredentials);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
  get onerror() {
    return __privateGet(this, _onError);
  }
  set onerror(value) {
    __privateSet(this, _onError, value);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
  get onmessage() {
    return __privateGet(this, _onMessage);
  }
  set onmessage(value) {
    __privateSet(this, _onMessage, value);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
  get onopen() {
    return __privateGet(this, _onOpen);
  }
  set onopen(value) {
    __privateSet(this, _onOpen, value);
  }
  addEventListener(type, listener, options) {
    const listen = listener;
    super.addEventListener(type, listen, options);
  }
  removeEventListener(type, listener, options) {
    const listen = listener;
    super.removeEventListener(type, listen, options);
  }
  /**
   * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
   *
   * @public
   */
  close() {
    __privateGet(this, _reconnectTimer) && clearTimeout(__privateGet(this, _reconnectTimer)), __privateGet(this, _readyState) !== this.CLOSED && (__privateGet(this, _controller) && __privateGet(this, _controller).abort(), __privateSet(this, _readyState, this.CLOSED), __privateSet(this, _controller, void 0));
  }
}
_readyState = /* @__PURE__ */ new WeakMap(), _url = /* @__PURE__ */ new WeakMap(), _redirectUrl = /* @__PURE__ */ new WeakMap(), _withCredentials = /* @__PURE__ */ new WeakMap(), _fetch = /* @__PURE__ */ new WeakMap(), _reconnectInterval = /* @__PURE__ */ new WeakMap(), _reconnectTimer = /* @__PURE__ */ new WeakMap(), _lastEventId = /* @__PURE__ */ new WeakMap(), _controller = /* @__PURE__ */ new WeakMap(), _parser = /* @__PURE__ */ new WeakMap(), _onError = /* @__PURE__ */ new WeakMap(), _onMessage = /* @__PURE__ */ new WeakMap(), _onOpen = /* @__PURE__ */ new WeakMap(), _EventSource_instances = /* @__PURE__ */ new WeakSet(), /**
* Connect to the given URL and start receiving events
*
* @internal
*/
connect_fn = function() {
  __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _controller, new AbortController()), __privateGet(this, _fetch)(__privateGet(this, _url), __privateMethod(this, _EventSource_instances, getRequestOptions_fn).call(this)).then(__privateGet(this, _onFetchResponse)).catch(__privateGet(this, _onFetchError));
}, _onFetchResponse = /* @__PURE__ */ new WeakMap(), _onFetchError = /* @__PURE__ */ new WeakMap(), /**
* Get request options for the `fetch()` request
*
* @returns The request options
* @internal
*/
getRequestOptions_fn = function() {
  var _a;
  const init = {
    // [spec] Let `corsAttributeState` be `Anonymous`…
    // [spec] …will have their mode set to "cors"…
    mode: "cors",
    redirect: "follow",
    headers: { Accept: "text/event-stream", ...__privateGet(this, _lastEventId) ? { "Last-Event-ID": __privateGet(this, _lastEventId) } : void 0 },
    cache: "no-store",
    signal: (_a = __privateGet(this, _controller)) == null ? void 0 : _a.signal
  };
  return "window" in globalThis && (init.credentials = this.withCredentials ? "include" : "same-origin"), init;
}, _onEvent = /* @__PURE__ */ new WeakMap(), _onRetryChange = /* @__PURE__ */ new WeakMap(), /**
* Handles the process referred to in the EventSource specification as "failing a connection".
*
* @param error - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
failConnection_fn = function(message, code) {
  var _a;
  __privateGet(this, _readyState) !== this.CLOSED && __privateSet(this, _readyState, this.CLOSED);
  const errorEvent = new ErrorEvent("error", { code, message });
  (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent);
}, /**
* Schedules a reconnection attempt against the EventSource endpoint.
*
* @param message - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
scheduleReconnect_fn = function(message, code) {
  var _a;
  if (__privateGet(this, _readyState) === this.CLOSED)
    return;
  __privateSet(this, _readyState, this.CONNECTING);
  const errorEvent = new ErrorEvent("error", { code, message });
  (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent), __privateSet(this, _reconnectTimer, setTimeout(__privateGet(this, _reconnect), __privateGet(this, _reconnectInterval)));
}, _reconnect = /* @__PURE__ */ new WeakMap(), /**
* ReadyState representing an EventSource currently trying to connect
*
* @public
*/
EventSource.CONNECTING = 0, /**
* ReadyState representing an EventSource connection that is open (eg connected)
*
* @public
*/
EventSource.OPEN = 1, /**
* ReadyState representing an EventSource connection that is closed (eg disconnected)
*
* @public
*/
EventSource.CLOSED = 2;
function getBaseURL() {
  const doc = "document" in globalThis ? globalThis.document : void 0;
  return doc && typeof doc == "object" && "baseURI" in doc && typeof doc.baseURI == "string" ? doc.baseURI : void 0;
}

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
        var _b = _a.url, url = _b === void 0 ? 'http://localhost:8000' : _b, onToolsReady = _a.onToolsReady, onToolResult = _a.onToolResult, onError = _a.onError, onResourcesReady = _a.onResourcesReady, onResourceTemplatesReady = _a.onResourceTemplatesReady, onPromptsReady = _a.onPromptsReady, onReady = _a.onReady, onNotifications = _a.onNotifications;
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
        this.serverInfo = null;
        this.url = url;
        this.onToolsReady = onToolsReady;
        this.onToolResult = onToolResult;
        this.onError = onError;
        this.onResourcesReady = onResourcesReady;
        this.onResourceTemplatesReady = onResourceTemplatesReady;
        this.onPromptsReady = onPromptsReady;
        this.onReady = onReady;
        this.onNotifications = onNotifications;
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
                // console.log('正在连接 SSE:', sseUrl)
                this.eventSource = new EventSource(sseUrl);
                initialized = false;
                toolsRequested = false;
                this.eventSource.onopen = function () {
                    // console.log('SSE 连接已建立')
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
                    var message, _a, name_1, version, capabilities, resourceTemplates, index, uri, error_3;
                    var _this = this;
                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0:
                                _r.trys.push([0, 4, , 5]);
                                message = JSON.parse(event.data);
                                if (!(message.jsonrpc === '2.0')) return [3 /*break*/, 3];
                                if (!(message.id === 1 && message.result && !initialized)) return [3 /*break*/, 2];
                                initialized = true;
                                _a = message.result.serverInfo, name_1 = _a.name, version = _a.version;
                                capabilities = message.result.capabilities;
                                this.serverName = name_1;
                                this.protocolVersion = message.result.protocolVersion;
                                this.capabilities = capabilities;
                                this.serverInfo = {
                                    name: name_1,
                                    protocolVersion: this.protocolVersion || '',
                                    version: version,
                                    capabilities: capabilities
                                };
                                return [4 /*yield*/, this.handleInitialized(toolsRequested)];
                            case 1:
                                // console.log('MCP capabilities:', capabilities)
                                toolsRequested = _r.sent();
                                (_b = this.onReady) === null || _b === void 0 ? void 0 : _b.call(this, this.serverInfo);
                                return [3 /*break*/, 3];
                            case 2:
                                if ((_c = message.result) === null || _c === void 0 ? void 0 : _c.tools) {
                                    // console.log('获取到工具列表:', this.sessionId, message.result.tools)
                                    // 为每个工具添加执行方法
                                    message.result.tools = message.result.tools.map(function (tool) { return (__assign(__assign({}, tool), { fromServerName: _this.serverName, execute: function (args) { return _this.executeTool(tool.name, args); } })); });
                                    (_d = this.onToolsReady) === null || _d === void 0 ? void 0 : _d.call(this, message.result.tools);
                                    this.handleCallback(message);
                                }
                                else if ((_e = message.result) === null || _e === void 0 ? void 0 : _e.resources) {
                                    // console.log('获取到资源列表:', message.result.resources)
                                    (_f = this.onResourcesReady) === null || _f === void 0 ? void 0 : _f.call(this, message.result.resources);
                                    this.handleCallback(message);
                                }
                                else if ((_g = message.result) === null || _g === void 0 ? void 0 : _g.resourceTemplates) {
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
                                        // console.log(
                                        //   '缓存资源模板到capabilities:',
                                        //   this.capabilities.resourceTemplates
                                        // )
                                    }
                                    (_h = this.onResourceTemplatesReady) === null || _h === void 0 ? void 0 : _h.call(this, this.processResourceTemplates(resourceTemplates));
                                    this.handleCallback(message);
                                }
                                else if ((_j = message.result) === null || _j === void 0 ? void 0 : _j.prompts) {
                                    // console.log('获取到提示列表:', message.result.prompts)
                                    // 为每个提示添加执行方法
                                    message.result.prompts = message.result.prompts.map(function (prompt) {
                                        var np = __assign(__assign({}, prompt), { fromServerName: _this.serverName });
                                        if (prompt.arguments) {
                                            np.execute = function (args) { return _this.getPrompt(prompt.name, args); };
                                        }
                                        return np;
                                    });
                                    (_k = this.onPromptsReady) === null || _k === void 0 ? void 0 : _k.call(this, message.result.prompts);
                                    this.handleCallback(message);
                                }
                                // 处理工具执行结果
                                else if ((_l = message.result) === null || _l === void 0 ? void 0 : _l.content) {
                                    // console.log('工具执行结果:', message)
                                    this.handleCallback(message);
                                    // 仍然调用回调函数
                                    (_m = this.onToolResult) === null || _m === void 0 ? void 0 : _m.call(this, message.result.content, message.result.isError || false);
                                }
                                else if (message.method == 'sampling/createMessage') {
                                    // console.log('收到采样消息:', message)
                                    if ((_p = (_o = message === null || message === void 0 ? void 0 : message.params) === null || _o === void 0 ? void 0 : _o.metadata) === null || _p === void 0 ? void 0 : _p.request_id) {
                                        //fixbug , mcp server 里的 需要注意 metadata的处理， 用于更新id
                                        message.id = message.params.metadata.request_id;
                                        // console.log('fix收到采样消息:', message)
                                        this.handleCallback(message);
                                    }
                                }
                                else if (message.method == 'notifications/message' &&
                                    message.params) {
                                    // console.log('notifications/message:', message.params)
                                    (_q = this.onNotifications) === null || _q === void 0 ? void 0 : _q.call(this, message.params);
                                }
                                // 添加这个部分：处理任何其他类型的响应
                                else if (message.id != undefined) {
                                    // 确保任何带有 ID 的响应都能触发回调
                                    // console.log('#callback:', message)
                                    this.handleCallback(message);
                                }
                                _r.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                error_3 = _r.sent();
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
                // console.log('初始化会话')
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
    MCPClient.prototype.transformToolsToOpenAIFunctions = function (tools) {
        if (tools === void 0) { tools = []; }
        return tools.map(function (tool) { return ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
            }
        }); });
    };
    MCPClient.prototype.getToolsOfOpenAIFunctions = function (tools) {
        if (tools === void 0) { tools = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _ts, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tools;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getToolsList()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _ts = _a;
                        return [2 /*return*/, this.transformToolsToOpenAIFunctions(_ts)];
                }
            });
        });
    };
    return MCPClient;
}());
var prepareTools = function (url, timeout) {
    if (timeout === void 0) { timeout = 15000; }
    return new Promise(function (resolve, reject) {
        var mcpClient = null;
        // 添加超时处理
        var timeoutFn = setTimeout(function () {
            if (mcpClient) {
                mcpClient.disconnect();
            }
            reject(new Error('Connection timeout'));
        }, timeout);
        // 清理超时
        var cleanup = function () { return clearTimeout(timeoutFn); };
        try {
            mcpClient = new MCPClient({
                url: url,
                onToolsReady: function (tools) { return __awaiter(void 0, void 0, void 0, function () {
                    var prompts, systemPrompts, toolsFunctionCall;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!mcpClient) return [3 /*break*/, 2];
                                cleanup();
                                return [4 /*yield*/, mcpClient.getPromptsList()];
                            case 1:
                                prompts = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.prompts;
                                systemPrompts = prompts.filter(function (p) { return p.systemPrompt; });
                                toolsFunctionCall = mcpClient.transformToolsToOpenAIFunctions(tools);
                                resolve({ tools: tools, mcpClient: mcpClient, toolsFunctionCall: toolsFunctionCall, systemPrompts: systemPrompts });
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); },
                onError: function (error) {
                    if (mcpClient) {
                        mcpClient.disconnect();
                    }
                    cleanup();
                    reject(new Error("Failed to prepare tools: ".concat(error.message)));
                }
            });
            // 建立连接
            mcpClient.connect();
        }
        catch (error) {
            if (mcpClient) {
                mcpClient.disconnect();
            }
            reject(new Error("Failed to initialize MCPClient: ".concat(error.message)));
        }
    })
        .catch(function (error) {
        throw error;
    })
        .finally(function () {
        // 可选的清理逻辑
    });
};

export { MCPClient, prepareTools };
