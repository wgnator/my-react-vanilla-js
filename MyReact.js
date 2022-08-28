import { RENDER_EVENT } from "./index.js";

const MyReact = (function () {
  const componentStates = {};
  let currentHookIndex = 0;
  let currentComponentStates;
  let effectsToRun = [];

  return {
    render(Component, props) {
      currentHookIndex = 0;

      if (!Object.keys(componentStates).includes(Component.name)) {
        componentStates[Component.name] = {};
        componentStates[Component.name].states = [];
        componentStates[Component.name].mounted = true;
      }
      currentComponentStates = componentStates[Component.name].states;

      let VDOMTree;

      if (Component.name === "App") {
        Object.keys(componentStates).forEach(
          (component) => (componentStates[component].mounted = false)
        );
        componentStates[Component.name].mounted = true;
        VDOMTree = Component();

        while (effectsToRun.length > 0) {
          effectsToRun.pop()();
        }
        Object.keys(componentStates).forEach(
          (component) => !componentStates[component].mounted && delete componentStates[component]
        );
        console.log("hook states after render: ", componentStates);
      } else {
        componentStates[Component.name].mounted = true;
        VDOMTree = Component(props);
        if (Component.name === "NavBar")
          console.log("is rendering", Component.name, "result:", VDOMTree);
      }

      return VDOMTree;
    },

    useState(initialValue) {
      const currentComponent = currentComponentStates;
      const thisHookIndex = currentHookIndex;
      if (currentComponentStates[currentHookIndex] === undefined) {
        currentComponentStates.push({
          value: initialValue,
          setState: (newState) => {
            const prevState = currentComponent[thisHookIndex].value;
            currentComponent[thisHookIndex].value =
              newState instanceof Function ? newState(prevState) : newState;
            window.dispatchEvent(new CustomEvent(RENDER_EVENT));
          },
        });
      }

      return [
        currentComponentStates[currentHookIndex].value,
        currentComponentStates[currentHookIndex++].setState,
      ];
    },

    useEffect(callback, dependencies) {
      if (currentComponentStates[currentHookIndex] === undefined) {
        currentComponentStates.push({ callback: callback, dependenciesState: dependencies });
        effectsToRun.push(callback);
      } else if (
        !currentComponentStates[currentHookIndex].dependenciesState.every(
          (previousDependencyState, i) =>
            JSON.stringify(previousDependencyState) === JSON.stringify(dependencies[i])
        )
      )
        effectsToRun.push(callback);

      currentHookIndex++;
    },

    useRef(initialValue) {
      if (currentComponentStates[currentHookIndex] === undefined) {
        currentComponentStates.push({ current: initialValue });
      }
      return currentComponentStates[currentHookIndex++];
    },
  };
})();

export const render = MyReact.render;
export const useState = MyReact.useState;
export const useEffect = MyReact.useEffect;
export const useRef = MyReact.useRef;
export default MyReact;
