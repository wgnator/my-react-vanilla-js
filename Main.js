// import { useState, useRef } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import MyReact from "./MyReact.js";

export default function Main({ navigateTo }) {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);

  return parseHTMLToVDOMTree`
  <div class="main">
    <div class="mainBox" style="width: 10rem; height: 5rem; border: 1px solid black">
      useState counter: ${counter}
      useRef counter: ${useRefTestRef.current}
    </div>
    <button onclick="${() => setCounter(counter + 1)}">increase useState value</button>
    <button onclick="${() => useRefTestRef.current++}">increase useRef value</button>
    <button onclick="${() => navigateTo("/fetch")}">go to fetch page</button>
  </div>
  `;
}
