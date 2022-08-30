// import { useState, useRef } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import MyReact from "./MyReact.js";

export default function Main({ navigateTo }) {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);
  const increaseButtonRef = MyReact.useRef();

  const vdom = parseHTMLToVDOMTree`
  <main class="MainPage">
    <div onclick="${() => increaseButtonRef.current.click()}" class="count_box">
      <div>useState counter: ${counter}</div>
      <div>useRef counter: ${useRefTestRef.current}</div>
    </div>
    <button ref="${increaseButtonRef}" onclick="${() =>
    setCounter(counter + 1)}">increase useState value</button>
    <button onclick="${() => useRefTestRef.current++}">increase useRef value</button>
    <button onclick="${() => navigateTo("/fetch")}">go to fetch page</button>
  </main>
  `;
  console.log("main vdom:", vdom);
  return vdom;
}
