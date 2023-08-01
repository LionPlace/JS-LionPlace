/*

회원가입

아이디 유효성 검사 통과 후 아이디 중복확인 검사
비밀번호 유효성 검사
비밀번호 확인 값 === 비밀번호 확인
이메일 유효성 검사
  -> 다 통과하면 unique ID 생성 후 다 같이 JSON 파일에 넣어주기
      unique ID 만드는 법 : a-z 배열만들기, math.Random 이용해 배열 index 번호 10개 뽑아오기, 조건처리 : 중복 값 처리 ( 결과값 겹치지 않게 )
메인 페이지로 이동

포스트 통신으로 유니크 아이디 집어넣어주기

*/

const idInput = getNode('.register-user-id');
const emailInput = getNode('.register-user-email');
const pwInput = getNode('.register-user-pw');
const pwConfirmInput = getNode('.register-user-pw-confirm');

function OnlyIdCheck() {}

function uniqueId(){
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
}

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
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}
