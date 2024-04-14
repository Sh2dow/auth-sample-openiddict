"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class Counter extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { currentCount: 0 };
        this.incrementCounter = this.incrementCounter.bind(this);
    }
    incrementCounter() {
        this.setState((prevState) => ({
            currentCount: prevState.currentCount + 1
        }));
    }
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Counter" }), (0, jsx_runtime_1.jsx)("p", { children: "This is a simple example of a React component." }), (0, jsx_runtime_1.jsxs)("p", { "aria-live": "polite", children: ["Current count: ", (0, jsx_runtime_1.jsx)("strong", { children: this.state.currentCount })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", onClick: this.incrementCounter, children: "Increment" })] }));
    }
}
exports.Counter = Counter;
Counter.displayName = Counter.name;
