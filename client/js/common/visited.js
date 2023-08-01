import {
  attr,
  getNode,
  getNodes,
  insertFirst,
  insertLast,
  saveStorage,
  tiger,
} from '../../lib/index.js';

// ---------- 방문 페이지 ----------
async function fetching() {
  const user = tiger.get('http://localhost:3000/data/');
  const res = await user;
  const authUser = res.data.filter(e => e.userId === 'lion')[0];

  return authUser;
}
const authUser = await fetching();

// 헤더 템플릿 생성 함수
function createTemplateHeader() {
  // 프로필 리뷰 수
  const reviews = authUser.visited
    .map(e => Object.values(e)[0].reviews.length)
    .reduce((acc, curr) => acc + curr, 0);
  // 프로필 사진 수
  const photo = authUser.visited.map(e => Object.values(e)[0].photo).length;

  return /* html */ `
  <a
  href="#"
  class="absolute right-[20px] top-[12px] rounded-[4px] border px-[4px] -text--lion-paragraph-small"
>
  쿠폰
  <span
    class="absolute right-[-4px] top-[-3px] flex h-[12px] w-[12px] items-center justify-center rounded-full bg-white -text--lion-paragraph-small -text--lion-primary"
  >
    1
  </span>
</a>
<div class="flex justify-center gap-[19px]">
  <a href="#" class="relative block h-[56px] w-[56px] rounded-full bg-white p-[4px]">
    <img
      class="h-full w-full rounded-full"
      src="https://cdn.inflearn.com/public/users/thumbnails/170506/fc3d4883-71b8-4c64-8647-7f79a4499461"
      alt="사용자 이미지"
    />
    <div class="absolute bottom-0 right-0 h-[20px] w-[20px] rounded-full bg-white p-[4px]">
      <img
        class="h-full w-full"
        src="../assets/feed/icon-pencil.png"
        alt="프로필 이미지 수정"
      />
    </div>
  </a>
  <div>
    <div>
      <h2 class="sr-only">피드 페이지 사용자 프로필</h2>
      <a href="#" class="flex -text--lion-label-medium font-semibold">
        ${authUser.userId}
        <img
          class="mb-[4px] ml-[4px] h-[18px] w-[18px]"
          src="../assets/feed/icon-share-white.png"
          alt="공유하기"
        />
      </a>
    </div>
    <ul class="flex">
      <li>
        <a href="#" class="flex flex-col items-center pr-[12px] text-center">
          <span class="-text--lion-paragraph-small">리뷰</span
          ><span class="-text--lion-label-small font-semibold">${reviews}</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-col items-center border-l px-[12px] text-center">
          <span class="-text--lion-paragraph-small">사진</span
          ><span class="-text--lion-label-small font-semibold">${photo}</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-col items-center border-l px-[12px] text-center">
          <span class="-text--lion-paragraph-small">팔로잉</span
          ><span class="-text--lion-label-small font-semibold">0</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-col items-center border-l px-[12px] text-center">
          <span class="-text--lion-paragraph-small">팔로워</span
          ><span class="-text--lion-label-small font-semibold">0</span>
        </a>
      </li>
    </ul>
  </div>
</div>
<div class="mt-[8px] flex gap-[5px]">
  <a
    href="#"
    class="flex items-center gap-[8px] rounded-[8px] -bg--lion-lightblue-800 px-[58px] py-[6px] -text--lion-label-small"
  >
    <img
      class="h-[18px] w-[20px]"
      src="../assets/feed/icon-pencil-white.png"
      alt="리뷰 쓰기"
    />리뷰쓰기
  </a>
  <a
    href="#"
    class="flex flex-1 items-center gap-[8px] rounded-[8px] -bg--lion-lightblue-800 px-[18px] py-[6px] -text--lion-label-small"
  >
    <img src="../assets/feed/icon-mission-white.png" alt="미션" />미션
  </a>
</div>
  `;
}
// 헤더 템플릿 렌더 함수
function renderHeader() {
  const header = getNode('header');
  insertLast(header, createTemplateHeader());
}
renderHeader();

// 방문 템플릿 생성 함수
function isReviewTemplate(hasReviews, info, index) {
  const res = info[index];
  const {month, date, day} = res.visited;
  const [item, ...restItem] = res.buy;
  const title = Object.keys(authUser.visited[index])[0];
  const restProduct = restItem.length ? `외 ${restItem.length} 항목` : '';
  const reviewKeyWord = {...res};

  let totalPrice = item.price;
  restItem.forEach(e => {
    totalPrice += e.price;
  });

  const noReviewItemTemplate = /* html */ `
  <div class="mt-[16px] rounded-[8px] bg-white p-[12px]">
    <div class="flex items-center justify-between">
      <div>
        <span class="visitedTitle -text--lion-label-medium font-semibold">${title}</span>
        <span class="-text--lion-paragraph-small -text--lion-contents-content-tertiary">${month}.${day}.${date}·1번째 방문</span>
      </div>
      <div class="flex items-center">
        <button>
          <img class="h-[18px] w-[18px]" src="../assets/feed/icon-heart.png" alt="좋아요" />
        </button>
        <button>
          <img class="h-[18px] w-[18px]" src="../assets/feed/icon-more.png" alt="더보기" />
        </button>
      </div>
    </div>
    <div>
      <span class="-text--lion-paragraph-small -text--lion-contents-content-tertiary">${item.item}  ${restProduct} · ${totalPrice}원</span>
    </div>
    <div>
      <button class="wirteReview mt-[4px] flex w-full items-center justify-center gap-[8px] rounded-[8px] -bg--lion-blue-800 py-[6px] -text--lion-label-small font-semibold text-white">
        <img src="../assets/feed/icon-pencil-white.png" alt="연필" /> 리뷰쓰기
      </button>
    </div>
  </div>
`;

  const reviewItemTemplate = /* html */ `
  <div class="mt-[16px] rounded-[8px] bg-white p-[12px]">
    <div class="flex items-center justify-between">
      <div>
        <span class="-text--lion-label-medium font-semibold">${title}</span>
        <span class="-text--lion-paragraph-small -text--lion-contents-content-tertiary">${month}.${day}.${date}·1번째 방문</span>
      </div>
      <div class="flex items-center">
        <button>
        <img class="h-[18px] w-[18px]" src="../assets/feed/icon-heart.png" alt="좋아요" />
        </button>
        <button>
          <img class="h-[18px] w-[18px]" src="../assets/feed/icon-more.png" alt="더보기" />
        </button>
      </div>
    </div>
    <div class="mt-[6px] flex gap-[16px]">
      <div>
        <p class="line-clamp-2 w-[168px] overflow-hidden -text--lion-paragraph-small -text--lion-contents-content-secondary">
          ${res.reviews[0]?.content}
        </p>
        <span class="mt-[40px] rounded-[4px] -bg--lion-gray-50 px-[8px] py-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary">😎 트랜디해요</span>
        <span class="mt-[40px] rounded-[4px] -bg--lion-gray-50 px-[8px] py-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary">+2</span>
      </div>
      <img src=${res.photo} class="h-[80x] w-[72px]" alt="비건 베이커리 구떼" />
    </div>
    <div>
      <span class="-text--lion-paragraph-small -text--lion-contents-content-tertiary">${item.item}  ${restProduct} · ${totalPrice}원</span>
    </div>
  </div>
`;

  return hasReviews ? reviewItemTemplate : noReviewItemTemplate;
}

// <span class="mt-[40px] rounded-[4px] -bg--lion-gray-50 px-[8px] py-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary">${tureKeyWordArr[0]}</span>
// <span class="mt-[40px] rounded-[4px] -bg--lion-gray-50 px-[8px] py-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary">✨ +${tureKeyWordArr.length} </span>

// 방문 템플릿 렌더 함수
function insertVisitedItem() {
  const month = authUser.visited.map(e => Object.values(e)[0].visited.month);
  const review = authUser.visited.map(e => Object.values(e)[0].reviews);
  const info = authUser.visited.map(e => Object.values(e)[0]);

  month.forEach((e, index) => {
    const div = getNode(`div[data-month="${e}"]`);

    insertLast(div, isReviewTemplate(review[index].length, info, index));
  });
}

// 월별 컨테이너 요소 생성 함수
function renderVisitedSectionItem(e) {
  const containerTemplate = /* html */ `
    <div  data-month="${e}" class="month">
      <h3 class="mt-[16px] -text--lion-label-medium font-semibold">${e}월 방문</h3>
    </div>
  `;
  return containerTemplate;
}
// 월별 컨테이너 요소 렌더 함수
function insertVisitedSectionItem() {
  const section = getNode('section.visited');
  [...new Set(authUser.visited.map(e => Object.values(e)[0].visited.month))].forEach(e => {
    insertFirst(section, renderVisitedSectionItem(e));
  });
}
insertVisitedSectionItem();
insertVisitedItem();

function saveStorageVisited() {
  const writeBtn = getNodes('.wirteReview');
  writeBtn.forEach((e, index) => {
    e.addEventListener('click', () => {
      const visitedTitle = getNodes('.visitedTitle');
      const clickVisited = visitedTitle[index].textContent;
      saveStorage('visited', clickVisited);
      window.location.href = './addReviews.html';
    });
  });
}
saveStorageVisited();

// 네네 치킨 방문!!!!!
// const visited = {
//   네네치킨: {
//     location: {
//       latitude: 37.55711206891357,
//       longitude: 126.92496156998747,
//       region: {
//         state: '서울시',
//         country: '마포구',
//         town: '서교동',
//       },
//     },
//     bookmark: true,
//     buy: [
//       {
//         item: '허니콤보',
//         price: 32000,
//       },
//     ],
//     reviews: [],
//     theme: [],
//     photo: 'www.gyochon.com',
//     product: '치킨',
//     visited: {
//       year: 2023,
//       month: 8,
//       day: 1,
//       date: '화요일',
//     },
//   },
// };
// authUser.visited.push(visited);
// tiger.put('http://localhost:3000/data/1', {...authUser, ...visited});
