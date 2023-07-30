import {getNode, insertLast} from '../../lib/index.js';

// * 카카오 지도 API
const getInfo = async options => {
  const defaultOptions = {
    method: 'GET',
    body: null,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
  const {url, ...restOptions} = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  const response = await fetch(url, restOptions);

  if (response.ok) {
    response.data = await response.json();
  }

  return response;
};

function renderOverlay(map, storeData) {
  storeData.visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === storeData.theme[0].title) {
      const [latitude, longitude] = [
        visitedPlace[placeName].location.latitude,
        visitedPlace[placeName].location.longitude,
      ];
      const content = `<div style="margin-bottom: 110px;   
            display: inline-flex;
            font-size: 12px;
            align-items: center;
            justify-content: center;
            border-radius: 2rem;
            border-width: 3px;
            border-color: #AAC4FA;
            background-color: #FFFFFF;
            padding-right: 4px;
            padding-left: 2px;">
                <span style="margin-left:4px">${placeName}</span>
            </div>`;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(latitude, longitude),
        content,
      });
      customOverlay.setMap(map);
    }
  });
}

function setBounds(map, storeData) {
  const bounds = new kakao.maps.LatLngBounds();
  storeData.visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === storeData.theme[0].title) {
      const [latitude, longitude] = [
        visitedPlace[placeName].location.latitude,
        visitedPlace[placeName].location.longitude,
      ];
      const position = new kakao.maps.LatLng(latitude, longitude);
      const marker = new kakao.maps.Marker({
        position,
        title: placeName,
      });
      marker.setMap(map);
      bounds.extend(position);
    }
  });
  map.setBounds(bounds);
}

function renderMap(storeData) {
  const container = document.getElementById('map');
  const centerPlace = storeData.visited[0];
  const placeName = Object.keys(storeData.visited[0])[0];
  const [latitude, longitude] = [
    centerPlace[placeName].location.latitude,
    centerPlace[placeName].location.longitude,
  ];
  const options = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);
  setBounds(map, storeData);
  renderOverlay(map, storeData);
}

(async function render() {
  const URL = 'http://localhost:3000/lion';
  const response = await getInfo({url: URL});
  const storeData = response.data;
  renderMap(storeData);
})();

//* 카카오 지도 API

//* 지도 확장 버튼
const expandButton = getNode('.expand-button');

function test() {
  console.log('test');
}

expandButton.addEventListener('click', test);
//* 지도 확장 버튼

//* 스크롤 내리기 버튼
// const mapButton = getNode('.map-button');

// function moveScrollBottom() {
//   window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
// }

// mapButton.addEventListener('click', moveScrollBottom);

// //* 스크롤 내리기 버튼

//* themeEnroll 2page 랜더링

//* 리뷰 카드 템플릿 생성 함수
let i = 0;
function createReviewCard({
  photo,
  year,
  month,
  day,
  date,
  content,
  keyword,
  title,
  totalReview,
  state,
  town,
}) {
  const template = /* html */ `
    <div>
        <figure class="ml-4 py-9 flex items-center">
        <div class="mr-[6px] rounded-[50%] -bg--lion-lightblue-400 p-2">
          <img src="./../assets/map/Icon/Group.png" alt="" />
        </div>
        <figcaption class="-text--lion-label-small -text--lion-lightblue-400">NO.${(i += 1)}</figcaption>
          </figure>
          <section class="mt-3 bg-white">
        <img class="w-full" src=${photo} alt="" />
        <div class="my-6 flex flex-col px-[38px] text-center">
          <div class="flex flex-row justify-center">
            <time
              class="mr-[2px] -text--lion-label-small -text--lion-lightblue-400"
              datetime="2022-11-04"
            >
              ${year.toString().slice(2)}.${month}.${day}${date.slice(2)}
            </time>
            <span
              class="mb-2 rounded-[4px] border-[1px] border-solid -border--lion-lightblue-400 px-1 -text--lion-paragraph-small -text--lion-lightblue-400"
              >방문</span
            >
          </div>
          <p class="line-clamp-3 text-justify -text--lion-paragraph-small">
            ${content}
          </p>
          <div class="mt-2 flex justify-center gap-1">
            <figure class="flex rounded bg-gray-50 px-1 py-[2px]">
              <img src="./../assets/map/Icon/clock.png" alt="시계" />
              <figcaption
                class="ml-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary"
              >
                ${keyword[0]}
              </figcaption>
            </figure>
            <span
              class="rounded bg-gray-50 px-2 py-[2px] -text--lion-paragraph-small -text--lion-contents-content-secondary"
              >+${keyword.length}</span
            >
          </div>
        </div>
        <div class="border-t border-dashed px-5 py-3 -text--lion-label-medium">
          <h2>${title}</h2>
          <span
            class="-text--lion-label-small -text--lion-contents-content-secondary after:ml-1 after:content-['|']"
            >리뷰 ${totalReview}</span
          >
          <span class="-text--lion-label-small -text--lion-contents-content-secondary"
            >${state} ${town}</span
          >
        </div>
          </section>
    </div>
    `;

  return template;
}

//* 리뷰카드 렌더링 함수
function renderReviewCard(target, data) {
  insertLast(target, createReviewCard(data));
}
const reviewCardInner = getNode('.review-card-inner');

async function renderReview() {
  const URL = 'http://localhost:3000/lion';
  const response = await getInfo({url: URL});
  const userData = response.data;
  //   console.log(userData.visited[0]);
  userData.visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === userData.theme[0].title) {
      const [photo, year, month, day, date, content, keyword, state, town] = [
        visitedPlace[placeName].phto,
        visitedPlace[placeName].visited.year,
        visitedPlace[placeName].visited.month,
        visitedPlace[placeName].visited.day,
        visitedPlace[placeName].visited.date,
        visitedPlace[placeName].reviews[0].content,
        visitedPlace[placeName].reviews[0].keyword,
        visitedPlace[placeName].location.region.state,
        visitedPlace[placeName].location.region.town,
      ];
      const data = {
        photo,
        year,
        month,
        day,
        date,
        content,
        keyword,
        title: placeName,
        totalReview: 5,
        state,
        town,
      };
      renderReviewCard(reviewCardInner, data);
    }
  });
}

renderReview();

//* 리뷰카드 렌더링 렌더링 함수

//* 테마 제목 및 설명 템플릿 함수

function createThemeTitle({title, description}) {
  const template = /* html */ `
    <section class=" bg-[url('./../assets/map/reviewPost.png')] bg-cover bg-center pb-8 -z-10">
      <div class="flex flex-row justify-between px-[10px] py-[14px]">
        <button>
          <img src="./../assets/map/Icon/left.png" alt="뒤로가기" />
        </button>
        <button class="flex flex-row rounded-[50px] -bg--lion-lightblue-300 px-3">
          <img class="py-2" src="./../assets/map/Icon/check.png" alt="등록" />
          <span class="py-3 -text--lion-label-small text-white">등록</span>
        </button>
      </div>
      <div class="flex flex-col">
        <span class="ml-4 mt-[10px] -text--lion-label-xl text-white">${title}</span>
        <h2 class="ml-4 mt-[14px] -text--lion-label-small text-white">${description}</h2>
        <button
          class="map-button mr-[22px] mt-[88px] flex gap-1 self-end rounded-[50px] border-[1px] border-white px-4 py-2">
          <img class="my-[4px]" src="./../assets/map/Icon/subway.png" alt="지도" />
          <span class="text-white">지도</span>
        </button>
      </div>
    </section>
    `;

  return template;
}

//* 테마 제목 및 설명 렌더링 함수
function renderThemeTitle(target, data) {
  insertLast(target, createThemeTitle(data));
}

const themeTitleInner = getNode('.theme-title-inner');
async function renderTheme() {
  const URL = 'http://localhost:3000/lion';
  const response = await getInfo({url: URL});
  const themeData = response.data;
  const [title, description, url] = [
    themeData.theme[0].title,
    themeData.theme[0].list,
    themeData.theme[0].coverimg,
  ];
  const data = {title, description, url};
  renderThemeTitle(themeTitleInner, data);
  //   console.log(title, description, url);
}

renderTheme();
