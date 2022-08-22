export const navigateTo = (path, setState) => {
  console.log("navigating to: ", path);
  window.history.pushState(null, null, path);
  setState(path);
};

export function createElement(tagName, className, attributes, innerText) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (attributes) Object.keys(attributes).forEach((attr) => element.setAttribute(attr, attributes[attr]));
  if (innerText) element.innerText = innerText;
  return element;
}

const regexForTagAndTextSelection = /<[\s\S]*?(?=<\/?)/g;
const regexForAttributes = /\s[0-9a-zA-Z=_\-":/.]+/g;

export function parseHTMLToObject(html) {
  if (typeof html === "string") html = html.match(regexForTagAndTextSelection);
  if (html.length < 1) return;
  if (html[0].match(/<\//)) {
    html.splice(0, 1);
    return;
  }

  const currentLevelTagString = html.splice(0, 1);
  let [openingTag, innerText] = currentLevelTagString[0].split(">");
  if (innerText.startsWith("\n")) innerText = innerText.replaceAll(/\n\s*/g, "") || null;

  const tagName = openingTag.match(/[a-z0-9]+/)[0];
  let attributes = openingTag.match(regexForAttributes);
  attributes =
    attributes?.reduce((prev, curr) => {
      if (curr.match(/=/)) {
        curr = curr.split("=");
        return { ...prev, [curr[0].replaceAll(/\s/g, "").replace("class", "className")]: curr[1].replaceAll('"', "") };
      }
    }, {}) || [];
  const children = [];
  let nextChild;

  if (tagName !== "img")
    do {
      nextChild = parseHTMLToObject(html);
      if (nextChild) children.push(nextChild);
    } while (nextChild);

  return { tagName: tagName, ...attributes, text: innerText, children: children.length > 0 ? children : null };
}

export function convertObjectToDOM(tree) {
  if (!tree) return;
  const { tagName, className, text, children, ...attributes } = tree;
  const element = createElement(tagName, className, attributes, text);
  const childrenElements = tree.children?.map((child) => convertObjectToDOM(child));
  if (childrenElements) element.append(...childrenElements);
  return element;
}
