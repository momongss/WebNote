var dragged;

/* 드래그 가능한 대상에서 이벤트 발생 */
document.addEventListener("drag", function (event) {}, false);

document.addEventListener(
  "dragstart",
  function (event) {
    // 드래그한 요소에 대한 참조 변수
    dragged = event.target;
    // 요소를 반투명하게 함
    event.target.style.opacity = 0.5;
  },
  false
);

document.addEventListener(
  "dragend",
  function (event) {
    // 투명도를 리셋
    event.target.style.opacity = "";
  },
  false
);

/* 드롭 대상에서 이벤트 발생 */
document.addEventListener(
  "dragover",
  function (event) {
    // 드롭을 허용하도록 prevetDefault() 호출
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "dragenter",
  function (event) {
    // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
    if (event.target.className == "dropzone") {
      event.target.style.background = "purple";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function (event) {
    // 요소를 드래그하여 드롭하려던 대상으로부터 벗어났을 때 배경색 리셋
    if (event.target.className == "dropzone") {
      event.target.style.background = "";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    // 기본 액션을 막음 (링크 열기같은 것들)
    event.preventDefault();
    // 드래그한 요소를 드롭 대상으로 이동
    if (event.target.className == "dropzone") {
      event.target.style.background = "";
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
    }
  },
  false
);
