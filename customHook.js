import { MyReact } from "./MyReact.js";

export default function useCustomHook() {
  const [user, setUser] = MyReact.useState();

  const getUser = () => {
    fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => window.alert("getUser error:", error.message));
  };

  MyReact.useEffect(() => {
    getUser();
  }, []);

  return { user, getUser };
}
