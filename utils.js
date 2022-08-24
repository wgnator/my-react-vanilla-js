export function createElement(tagName, className, attributes, innerText) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (attributes)
    Object.keys(attributes).forEach((attr) => {
      if (attr.startsWith("on")) element[attr] = attributes[attr];
      else element.setAttribute(attr, attributes[attr]);
    });
  if (innerText) element.innerText = innerText;
  return element;
}

Number.prototype.isEndIndexOf = function (data) {
  return this === data.length - 1;
};

const isInnerText = (index, brokenHTML) => {
  const closestUpcomingIndexOf = (char, startingArrayIndex, array) => {
    let piece = array[startingArrayIndex];
    let offset = Math.max(piece.indexOf(char), 0);
    while (piece.indexOf(char) < 0) {
      offset += piece.length;
      piece = brokenHTML[startingArrayIndex++];
    }
    return offset + piece.indexOf(char);
  };

  return closestUpcomingIndexOf("<", index, brokenHTML) < closestUpcomingIndexOf(">", index, brokenHTML);
};

export function parseHTMLToRenderTree(brokenHTML, ...variables) {
  const regexForTagAndTextSelection = /<[\s\S]*?(?=<\/?)/g;
  const regexForAttributes = /[a-z]+="[0-9a-zA-Z=_\-:;/.\[\]\s]+"/g;
  const singletonTags = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "source", "track", "wbr"];

  let joinedHTML;

  if (variables) {
    let variableIndex = 0;
    joinedHTML = brokenHTML
      .map((HTMLPiece, index) => HTMLPiece + (index.isEndIndexOf(brokenHTML) ? "" : isInnerText(index + 1, brokenHTML) ? variables[variableIndex++] : `[${variableIndex++}]`))
      .join("");
  } else joinedHTML = brokenHTML[0];

  const htmlArr = joinedHTML.match(regexForTagAndTextSelection);

  function recursivelyParseHTML(htmlArr) {
    if (htmlArr.length < 1) return;
    if (htmlArr[0].match(/<\//)) {
      htmlArr.splice(0, 1);
      return;
    }

    const currentLevelTagString = htmlArr.splice(0, 1);
    let [openingTag, innerText] = currentLevelTagString[0].split(">");
    if (!innerText.replaceAll(" ", "").replaceAll("\n", "")) innerText = null;
    else if (innerText.startsWith("\n")) innerText = innerText.replace("\n", "");
    const tagName = openingTag.match(/[a-z0-9]+/)[0];
    const attributesArr = openingTag.match(regexForAttributes);
    const attributesObj =
      attributesArr?.reduce((prev, curr) => {
        if (curr.match(/=/)) {
          let [attribute, value] = curr.split("=");
          attribute = attribute.replaceAll(/\s/g, "").replace("class", "className");
          if (value.match(/\[[0-9]+\]/)) value = variables[parseInt(value.match(/[0-9]+/)[0])];
          return { ...prev, [attribute]: typeof value === "string" ? value.replaceAll('"', "") : value };
        } else {
          return { ...prev, [curr]: true };
        }
      }, {}) || [];

    const children = [];
    let childElements;

    if (singletonTags.every((singletonTag) => singletonTag !== tagName))
      do {
        childElements = recursivelyParseHTML(htmlArr);
        if (childElements) children.push(childElements);
      } while (childElements);

    return { tagName: tagName, ...attributesObj, text: innerText, children: children.length > 0 ? children : null };
  }

  return recursivelyParseHTML(htmlArr);
}

export function parseRenderTreeToDOM(tree) {
  if (!tree) return;
  const { tagName, className, text, children, ...attributes } = tree;
  const element = createElement(tagName, className, attributes, text);
  const childrenElements = tree.children?.map((child) => parseRenderTreeToDOM(child));
  if (childrenElements) element.append(...childrenElements);
  return element;
}
