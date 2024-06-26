import React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { QueryParameterNames, LogoutActions, ApplicationPaths } from './ApiAuthorizationConstants';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
interface LogoutProps {
  action: string; // or the expected type of the action prop
}

interface LogoutState {
  isReady: boolean; // Define the isReady property with the correct type
  message: string | null; // Define the message property with the correct type
  authenticated: boolean;
}

export class Logout extends Component<LogoutProps, LogoutState> {
  constructor(props: LogoutProps) {
    super(props);

    this.state = {
      isReady: false,
      message: null,
      authenticated: false
    };
  }

  componentDidMount() {
    // ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
    const action = this.props.action;
    switch (action) {
      case LogoutActions.Logout:
        if (!!window.history.state.usr.local) {
          // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
          this.logout(this.getReturnUrl());
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout
          this.setState({ isReady: true, message: "The logout was not initiated from within the page." });
        }
        break;
      case LogoutActions.LogoutCallback:
        this.processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        this.setState({ isReady: true, message: "You successfully logged out!" });
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    this.populateAuthenticationState();
  }

  render() {
    // ts-expect-error TS(2339): Property 'isReady' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { isReady, message } = this.state;
    if (!isReady) {
      return <div></div>
    }
    if (!!message) {
      return (<div>{message}</div>);
    } else {
      // ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
      const action = this.props.action;
      switch (action) {
        case LogoutActions.Logout:
          return (<div>Processing logout</div>);
        case LogoutActions.LogoutCallback:
          return (<div>Processing logout callback</div>);
        case LogoutActions.LoggedOut:
          return (<div>{message}</div>);
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  async logout(returnUrl: any) {
    const state = { returnUrl };
    const isauthenticated = await authService.isAuthenticated();
    if (isauthenticated) {
      const result = await authService.signOut(state);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          break;
        case AuthenticationResultStatus.Success:
          await this.navigateToReturnUrl(returnUrl);
          break;
        case AuthenticationResultStatus.Fail:
          // @ts-expect-error TS(2339): Property 'message' does not exist on type '{ statu... Remove this comment to see the full error message
          this.setState({ message: result.message });
          break;
        default:
          throw new Error("Invalid authentication result status.");
      }
    } else {
      this.setState({ message: "You successfully logged out!" });
    }
  }

  async processLogoutCallback() {
    const url = window.location.href;
    const result = await authService.completeSignOut(url);

    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        // Add a check to verify if result.message exists
        if ('message' in result && typeof result.message === 'string') {
          this.setState({ message: result.message });
        }
        break;
      default:
        throw new Error("Invalid authentication result status.");
    }
  }


  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ isReady: true, authenticated });
  }

  getReturnUrl(state: any) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.LoggedOut}`;
  }

  navigateToReturnUrl(returnUrl: any) {
    return window.location.replace(returnUrl);
  }
}
