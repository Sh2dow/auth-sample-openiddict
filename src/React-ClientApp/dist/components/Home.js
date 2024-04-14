"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class Home extends react_1.Component {
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Hello, world!" }), (0, jsx_runtime_1.jsx)("p", { children: "Welcome to your new single-page application, built with:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("a", { href: 'https://get.asp.net/', children: "ASP.NET Core" }), " and ", (0, jsx_runtime_1.jsx)("a", { href: 'https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx', children: "C#" }), " for cross-platform server-side code"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("a", { href: 'https://facebook.github.io/react/', children: "React" }), " for client-side code"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("a", { href: 'http://getbootstrap.com/', children: "Bootstrap" }), " for layout and styling"] })] }), (0, jsx_runtime_1.jsx)("p", { children: "To help you get started, we have also set up:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Client-side navigation" }), ". For example, click ", (0, jsx_runtime_1.jsx)("em", { children: "Counter" }), " then ", (0, jsx_runtime_1.jsx)("em", { children: "Back" }), " to return here."] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Development server integration" }), ". In development mode, the development server from ", (0, jsx_runtime_1.jsx)("code", { children: "create-react-app" }), " runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file."] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Efficient production builds" }), ". In production mode, development-time features are disabled, and your ", (0, jsx_runtime_1.jsx)("code", { children: "dotnet publish" }), " configuration produces minified, efficiently bundled JavaScript files."] })] }), (0, jsx_runtime_1.jsxs)("p", { children: ["The ", (0, jsx_runtime_1.jsx)("code", { children: "ClientApp" }), " subdirectory is a standard React application based on the ", (0, jsx_runtime_1.jsx)("code", { children: "create-react-app" }), " template. If you open a command prompt in that directory, you can run ", (0, jsx_runtime_1.jsx)("code", { children: "npm" }), " commands such as ", (0, jsx_runtime_1.jsx)("code", { children: "npm test" }), " or ", (0, jsx_runtime_1.jsx)("code", { children: "npm install" }), "."] })] }));
    }
}
exports.Home = Home;
Home.displayName = Home.name;