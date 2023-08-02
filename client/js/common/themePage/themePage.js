import {
  attr,
  clearContents,
  deleteStorage,
  getNode,
  getNodes,
  insertFirst,
  insertLast,
  loadStorage,
  saveStorage,
  tiger,
} from './../../../lib/index.js';

/* --------------------------- plusReview 페이지로 보내기 -------------------------- */

const addReviewList = getNode('.addReviewList');
console.log(addReviewList);

addReviewList.addEventListener('click', () => {
  window.location.href = 'http://localhost:5500/views/plusReview.html';
});