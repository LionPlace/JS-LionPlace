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
const user = tiger.get('http://localhost:3000/data/');
const res = await user;
async function fetching() {
  const userF = tiger.get('http://localhost:3000/data/');
  const resF = await userF;
  const authUser = resF.data.filter(e => e.userId === 'lion1')[0];

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

// 관심 지역
function interestListTemplate(text) {
  return /* html */ `
    <li><button class="h-[36px] w-[54px] rounded-[4px] bg-white">${text}</button></li>
`;
}
function renderInterestList() {
  const location = getNode('.location');

  authUser.interest.forEach(e => insertLast(location, interestListTemplate(e)));
  //
}
renderInterestList();

// 피드 렌더
function feedTemplate(e) {
  const data = e[Object.keys(e)];
  const {visitedUser, visited, photo, reviews} = data;

  const userE = res.data.map(k => [k.userId, k.img]);
  const [user1, user2] = userE;
  console.log(visitedUser);

  return /* html */ `
<div class="px-[16px] py-[8px]">
  <div class="mb-[10px] flex items-center justify-between">
    <a href="#" onclick="location.href='./anotherUserFeed.html'" class="flex items-center gap-[5px] text-left">
      <div>
        <img class="h-[30px] w-[30px] rounded-full" src=${
          visitedUser === 'lion1' ? user1[1] : user2[1]
        } alt="user" />
      </div>
      <div>
        <p class="-text--lion-label-small font-semibold">${visitedUser}</p>
        <p class="-text--lion-label-small font-semibold -text--lion-contents-content-tertiary" > 사진리뷰 2 · ${
          visited.month
        }.${visited.day}.${visited.date} </p>
      </div>
    </a>

    <button button class="rounded-[16px] -bg--lion-primary px-[8px] py-[4px] -text--lion-label-small font-semibold text-white" > 팔로우 </button>
  </div>

  <div class="mb-[8px]">
   <img class="rounded-[8px]" src=${photo[0]} alt="피자" />
  </div>

  <div class="line-clamp-3 h-[53px] -text--lion-label-small -text--lion-contents-content-tertiary" > ${
    reviews[0].content
  }</div>
</div>  
  `;
}
function renderFeed() {
  const visitedData = res.data.map(e =>
    e.visited.filter(j => Object.values(j)[0].reviews.length > 0),
  );
  const allFeed = [...visitedData[0], ...visitedData[1]];

  const feedRender = getNode('.feedRender');
  allFeed.forEach(e => {
    insertLast(feedRender, feedTemplate(e));
  });
}
renderFeed();
