/*

회원가입

아이디 유효성 검사 통과 후 아이디 중복확인 검사
비밀번호 유효성 검사
비밀번호 확인 값 === 비밀번호 확인
이메일 유효성 검사
  -> 다 통과하면 unique ID 생성 후 다 같이 JSON 파일에 넣어주기
      unique ID 만드는 법 : a-z 배열만들기, math.Random 이용해 배열 index 번호 10개 뽑아오기, 조건처리 : 중복 값 처리 ( 결과값 겹치지 않게 )
메인 페이지로 이동

포스트 통신으로 유니크 아이디를 포함한 회원정보 집어넣어주기

*/

import {getNode, tiger} from '../../lib/index.js';

const idInput = getNode('.register-user-id');
const emailInput = getNode('.register-user-email');
const pwInput = getNode('.register-user-pw');
const pwConfirmInput = getNode('.register-user-pw-confirm');
const registerLoginBtn = getNode('.register-login-btn');

let idPass = false;
let pwPass = false;
let pwConfirmPass = false;
let emailPass = false;

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

// 이메일 정규식
function emailReg(text) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

// 아이디 유효성 검사
function idValidation() {
  if (idReg(idInput.value)) {
    idInput.classList.remove('is--invalid');
    idPass = true;
  } else {
    idInput.classList.add('is--invalid');
    idPass = false;
  }
}

idInput.addEventListener('input', idValidation);

// 비밀번호 유효성 검사
function pwValidation() {
  if (pwReg(pwInput.value)) {
    pwInput.classList.remove('is--invalid');
    pwPass = true;
  } else {
    pwInput.classList.add('is--invalid');
    pwPass = false;
  }
}

pwInput.addEventListener('input', pwValidation);

// 비밀번호 확인 검사
function pwConfrim() {
  if (pwInput.value === pwConfirmInput.value) {
    pwConfirmInput.classList.remove('is--invalid');
    pwConfirmPass = true;
  } else {
    pwConfirmInput.classList.add('is--invalid');
    pwConfirmPass = false;
  }
}

pwConfirmInput.addEventListener('input', pwConfrim);

// 이메일 유효성 검사
function emailValidation() {
  if (emailReg(emailInput.value)) {
    emailInput.classList.remove('is--invalid');
    emailPass = true;
  } else {
    emailInput.classList.add('is--invalid');
    emailPass = false;
  }
}

emailInput.addEventListener('input', emailValidation);

// 아이디 중복검사 ( 아이디 입력값 / 기존 있는 모든 아이디 값 비교)
async function multipleIdCheck() {
  const response = await tiger.get('http://localhost:3000/data');
  const data = response.data;
  data.forEach((item) => {
    if (item.userId === idInput.value) {
      alert('이미 사용중인 아이디입니다.');
    }
  });
}

idInput.addEventListener('input', multipleIdCheck);

// 유니크 아이디 생성
function getUniqueId() {
  const uniqueArray = [];
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 10; i += 1) {
    const randomAlphabet = Math.floor(Math.random() * alphabet.length);
    uniqueArray.push(alphabet[randomAlphabet]);
  }
  const uniqueID = uniqueArray.join('');
  return uniqueID;
}

const uniqueKey = getUniqueId();

function sendInfo(id) {
  const userInfo = {
    userId: idInput.value,
    email: emailInput.value,
    password: pwInput.value,
    uniqueID: id,
  };
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

// 실행한 결과값을 변수에 담은 다음에 그 변수이름응ㄹ sendinfo 에 넣어주기

function handleRegister(e) {
  e.preventDefault();
  idValidation();
  pwValidation();
  pwConfrim();
  emailValidation();
  multipleIdCheck();
  if (idPass && pwPass && pwConfirmPass && emailPass) {
    getUniqueId();
    sendInfo(uniqueKey);
    tiger.post('http://localhost:3000/data', {
      userId: idInput.value,
      email: emailInput.value,
      password: pwInput.value,
      uniqueID: uniqueKey,
    });
    window.location.href = './login.html';
  }
}

registerLoginBtn.addEventListener('click', handleRegister);
