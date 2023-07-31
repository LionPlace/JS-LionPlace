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
  <div class='review-card'>
    <div class="relative parent mb-5">
        <figure class="flex items-center">
        <div class="mr-[6px] rounded-[50%] -bg--lion-lightblue-400 p-2">
          <img src="./../assets/map/Icon/Group.png" alt="" />
        </div>
        <figcaption class="-text--lion-label-small -text--lion-lightblue-400">NO.${(i += 1)}</figcaption>
          </figure>
          <section class="relative mt-3 bg-white">
        <img class="w-full  " src=${photo} alt="가게 사진" />
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
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const userData = response.data;
  //   console.log(userData.visited[0]);
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
      renderReviewCard(reviewCardInner, data);
    }
  });
  //* 삭제 버튼 토글
  const deleteButton = getNodes('.delete-button');
  function toggleDeleteButton() {
    deleteButton.forEach(button => {
      toggleClass(button, 'hidden');
    });
  }
  editButton.addEventListener('click', toggleDeleteButton);
  //* 리뷰 클릭시 삭제
  function deleteReview() {
    const parentElement = this.closest('.parent');
    const changeTheme = {
      theme: [],
    };
    parentElement.remove();
    // tiger.put('http://localhost:3000/data/1', {...userData, ...changeTheme});
    // console.log(userData);
  }
  deleteButton.forEach(button => {
    button.addEventListener('click', deleteReview);
  });
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
  editButton.addEventListener('click', editReviewCard);
}
renderReview();

//* 리뷰카드 렌더링 렌더링 함수

//* 테마 제목 및 설명 템플릿 함수

function createThemeTitle({title, description, url}) {
  const template = /* html */ `
    <section class="header-inner flex flex-col bg-[url('${url}')] bg-cover bg-center pb-8 -z-10">
      <div class="flex flex-row justify-between px-[10px] py-[14px]">
        <button>
          <img src="./../assets/map/Icon/left.png" alt="뒤로가기" />
        </button>
        <button class="flex flex-row rounded-[50px] -bg--lion-lightblue-300 px-3">
          <img class="py-2" src="./../assets/map/Icon/check.png" alt="저장" />
          <span class="py-3 -text--lion-label-small text-white">저장</span>
        </button>
      </div>
      <div class="theme-summary flex flex-col">
          <div class="theme-title flex flex-col">
            <span class="ml-4 mt-[10px] -text--lion-label-xl text-white">${title}</span>
            <h2 class="ml-4 mt-[14px] -text--lion-label-small text-white">${description}</h2>
          </div>
      </div>
      <button
      class="map-button mr-[22px] mt-[82px] flex gap-1 rounded-[50px] self-end border-[1px] border-white px-4 py-2">
      <img class="my-[4px]" src="./../assets/map/Icon/subway.png" alt="지도" />
      <span class="text-white">지도</span>
    </button>
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
  const URL = 'http://localhost:3000/data';
  const response = await tiger({url: URL});
  const themeData = response.data;
  const [title, description, url] = [
    themeData[0].theme[0].title,
    themeData[0].theme[0].list,
    themeData[0].theme[0].coverimg,
  ];
  const data = {title, description, url};
  renderThemeTitle(themeTitleInner, data);

  //* 지도 바로가기
  const mapButton = getNode('.map-button');

  function moveScrollBottom() {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
  }

  mapButton.addEventListener('click', moveScrollBottom);

  //* 맵 버튼 제거

  function hideMapButton() {
    mapButton.remove();
  }
  editButton.addEventListener('click', hideMapButton);

  //* 커버 변경 버튼 렌더링
  const headerInner = getNode('.header-inner');
  function renderCoverChangeButton(target) {
    const template = /* html */ `
              <button class="mx-auto mt-[82px] flex rounded-[50px] border-[1px] bg-inherit border-white px-3 py-2 z-10">
                  <img src="./../assets/map/Icon/photo.png" alt="" />
                  <span class="ml-1 mt-[2px] text-white">커버변경</span>
              </button>
          `;
    insertLast(target, template);
  }

  function renderCoverChange() {
    renderCoverChangeButton(headerInner);
  }

  editButton.addEventListener('click', renderCoverChange);
  //* 제목, 설명 input 태그로 변경
  //* 기존 제목, 설명 제거
  function removeThemeTitle() {
    const ThemeTitle = getNode('.theme-title');
    ThemeTitle.remove();
  }
  editButton.addEventListener('click', removeThemeTitle);

  //* input 태그 넣기
  const themeSummary = getNode('.theme-summary');
  function createThemeSummary(target) {
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
                        class="mr-[22px] mt-3 self-end -text--lion-label-small text-black"><span
                            class="render-description-length -text--lion-label-small text-white">16</span> /100</span>
      `;
    insertLast(target, template);
  }
  function renderThemeSummary() {
    createThemeSummary(themeSummary);
    //* input 태그 글자수 세기
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
}

renderTheme();

//* 수정하기 버튼 숨기기

function hideButton() {
  editButton.remove();
}
editButton.addEventListener('click', hideButton);

//* 유저 프로필 영역 숨기기
const userProfile = getNode('.user-profile-area');

function hideUserProfile() {
  userProfile.remove();
}

editButton.addEventListener('click', hideUserProfile);

// * 리뷰 데이터 렌더링

function createReviewData() {
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

function renderReviewData(target, data) {
  insertLast(target, createReviewData(data));
}

function renderData() {
  const reviewDataInner = getNode('.review-data-inner');
  renderReviewData(reviewDataInner);
}

editButton.addEventListener('click', renderData);

//* 수정하기 클릭 시 지도 삭제
const map = getNode('.map');

function removeMap() {
  map.remove();
}

editButton.addEventListener('click', removeMap);

// console.log(user)
// tiger.put('http://localhost:3000/data/1', {...userData, ...changeTheme});
// console.log(userData);
