import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { Layout } from './components/Layout';
import './custom.css';

// Define types for the App component's props and state
interface AppState { }

interface RouteObject {
  path?: string;
  element: React.ReactElement;
  requireAuth?: boolean; // Make requireAuth optional as not all routes may need it
}

export default class App extends Component<{}, AppState> {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            // Check if the route requires authorization and has a valid path
            if (route.requireAuth && route.path) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<AuthorizeRoute key={index} path={route.path} element={route.element} />}
                />
              );
            } else if (route.path) {
              // Render regular Route for other routes with a valid path
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              );
            } else {
              // Handle the case where the path is undefined
              console.error(`Route at index ${index} is missing a 'path' property.`);
              return null;
            }
          })}
        </Routes>
      </Layout>
    );
  }
}

