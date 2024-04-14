import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const baseUrl = document.getElementsByTagName('base')[0]?.getAttribute('href') || undefined;
const rootElement = document.getElementById('root');

if (rootElement !== null) {
  const root = createRoot(rootElement);

  root.render(
    <BrowserRouter basename={baseUrl}>
      <App />
    </BrowserRouter>
  );
}

// Register or unregister the service worker based on your preference
serviceWorkerRegistration.unregister();

// To measure performance in your app, pass a function to log results
// to the reportWebVitals function
reportWebVitals(console.log); // Pass a function like console.log here
