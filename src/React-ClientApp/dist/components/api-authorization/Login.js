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
exports.Login = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthorizeService_1 = __importDefault(require("./AuthorizeService"));
const AuthorizeService_2 = require("./AuthorizeService");
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
class Login extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: undefined
        };
    }
    componentDidMount() {
        // @ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
        const action = this.props.action;
        switch (action) {
            case ApiAuthorizationConstants_1.LoginActions.Login:
                // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                this.login(this.getReturnUrl());
                break;
            case ApiAuthorizationConstants_1.LoginActions.LoginCallback:
                this.processLoginCallback();
                break;
            case ApiAuthorizationConstants_1.LoginActions.LoginFailed:
                const params = new URLSearchParams(window.location.search);
                const error = params.get(ApiAuthorizationConstants_1.QueryParameterNames.Message);
                this.setState({ message: error });
                break;
            case ApiAuthorizationConstants_1.LoginActions.Profile:
                this.redirectToProfile();
                break;
            case ApiAuthorizationConstants_1.LoginActions.Register:
                this.redirectToRegister();
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }
    render() {
        // @ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
        const action = this.props.action;
        // @ts-expect-error TS(2339): Property 'message' does not exist on type 'Readonl... Remove this comment to see the full error message
        const { message } = this.state;
        if (!!message) {
            return (0, jsx_runtime_1.jsx)("div", { children: message });
        }
        else {
            switch (action) {
                case ApiAuthorizationConstants_1.LoginActions.Login:
                    return ((0, jsx_runtime_1.jsx)("div", { children: "Processing login" }));
                case ApiAuthorizationConstants_1.LoginActions.LoginCallback:
                    return ((0, jsx_runtime_1.jsx)("div", { children: "Processing login callback" }));
                case ApiAuthorizationConstants_1.LoginActions.Profile:
                case ApiAuthorizationConstants_1.LoginActions.Register:
                    return ((0, jsx_runtime_1.jsx)("div", {}));
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }
    login(returnUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { returnUrl };
            const result = yield AuthorizeService_1.default.signIn(state);
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
                    throw new Error(`Invalid status result ${result.status}.`);
            }
        });
    }
    processLoginCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = window.location.href;
            const result = yield AuthorizeService_1.default.completeSignIn(url);
            switch (result.status) {
                case AuthorizeService_2.AuthenticationResultStatus.Redirect:
                    // There should not be any redirects as the only time completeSignIn finishes
                    // is when we are doing a redirect sign in flow.
                    throw new Error('Should not redirect.');
                case AuthorizeService_2.AuthenticationResultStatus.Success:
                    // ts-expect-error TS(2339): Property 'state' does not exist on type '{ status:... Remove this comment to see the full error message
                    yield this.navigateToReturnUrl(this.getReturnUrl(result.state));
                    break;
                case AuthorizeService_2.AuthenticationResultStatus.Fail:
                    // ts-expect-error TS(2339): Property 'message' does not exist on type '{ statu... Remove this comment to see the full error message
                    if ('message' in result && typeof result.message === 'string') {
                        this.setState({ message: result.message });
                    }
                    break;
                default:
                    throw new Error(`Invalid authentication result status '${result.status}'.`);
            }
        });
    }
    getReturnUrl(state) {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(ApiAuthorizationConstants_1.QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.");
        }
        return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
    }
    redirectToRegister() {
        this.redirectToApiAuthorizationPath(`${ApiAuthorizationConstants_1.ApplicationPaths.IdentityRegisterPath}?${ApiAuthorizationConstants_1.QueryParameterNames.ReturnUrl}=${encodeURI(ApiAuthorizationConstants_1.ApplicationPaths.Login)}`);
    }
    redirectToProfile() {
        this.redirectToApiAuthorizationPath(ApiAuthorizationConstants_1.ApplicationPaths.IdentityManagePath);
    }
    redirectToApiAuthorizationPath(apiAuthorizationPath) {
        const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
        // It's important that we do a replace here so that when the user hits the back arrow on the
        // browser they get sent back to where it was on the app instead of to an endpoint on this
        // component.
        window.location.replace(redirectUrl);
    }
    navigateToReturnUrl(returnUrl) {
        // It's important that we do a replace here so that we remove the callback uri with the
        // fragment containing the tokens from the browser history.
        window.location.replace(returnUrl);
    }
}
exports.Login = Login;
