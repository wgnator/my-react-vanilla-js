import { parseHTMLToVDOMTree } from "./utils.js";

export default function BreweryItem({ data }) {
  return parseHTMLToVDOMTree`
    <div class="brewery_item">
      Name: ${data?.name}
      Street: ${data?.street}
      Phone No.: ${data?.phone}
    </div>
  `;
}
