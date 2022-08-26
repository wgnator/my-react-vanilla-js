import createElement from "./createElement.js";
import Main from "./Main.js";
import router from "./router.js";
import { MyReact } from "./MyReact.js";
import FetchPage from "./FetchPage.js";
import useNavigate from "./useNavigate.js";
import { parseHTMLToRenderTree } from "./utils.js";

export default function App() {
  const { currentPath, navigateTo } = useNavigate();

  const routes = [
    {
      pathname: "/",
      render() {
        return MyReact.render(Main, { navigateTo: navigateTo });
      },
    },
    {
      pathname: "/fetch",
      render() {
        return MyReact.render(FetchPage, { navigateTo: navigateTo });
      },
    },
  ];
  return parseHTMLToRenderTree`
    <div class="App">
      ${router(currentPath, routes).render()}
    </div>
  `;
}
