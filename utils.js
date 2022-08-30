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

String.prototype.hasValidText = function () {
  return this ? !!this.replaceAll(" ", "").replaceAll("\n", "") : false;
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

  return (
    closestUpcomingIndexOf("<", index, brokenHTML) < closestUpcomingIndexOf(">", index, brokenHTML)
  );
};

const regexForTagAndTextSelection = /(<[\s\S]*?(?=<\/?))|<\/[\S]*/g;
const regexForAttributes = /[a-z]+="[0-9a-zA-Z=_\-:;/.\[\]\s$]+"/g;
const regexForOpeningTag = /<[A-Za-z0-9\s="_\-\[\]$]*(\s\/)*>/;
const regexForClosingTag = /<\/[a-z0-9]*>/;
const singletonTags = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
];
const CLOSED = false;

const isSingleton = (tagName) => !singletonTags.every((singletonTag) => singletonTag !== tagName);

const joinFragmentsWithVariableNumbering = (brokenHTML, variables) => {
  let varIndex = 0;
  return brokenHTML
    .map(
      (HTMLFragment, pieceIndex) =>
        HTMLFragment +
        (pieceIndex.isEndIndexOf(brokenHTML) || variables[varIndex] === undefined
          ? ""
          : `$[${varIndex++}]`)
    )
    .join("");
};

const parseFragment = (html) => {
  if (html.startsWith("\n")) html.replace(/\\n/, "");
  html = html.trim();
  let openingTag, closingTag, variableIndex, leftOver;

  if (html.startsWith("<")) {
    const boundaryIndex = html.indexOf(">") + 1;
    if (html.match(regexForOpeningTag))
      [openingTag, leftOver] = [html.slice(0, boundaryIndex), html.slice(boundaryIndex)];
    else if (html.match(regexForClosingTag))
      [closingTag, leftOver] = [html.slice(0, boundaryIndex), html.slice(boundaryIndex)];
  } else if (html.startsWith("$")) {
    const boundaryIndex = html.indexOf("]") + 1;
    [variableIndex, leftOver] = [
      html.slice(0, boundaryIndex).replace(/(\$\[)|(\])/g, ""),
      html.slice(boundaryIndex),
    ];
  } else {
    if (html.indexOf("$[") > -1)
      [html, leftOver] = [html.slice(0, html.indexOf("$")), html.slice(html.indexOf("$"))];
    else [html, leftOver] = [html, null];
  }

  if (leftOver) leftOver = leftOver.trim();

  return {
    type: openingTag
      ? "OPENING_TAG"
      : closingTag
      ? "CLOSING_TAG"
      : variableIndex
      ? "VAR_INDEX"
      : "INNER_TEXT",
    parsed: openingTag || closingTag || variableIndex || html,
    leftOver: leftOver || null,
  };
};

export function parseHTMLToVDOMTree(brokenHTML, ...variables) {
  console.log("variables:", variables);
  const joinedHTML = variables
    ? joinFragmentsWithVariableNumbering(brokenHTML, variables)
    : brokenHTML[0];

  const htmlArr = joinedHTML.match(regexForTagAndTextSelection);

  const recursivelyParseHTML = () => {
    if (htmlArr.length === 0) return false;

    const currentString = htmlArr.splice(0, 1)[0];
    const { type: fragmentType, parsed, leftOver } = parseFragment(currentString);

    if (leftOver) htmlArr.splice(0, 0, leftOver);
    if (!parsed.hasValidText()) return;

    let attributesArr = [],
      attributesObj = {},
      children = [];

    if (fragmentType === "INNER_TEXT") return parsed;
    if (fragmentType === "VAR_INDEX")
      return typeof variables[parsed] === "number"
        ? variables[parsed].toString()
        : variables[parsed];
    if (fragmentType === "CLOSING_TAG") return CLOSED;

    if (fragmentType === "OPENING_TAG") {
      let tagName = parsed.match(/<[a-zA-Z0-9]*/)[0].replace("<", "");

      if (tagName) {
        attributesArr = parsed.match(regexForAttributes);
        attributesObj =
          attributesArr?.reduce((prev, curr) => {
            if (curr.match(/=/)) {
              let [attribute, value] = curr.split("=");
              attribute = attribute.replaceAll(/\s/g, "").replace("class", "className");
              if (value.match(/\$\[[0-9]+\]/))
                value = variables[parseInt(value.match(/[0-9]+/)[0])];
              return {
                ...prev,
                [attribute]: typeof value === "string" ? value.replaceAll('"', "") : value,
              };
            } else {
              return { ...prev, [curr]: true };
            }
          }, {}) || [];
      }

      if (isSingleton(tagName)) return { tagName: tagName, ...attributesObj };

      let nextChildElement,
        i = 0;

      while (nextChildElement !== CLOSED) {
        i++;
        if (i > 50) {
          console.error("error occured during parsing children : infinitely looping!");
          break;
        }
        nextChildElement = recursivelyParseHTML();
        if (nextChildElement) children.push(nextChildElement);
      }

      if (!tagName && !children) return;
      if (children.length === 1) children = children.flat();
      return children.length > 0
        ? { tagName: tagName, ...attributesObj, children: children }
        : { tagName: tagName, ...attributesObj };
    }
  };

  return recursivelyParseHTML();
}

export function parseVDOMTreeToDOMTree(VDOMTree) {
  if (!VDOMTree) return;
  if (typeof VDOMTree === "string") return VDOMTree;
  const { tagName, className, text, children, ...attributes } = VDOMTree;
  let childElements = VDOMTree.children?.map((child) => parseVDOMTreeToDOMTree(child));
  if (childElements) childElements = childElements.flat();
  if (tagName) {
    const element = createElement(tagName, className, attributes, text);
    if (Object.keys(attributes).includes("ref")) attributes.ref.current = element;
    if (childElements) element.append(...childElements);
    return element;
  } else return childElements || "";
}

export function generateUniqueID(existingIDs) {
  let newID;
  while (existingIDs.find((id) => id === newID)) newID = Math.random().toString();
  return newID;
}
