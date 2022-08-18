import Component from "./Component.js";
import createElement from "./createElement.js";
import { MyReact } from "./MyReact.js";

export default function Main() {
  const [counter, setCounter] = MyReact.useState(0);
  console.log(setCounter);
  const container = createElement("div", "main");
  const mainBox = createElement("div", "mainBox");
  const increaseButton = createElement("button", "increase-button");
  mainBox.innerText = "counter: " + counter;
  mainBox.style = ` width: 5rem; height: 5rem; border: 1px solid black;`;
  increaseButton.innerText = "increase";
  container.append(mainBox);
  container.append(increaseButton);

  return {
    onClick: () => setCounter(counter + 1),
    render() {
      container.onclick = this.onClick;
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
