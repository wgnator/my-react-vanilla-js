import { MyReact } from "./MyReact.js";
import { parseRenderTreeToDOM, parseHTMLToRenderTree } from "./utils.js";

export default function Main({ navigateTo }) {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);

  const renderTree = parseHTMLToRenderTree`
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
  return {
    render() {
      return parseRenderTreeToDOM(renderTree);
    },
  };
}
