import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";


const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let userRequest = '';
let totalHits;



searchForm.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onClick);

loadMore.classList.add('is-hidden');

 async function apiSearch(name, page) {
  const api = `https://pixabay.com/api/?key=24368394-ccc0003f8191eae78e1f7d910&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=30&page=${page}`;
  return await axios.get(api);
};


function onSubmit(event) {
  event.preventDefault();
  userRequest = event.currentTarget.elements.searchQuery.value.trim();
  loadMore.classList.add('.is-hidden');
  gallery.innerHTML = '';
  page = 1;

  if (userRequest === '') {
    return Notify.failure('Please type your request')
  };
 event.target.reset();
  apiSearch(userRequest, page).then(res => {
    const responseGallery = res.data.hits;
    totalHits = res.data.totalHits;

    if (responseGallery.length === 0) {
      loadMore.classList.add('.is-hidden');
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      
    }
    
      Notify.success(`Hooray! We found ${totalHits} images.`);
      markup(res);
      loadMore.classList.remove('.is-hidden');
      endOfGallery(page, totalHits);
      
      page += 1;
    });  
};

function markup(images) {
  const gallerySearch = images.data.hits;
  const galleryMarkup = gallerySearch.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
  `<div class="photo-gallery">
  <a class="img-ref" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes <span class="img-info">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <span class="img-info">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class="img-info">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class="img-info">${downloads}</span></b>
    </p>
  </div>
</div>`
  ).join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
  lightbox.refresh();

  const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function endOfGallery(page, totalHits) {
  if (page * 40 >= totalHits) {
    loadMore.classList.add('.is-hidden');
    Notify.success("We're sorry, but you've reached the end of search results.");
  }
}
  
function onClick() {
  apiSearch(userRequest, page).then(res => {
    markup(res);
  endOfGallery(page, totalHits);
  page += 1;
});
}

