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

/* ------------------------------ 이전 페이지로 넘어가기 ------------------------------ */

const beforePageBtn = getNode('.beforePageBtn');

beforePageBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:5500/views/themePage.html';
});
