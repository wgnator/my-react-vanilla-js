import { MyReact } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";

export default function BrowserRouter({ currentPath, routes }) {
  console.log("requested route:", currentPath);
  const requestedRoute = currentPath.match(/\/[a-zA-Z0-9]*/g);
  const matchingComponent = findMatchingPath(requestedRoute, routes);
  return parseHTMLToVDOMTree`
  <>
    ${MyReact.render(matchingComponent.component)}
  </>
  `;
}

const findMatchingPath = (requestedRoute, routes) => {
  if (requestedRoute === undefined || !routes) return;
  const found = routes.find((e) => e.pathname === requestedRoute[0]);
  const foundInChildren = found?.childPaths
    ? findMatchingPath(requestedRoute.slice(1), found.childPaths)
    : null;
  return foundInChildren ? foundInChildren : found;
};
