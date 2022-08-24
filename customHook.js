import { MyReact } from "./MyReact.js";

export default function useCustomHook() {
  const [user, setUser] = MyReact.useState();

  const getUser = () => {
    return fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => window.alert(error));
  };

  MyReact.useEffect(() => {
    getUser();
  }, []);

  return { user, getUser };
}
