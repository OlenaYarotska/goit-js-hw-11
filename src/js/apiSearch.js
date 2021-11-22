import axios from "axios";

export async function apiSearch(name, page) {
  const api = `https://pixabay.com/api/?key=24368394-ccc0003f8191eae78e1f7d910&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=30&page=${page}`;
  return await axios.get(api);
}
;
