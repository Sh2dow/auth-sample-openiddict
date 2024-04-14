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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("bootstrap/dist/css/bootstrap.css");
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./App"));
const serviceWorkerRegistration = __importStar(require("./serviceWorkerRegistration"));
const reportWebVitals_1 = __importDefault(require("./reportWebVitals"));
const baseUrl = ((_a = document.getElementsByTagName('base')[0]) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || undefined;
const rootElement = document.getElementById('root');
if (rootElement !== null) {
    const root = (0, client_1.createRoot)(rootElement);
    root.render((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { basename: baseUrl, children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }));
}
// Register or unregister the service worker based on your preference
serviceWorkerRegistration.unregister();
// To measure performance in your app, pass a function to log results
// to the reportWebVitals function
(0, reportWebVitals_1.default)(console.log); // Pass a function like console.log here
