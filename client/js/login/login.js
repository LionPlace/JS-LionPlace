/*

1. 아무것도 입력안했을 때 다른 메세지 창 띄우기 ( + 함수 작동 멈추기 )
2. 해당 아이디 값과 그 아이디의 비밀번호가 틀리면 틀리다는 메세지 창 띄우기
3. 아이디가 없으면 존재하지 않는 아이디라는 메세지 창 띄우기 ( + 비밀번호 점검 전에서 멈추기 return? )

로그인

정규식 검사

- 아이디 값 정규식 검사 함수, 일치하지 않는다면, 에러메세지 띄우기
- 비밀번호 값 정규식 검사 함수, 일치하지 않는다면, 에러메세지 띄우기

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

localStorage.setItem('uniqueID','asdfQWERTY');

// 회원가입 했을 때의 아이디값과 입력한 아이디 값이 일치하는지 검사하기
// async, await 을 이용해 data 값을 가져왔다.
// email 값 id 로 바꿔주기
// 비밀번호도 이렇게 검사해주기

// 배열의 원하는 항목만 찾아내는 find 를 사용해서 user id 값을 가지고 있는 배열을 반환받는다. - 이 배열의 아이디, 비밀번호, 유니크아이디.. 다 찾을 수 있겠죠?

async function handleLogin(e) {
  e.preventDefault();
  const response = await tiger.get('http://localhost:3000/data');
  const data = response.data;
  // const user = data.find( (item) => {
  //   return item.userId === idInput.value;}) 줄이면 아래의 한 줄 코드
  const user = data.find(item => item.userId === idInput.value);
  const registerId = user.userId;
  const registerPw = user.password;
  if (idInput.value === registerId && pwInput.value === registerPw) {
    console.log('로그인 성공~');
    const registerUnique = user.uniqueID;
    console.log(registerUnique);
    if (registerUnique === localStorage.getItem('uniqueID')) {
      // window.location.href = './views/start.html';
    }
  }
}

// 로그인 버튼을 눌렀을 때, 입력한 아이디 값과 data의 아이디 값이 같은지 확인, 입력한 비밀번호 값과 data 의 비밀번호 값이 같은지 확인
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

// 똑같이 비밀번호 input 이벤트줘서 입력할때마다 검사하는 거 작성하기
// 아이디 비밀번호 통과하면 최종적으로 unique ID 값 비교해서 성공하면 메인페이지로 이동

function handlePw() {
  if (pwReg(pwInput.value)) {
    pwInput.classList.remove('is--valid');
  } else {
    pwInput.classList.add('is--valid');
  }
}

pwInput.addEventListener('input', handlePw);
