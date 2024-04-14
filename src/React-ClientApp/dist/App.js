"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AppRoutes_1 = __importDefault(require("./AppRoutes"));
const AuthorizeRoute_1 = __importDefault(require("./components/api-authorization/AuthorizeRoute"));
const Layout_1 = require("./components/Layout");
require("./custom.css");
class App extends react_1.Component {
    render() {
        return ((0, jsx_runtime_1.jsx)(Layout_1.Layout, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: AppRoutes_1.default.map((route, index) => {
                    const { path, element, requireAuth } = route;
                    if (requireAuth && path) {
                        // Render AuthorizeRoute for authenticated routes
                        return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: path, element: (0, jsx_runtime_1.jsx)(AuthorizeRoute_1.default, { path: path, element: element }, index) }, index));
                    }
                    else if (path) {
                        // Render regular Route for other routes
                        return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: path, element: element }, index));
                    }
                    else {
                        // Handle the case where the path is missing
                        console.error(`Route at index ${index} is missing a 'path' property.`);
                        return null;
                    }
                }) }) }));
    }
}
App.displayName = App.name;
exports.default = App;
