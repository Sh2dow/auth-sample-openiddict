"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const react_router_dom_1 = require("react-router-dom");
const LoginMenu_1 = require("./api-authorization/LoginMenu");
require("./NavMenu.css");
class NavMenu extends react_1.Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    render() {
        return ((0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsxs)(reactstrap_1.Navbar, { className: "navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3", container: true, light: true, children: [(0, jsx_runtime_1.jsx)(reactstrap_1.NavbarBrand, { tag: react_router_dom_1.Link, to: "/", children: "Samples.WeatherApi.MvcClient" }), (0, jsx_runtime_1.jsx)(reactstrap_1.NavbarToggler, { onClick: this.toggleNavbar, className: "mr-2" }), (0, jsx_runtime_1.jsx)(reactstrap_1.Collapse, { className: "d-sm-inline-flex flex-sm-row-reverse", isOpen: !this.state.collapsed, navbar: true, children: (0, jsx_runtime_1.jsxs)("ul", { className: "navbar-nav flex-grow", children: [(0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: "/", children: "Home" }) }), (0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: "/counter", children: "Counter" }) }), (0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: "/fetch-data", children: "Fetch data" }) }), (0, jsx_runtime_1.jsx)(LoginMenu_1.LoginMenu, {})] }) })] }) }));
    }
}
exports.NavMenu = NavMenu;
NavMenu.displayName = NavMenu.name;
