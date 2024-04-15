import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null; // Consider making userName optional in case the user is not logged in
}

export class LoginMenu extends Component<{}, AuthState> {
  _subscription: any;
  constructor(props: {}) {
    super(props);
    this.state = {
      isAuthenticated: false,
      userName: null
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user?.profile.name ?? null
    });
  }

  render() {
    // ts-expect-error TS(2339): Property 'isAuthenticated' does not exist on type ... Remove this comment to see the full error message
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = `${ApplicationPaths.LogOut}`;
      const logoutState = { local: true };
      return this.authenticatedView(userName, profilePath, logoutPath, logoutState);
    }
  }

  authenticatedView(userName: any, profilePath: any, logoutPath: any, logoutState: any) {
    return (<Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {userName}</NavLink>
      </NavItem>
      <NavItem>
        <NavLink replace tag={Link} className="text-dark" to={logoutPath} state={logoutState}>Logout</NavLink>
      </NavItem>
    </Fragment>);
  }

  anonymousView(registerPath: any, loginPath: any) {
    return (<Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
      </NavItem>
    </Fragment>);
  }
}
