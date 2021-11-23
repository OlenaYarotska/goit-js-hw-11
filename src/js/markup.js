import { refs } from '../index';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

export function markup(images) {
  const gallerySearch = images.data.hits;
  const galleryMarkup = gallerySearch.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `<div class="photo-gallery">
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

  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
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
