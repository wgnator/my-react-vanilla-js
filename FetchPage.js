import BreweryItem from "./BreweryItem.js";
import useCustomHook from "./customHook.js";
// import { render, useState, useEffect } from "./MyReact.js";
import MyReact from "./MyReact.js";
import { parseHTMLToVDOMTree } from "./utils.js";

export default function FetchPage({ navigateTo }) {
  const [dogImageURL, setDogImageURL] = MyReact.useState();
  const { user } = useCustomHook();
  const [breweries, setBreweries] = MyReact.useState();

  MyReact.useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => {
        return res.json();
      })
      .then((data) => setDogImageURL(data.message));
  }, []);

  MyReact.useEffect(() => {
    fetch("https://api.openbrewerydb.org/breweries")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setBreweries(data.slice(0, 5));
      });
  }, []);

  return parseHTMLToVDOMTree`
  <div class="FetchPage">
    <div><button onclick="${() => navigateTo("/")}">go back to main page</button></div>
    <div class="dog_name">name: ${user?.results[0].name.first}</div>
    <img src="${dogImageURL}" alt="" class="dog_photo" /> 
    <div class="brewing_company_list_container">${breweries?.map((brewery) => {
      return MyReact.render(BreweryItem, { data: brewery });
    })}</div>
  </div>
  `;
}
