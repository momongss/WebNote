import App from "./App.js";

// app
// <div class="title" contenteditable="true"></div>
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
<header class="_header">
    <div class="title-wrapper">
      <img id="logo" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/docs.svg" alt="문서">
      <div class="title" contenteditable="true"></div>
      <img id="createBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/add.svg" alt="문서">
      <img id="deleteBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/trash.svg" alt="문서">
      <div class="recent-wrapper">
        <button class="sel-all">전체</button>
        <button class="sel-url">URL</button>
        <ul class="recent-list"></ul>
      </div>
    </div>
    <img id="closeBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/delete.svg" alt="문서">
</header>
<div class="docs-wrapper">
    <div class="content" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
const $alarmUI = document.createElement("div");
$alarmUI.className = "alarm-ui";

document.body.appendChild($app);
document.body.appendChild($alarmUI);

const app = new App({ $app: $app, mode: "normal" });

// svg
// https://svgontheweb.com/ko/
// https://nykim.work/35

// 프로미스와 콜백의 차이, 콜백 함수를 받는 함수를 프로미스로 실행 하려면??
// => 프로미스를 생성하여 resolve 를 콜백함수로 넘겨주면 된다.
