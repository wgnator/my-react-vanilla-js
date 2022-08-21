import { RERENDER_EVENT } from "./index.js";

export const MyReact = (function () {
  let hookStates = [];
  let currentHookIndex = 0;
  let effectsToRun = [];
  let renderedComponentsInSeries = [];
  let currentComponentIndex = 0;

  return {
    render(Component, props) {
      // console.log("COMPARE:", renderedComponentsInSeries[currentComponentIndex], Component, renderedComponentsInSeries[currentComponentIndex] === Component);
      if (renderedComponentsInSeries[currentComponentIndex] === undefined) renderedComponentsInSeries.push(Component);
      else if (renderedComponentsInSeries[currentComponentIndex] !== Component) {
        hookStates.splice(currentHookIndex);
        renderedComponentsInSeries[currentComponentIndex] = Component;
      }
      currentComponentIndex++;
      const componentClosure = Component(props);
      // console.log("hookStates before render:", hookStates);
      // console.log("effects waiting to be run:", effectsToRun);
      // console.log("componentClosure: ", componentClosure);
      const renderedComponent = componentClosure.render();
      currentHookIndex = 0;
      currentComponentIndex = 0;
      while (effectsToRun.length > 0) effectsToRun.pop()();
      console.log("hookStates after render:", hookStates);
      // console.log("rendered components:", renderedComponentsInSeries);

      return renderedComponent;
    },
    useState(initialValue) {
      const thisHookIndex = currentHookIndex;
      if (hookStates[currentHookIndex] === undefined) hookStates.push({ value: initialValue, updated: false });

      const setState = (newState) => {
        hookStates[thisHookIndex].value = newState instanceof Function ? newState() : newState;
        hookStates[thisHookIndex].updated = true;
        window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
      };
      return [hookStates[currentHookIndex++].value, setState];
    },
    useEffect(callback, dependencies) {
      // console.log("current hook index:", currentHookIndex, "states:", hookStates);
      // console.log("use effect called. deps:", dependencies);
      if (hookStates[currentHookIndex] === undefined) {
        hookStates.push({ callback: callback, dependenciesState: dependencies });
        effectsToRun.push(callback);
      }

      if (!hookStates[currentHookIndex].dependenciesState.every((previousDependencyState, i) => previousDependencyState === dependencies[i])) {
        // console.log("dependency has changed. pushing effect hook.");
        effectsToRun.push(hookStates[currentHookIndex].callback);
      }
      currentHookIndex++;
    },
    useRef(initialState) {
      if (hookStates[currentHookIndex] === undefined) {
        hookStates.push({ current: initialState });
      }
      return hookStates[currentHookIndex++];
    },
  };
})();
