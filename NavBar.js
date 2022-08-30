import Dropdown from "./Dropdown.js";
import { render, useState } from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";

export default function NavBar() {
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);

  return parseHTMLToVDOMTree`
  <div class="NavBar">
    <h1 class="title">MyReactJS</h1>
    <div class="user_info">
      <div class="avatar" onclick="${() => setIsShowingDropdown(!isShowingDropdown)}">user</div>
    </div>
    ${
      isShowingDropdown &&
      render(Dropdown, {
        children: parseHTMLToVDOMTree`
        <>
          <div>My Profile</div>
          <div>Logout </div>
        </>
    `,
      })
    }
  </div>
  `;
}
