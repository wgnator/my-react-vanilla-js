import useCustomHook from "./customHook.js";
import { MyReact } from "./MyReact.js";
import { parseRenderTreeToDOM, parseHTMLToRenderTree } from "./utils.js";

export default function FetchPage({ navigateTo }) {
  const [dogImageURL, setDogImageURL] = MyReact.useState();
  const { user } = useCustomHook();

  MyReact.useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => {
        return res.json();
      })
      .then((data) => setDogImageURL(data.message));
  }, []);

  const renderTree = parseHTMLToRenderTree`
  <div class="Container">
    <div class="dog_name">name: ${user?.results[0].name.first}</div>
    <img src="${dogImageURL}" alt="" class="dog_photo" />
    <div><button onclick="${() => navigateTo("/")}">go back to main page</button></div>
  </div>
  `;
  return {
    render: () => (dogImageURL ? parseRenderTreeToDOM(renderTree) : ""),
  };
}
