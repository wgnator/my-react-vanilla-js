import { MyReact } from "./MyReact.js";
import { PathStateContext } from "./PathStateContext.js";

export default function useNavigate() {
  console.log("pathStateContext in useContext", PathStateContext.getValue());
  const { setCurrentPath } = MyReact.useContext(PathStateContext);
  const navigateTo = (path) => {
    setCurrentPath(path);
    window.history.pushState(null, null, path);
  };

  return navigateTo;
}
