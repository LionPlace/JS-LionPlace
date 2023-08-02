/*

추가 할 일

1. 입력값이 없을 때 메세지 창 띄우기 ( 클릭함수 작동하지 못하게 하기 )
2. 아이디가 없으면 존재하지 않는 아이디라는 메세지 창 띄우기
3. 해당 아이디 값과 그 아이디의 비밀번호가 틀리면 틀리다는 메세지 창 띄우기
4. 아이디 비밀번호가 틀렸을 때 마이크로 애니메이션 추가
5. 틀린 입력값을 다 지웠을 때 에러메세지 지우기

*/

import {getNode, tiger} from '../../lib/index.js';

// 변수

const idInput = getNode('.login-id-input');
const pwInput = getNode('.login-pw-input');
const loginBtn = getNode('.login-btn');

// 함수

// 아이디 정규식 - 영문 대소문자와 숫자 0-9만 허용하는 최소3글자 이상 16글자 이하 id
function idReg(text) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{3,16}$/;
  return re.test(String(text));
}

// 비밀번호 정규식
function pwReg(text) {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,16}$/;
  return re.test(String(text).toLowerCase());
}

// 임의의 unique ID 값 설정
localStorage.setItem('uniqueID', 'asdfQWERTY');

// 입력한 값과 data 의 값 비교,
async function handleLogin(e) {
  e.preventDefault();
  const response = await tiger.get('http://localhost:3000/data');
  const data = response.data;
  const user = data.find(item => item.userId === idInput.value);
  const registerId = user.userId;
  const registerPw = user.password;
  if (idInput.value === registerId && pwInput.value === registerPw) {
    const registerUnique = user.uniqueID;
    if (registerUnique === localStorage.getItem('uniqueID')) {
      window.location.href = './views/start.html';
    }
  }
}

loginBtn.addEventListener('click', handleLogin);

// 아이디 입력할 때마다 정규식 검사
function handleId() {
  if (idReg(idInput.value)) {
    idInput.classList.remove('is--invalid');
  } else {
    idInput.classList.add('is--invalid');
  }
}

idInput.addEventListener('input', handleId);

// 비밀번호 입력할 때마다 정규식 검사
function handlePw() {
  if (pwReg(pwInput.value)) {
    pwInput.classList.remove('is--invalid');
  } else {
    pwInput.classList.add('is--invalid');
  }
}

pwInput.addEventListener('input', handlePw);
