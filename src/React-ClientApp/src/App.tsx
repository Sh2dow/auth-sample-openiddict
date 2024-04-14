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
            const { path, element, requireAuth } = route;

            if (requireAuth && path) {
              // Render AuthorizeRoute for authenticated routes
              return (
                <Route
                  key={index}
                  path={path}
                  element={<AuthorizeRoute key={index} path={path} element={element} />}
                />
              );
            } else if (path) {
              // Render regular Route for other routes
              return (
                <Route
                  key={index}
                  path={path}
                  element={element}
                />
              );
            } else {
              // Handle the case where the path is missing
              console.error(`Route at index ${index} is missing a 'path' property.`);
              return null;
            }
          })}
        </Routes>
      </Layout>
    );
  }
}

