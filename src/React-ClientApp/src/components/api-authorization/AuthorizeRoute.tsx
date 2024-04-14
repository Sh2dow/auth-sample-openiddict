import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ApplicationPaths, QueryParameterNames } from './ApiAuthorizationConstants';
import authService from './AuthorizeService';

// Define types for the state and props
interface AuthorizeRouteState {
  ready: boolean;
  authenticated: boolean;
}

interface AuthorizeRouteProps {
  path: string; // Add the type for path prop
  element: ReactNode; // Use ReactNode type for element prop,
  [restProps: string]: any; // Any additional props
}

// Define AuthorizeRoute as a class component with specific types for state and props
export default class AuthorizeRoute extends Component<AuthorizeRouteProps, AuthorizeRouteState> {
  _subscription: any;

  constructor(props: AuthorizeRouteProps) {
    super(props);
    // Initialize state
    this.state = {
      ready: false,
      authenticated: false
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.authenticationChanged());
    this.populateAuthenticationState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  render() {
    // Destructure state
    const { ready, authenticated } = this.state;

    // Create a link element to extract the return URL
    const link = document.createElement("a");
    link.href = this.props.path; // Correctly use path prop

    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;

    if (!ready) {
      return <div></div>; // Return an empty div if not ready
    } else {
      // Destructure the element prop
      const { element } = this.props;

      // Return the element if authenticated; otherwise, redirect to login page
      return authenticated ? element : <Navigate replace to={redirectUrl} />;
    }
  }

  async populateAuthenticationState() {
    // Get the authenticated state and update the component's state
    const authenticated = await authService.isAuthenticated();
    this.setState({ ready: true, authenticated });
  }

  async authenticationChanged() {
    // Reset state and populate authentication state
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }
}
