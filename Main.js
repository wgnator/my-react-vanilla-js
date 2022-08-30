// import { useState, useRef } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import MyReact from "./MyReact.js";

const INITIAL_COUNT = 0;

const counterReducer = (state, action) => {
  switch (action) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return initializeCounter(INITIAL_COUNT);
    default:
      throw new Error("no action type has been passed");
  }
};

const initializeCounter = (initialValue) => {
  return { count: initialValue };
};
export default function Main({ navigateTo }) {
  const [counter, dispatch] = MyReact.useReducer(counterReducer, INITIAL_COUNT, initializeCounter);
  const useRefTestRef = MyReact.useRef(0);
  const increaseButtonRef = MyReact.useRef();

  const vdom = parseHTMLToVDOMTree`
  <main class="MainPage">
    <div onclick="${() => increaseButtonRef.current.click()}" class="count_box">
      <div>useReducer counter: ${counter.count}</div>
      <div>useRef counter: ${useRefTestRef.current}</div>
    </div>
    <button ref="${increaseButtonRef}" onclick="${() =>
    dispatch("INCREMENT")}">increase useReducer value</button>
    <button ref="${increaseButtonRef}" onclick="${() =>
    dispatch("DECREMENT")}">decrease useReducer value</button>
    <button onclick="${() => useRefTestRef.current++}">increase useRef value</button>
    <button onclick="${() => dispatch("RESET")}">reset useReducer value</button>
    <button onclick="${() => navigateTo("/fetch")}">go to fetch page</button>
  </main>
  `;
  console.log("main vdom:", vdom);
  return vdom;
}
