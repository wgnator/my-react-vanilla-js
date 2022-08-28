// import { useState, useRef } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import MyReact from "./MyReact.js";

export default function Main({ navigateTo }) {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);
  const increaseButtonRef = MyReact.useRef();
  console.log(setCounter);
  return parseHTMLToVDOMTree`
  <main class="MainPage">
    <div onclick="${() => increaseButtonRef.current.click()}" class="count_box">
      useState counter: ${counter}
      useRef counter: ${useRefTestRef.current}
    </div>
    <button ref="${increaseButtonRef}" onclick="${() =>
    setCounter(counter + 1)}">increase useState value</button>
    <button onclick="${() => useRefTestRef.current++}">increase useRef value</button>
    <button onclick="${() => navigateTo("/fetch")}">go to fetch page</button>
  </main>
  `;
}
