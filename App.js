import Main from "./Main.js";
import BrowserRouter from "./router.js";
import { render } from "./MyReact.js";
import FetchPage from "./FetchPage.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import NavBar from "./NavBar.js";
import useNavigate from "./useNavigate.js";

export default function App() {
  const { currentPath, navigateTo } = useNavigate();

  const routes = [
    {
      pathname: "/",
      component: Main,
    },

    {
      pathname: "/fetch",
      component: FetchPage,
    },
  ];

  const VDOM = parseHTMLToVDOMTree`
    <div class="App">
    ${render(NavBar)}
    ${render(BrowserRouter, {
      navigateTo: navigateTo,
      currentPath: currentPath,
      routes: routes,
    })}
    </div>
  `;
  console.log("app VDOM:", VDOM);
  return VDOM;
}
