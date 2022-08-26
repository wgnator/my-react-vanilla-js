import Main from "./Main.js";
import BrowserRouter from "./router.js";
import { MyReact } from "./MyReact.js";
import FetchPage from "./FetchPage.js";
import { parseHTMLToVDOMTree } from "./utils.js";
import NavBar from "./NavBar.js";
import { PathStateContext } from "./PathStateContext.js";

export default function App() {
  const [currentPath, setCurrentPath] = MyReact.useState(window.location.pathname);
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
    ${MyReact.render(PathStateContext.Provider, {
      value: { currentPath: currentPath, setCurrentPath: setCurrentPath },
      children: [
        [NavBar, null],
        [
          BrowserRouter,
          {
            currentPath: currentPath,
            routes: routes,
          },
        ],
      ],
    })}
    </div>
  `;
}
