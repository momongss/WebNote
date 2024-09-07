import App from "./App.js";

const $app = document.createElement("div");
$app.style.top = "0px";
$app.style.bottom = "0px";
$app.style.width = "440px";
$app.style.right = "0px";
$app.className = "web-docs-app-8f8894ba7a1f5c7a94a170b7dc841190";
$app.innerHTML = `
<div class="resize-btn-top-8f8894ba7a1f5c7a94a170b7dc841190"><div class="visible-8f8894ba7a1f5c7a94a170b7dc841190"></div></div>
<div class="resize-btn-bottom-8f8894ba7a1f5c7a94a170b7dc841190"><div class="visible-8f8894ba7a1f5c7a94a170b7dc841190"></div></div>
<div class="resize-btn-left-8f8894ba7a1f5c7a94a170b7dc841190"><div class="visible-8f8894ba7a1f5c7a94a170b7dc841190"></div></div>
<div class="resize-btn-right-8f8894ba7a1f5c7a94a170b7dc841190"><div class="visible-8f8894ba7a1f5c7a94a170b7dc841190"></div></div>
<div class="_header-8f8894ba7a1f5c7a94a170b7dc841190">
    <div class="title-wrapper-8f8894ba7a1f5c7a94a170b7dc841190">
      <img id="logo-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/docs.svg" alt="문서">
      <input class="title-8f8894ba7a1f5c7a94a170b7dc841190" placeholder="제목" spellcheck="false"/>
      <img id="createBtn-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/add.svg" alt="문서">
      <img id="deleteBtn-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/trash.svg" alt="문서">
      <img id="starBtn-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/star_e.svg" alt="문서">
      <div class="recent-wrapper-8f8894ba7a1f5c7a94a170b7dc841190">
        <button class="sel-all-8f8894ba7a1f5c7a94a170b7dc841190">전체</button>
        <button class="sel-url-8f8894ba7a1f5c7a94a170b7dc841190">URL</button>
        <ul class="recent-list-8f8894ba7a1f5c7a94a170b7dc841190"></ul>
      </div>
    </div>
    <img id="closeBtn-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/delete.svg" alt="문서">
</div>
<div class="docs-wrapper-8f8894ba7a1f5c7a94a170b7dc841190">
    <div class="content-8f8894ba7a1f5c7a94a170b7dc841190" contenteditable="true" spellcheck="false">
        <div><br /></div>
    </div>
</div>
`;

const $alarmUI = document.createElement("div");
$alarmUI.className = "alarm-ui-8f8894ba7a1f5c7a94a170b7dc841190";

document.body.appendChild($app);
document.body.appendChild($alarmUI);

const app = new App({ $app: $app, mode: "normal" });
