export default function createElement(tagName, className, attributes, innerText) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (attributes) Object.keys(attributes).forEach((attr) => element.setAttribute(attr, attributes[attr]));
  if (innerText) element.innerText = innerText;
  return element;
}
