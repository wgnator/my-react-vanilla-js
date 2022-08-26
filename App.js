import Main from "./Main.js";
import BrowserRouter from "./router.js";
// import { render } from "./MyReact.js";
import MyReact from "./MyReact.js";
import FetchPage from "./FetchPage.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import NavBar from "./NavBar.js";
import useNavigate from "./useNavigate.js";

export default function App() {
  // const { currentPath, navigateTo } = useNavigate();
  const [currentPath, setCurrentPath] = MyReact.useState(window.location.pathname);

  const navigateTo = (path) => {
    window.history.pushState(null, null, path);
    setCurrentPath(window.location.pathname);
  };

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

  return parseHTMLToVDOMTree`
    <div class="App">
    ${MyReact.render(NavBar)}
    ${MyReact.render(BrowserRouter, {
      navigateTo: navigateTo,
      currentPath: currentPath,
      routes: routes,
    })}
    </div>
  `;
}
