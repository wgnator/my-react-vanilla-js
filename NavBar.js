import { parseHTMLToVDOMTree } from "./utils.js";

export default function NavBar() {
  return parseHTMLToVDOMTree`
  <div class="NavBar">
    <h1 class="title">MyReactJS</h1>
    <div class="user_info">
      <div class="avatar">user</div>
    </div>
  </div>;
  `;
}
