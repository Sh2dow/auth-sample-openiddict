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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationResultStatus = exports.AuthorizeService = void 0;
const oidc_client_1 = require("oidc-client");
const ApiAuthorizationConstants_1 = require("./ApiAuthorizationConstants");
class AuthorizeService {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            callbacks: [],
            nextSubscriptionId: 0,
            popUpDisabled: true,
        };
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser();
            return !!user;
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.user) {
                return this.state.user;
            }
            yield this.ensureUserManagerInitialized();
            const user = yield this.userManager.getUser();
            return user;
        });
    }
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUserManagerInitialized();
            const user = yield this.userManager.getUser();
            return user === null || user === void 0 ? void 0 : user.access_token;
        });
    }
    signIn(state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUserManagerInitialized();
            try {
                const silentUser = yield this.userManager.signinSilent();
                this.updateState(silentUser);
                return this.success(state);
            }
            catch (silentError) {
                console.log('Silent authentication error: ', silentError);
                if (this.state.popUpDisabled) {
                    console.error('Popup disabled. Enable pop-up authentication.');
                    throw new Error('Popup disabled');
                }
                try {
                    const popUpUser = yield this.userManager.signinPopup();
                    this.updateState(popUpUser);
                    return this.success(state);
                }
                catch (popUpError) {
                    console.log('Popup authentication error: ', popUpError);
                    try {
                        yield this.userManager.signinRedirect();
                        return this.redirect();
                    }
                    catch (redirectError) {
                        // Narrow the type of `redirectError` before using it
                        if (redirectError instanceof Error) {
                            console.log('Redirect authentication error: ', redirectError.message);
                            return this.error(redirectError.message);
                        }
                        else if (typeof redirectError === 'string') {
                            console.log('Redirect authentication error: ', redirectError);
                            return this.error(redirectError);
                        }
                        else {
                            console.log('Redirect authentication error: unknown error type', redirectError);
                            return this.error('An unknown error occurred during redirect authentication.');
                        }
                    }
                }
            }
        });
    }
    completeSignIn(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUserManagerInitialized();
            try {
                const user = yield this.userManager.signinCallback(url);
                this.updateState(user);
                return this.success(user === null || user === void 0 ? void 0 : user.state);
            }
            catch (error) {
                console.log('Error during sign-in callback: ', error);
                return this.error('Error during sign-in callback');
            }
        });
    }
    signOut(state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUserManagerInitialized();
            try {
                if (this.state.popUpDisabled) {
                    console.error('Popup disabled. Enable pop-up authentication.');
                    throw new Error('Popup disabled');
                }
                yield this.userManager.signoutPopup();
                this.updateState(null);
                return this.success(state);
            }
            catch (popupSignOutError) {
                console.log('Popup signout error: ', popupSignOutError);
                try {
                    yield this.userManager.signoutRedirect();
                    return this.redirect();
                }
                catch (redirectSignOutError) {
                    // Narrow the type of `redirectSignOutError` before using it
                    if (redirectSignOutError instanceof Error) {
                        console.log('Redirect signout error: ', redirectSignOutError.message);
                        return this.error(redirectSignOutError.message);
                    }
                    else if (typeof redirectSignOutError === 'string') {
                        console.log('Redirect signout error: ', redirectSignOutError);
                        return this.error(redirectSignOutError);
                    }
                    else {
                        console.log('Redirect signout error: unknown error type', redirectSignOutError);
                        return this.error('An unknown error occurred during redirect signout.');
                    }
                }
            }
        });
    }
    completeSignOut(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureUserManagerInitialized();
            try {
                const response = yield this.userManager.signoutCallback(url);
                this.updateState(null);
                return this.success(response === null || response === void 0 ? void 0 : response.state);
            }
            catch (error) {
                console.log('Error during sign-out callback: ', error);
                return this.error('Error during sign-out callback');
            }
        });
    }
    updateState(user) {
        this.state.user = user;
        this.state.isAuthenticated = !!user;
        this.notifySubscribers();
    }
    subscribe(callback) {
        this.state.callbacks.push({ callback, subscription: this.state.nextSubscriptionId });
        return this.state.nextSubscriptionId++;
    }
    unsubscribe(subscriptionId) {
        const index = this.state.callbacks.findIndex((element) => element.subscription === subscriptionId);
        if (index !== -1) {
            this.state.callbacks.splice(index, 1);
        }
        else {
            console.error(`Subscription ID ${subscriptionId} not found.`);
        }
    }
    notifySubscribers() {
        this.state.callbacks.forEach(({ callback }) => callback());
    }
    createArguments(state) {
        return { useReplaceToNavigate: true, data: state };
    }
    error(message) {
        return { status: exports.AuthenticationResultStatus.Fail, message };
    }
    success(state) {
        return { status: exports.AuthenticationResultStatus.Success, state };
    }
    redirect() {
        return { status: exports.AuthenticationResultStatus.Redirect };
    }
    ensureUserManagerInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userManager) {
                return;
            }
            const response = yield fetch(ApiAuthorizationConstants_1.ApplicationPaths.ApiAuthorizationClientConfigurationUrl);
            if (!response.ok) {
                throw new Error(`Could not load settings for '${ApiAuthorizationConstants_1.ApplicationName}'`);
            }
            const settings = yield response.json();
            settings.automaticSilentRenew = true;
            settings.includeIdTokenInSilentRenew = true;
            settings.userStore = new oidc_client_1.WebStorageStateStore({
                prefix: ApiAuthorizationConstants_1.ApplicationName,
            });
            this.userManager = new oidc_client_1.UserManager(settings);
            this.userManager.events.addUserSignedOut(() => __awaiter(this, void 0, void 0, function* () {
                yield this.userManager.removeUser();
                this.updateState(null);
            }));
        });
    }
    static get instance() {
        return authService;
    }
}
exports.AuthorizeService = AuthorizeService;
const authService = new AuthorizeService();
exports.default = authService;
exports.AuthenticationResultStatus = {
    Redirect: 'redirect',
    Success: 'success',
    Fail: 'fail',
};
