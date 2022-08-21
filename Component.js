import createElement from "./createElement.js";
import { MyReact } from "./MyReact.js";

export default function Component() {
  console.log("Fetching Page Called");
  const [data, setData] = MyReact.useState();
  const Container = createElement("img");
  Container.src = data;
  MyReact.useEffect(() => {
    console.log("fetching...");
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => setData(data.message));
  }, []);

  return {
    render: () => (data ? Container : ""),
  };
}
