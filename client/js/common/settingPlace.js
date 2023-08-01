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
  const authUser = resF.data.filter(e => e.userId === 'lion')[0];

  return authUser;
}
const authUser = await fetching();

console.log(authUser.interest);

// 선택한 관심지역 리스트
function renderSelectPlaceTamplate(interestArr, interestList) {
  const templtate = /* html */ `
    <li>
      <button class="interestBtn mb-[8px] flex w-full items-center justify-between rounded-[8px] -bg--lion-primary px-[12px] py-[14px] text-white" >
        <span class="flex items-center gap-[4px]" ><img class="h-[14px] w-[10px]" src="../assets/feed/icon-group-white.png" alt="위치" /></span >
        <span n class="flex gap-[8px]" ><img src="../assets/feed/icon-triangle-white.png" alt="순서" /><img src="../assets/feed/icon-close-white.png" alt="삭제" /></span>
      </button>
    </li>
`;
  return templtate;
}

function renderSelectPlaceRender() {
  const interestBtn = getNodes('.interestBtn');
  const interestList = getNodes('.interestList');
  const checkImg = getNodes('.interestBtn span img');
  const checkImgArr = [
    'http://localhost:5500/assets/feed/icon-plus.png',
    'http://localhost:5500/assets/feed/icon-check.png',
  ];
  let interestTextArr = [];
  const placeRenderBox = getNode('.placeRenderBox');
  let interestArr = [];

  interestBtn.forEach((e, inedx) =>
    e.addEventListener('click', () => {
      interestList[inedx].classList.toggle('is-active');

      checkImg[inedx].src = interestList[inedx].classList.contains('is-active')
        ? checkImgArr[1]
        : checkImgArr[0];

      if (interestList[inedx].classList.contains('is-active')) {
        interestTextArr.push(interestBtn[inedx].textContent.trim());
        interestArr.push(e);
      } else {
        interestTextArr = interestTextArr.filter(j => j !== interestBtn[inedx].textContent.trim());
        interestArr = interestArr.filter(j => j !== e);
      }
      insertLast(placeRenderBox, renderSelectPlaceTamplate(interestArr, interestList));
    }),
  );
}

renderSelectPlaceRender();
