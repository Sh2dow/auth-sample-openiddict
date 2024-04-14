"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const NavMenu_1 = require("./NavMenu");
class Layout extends react_1.Component {
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(NavMenu_1.NavMenu, {}), (0, jsx_runtime_1.jsx)(reactstrap_1.Container, { tag: "main", children: this.props.children })] }));
    }
}
exports.Layout = Layout;
Layout.displayName = Layout.name;
