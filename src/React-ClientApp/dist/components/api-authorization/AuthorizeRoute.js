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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
const AuthorizeService_1 = __importDefault(require("./AuthorizeService"));
// Define AuthorizeRoute as a class component with specific types for state and props
class AuthorizeRoute extends react_1.Component {
    constructor(props) {
        super(props);
        // Initialize state
        this.state = {
            ready: false,
            authenticated: false
        };
    }
    componentDidMount() {
        this._subscription = AuthorizeService_1.default.subscribe(() => this.authenticationChanged());
        this.populateAuthenticationState();
    }
    componentWillUnmount() {
        AuthorizeService_1.default.unsubscribe(this._subscription);
    }
    render() {
        // Destructure state
        const { ready, authenticated } = this.state;
        // Create a link element to extract the return URL
        const link = document.createElement("a");
        link.href = this.props.path; // Correctly use path prop
        const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
        const redirectUrl = `${ApiAuthorizationConstants_1.ApplicationPaths.Login}?${ApiAuthorizationConstants_1.QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
        if (!ready) {
            return (0, jsx_runtime_1.jsx)("div", {}); // Return an empty div if not ready
        }
        else {
            // Destructure the element prop
            const { element } = this.props;
            // Return the element if authenticated; otherwise, redirect to login page
            return authenticated ? element : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { replace: true, to: redirectUrl });
        }
    }
    populateAuthenticationState() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the authenticated state and update the component's state
            const authenticated = yield AuthorizeService_1.default.isAuthenticated();
            this.setState({ ready: true, authenticated });
        });
    }
    authenticationChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            // Reset state and populate authentication state
            this.setState({ ready: false, authenticated: false });
            yield this.populateAuthenticationState();
        });
    }
}
exports.default = AuthorizeRoute;
