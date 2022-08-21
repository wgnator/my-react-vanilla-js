import createElement from "./createElement.js";
import Main from "./Main.js";
import router from "./router.js";
import { MyReact } from "./MyReact.js";
import Component from "./Component.js";

export default function App() {
  const [currentPath, setCurrentPath] = MyReact.useState(window.location.pathname);
  console.log("currentPath: ", currentPath);

  const routes = [
    {
      pathname: "/",
      props: { setCurrentPath: setCurrentPath },
      render() {
        return MyReact.render(Main, this.props);
      },
    },
    {
      pathname: "/fetch",
      render() {
        return MyReact.render(Component);
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
