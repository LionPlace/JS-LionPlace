import {
  addClass,
  attr,
  clearContents,
  deleteStorage,
  getNode,
  getNodes,
  insertFirst,
  insertLast,
  loadStorage,
  removeClass,
  saveStorage,
  tiger,
} from '../../../lib/index.js';

async function fetching() {
  const user = tiger.get('http://localhost:3000/data');
  const res = await user;
  const authUser = res.data.filter(e => e.userId === 'lion')[0];

  return authUser;
}
const authUser = await fetching();

// 로컬 스토리지
const clickedReview = await loadStorage('visited');
if (clickedReview === null) window.location.href = './visited.html';
const clickedValue = authUser.visited.filter(e => Object.keys(e)[0] === clickedReview)[0][
  clickedReview
];

const locationId = clickedValue.visitedId;

// 방문한 장소 렌더 함수
function renderVistieInfo() {
  const {year, month, date, day} = clickedValue.visited;
  const clickedReviewLocal = getNode('.clickedReviewLocal');
  const clickedReviewDate = getNode('.clickedReviewDate');
  insertLast(clickedReviewLocal, clickedReview);
  insertLast(clickedReviewDate, `${year}.${month}.${day}.(${date[0]}) 1번째 방문`);
}
renderVistieInfo();

// 리뷰 작성
function textaeraValue({value}) {
  saveStorage('reivew', value);
}
// 로컬스토리지 값 불러오기
async function reviewRender() {
  const textatera = getNode('textarea');
  const savedReview = await loadStorage('reivew');
  textatera.value = savedReview;
}
reviewRender();

// 기본 값 설정
const postReviewValue = {...authUser};

const defaultReview = {
  like: false,
  content: null,
  keyword: [
    {
      '💚 원하는 스타일로 잘해줘요': false,
    },
    {
      '💇‍♀️ 스타일 추천을 잘해줘요': false,
    },
    {
      '🌹 고급스러워요': false,
    },
    {
      '😎 트랜디해요': false,
    },
    {
      '🔍 시술이 꼼꼼해요': false,
    },
    {
      '💆‍♀️ 관리법을 잘 알려줘요': false,
    },
    {
      '💆‍♀️ 관리법을 잘 알려줘요': false,
    },
    {
      '😀 친절해요': false,
    },
    {
      '💰 가격이 합리적이에요': false,
    },
    {
      '💵 비싼 만큼 가치가 있어요': false,
    },
    {
      '👍 좋은 제품을 사용해요': false,
    },
    {
      '🚗 주차하기 편해요': false,
    },
  ],
};

// 좋아요 추천인
function recommendPeople() {
  const recommendPeopleSection = getNode('.recommendPeople');
  const template = /* html */ `
  <a href="#" class="relative block h-[56px] w-[56px] rounded-full bg-white p-[4px]">
    <img class="h-full w-full rounded-full" src="https://i.ibb.co/9Vpvp3f/karebbang.png" alt="사용자 이미지" />
    <span class="w-full block text-center -text--lion-paragraph-small">카레빵</span>
  </a>
  `;
  clearContents(recommendPeopleSection);
  insertLast(recommendPeopleSection, template);
  defaultReview.like = !defaultReview.like;
}
function renderRecommendPeople() {
  const likeBtn = getNode('.likeBtn');
  likeBtn.addEventListener('click', () => recommendPeople());
}
renderRecommendPeople();

// 좋아요 키워드
function likeKeywordTemplate() {
  const template = /* html */ `
    <div class="flex w-[660px]">
      <div class="flex flex-col gap-[8px] px-[20px] py-[4px]">
        <div>
          <button data-index='1' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[0],
          )}</button>
        </div>
        <div>
          <button data-index='2' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[1],
          )}</button>
        </div>
        <div>
          <button data-index='3' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[2],
          )}</button>
        </div>
        <div>
            <button data-index='4' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
              defaultReview.keyword[3],
            )}</button>
        </div>
      </div>
      <div class="flex flex-col gap-[8px] px-[20px] py-[4px]">
        <div>
          <button data-index='5' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[4],
          )}</button>
        </div>
        <div>
          <button data-index='6' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[5],
          )}</button>
        </div>
        <div>
          <button data-index='7' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[6],
          )}</button>
        </div>
        <div>
          <button data-index='8' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[7],
          )}</button>
        </div>
      </div>
      <div class="flex flex-col gap-[8px] px-[20px] py-[4px]">
        <div>
          <button data-index='9' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[8],
          )} </button>
        </div>
        <div>
          <button data-index='10' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[9],
          )}</button>
        </div>
        <div>
          <button data-index='11' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[10],
          )}</button>
        </div>
        <div>
          <button data-index='12' class="likeButton rounded-[4px] px-[18px] py-[10px] -text--lion-label-small -shadow--lion-below-low-box-shadow" >${Object.keys(
            defaultReview.keyword[11],
          )}</button>
        </div>
      </div>
    </div>
  `;

  return template;
}
function renderLikeKeyword() {
  const likeKeywordContainer = getNode('.likeKeywordContainer');
  insertLast(likeKeywordContainer, likeKeywordTemplate());
  const likeButton = getNodes('.likeButton');
  likeButton.forEach((e, index) =>
    e.addEventListener('click', () => {
      e.classList.toggle('is-active');
      defaultReview.keyword[index][e.textContent] = !defaultReview.keyword[index][e.textContent];
      const likeBtn = defaultReview.keyword.filter(k => Object.values(k)[0] === true);
      const warningText = getNode('.warningText');

      if (likeBtn) {
        removeClass(warningText, 'is-invalid');
        warningText.textContent = '이 장소에 어울리는 키워드를 골라주세요.';
      }

      // if (likeBtn.length) {
      //   removeClass(warningText, 'is-invalid');
      //   warningText.textContent = 'asdf';
      // }
    }),
  );
}
renderLikeKeyword();

// 랜덤 이미지 추가
// function radomImg() {
//   return ['../assets/feed/h1.jpg'];
// }

function renderBgImg() {
  // const imageArr = radomImg();
  const reviewImgBox = getNode('.reviewBg');
  const reviewImgBtn = getNode('.reviewBg button');

  // const randomImg = imageArr[Math.floor(Math.random() * imageArr.length)];

  reviewImgBtn.addEventListener('click', () => {
    addClass(reviewImgBox, 'h-[260px]');
    addClass(reviewImgBox, `bg-[url(../assets/feed/h1.jpg)]`);
  });

  postReviewValue.visited[locationId - 1][clickedReview].photo[0] = '../assets/feed/h1.jpg';
}
renderBgImg();
// 포스트 등록하기
function postReview() {
  const textatera = getNode('textarea');
  const textLength = getNode('.textLength');
  const submit = getNode('.submitReview');

  textatera.addEventListener('input', () => {
    textLength.textContent = textatera.value.length;
    if (textatera.value.length === 0) {
      addClass(submit, 'is-invalid');
    } else {
      removeClass(submit, 'is-invalid');
    }

    textaeraValue(textatera);
  });

  submit.addEventListener('click', () => {
    postReviewValue.visited[locationId - 1][clickedReview].reviews.push(defaultReview);
    postReviewValue.visited[locationId - 1][clickedReview].reviews[0].content = textatera.value;

    const likeBtn = defaultReview.keyword.filter(e => Object.values(e)[0] === true);
    const warningText = getNode('.warningText');
    if (!likeBtn.length) {
      addClass(warningText, 'is-invalid');
      warningText.textContent = '키워드는 최소 1개 이상 골라주세요!!!';
    } else if (textatera.value.length === 0) {
      alert('리뷰를 입력해주세요!!');
    } else {
      tiger.put('http://localhost:3000/data/1', {...authUser, ...postReviewValue});
      deleteStorage('visited');
      deleteStorage('reivew');
      window.location.href = './visited.html';
    }
  });
}
postReview();
