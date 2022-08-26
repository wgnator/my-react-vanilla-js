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

      const renderTree = Component(props);

      currentHookIndex = 0;

      let runEffectIndex;

      if (effectsToRun) {
        effectsToRun.forEach((effect, index) => {
          if (effect.componentIndex === currentComponentIndex) {
            effect.callback();
            runEffectIndex = index;
          }
        });
        effectsToRun.splice(runEffectIndex, 1);
      }

      currentComponentIndex--;
      // console.log("hook states after render: ", JSON.stringify(hookStates));

      return renderTree;
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
        effectsToRun.push({ callback: callback, componentIndex: currentComponentIndex });
      } else if (!hookStates[currentHookIndex].dependenciesState.every((previousDependencyState, i) => JSON.stringify(previousDependencyState) === JSON.stringify(dependencies[i]))) {
        effectsToRun.push({ callback: hookStates[currentHookIndex].callback, componentIndex: currentComponentIndex });
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
