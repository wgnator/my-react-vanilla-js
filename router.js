export default function router(pathname, routes) {
  const requestedRoute = pathname.match(/\/[a-zA-Z0-9]*/g);
  return findMatchingPath(requestedRoute, routes);
}

const findMatchingPath = (requestedRoute, routes) => {
  if (requestedRoute === undefined || !routes) return;
  const found = routes.find((e) => e.pathname === requestedRoute[0]);
  console.log("requestedRoute:", requestedRoute, "routes:", routes, "found:", found);
  const foundInChildren = found?.childPaths ? findMatchingPath(requestedRoute.slice(1), found.childPaths) : null;
  return foundInChildren ? foundInChildren : found;
};
