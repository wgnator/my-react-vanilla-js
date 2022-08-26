import { parseHTMLToRenderTree } from "./utils.js";

export default function BreweryItem({ data }) {
  return parseHTMLToRenderTree`
    <div class="brewery_item">
      Name: ${data?.name}
      Street: ${data?.street}
      Phone No.: ${data?.phone}
    </div>
  `;
}
