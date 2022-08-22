export default function router(pathname, routes) {
  const requestedRoute = pathname.match(/\/[\S]*/g);
  console.log("requested route:", requestedRoute, "routes:", routes);
  return findMatchingPath(requestedRoute, routes);
}

const findMatchingPath = (requestedRoute, routes) => {
  if (requestedRoute === undefined || !routes) return;
  const found = routes.find((e) => e.pathname === requestedRoute[0]);
  return found ? findMatchingPath(requestedRoute.slice(1), found.childPaths) || found : null;
};
