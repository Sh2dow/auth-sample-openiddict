import { UserManager, WebStorageStateStore, User, SigninResponse, SignoutResponse } from 'oidc-client';
import { ApplicationPaths, ApplicationName } from './ApiAuthorizationConstants';

interface Callback {
  callback: () => void;
  subscription: number;
}

interface State {
  user: User | null;
  isAuthenticated: boolean;
  callbacks: Callback[];
  nextSubscriptionId: number;
  popUpDisabled: boolean;
}

export class AuthorizeService {
  private userManager: UserManager | undefined;
  private state: State = {
    user: null,
    isAuthenticated: false,
    callbacks: [],
    nextSubscriptionId: 0,
    popUpDisabled: true,
  };

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }

  async getUser(): Promise<User | null> {
    if (this.state.user) {
      return this.state.user;
    }

    await this.ensureUserManagerInitialized();
    const user = await this.userManager!.getUser();
    return user;
  }

  async getAccessToken(): Promise<string | undefined> {
    await this.ensureUserManagerInitialized();
    const user = await this.userManager!.getUser();
    return user?.access_token;
  }

  async signIn(state: unknown): Promise<{ status: string; state?: unknown }> {
    await this.ensureUserManagerInitialized();

    try {
      const silentUser = await this.userManager!.signinSilent();
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      console.log('Silent authentication error: ', silentError);

      if (this.state.popUpDisabled) {
        console.error('Popup disabled. Enable pop-up authentication.');
        throw new Error('Popup disabled');
      }

      try {
        const popUpUser = await this.userManager!.signinPopup();
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError) {
        console.log('Popup authentication error: ', popUpError);

        try {
          await this.userManager!.signinRedirect();
          return this.redirect();
        } catch (redirectError) {
          // Narrow the type of `redirectError` before using it
          if (redirectError instanceof Error) {
            console.log('Redirect authentication error: ', redirectError.message);
            return this.error(redirectError.message);
          } else if (typeof redirectError === 'string') {
            console.log('Redirect authentication error: ', redirectError);
            return this.error(redirectError);
          } else {
            console.log('Redirect authentication error: unknown error type', redirectError);
            return this.error('An unknown error occurred during redirect authentication.');
          }
        }
      }
    }
  }


  async completeSignIn(url: string): Promise<{ status: string; state?: unknown }> {
    await this.ensureUserManagerInitialized();

    try {
      const user = await this.userManager!.signinCallback(url);
      this.updateState(user);
      return this.success(user?.state);
    } catch (error) {
      console.log('Error during sign-in callback: ', error);
      return this.error('Error during sign-in callback');
    }
  }

  async signOut(state: unknown): Promise<{ status: string; state?: unknown }> {
    await this.ensureUserManagerInitialized();

    try {
      if (this.state.popUpDisabled) {
        console.error('Popup disabled. Enable pop-up authentication.');
        throw new Error('Popup disabled');
      }

      await this.userManager!.signoutPopup();
      this.updateState(null);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError);

      try {
        await this.userManager!.signoutRedirect();
        return this.redirect();
      } catch (redirectSignOutError) {
        // Narrow the type of `redirectSignOutError` before using it
        if (redirectSignOutError instanceof Error) {
          console.log('Redirect signout error: ', redirectSignOutError.message);
          return this.error(redirectSignOutError.message);
        } else if (typeof redirectSignOutError === 'string') {
          console.log('Redirect signout error: ', redirectSignOutError);
          return this.error(redirectSignOutError);
        } else {
          console.log('Redirect signout error: unknown error type', redirectSignOutError);
          return this.error('An unknown error occurred during redirect signout.');
        }
      }
    }
  }


  async completeSignOut(url: string): Promise<{ status: string; state?: unknown }> {
    await this.ensureUserManagerInitialized();

    try {
      const response = await this.userManager!.signoutCallback(url);
      this.updateState(null);
      return this.success(response?.state);
    } catch (error) {
      console.log('Error during sign-out callback: ', error);
      return this.error('Error during sign-out callback');
    }
  }

  updateState(user: User | null): void {
    this.state.user = user;
    this.state.isAuthenticated = !!user;
    this.notifySubscribers();
  }

  subscribe(callback: () => void): number {
    this.state.callbacks.push({ callback, subscription: this.state.nextSubscriptionId });
    return this.state.nextSubscriptionId++;
  }

  unsubscribe(subscriptionId: number): void {
    const index = this.state.callbacks.findIndex((element) => element.subscription === subscriptionId);
    if (index !== -1) {
      this.state.callbacks.splice(index, 1);
    } else {
      console.error(`Subscription ID ${subscriptionId} not found.`);
    }
  }

  notifySubscribers(): void {
    this.state.callbacks.forEach(({ callback }) => callback());
  }

  createArguments(state: unknown): Record<string, unknown> {
    return { useReplaceToNavigate: true, data: state };
  }

  error(message: string): { status: string; message: string } {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  success(state: unknown): { status: string; state?: unknown } {
    return { status: AuthenticationResultStatus.Success, state };
  }

  redirect(): { status: string } {
    return { status: AuthenticationResultStatus.Redirect };
  }

  async ensureUserManagerInitialized(): Promise<void> {
    if (this.userManager) {
      return;
    }

    const response = await fetch(ApplicationPaths.ApiAuthorizationClientConfigurationUrl);
    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`);
    }

    const settings = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName,
    });

    this.userManager = new UserManager(settings);
    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager!.removeUser();
      this.updateState(null);
    });
  }

  static get instance(): AuthorizeService {
    return authService;
  }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
  Redirect: 'redirect',
  Success: 'success',
  Fail: 'fail',
};
