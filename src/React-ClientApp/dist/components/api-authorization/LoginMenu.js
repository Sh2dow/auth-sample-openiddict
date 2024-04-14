"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const react_router_dom_1 = require("react-router-dom");
const AuthorizeService_1 = __importDefault(require("./AuthorizeService"));
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
class LoginMenu extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            userName: null
        };
    }
    componentDidMount() {
        this._subscription = AuthorizeService_1.default.subscribe(() => this.populateState());
        this.populateState();
    }
    componentWillUnmount() {
        AuthorizeService_1.default.unsubscribe(this._subscription);
    }
    populateState() {
        return __awaiter(this, void 0, void 0, function* () {
            const [isAuthenticated, user] = yield Promise.all([AuthorizeService_1.default.isAuthenticated(), AuthorizeService_1.default.getUser()]);
            this.setState({
                isAuthenticated,
                userName: user && user.profile.name
            });
        });
    }
    render() {
        // @ts-expect-error TS(2339): Property 'isAuthenticated' does not exist on type ... Remove this comment to see the full error message
        const { isAuthenticated, userName } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApiAuthorizationConstants_1.ApplicationPaths.Register}`;
            const loginPath = `${ApiAuthorizationConstants_1.ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        }
        else {
            const profilePath = `${ApiAuthorizationConstants_1.ApplicationPaths.Profile}`;
            const logoutPath = `${ApiAuthorizationConstants_1.ApplicationPaths.LogOut}`;
            const logoutState = { local: true };
            return this.authenticatedView(userName, profilePath, logoutPath, logoutState);
        }
    }
    authenticatedView(userName, profilePath, logoutPath, logoutState) {
        return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsxs)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: profilePath, children: ["Hello ", userName] }) }), (0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { replace: true, tag: react_router_dom_1.Link, className: "text-dark", to: logoutPath, state: logoutState, children: "Logout" }) })] }));
    }
    anonymousView(registerPath, loginPath) {
        return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: registerPath, children: "Register" }) }), (0, jsx_runtime_1.jsx)(reactstrap_1.NavItem, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.NavLink, { tag: react_router_dom_1.Link, className: "text-dark", to: loginPath, children: "Login" }) })] }));
    }
}
exports.LoginMenu = LoginMenu;
