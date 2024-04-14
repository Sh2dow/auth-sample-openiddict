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
exports.Logout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthorizeService_1 = __importDefault(require("./AuthorizeService"));
const AuthorizeService_2 = require("./AuthorizeService");
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
class Logout extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: undefined,
            isReady: false,
            authenticated: false
        };
    }
    componentDidMount() {
        // @ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
        const action = this.props.action;
        switch (action) {
            case ApiAuthorizationConstants_1.LogoutActions.Logout:
                if (!!window.history.state.usr.local) {
                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    this.logout(this.getReturnUrl());
                }
                else {
                    // This prevents regular links to <app>/authentication/logout from triggering a logout
                    this.setState({ isReady: true, message: "The logout was not initiated from within the page." });
                }
                break;
            case ApiAuthorizationConstants_1.LogoutActions.LogoutCallback:
                this.processLogoutCallback();
                break;
            case ApiAuthorizationConstants_1.LogoutActions.LoggedOut:
                this.setState({ isReady: true, message: "You successfully logged out!" });
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
        this.populateAuthenticationState();
    }
    render() {
        // @ts-expect-error TS(2339): Property 'isReady' does not exist on type 'Readonl... Remove this comment to see the full error message
        const { isReady, message } = this.state;
        if (!isReady) {
            return (0, jsx_runtime_1.jsx)("div", {});
        }
        if (!!message) {
            return ((0, jsx_runtime_1.jsx)("div", { children: message }));
        }
        else {
            // @ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
            const action = this.props.action;
            switch (action) {
                case ApiAuthorizationConstants_1.LogoutActions.Logout:
                    return ((0, jsx_runtime_1.jsx)("div", { children: "Processing logout" }));
                case ApiAuthorizationConstants_1.LogoutActions.LogoutCallback:
                    return ((0, jsx_runtime_1.jsx)("div", { children: "Processing logout callback" }));
                case ApiAuthorizationConstants_1.LogoutActions.LoggedOut:
                    return ((0, jsx_runtime_1.jsx)("div", { children: message }));
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }
    logout(returnUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { returnUrl };
            const isauthenticated = yield AuthorizeService_1.default.isAuthenticated();
            if (isauthenticated) {
                const result = yield AuthorizeService_1.default.signOut(state);
                switch (result.status) {
                    case AuthorizeService_2.AuthenticationResultStatus.Redirect:
                        break;
                    case AuthorizeService_2.AuthenticationResultStatus.Success:
                        yield this.navigateToReturnUrl(returnUrl);
                        break;
                    case AuthorizeService_2.AuthenticationResultStatus.Fail:
                        // @ts-expect-error TS(2339): Property 'message' does not exist on type '{ statu... Remove this comment to see the full error message
                        this.setState({ message: result.message });
                        break;
                    default:
                        throw new Error("Invalid authentication result status.");
                }
            }
            else {
                this.setState({ message: "You successfully logged out!" });
            }
        });
    }
    processLogoutCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = window.location.href;
            const result = yield AuthorizeService_1.default.completeSignOut(url);
            switch (result.status) {
                case AuthorizeService_2.AuthenticationResultStatus.Redirect:
                    throw new Error('Should not redirect.');
                case AuthorizeService_2.AuthenticationResultStatus.Success:
                    yield this.navigateToReturnUrl(this.getReturnUrl(result.state));
                    break;
                case AuthorizeService_2.AuthenticationResultStatus.Fail:
                    // Add a check to verify if result.message exists
                    if ('message' in result && typeof result.message === 'string') {
                        this.setState({ message: result.message });
                    }
                    break;
                default:
                    throw new Error("Invalid authentication result status.");
            }
        });
    }
    populateAuthenticationState() {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticated = yield AuthorizeService_1.default.isAuthenticated();
            this.setState({ isReady: true, authenticated });
        });
    }
    getReturnUrl(state) {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(ApiAuthorizationConstants_1.QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.");
        }
        return (state && state.returnUrl) ||
            fromQuery ||
            `${window.location.origin}${ApiAuthorizationConstants_1.ApplicationPaths.LoggedOut}`;
    }
    navigateToReturnUrl(returnUrl) {
        return window.location.replace(returnUrl);
    }
}
exports.Logout = Logout;
