export const navigateTo = (path, setState) => {
  console.log("navigate to: ", path);
  window.history.pushState(null, null, path);
  setState(path);
};
