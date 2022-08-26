// import { useState } from "./MyReact.js";
import MyReact from "./MyReact.js";
export default function useNavigate() {
  const [currentPath, setCurrentPath] = MyReact.useState(window.location.pathname);
  console.log("current path in usenavigate", currentPath);
  const navigateTo = (path) => {
    window.history.pushState(null, null, path);
    setCurrentPath(window.location.pathname);
  };

  return { currentPath, navigateTo };
}
