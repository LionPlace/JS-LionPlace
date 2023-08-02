import {getNode, getNodes, insertLast, tiger, toggleClass} from '../../lib/index.js';

const editButton = getNode('.edit-button');

// * 카카오 지도 API
function renderOverlay(map, userData) {
  userData[0].visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === userData[0].theme[0].title) {
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

function setBounds(map, userData) {
  const bounds = new kakao.maps.LatLngBounds();
  userData[0].visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === userData[0].theme[0].title) {
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

function renderMap(userData) {
  const container = document.getElementById('map');
  const centerPlace = userData[0].visited[0];
  const placeName = Object.keys(userData[0].visited[0])[0];
  const [latitude, longitude] = [
    centerPlace[placeName].location.latitude,
    centerPlace[placeName].location.longitude,
  ];
  const options = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);
  setBounds(map, userData);
  renderOverlay(map, userData);
}

(async function getUserInfo() {
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  renderMap(userData);
})();

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
  <div class='review-card'>
    <div class="relative parent mb-5">
        <figure class="flex items-center">
        <div class="mr-[6px] rounded-[50%] -bg--lion-lightblue-400 p-2">
          <img src="./../assets/map/Icon/Group.png" alt="" />
        </div>
        <figcaption class="-text--lion-label-small -text--lion-lightblue-400">NO.${(i += 1)}</figcaption>
          </figure>
          <section class="relative mt-3 bg-white">
        <img class="w-full h-[250px]" src=${photo} alt="가게 사진" />
        <img class="delete-button absolute right-[-8px] top-[-6px] hidden" src="./../assets/map/Icon/close.png" alt="삭제 버튼" />
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
              >+${keyword.length - 1}</span
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
    </div>
    `;

  // const deleteButton = getNodes('.deleteButton');
  return template;
}

//* 리뷰 카드 DOM 삽입 함수
function insertReviewCard(target, data) {
  insertLast(target, createReviewCard(data));
}

//* 삭제 버튼 토글
function toggleDeleteButton(deleteButton) {
  deleteButton.forEach(button => {
    toggleClass(button, 'hidden');
  });
}

//* 수정 버튼 클릭 시 이벤트리스너 등록
function clickEditButton(func) {
  const changeButton = getNode('.edit-button');
  changeButton.addEventListener('click', func);
}

//* 삭제 버튼 클릭 시 리뷰 제거
function deleteReview() {
  const parentElement = this.closest('.parent');
  parentElement.remove();
}

function ClickDeleteButton(deleteButton) {
  deleteButton.forEach(button => {
    button.addEventListener('click', deleteReview);
  });
}

//* 리뷰 순서 변경
function editReviewCard() {
  const reviewCard = getNodes('.review-card');
  reviewCard.forEach(card => {
    new Sortable(card, {
      group: 'shared',
      animation: 150,
      ghostClass: 'blue-background-class',
    });
  });
}

// * 리뷰카드 랜더링 함수
async function renderReviewCard() {
  const reviewCardInner = getNode('.review-card-inner');
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  userData[0].visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === userData[0].theme[0].title) {
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
      insertReviewCard(reviewCardInner, data);
    }
  });
  const deleteButton = getNodes('.delete-button');

  function toggleButton() {
    toggleDeleteButton(deleteButton);
  }

  clickEditButton(toggleButton);

  //* 리뷰 클릭시 삭제
  ClickDeleteButton(deleteButton);

  //* 리뷰 순서 변경
  clickEditButton(editReviewCard);
}
renderReviewCard();

//* 헤더 영역 템플릿 생성함수

function createThemeHeader({title, description, url}) {
  const template = /* html */ `
    <section class="header-inner flex flex-col bg-[url('${url}')] bg-cover bg-center pb-8 -z-10">
      <div class="flex flex-row justify-between px-[10px] py-[14px]">
        <button>
          <img src="./../assets/map/Icon/left.png" alt="뒤로가기" />
        </button>
        <button class="save-button flex flex-row rounded-[50px] -bg--lion-lightblue-300 px-3">
          <img class="py-2" src="./../assets/map/Icon/check.png" alt="저장" />
          <span class="py-3 -text--lion-label-small text-white">저장</span>
        </button>
      </div>
      <div class="theme-summary flex flex-col">
          <div class="theme-title flex flex-col">
            <span class="ml-4 mt-[10px] -text--lion-label-xl text-white">${title}</span>
            <h2 class="ml-4 mt-[30px] -text--lion-label-small text-white">${description}</h2>
          </div>
      </div>
      <button
      class="map-button mr-[22px] mt-[104px] flex gap-1 rounded-[50px] self-end border-[1px] border-white px-4 py-2">
      <img class="my-[4px]" src="./../assets/map/Icon/subway.png" alt="지도" />
      <span class="text-white">지도</span>
    </button>
    </section>
    `;

  return template;
}

//* 헤더 영역 DOM 삽입
function insertThemeHeader(target, data) {
  insertLast(target, createThemeHeader(data));
}

//* 지도 바로가기
function moveScrollBottom() {
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}

function clickMapButton(mapButton) {
  mapButton.addEventListener('click', moveScrollBottom);
}

//* 지도 버튼 삭제
function removeMapButton(mapButton) {
  mapButton.remove();
}

//* 기존 제목, 설명 제거
function removeThemeTitle(themeTitle) {
  themeTitle.remove();
}

function createCoverChangeButton() {
  const template = /* html */ `
  <button class="mx-auto mt-[82px] flex rounded-[50px] border-[1px] bg-inherit border-white px-3 py-2 z-10">
      <img src="./../assets/map/Icon/photo.png" alt="" />
      <span class="ml-1 mt-[2px] text-white">커버변경</span>
  </button>
  `;

  return template;
}
function insertCoverChangeButton(target) {
  insertLast(target, createCoverChangeButton());
}

function renderCoverChangeButton() {
  const headerInner = getNode('.header-inner');
  insertCoverChangeButton(headerInner);
}

function createEditReview({
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
  <div class='review-card'>
    <div class="relative parent mb-5">
        <figure class="flex items-center">
        <div class="mr-[6px] rounded-[50%] -bg--lion-lightblue-400 p-2">
          <img src="./../assets/map/Icon/Group.png" alt="" />
        </div>
        <figcaption class="-text--lion-label-small -text--lion-lightblue-400">NO.${(i += 1)}</figcaption>
          </figure>
          <section class="relative mt-3 bg-white">
        <img class="w-full h-[250px]" src=${photo} alt="가게 사진" />
        <img class="delete-button absolute right-[-8px] top-[-6px] hidden" src="./../assets/map/Icon/close.png" alt="삭제 버튼" />
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
              >+${keyword.length - 1}</span
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
    </div>
    `;

  // const deleteButton = getNodes('.deleteButton');
  return template;
}

function insertEditReview(target, data) {
  insertLast(target, createEditReview(data));
}

async function renderEditReview() {
  const reviewCardInner = getNode('.review-card-inner');
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  userData[0].visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
    if (visitedPlace[placeName].theme.toString() === userData[0].theme[0].title) {
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
      insertEditReview(reviewCardInner, data);
    }
  });
}

//*

function createEditThemeHeader({title, description, url}) {
  const template = /* html */ `
    <section class="header-inner flex flex-col bg-[url('${url}')] bg-cover bg-center pb-8 -z-10">
      <div class="flex flex-row justify-between px-[10px] py-[14px]">
        <button>
          <img src="./../assets/map/Icon/left.png" alt="뒤로가기" />
        </button>
        <button class="save-button flex flex-row rounded-[50px] -bg--lion-lightblue-300 px-3">
          <img class="py-2" src="./../assets/map/Icon/check.png" alt="저장" />
          <span class="py-3 -text--lion-label-small text-white">저장</span>
        </button>
      </div>
      <div class="theme-summary flex flex-col">
          <div class="theme-title flex flex-col">
            <span class="ml-4 mt-[10px] -text--lion-label-xl text-white">${title}</span>
            <h2 class="ml-4 mt-[30px] -text--lion-label-small text-white">${description}</h2>
          </div>
      </div>
      <button
      class="map-button mr-[22px] mt-[104px] flex gap-1 rounded-[50px] self-end border-[1px] border-white px-4 py-2">
      <img class="my-[4px]" src="./../assets/map/Icon/subway.png" alt="지도" />
      <span class="text-white">지도</span>
    </button>
    </section>
    `;

  return template;
}

//* 헤더 영역 DOM 삽입
function insertEditThemeHeader(target, data) {
  insertLast(target, createEditThemeHeader(data));
}
async function renderEditThemeHeader() {
  const editThemeTitleInner = getNode('.edit-theme-title-inner');
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  const [title, description, url] = [
    userData[0].theme[0].title,
    userData[0].theme[0].list,
    userData[0].theme[0].coverimg,
  ];
  const data = {title, description, url};
  insertEditThemeHeader(editThemeTitleInner, data);
}

//* 헤더 영역 렌더링
async function renderThemeHeader() {
  const themeTitleInner = getNode('.theme-title-inner');
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  const [title, description, url] = [
    userData[0].theme[0].title,
    userData[0].theme[0].list,
    userData[0].theme[0].coverimg,
  ];
  const data = {title, description, url};
  insertThemeHeader(themeTitleInner, data);

  const mapButton = getNode('.map-button');
  //* 지도 바로가기
  clickMapButton(mapButton);

  //* 지도 버튼 삭제
  function removeButton() {
    removeMapButton(mapButton);
  }

  clickEditButton(removeButton);

  //* 커버 변경 버튼 렌더링
  clickEditButton(renderCoverChangeButton);

  //* 기존 제목, 설명 제거
  const themeTitle = getNode('.theme-title');

  function removeTitle() {
    removeThemeTitle(themeTitle);
  }

  clickEditButton(removeTitle);

  //* input 태그 템플릿 생성
  function createThemeSummary() {
    const template = /* html */ `
                <input
                    class="input-title bg-transparent mx-4 mt-[10px] -text--lion-label-xl text-white -placeholder--lion-white border-none outline-none"
                    minlength="1" maxlength="20" type="text" placeholder="제목을 입력해 주세요" />
                <span
                    class="mr-[22px] self-end -text--lion-label-small text-black"><span
                        class="render-title-length -text--lion-label-small text-white">11</span>/20</span>
                <input
                        class="input-description bg-transparent mx-4 mt-[14px] -text--lion-label-small text-white -placeholder--lion-white border-none outline-none"
                        minlength="1" maxlength="100" type="text" placeholder="어떤 리스트인지 설명 해주세요" />
                <span
                        class="mr-[22px] self-end -text--lion-label-small text-black"><span
                            class="render-description-length -text--lion-label-small text-white">16</span> /100</span>
      `;
    return template;
  }

  //* input 태그 DOM 삽입
  function insertThemeSummary(target) {
    insertLast(target, createThemeSummary());
  }

  //* input 태그 랜더링
  function renderThemeSummary() {
    const themeSummary = getNode('.theme-summary');
    insertThemeSummary(themeSummary);

    //* input 태그 글자수 세기

    //* 글자수 세기
    const titleInput = getNode('.input-title');
    const renderTitleLength = getNode('.render-title-length');
    function countTitle() {
      const titleLength = titleInput.value.length;
      renderTitleLength.textContent = titleLength;
    }
    const descriptionInput = getNode('.input-description');
    const renderDescriptionLength = getNode('.render-description-length');
    function countDescription() {
      const DescriptionLength = descriptionInput.value.length;
      renderDescriptionLength.textContent = DescriptionLength;
    }
    titleInput.addEventListener('input', countTitle);
    descriptionInput.addEventListener('input', countDescription);
  }

  editButton.addEventListener('click', renderThemeSummary);

  // //* 저장 버튼 클릭시 페이지 다시 렌더링
  const saveButton = getNode('.save-button');
  saveButton.addEventListener('click', renderEditReview);
  function renderUserProfile() {
    const userProfile = getNode('.user-profile-area');
    userProfile.style.display = 'flex';
  }
  function removeThemeTitleInner() {
    themeTitleInner.style.display = 'none';
  }

  saveButton.addEventListener('click', renderUserProfile);
  saveButton.addEventListener('click', removeThemeTitleInner);
  saveButton.addEventListener('click', renderEditThemeHeader);
}

renderThemeHeader();

//* 수정하기 버튼 삭제
function removeEditButton() {
  editButton.style.display = 'none';
}
clickEditButton(removeEditButton);

//* 유저 프로필 영역 삭제
function hideUserProfile() {
  const userProfile = getNode('.user-profile-area');
  userProfile.style.display = 'none';
}

clickEditButton(hideUserProfile);

// * 리뷰 네비게이션 바 템플릿 생성
function createReviewNav() {
  const template = /* html */ `
  <div class="ml-4 mr-7 mt-[18px] flex items-center justify-between">
    <div class="flex items-center gap-1 text-center">
        <h2 class="-text--lion-label-medium">리뷰</h2>
        <span class="-text--lion-label-medium -text--lion-info-error">2<span
        class="-text--lion-contents-content-tertiary">/10</span></span>
    </div>
    <ul class="flex gap-1 pt-1 -text--lion-label-small -text--lion-contents-content-secondary">
        <li class="after:ml-1 after:content-['|']">임시저장</li>
        <li>전체삭제</li>
    </ul>
</div>
    `;

  return template;
}

//* 리뷰 네비게이션 바 DOM 삽입
function insertReviewNav(target, data) {
  insertLast(target, createReviewNav(data));
}

//* 리뷰 네비게이션 바 렌더링
function renderReviewNav() {
  const reviewDataInner = getNode('.review-nav-inner');
  insertReviewNav(reviewDataInner);
  const saveButton = getNode('.save-button');
  function removeReviewNav() {
    reviewDataInner.style.display = 'none';
  }
  function displayEditButton() {
    editButton.style.display = 'flex';
  }
  saveButton.addEventListener('click', removeReviewNav);
  saveButton.addEventListener('click', displayEditButton);
  saveButton.addEventListener('click', toggleDeleteButton);
}

clickEditButton(renderReviewNav);

//* 수정하기 클릭 시 지도 삭제

function removeMap() {
  const map = getNode('.map');
  map.remove();
}

clickEditButton(removeMap);

// * 저장 버튼 클릭 시 렌더링
