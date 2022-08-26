import { RERENDER_EVENT } from "./index.js";
import { parseHTMLToVDOMTree } from "./utils.js";

export const MyReact = (function () {
  const hookStates = [];
  let currentHookIndex = 0;
  const effectsToRun = [];
  const renderedComponentsInSeries = [];
  let currentComponentIndex = 0;
  const contexts = [];

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
      console.log("contexts: ", contexts);
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

      return VDOMTree;
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

    createContext(initialValue) {
      const context = (() => {
        let _value = initialValue;
        return {
          getValue() {
            return _value;
          },
          Provider({ value, children }) {
            if (value) _value = value;
            console.log("_value", _value);
            return {
              value: _value,
              children: children.map((child) => MyReact.render(...child)),
            };
          },
        };
      })();
      contexts.push(context);
      return contexts[contexts.length - 1];
    },

    useContext(Context) {
      return Context.getValue();
    },
  };
})();
