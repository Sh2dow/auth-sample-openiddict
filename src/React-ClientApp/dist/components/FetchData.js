"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchData = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthorizeService_1 = __importDefault(require("./api-authorization/AuthorizeService"));
class FetchData extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true };
    }
    componentDidMount() {
        this.populateWeatherData();
    }
    static renderForecastsTable(forecasts) {
        return ((0, jsx_runtime_1.jsxs)("table", { className: "table table-striped", "aria-labelledby": "tableLabel", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Date" }), (0, jsx_runtime_1.jsx)("th", { children: "Temp. (C)" }), (0, jsx_runtime_1.jsx)("th", { children: "Temp. (F)" }), (0, jsx_runtime_1.jsx)("th", { children: "Summary" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: forecasts.map((forecast) => (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: forecast.date }), (0, jsx_runtime_1.jsx)("td", { children: forecast.temperatureC }), (0, jsx_runtime_1.jsx)("td", { children: forecast.temperatureF }), (0, jsx_runtime_1.jsx)("td", { children: forecast.summary })] }, forecast.date)) })] }));
    }
    render() {
        // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Readonl... Remove this comment to see the full error message
        let contents = this.state.loading
            ? (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("em", { children: "Loading..." }) })
            // @ts-expect-error TS(2339): Property 'forecasts' does not exist on type 'Reado... Remove this comment to see the full error message
            : FetchData.renderForecastsTable(this.state.forecasts);
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { id: "tableLabel", children: "Weather forecast" }), (0, jsx_runtime_1.jsx)("p", { children: "This component demonstrates fetching data from the server." }), contents] }));
    }
    populateWeatherData() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield AuthorizeService_1.default.getAccessToken();
            const response = yield fetch('weatherforecast', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = yield response.json();
            this.setState({ forecasts: data, loading: false });
        });
    }
}
exports.FetchData = FetchData;
FetchData.displayName = FetchData.name;
