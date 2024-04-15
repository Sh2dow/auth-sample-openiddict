// Define the expected type for AppRoutes
import { ReactElement } from 'react';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";

interface RouteObject {
  index?: boolean;
  path?: string;
  requireAuth?: boolean;
  element: ReactElement;
}

// Define the AppRoutes array with the explicit RouteObject type
const AppRoutes: RouteObject[] = [
  {
    index: true,
    path: '/',
    element: <Home />,
  },
  {
    path: '/counter',
    element: <Counter />,
  },
  {
    path: '/fetch-data',
    requireAuth: true,
    element: <FetchData />,
  },
  ...ApiAuthorizationRoutes, // Assuming this also matches the RouteObject type
];

export default AppRoutes;
