import App from "./App.js";
import { MyReact } from "./MyReact.js";

export const RERENDER_EVENT = "RERENDER";

window.addEventListener(RERENDER_EVENT, () => {
  console.log("rerender event dispatched");
  const app = MyReact.render(App);
  document.querySelector(".App")?.remove();
  document.querySelector("body").append(app);
});

window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
