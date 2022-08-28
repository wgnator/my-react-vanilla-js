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

// const isInnerText = (index, brokenHTML) => {
//   const closestUpcomingIndexOf = (char, startingArrayIndex, array) => {
//     let piece = array[startingArrayIndex];
//     let offset = Math.max(piece.indexOf(char), 0);
//     while (piece.indexOf(char) < 0) {
//       offset += piece.length;
//       piece = brokenHTML[startingArrayIndex++];
//     }
//     return offset + piece.indexOf(char);
//   };

//   return (
//     closestUpcomingIndexOf("<", index, brokenHTML) < closestUpcomingIndexOf(">", index, brokenHTML)
//   );
// };

export function parseHTMLToVDOMTree(brokenHTML, ...variables) {
  const regexForTagAndTextSelection = /<[\s\S]*?(?=<\/?)/g;
  const regexForAttributes = /[a-z]+="[0-9a-zA-Z=_\-:;/.\[\]\s]+"/g;
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
  let joinedHTML;

  //write variables indexes into html for future parsing
  if (variables) {
    let varIndex = 0;
    joinedHTML = brokenHTML
      .map(
        (HTMLPiece, pieceIndex) =>
          HTMLPiece + (pieceIndex.isEndIndexOf(brokenHTML) ? "" : `[${varIndex++}]`)
      )
      .join("");
  } else joinedHTML = brokenHTML[0];

  //splits html into opening tag + inner text / closing tag
  const htmlArr = joinedHTML.match(regexForTagAndTextSelection);

  function recursivelyParseHTML(htmlArr) {
    console.log(htmlArr);
    if (htmlArr.length < 1) return;
    if (htmlArr[0].match(/<\//)) {
      htmlArr.splice(0, 1);
      return;
    }

    // split into opening tag / inner text
    const currentLevelTagString = htmlArr.splice(0, 1);
    let [openingTag, innerText] = currentLevelTagString[0].split(">");

    const children = [];

    //get tag name
    let tagName = openingTag?.match(/[a-z0-9]+/);
    if (tagName) tagName = tagName[0];
    //get attributes
    let attributesArr, attributesObj;
    if (tagName) {
      attributesArr = openingTag.match(regexForAttributes);
      attributesObj =
        attributesArr?.reduce((prev, curr) => {
          if (curr.match(/=/)) {
            let [attribute, value] = curr.split("=");
            attribute = attribute.replaceAll(/\s/g, "").replace("class", "className");
            if (value.match(/\[[0-9]+\]/)) value = variables[parseInt(value.match(/[0-9]+/)[0])];
            return {
              ...prev,
              [attribute]: typeof value === "string" ? value.replaceAll('"', "") : value,
            };
          } else {
            return { ...prev, [curr]: true };
          }
        }, {}) || [];
    }

    //if has functional child components or array(by mapped) of children
    if (innerText) {
      const matchingVariables = innerText.match(/\[[0-9]+\]/g);
      let indexes;
      if (matchingVariables) {
        console.log("matchingVariables:", matchingVariables, innerText);
        indexes = matchingVariables.map((e) => e.replace("[", "").replace("]", ""));
        indexes.forEach((index) => {
          if (variables[index] instanceof Object) {
            if (variables[index] instanceof Array) children.push(...variables[index]);
            else children.push(variables[index]);
            innerText = innerText.replace(`[${index}]`, "");
          } else innerText = innerText.replace(`[${index}]`, variables[index] ?? "");
        });
        if (indexes[0] === "1") console.log(tagName, innerText, children);
      }
    }

    //remove white spaces between tags
    if (!innerText.replaceAll(" ", "").replaceAll("\n", "")) innerText = null;
    else if (innerText.startsWith("\n")) innerText = innerText.replace("\n", "");

    let childElements;

    //recursively parse children
    //for singleton tags, prevent parsing the next element as child
    if (singletonTags.every((singletonTag) => singletonTag !== tagName))
      do {
        childElements = recursivelyParseHTML(htmlArr);
        if (childElements) children.push(childElements);
      } while (childElements);
    if (!tagName && children.length === 0 && !innerText) return;

    return tagName
      ? {
          tagName: tagName,
          ...attributesObj,
          text: innerText,
          children: children.length > 0 ? children : null,
        }
      : { children: children.length > 0 ? children : null };
  }

  return recursivelyParseHTML(htmlArr);
}

export function parseVDOMTreeToDOMTree(VDOMTree) {
  if (!VDOMTree) return;
  const { tagName, className, text, children, ...attributes } = VDOMTree;
  let childElements = VDOMTree.children?.map((child) => parseVDOMTreeToDOMTree(child));
  if (childElements) childElements = childElements.flat();
  if (tagName) {
    const element = createElement(tagName, className, attributes, text);
    if (Object.keys(attributes).includes("ref")) attributes.ref.current = element;
    if (childElements) element.append(...childElements);
    return element;
  } else return childElements;
}

export function generateUniqueID(existingIDs) {
  let newID;
  while (existingIDs.find((id) => id === newID)) newID = Math.random().toString();
  return newID;
}
