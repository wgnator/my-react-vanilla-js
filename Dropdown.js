import { parseHTMLToVDOMTree } from "./utils.js";

export default function Dropdown({ children }) {
  return parseHTMLToVDOMTree`
  <div class="dropdown_container">
    ${children}
  </div>
  `;
}
