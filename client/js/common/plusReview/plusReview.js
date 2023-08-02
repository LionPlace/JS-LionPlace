import {
  attr,
  clearContents,
  deleteStorage,
  getNode,
  getNodes,
  getRandom,
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

/* --------------------------- input 입력 시 label 제거 -------------------------- */
// 제목 입력
const madeTitleInput = getNode('#madeTitle');
const titleLabel = getNode('.titleLabel');

madeTitleInput.addEventListener('focusin', () => {
  titleLabel.style.display = 'none';
}); // focus 받았을 때

madeTitleInput.addEventListener('focusout', () => {
  if (!madeTitleInput.value) {
    titleLabel.style.display = 'block';
  }
}); // focus 빠졌을 때

// 리스트 설명
const madeListInput = getNode('#madeList');
const listLabel = getNode('.listLabel');

madeListInput.addEventListener('focusin', () => {
  listLabel.style.display = 'none';
}); // focus 받았을 때

madeListInput.addEventListener('focusout', () => {
  if (!madeListInput.value) {
    listLabel.style.display = 'block';
  }
}); // focus 빠졌을 때

/* ------------------------------ input 글자 수 세기 ----------------------------- */

const charCountTitle = getNode('.charCountTitle');
const charCountlist = getNode('.charCountList');

madeTitleInput.addEventListener('input', () => {
  const inputTitle = madeTitleInput.value;
  const charCount = inputTitle.length > 20 ? 20 : inputTitle.length;
  charCountTitle.textContent = `${charCount}/20`;
  madeTitleInput.value = inputTitle.slice(0, 20);
});

madeListInput.addEventListener('input', () => {
  const inputList = madeListInput.value;
  const charCount = inputList.length > 100 ? 100 : inputList.length;
  charCountlist.textContent = `${charCount}/100`;
  madeListInput.value = inputList.slice(0, 100);
});

/* --------------------------------- 랜덤 이미지 --------------------------------- */

const randomImg = [
  'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/3789885/pexels-photo-3789885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1586942/pexels-photo-1586942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/4047217/pexels-photo-4047217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,',
  'https://images.pexels.com/photos/10607993/pexels-photo-10607993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
];

const changeCoverBtn = getNode('.changeCoverBtn');
const plusReviewBox = getNode('.plusReviewBox');

let num = 0;

changeCoverBtn.addEventListener('click', () => {
  num = getRandom(randomImg.length - 1);

  const randomCover = randomImg[num];

  plusReviewBox.style.backgroundImage = `url('${randomCover}')`;
});

/* ------------------------------- data 보내기 ------------------------------ */
const user = tiger.get('http://localhost:3000/data');
const res = await user;

const plusReviewBtn = getNode('.plusReviewBtn');

// console.log(plusReviewBtn);
const plusTheme = {
  'title': '',
  'list': '',
  'coverimg': '',
};

const currentLion = {...res.data[0]};
// console.log(currentLion.theme);

plusReviewBtn.addEventListener('click', () => {
  const inputTitle = madeTitleInput.value;
  const inputList = madeListInput.value;
  const imgUrl = randomImg[num];
  // const plusReviewBox = getNode('.plusReviewBox');

  if (!inputTitle || !attr(plusReviewBox, 'style')) {
    alert('제목과 커버는 필수로 변경해 주세요!');
    return;
  }

  plusTheme.title = inputTitle;
  plusTheme.list = inputList;
  plusTheme.coverimg = imgUrl;

  currentLion.theme.push(plusTheme);
  tiger.put('http://localhost:3000/data/1', currentLion);
});
