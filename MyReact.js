import { RERENDER_EVENT } from "./index.js";

export const MyReact = (function () {
  let hookStates = [];
  let currentHookIndex = 0;
  let effectsToRun = [];
  let renderedComponentsInSeries = [];
  let currentComponentIndex = 0;

  return {
    render(Component, props) {
      if (renderedComponentsInSeries[currentComponentIndex] === undefined) renderedComponentsInSeries.push(Component);
      else if (renderedComponentsInSeries[currentComponentIndex] !== Component) {
        hookStates.splice(currentHookIndex);
        renderedComponentsInSeries[currentComponentIndex] = Component;
      }
      currentComponentIndex++;
      const componentClosure = Component(props);
      const renderedComponent = componentClosure.render();
      currentHookIndex = 0;
      currentComponentIndex = 0;
      while (effectsToRun.length > 0) effectsToRun.pop()();

      return renderedComponent;
    },
    useState(initialValue) {
      const thisHookIndex = currentHookIndex;
      if (hookStates[currentHookIndex] === undefined) hookStates.push({ value: initialValue });

      const setState = (newState) => {
        hookStates[thisHookIndex].value = newState instanceof Function ? newState() : newState;
        window.dispatchEvent(new CustomEvent(RERENDER_EVENT));
      };
      return [hookStates[currentHookIndex++].value, setState];
    },
    useEffect(callback, dependencies) {
      if (hookStates[currentHookIndex] === undefined) {
        hookStates.push({ callback: callback, dependenciesState: dependencies });
        effectsToRun.push(callback);
      }

      if (!hookStates[currentHookIndex].dependenciesState.every((previousDependencyState, i) => JSON.stringify(previousDependencyState) === JSON.stringify(dependencies[i]))) {
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
