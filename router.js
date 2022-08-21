import Component from "./Component.js";

export default function router(pathname, routes) {
  const matchingChildComponent = routes.find((child) => child.pathname === pathname);
  console.log(matchingChildComponent);
  return matchingChildComponent;
}
