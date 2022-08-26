import App from "./App.js";
import { MyReact } from "./MyReact.js";
import { parseRenderTreeToDOMTree } from "./utils.js";

export const RERENDER_EVENT = "RERENDER";

window.addEventListener(RERENDER_EVENT, () => {
  console.log("render event dispatched");
  const renderTree = MyReact.render(App);
  const app = parseRenderTreeToDOMTree(renderTree);
  document.querySelector(".App")?.remove();
  document.querySelector("body").append(app);
});

window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
