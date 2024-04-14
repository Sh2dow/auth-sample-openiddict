"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Login_1 = require("./Login");
const Logout_1 = require("./Logout");
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
const ApiAuthorizationRoutes = [
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.Login,
        element: loginAction(ApiAuthorizationConstants_1.LoginActions.Login)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.LoginFailed,
        element: loginAction(ApiAuthorizationConstants_1.LoginActions.LoginFailed)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.LoginCallback,
        element: loginAction(ApiAuthorizationConstants_1.LoginActions.LoginCallback)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.Profile,
        element: loginAction(ApiAuthorizationConstants_1.LoginActions.Profile)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.Register,
        element: loginAction(ApiAuthorizationConstants_1.LoginActions.Register)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.LogOut,
        element: logoutAction(ApiAuthorizationConstants_1.LogoutActions.Logout)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.LogOutCallback,
        element: logoutAction(ApiAuthorizationConstants_1.LogoutActions.LogoutCallback)
    },
    {
        path: ApiAuthorizationConstants_1.ApplicationPaths.LoggedOut,
        element: logoutAction(ApiAuthorizationConstants_1.LogoutActions.LoggedOut)
    }
];
function loginAction(name) {
    // @ts-expect-error TS(2322): Type '{ action: any; }' is not assignable to type ... Remove this comment to see the full error message
    return (0, jsx_runtime_1.jsx)(Login_1.Login, { action: name });
}
function logoutAction(name) {
    // @ts-expect-error TS(2322): Type '{ action: any; }' is not assignable to type ... Remove this comment to see the full error message
    return (0, jsx_runtime_1.jsx)(Logout_1.Logout, { action: name });
}
exports.default = ApiAuthorizationRoutes;
