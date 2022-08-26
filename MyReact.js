import { RENDER_EVENT } from "./index.js";

const MyReact = (function () {
  const hookStates = [];
  let currentHookIndex = 0;
  let effectsToRun = [];
  const renderedComponentsInSeries = [];
  let currentComponentIndex = 0;

  return {
    render(Component, props) {
      if (renderedComponentsInSeries[currentComponentIndex] === undefined)
        renderedComponentsInSeries.push(Component);
      else if (renderedComponentsInSeries[currentComponentIndex] !== Component) {
        hookStates.splice(currentHookIndex);
        renderedComponentsInSeries[currentComponentIndex] = Component;
      }
      currentComponentIndex++;

      const VDOMTree = Component(props);
      console.log("rendered components:", renderedComponentsInSeries);

      currentHookIndex = 0;

      if (effectsToRun) {
        effectsToRun.forEach((effect, index) => {
          if (effect.componentIndex === currentComponentIndex) {
            effect.callback();
            console.log("effects to run before splice: ", effectsToRun);
          }
        });
        effectsToRun = effectsToRun.reduce(
          (prev, curr) => (curr.componentIndex !== currentComponentIndex ? prev.push(curr) : prev),
          []
        );
        console.log("effects to run after splice: ", effectsToRun);
      }

      currentComponentIndex--;
      console.log("hook states after render: ", JSON.stringify(hookStates));

      return VDOMTree;
    },

    useState(initialValue) {
      const thisHookIndex = currentHookIndex;
      if (hookStates[currentHookIndex] === undefined) hookStates.push({ value: initialValue });

      const setState = (newState) => {
        hookStates[thisHookIndex].value = newState instanceof Function ? newState() : newState;
        window.dispatchEvent(new CustomEvent(RENDER_EVENT));
      };
      return [hookStates[currentHookIndex++].value, setState];
    },

    useEffect(callback, dependencies) {
      if (hookStates[currentHookIndex] === undefined) {
        hookStates.push({ callback: callback, dependenciesState: dependencies });
        effectsToRun.push({ callback: callback, componentIndex: currentComponentIndex });
      } else if (
        !hookStates[currentHookIndex].dependenciesState.every(
          (previousDependencyState, i) =>
            JSON.stringify(previousDependencyState) === JSON.stringify(dependencies[i])
        )
      ) {
        effectsToRun.push({
          callback: hookStates[currentHookIndex].callback,
          componentIndex: currentComponentIndex,
        });
      }
      currentHookIndex++;
    },

    useRef(initialValue) {
      if (hookStates[currentHookIndex] === undefined) {
        hookStates.push({ current: initialValue });
      }
      return hookStates[currentHookIndex++];
    },
  };
})();

// export const render = MyReact.render;
// export const useState = MyReact.useState;
// export const useEffect = MyReact.useEffect;
// export const useRef = MyReact.useRef;
export default MyReact;
