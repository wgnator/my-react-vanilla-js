import App from "./App.js";
import MyReact from "./MyReact.js";
import { parseVDOMTreeToDOMTree } from "./utils.js";

export const RENDER_EVENT = "RENDER";

window.addEventListener(RENDER_EVENT, (event) => {
  const VDOMTree = MyReact.render(App);
  console.log("VDOM:", VDOMTree);
  const app = parseVDOMTreeToDOMTree(VDOMTree);
  document.querySelector(".App")?.remove();
  document.querySelector("body").append(app);
});

window.dispatchEvent(new CustomEvent(RENDER_EVENT));
