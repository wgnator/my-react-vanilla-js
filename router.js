import Component from "./Component.js";

export default function router(pathname, childrenRoutes) {
  const matchingChild = childrenRoutes.find((child) => child.pathname === pathname).element;
  return matchingChild();
}
