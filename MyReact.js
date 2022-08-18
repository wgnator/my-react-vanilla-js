import { RERENDER_EVENT } from "./index.js";

export const MyReact = (function () {
  let hookStates = [];
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
      if (hookStates[currentlyAccessingHookIndex] === undefined) hookStates.push(initialValue);
      const setState = (newState) => {
        console.log("this hook index: ", thisHookIndex);
        hookStates[thisHookIndex] = newState;
        // console.log(hookStates[currentlyAccessingHookIndex]);
        window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
      };
      return [hookStates[currentlyAccessingHookIndex++], setState];
    },
  };
})();
