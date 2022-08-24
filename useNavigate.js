import { MyReact } from "./MyReact.js";

export default function useNavigate() {
  const [currentPath, setCurrentPath] = MyReact.useState(window.location.pathname);

  console.log("currentPath: ", currentPath);

  const navigateTo = (path) => {
    window.history.pushState(null, null, path);
    setCurrentPath(path);
  };

  return { currentPath, navigateTo };
}
