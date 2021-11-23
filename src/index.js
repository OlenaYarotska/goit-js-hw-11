import './css/styles.css';
import { Notify } from 'notiflix';

import { apiSearch } from './js/apiSearch';
import { markup } from './js/markup';

export const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
const message = {
  noImagesFound: 'Sorry, there are no images matching your search query. Please try again.',
  maxImgReached: "We're sorry, but you've reached the end of search results.",
  searchrequestIsEmpty: 'Please type your request',
}

let userRequest = '';
let totalHits;
let page = 1;

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onClick);


function hideBtn(){
refs.loadMore.classList.add('is-hidden'); 
};

hideBtn();

function incrementPage() {
  page += 1;
}

function onSubmit(event) {
  event.preventDefault();

  userRequest = event.currentTarget.elements.searchQuery.value.trim();
   hideBtn();
  refs.gallery.innerHTML = '';
  page = 1;

  if (userRequest === '') {
    return Notify.failure(message.searchrequestIsEmpty)
  };
 event.target.reset();
  apiSearch(userRequest , page).then(res => {
    const responseGallery = res.data.hits;
    totalHits = res.data.totalHits;

    if (responseGallery.length === 0) {
       hideBtn();
      return Notify.failure(message.noImagesFound); 
    }

      Notify.success(`Hooray! We found ${totalHits} images.`);
      markup(res);
      refs.loadMore.classList.remove('is-hidden');
      endOfGallery(page, totalHits);
    incrementPage();
    });     
};
  
function endOfGallery(page, totalHits) {
  if (page * 40 >= totalHits) {
     hideBtn();
    Notify.success(message.maxImgReached);
  }
}
  
function onClick() {
  apiSearch(userRequest, page).then(res => {
    markup(res);
  endOfGallery(page, totalHits);
    incrementPage();
});
}

