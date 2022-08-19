import { RERENDER_EVENT } from "./index.js";

export const MyReact = (function () {
  const hookStates = [];
  let currentlyAccessingHookIndex = 0;
  return {
    render(Component) {
      currentlyAccessingHookIndex = 0;

      console.log("hookStates:", hookStates);
      // console.log("Component incoming for render: ", Component);
      const componentClosure = Component();
      console.log("componentClosure: ", componentClosure);

      const rendered = componentClosure.render();
      currentlyAccessingHookIndex = 0;
      console.log("hookStates:", hookStates);
      return rendered;
    },
    useState(initialValue) {
      const thisHookIndex = currentlyAccessingHookIndex;
      if (hookStates[currentlyAccessingHookIndex] === undefined) hookStates.push({ value: initialValue, updated: false });
      const setState = (newState) => {
        console.log("this hook index: ", thisHookIndex);
        hookStates[thisHookIndex].value = newState;
        hookStates[thisHookIndex].updated = true;
        // console.log(hookStates[currentlyAccessingHookIndex]);
        window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
      };
      return [hookStates[currentlyAccessingHookIndex++].value, setState];
    },
    useEffect(callback, dependencies) {
      console.log("use effect called: ", dependencies);
      if (hookStates[currentlyAccessingHookIndex] === undefined) {
        hookStates.push({ callback: callback, dependencies: dependencies });
        callback();
      }

      if (!hookStates[currentlyAccessingHookIndex].dependencies.every((previousDependencyState, i) => previousDependencyState === dependencies[i])) {
        hookStates[currentlyAccessingHookIndex].callback();
      }
      currentlyAccessingHookIndex++;
    },
  };
})();
