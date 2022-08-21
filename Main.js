import createElement from "./createElement.js";
import { MyReact } from "./MyReact.js";
import { navigateTo } from "./utils.js";

export default function Main({ setCurrentPath }) {
  const [counter, setCounter] = MyReact.useState(0);
  const useRefTestRef = MyReact.useRef(0);
  console.log(setCounter);
  const container = createElement("div", "main");
  const mainBox = createElement("div", "mainBox");
  const increaseButton = createElement("button", "increase-button");
  const useRefTestButton = createElement("button", "useRefTest");
  const seeFetchingPageButton = createElement("button", "reroute-FetchingPage-page");

  mainBox.innerText = `useState counter: ${counter} \n useRef counter: ${useRefTestRef.current}`;
  mainBox.style = ` width: 10rem; height: 5rem; border: 1px solid black;`;
  increaseButton.innerText = "increase useState value";
  seeFetchingPageButton.innerText = "see fetching page";
  useRefTestButton.innerText = "increase useRef value";
  useRefTestButton.onclick = () => useRefTestRef.current++;

  container.append(mainBox);
  container.append(increaseButton);
  container.append(useRefTestButton);
  container.append(seeFetchingPageButton);
  MyReact.useEffect(() => console.log("Main Page side effect exectuted!"), [counter]);
  return {
    onIncreaseButtonClick: () => setCounter(counter + 1),
    onSeeFetchingPageClick: () => {
      navigateTo("/fetch", setCurrentPath);
    },
    render() {
      increaseButton.onclick = this.onIncreaseButtonClick;
      seeFetchingPageButton.onclick = this.onSeeFetchingPageClick;
      return container;
    },
  };
}
// return {
//   element: Component({
//     element: increaseButton,
//     props: {
//       onClick: () => {
//         setCounter(counter + 1);
//         console.log(counter);
//       },
//     },
//   }),
// };
