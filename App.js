import createElement from "./createElement.js";
import Main from "./Main.js";
import router from "./router.js";
import { MyReact } from "./MyReact.js";
import FetchPage from "./FetchPage.js";
import useNavigate from "./useNavigate.js";

export default function App() {
  const { currentPath, navigateTo } = useNavigate();

  const routes = [
    {
      pathname: "/",
      props: { navigateTo: navigateTo },
      render() {
        return MyReact.render(Main, this.props);
      },
    },
    {
      pathname: "/fetch",
      props: { navigateTo: navigateTo },
      render() {
        return MyReact.render(FetchPage, this.props);
      },
    },
  ];

  const $App = createElement("div", "App");
  $App.append(router(currentPath, routes).render());
  return {
    render: () => {
      return $App;
    },
  };
}
