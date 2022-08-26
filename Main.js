import { MyReact } from "./MyReact.js";
import { PathStateContext } from "./PathStateContext.js";
import useNavigate from "./useNavigate.js";
import { parseHTMLToVDOMTree } from "./utils.js";

export default function Main() {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);
  const navigateTo = useNavigate();
  const contextValue = MyReact.useContext(PathStateContext);
  console.log("main component context value:", contextValue);
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
