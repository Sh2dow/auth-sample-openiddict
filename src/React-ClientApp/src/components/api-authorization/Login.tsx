import React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { LoginActions, QueryParameterNames, ApplicationPaths } from './ApiAuthorizationConstants';

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export class Login extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      message: undefined
    };
  }

  componentDidMount() {
    // @ts-expect-error TS(2339): Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
    const action = this.props.action;
    switch (action) {
      case LoginActions.Login:
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        this.login(this.getReturnUrl());
        break;
      case LoginActions.LoginCallback:
        this.processLoginCallback();
        break;
      case LoginActions.LoginFailed:
        const params = new URLSearchParams(window.location.search);
        const error = params.get(QueryParameterNames.Message);
        this.setState({ message: error });
        break;
      case LoginActions.Profile:
        this.redirectToProfile();
        break;
      case LoginActions.Register:
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
      return <div>{message}</div>
    } else {
      switch (action) {
        case LoginActions.Login:
          return (<div>Processing login</div>);
        case LoginActions.LoginCallback:
          return (<div>Processing login callback</div>);
        case LoginActions.Profile:
        case LoginActions.Register:
          return (<div></div>);
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  async login(returnUrl: any) {
    const state = { returnUrl };
    const result = await authService.signIn(state);
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
        throw new Error(`Invalid status result ${result.status}.`);
    }
  }

  async processLoginCallback() {
    const url = window.location.href;
    const result = await authService.completeSignIn(url);
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeSignIn finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        // ts-expect-error TS(2339): Property 'state' does not exist on type '{ status:... Remove this comment to see the full error message
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        // ts-expect-error TS(2339): Property 'message' does not exist on type '{ statu... Remove this comment to see the full error message
        if ('message' in result && typeof result.message === 'string') {
          this.setState({ message: result.message });
        }
        break;
      default:
        throw new Error(`Invalid authentication result status '${result.status}'.`);
    }
  }

  getReturnUrl(state: any) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
  }

  redirectToRegister() {
    this.redirectToApiAuthorizationPath(`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`);
  }

  redirectToProfile() {
    this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
  }

  redirectToApiAuthorizationPath(apiAuthorizationPath: any) {
    const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
    // It's important that we do a replace here so that when the user hits the back arrow on the
    // browser they get sent back to where it was on the app instead of to an endpoint on this
    // component.
    window.location.replace(redirectUrl);
  }

  navigateToReturnUrl(returnUrl: any) {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl);
  }
}
