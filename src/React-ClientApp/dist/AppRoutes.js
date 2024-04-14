"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ApiAuthorizationRoutes_1 = __importDefault(require("./components/api-authorization/ApiAuthorizationRoutes"));
const Counter_1 = require("./components/Counter");
const FetchData_1 = require("./components/FetchData");
const Home_1 = require("./components/Home");
// Define the AppRoutes array with the explicit RouteObject type
const AppRoutes = [
    {
        index: true,
        element: (0, jsx_runtime_1.jsx)(Home_1.Home, {}),
    },
    {
        path: '/counter',
        element: (0, jsx_runtime_1.jsx)(Counter_1.Counter, {}),
    },
    {
        path: '/fetch-data',
        requireAuth: true,
        element: (0, jsx_runtime_1.jsx)(FetchData_1.FetchData, {}),
    },
    ...ApiAuthorizationRoutes_1.default, // Assuming this also matches the RouteObject type
];
exports.default = AppRoutes;
