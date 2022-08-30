# my-react-vanilla-js

My own challenge to implement functional React (using hooks) from scratch in plain javascript (WIP)

## Objectives
- build functional React library with basic hooks (useState, useEffect, useRef, etc.).
- do not use any external libraries, build with only plain javascript.
- do not use class declarations(ES6), instead make full use of closures & plain objects & prototypes & constructor.

## 1. MyReact
### render()
- ```render``` function is called for each component during the process of rendering whole tree to track component mounting/unmounting. 
- It constructs and returns a virtual dom tree of the called component.
### component states
- States are stored in MyReact closure environment as an object for each component. Each component state object keeps state of the target component mounted/unmounted. States in a component are stored in hook calls order. Therefore, conditionally calling hooks should not be allowed.
### useState()
- ```useState``` creates a component state and returns most updated state and setState().
### setState()
- ```setState``` is created only once and stored in its component state object when ```useState``` is called, with its hook index imprinted inside, so that the linked hook index is not affected by other hook calls. (as setStates can be called anywhere in a component)
- calling ```setState``` will first compare old state and new state to deteremine whether to dispatch a CustomEvent to rerender the whole tree.
### useReducer()
-```useReducer``` takes a pure function reducer and initial value and initializer function, then returns most updates state and dispatch(), which can be used to call the previously received reducer te execute action receved as the argument. (We can pass in {actionType: ..., payload: ... } as an argument, which is a common practice when using useReducer or Redux)
### useEffect()
- callback in ```useEffect``` is first examined whehter it should be executed depending on changes in its dependcies' states or whether it is called first time. If it should be executed, it is pushed into ```effectsToRun``` stack and is executed after the construction of whole tree has been finished.
### useRef()
- ```useRef``` is used in two ways: 1. to store persisting data after render without trigerring rerender, 2. to keep a link to a certain DOM. For the second purpose, the ref variable can be stored in a VDOM attribute and will be linked to actual DOM later in .current property during VDOM to DOM conversion process.

## 2. Parsing HTML to VDOM
- to imitate React's usage of JSX, we can write in HTML format in component, which will be transformed to virtual DOM tree.
### parseHTMLtoVDOMTree
- HTML is recieved as [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) to seperate HTML and variables. Variables are first turned to string indicating its corresponding index in the variables array, and are later evaluated to be handled in the way it should be handled. (e.g. must be handled differently depending on whether it is callback in onclick, another child VDOM, or just plain string/number data to be printed in innerHTML)
### parseFragment
- HTML is split into fragments starting from a tag to right before the next tag, regardless of whether it be opening/closing tag. Fragments are evalutated whether it starts with a opening tag/closing tag/variable index/plain text. After extracting the first significant bit, the rest is reattached to the next fragment to be parsed later.
### recursivelyParseHTML
- it parses HTML fragments until the end or HTML fragment array in sequential way, but the function is called recursively when it meets an opening tag until it meets its closing tag.
## 3. Turning VDOM into DOM tree
- ```parseVDOMTreeToDOMTree``` recursively traverse the VDOM tree to create/append HTML elements to create DOM tree, which is eventually appended to the document in ```index.js```
- A React-like reconciliation with diffing mechanism is to be implemented later.

