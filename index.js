import App from "./App.js";
import { MyReact } from "./MyReact.js";
import { parseVDOMTreeToDOMTree } from "./utils.js";

export const RERENDER_EVENT = "RERENDER";

window.addEventListener(RERENDER_EVENT, () => {
  const VDOMTree = MyReact.render(App);
  const app = parseVDOMTreeToDOMTree(VDOMTree);
  document.querySelector(".App")?.remove();
  document.querySelector("body").append(app);
});

window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
