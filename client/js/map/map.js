const getStorInfo = async options => {
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
  for (let i = 0; i < storeData.length; i += 1) {
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
        <span style="margin-left:4px">${storeData[i].title}</span>
    </div>`;

    const customOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(storeData[i].lat, storeData[i].lng),
      content,
    });
    customOverlay.setMap(map);
  }
}

function setBounds(map, storeData) {
  const bounds = new kakao.maps.LatLngBounds();
  for (let i = 0; i < storeData.length; i += 1) {
    const position = new kakao.maps.LatLng(storeData[i].lat, storeData[i].lng);
    const marker = new kakao.maps.Marker({
      position,
      title: storeData[i].title,
    });
    marker.setMap(map);
    bounds.extend(position);
  }
  map.setBounds(bounds);
}

function renderMap(storeData) {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(storeData[0].lat, storeData[0].lng),
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);

  setBounds(map, storeData);
  renderOverlay(map, storeData);
}

(async function render() {
  const URL = 'http://localhost:3000/info';
  const response = await getStorInfo({url: URL});
  const storeData = response.data;
  renderMap(storeData);
})();
