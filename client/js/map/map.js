import {getNode} from '../../lib/index.js';

// * 카카오 지도 API
const getStoreInfo = async options => {
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
  });
}

function setBounds(map, storeData) {
  const bounds = new kakao.maps.LatLngBounds();
  storeData.visited.forEach(visitedPlace => {
    const placeName = Object.keys(visitedPlace)[0];
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
  const response = await getStoreInfo({url: URL});
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
const mapButton = getNode('.map-button');

function moveScrollBottom() {
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}

mapButton.addEventListener('click', moveScrollBottom);

//* 스크롤 내리기 버튼
