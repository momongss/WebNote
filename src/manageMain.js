import App from "./App.js";

const $app = document.createElement("div");
$app.className = "web-docs-app-8f8894ba7a1f5c7a94a170b7dc841190";
$app.innerHTML = `
<header>
    <div class="title-wrapper-8f8894ba7a1f5c7a94a170b7dc841190">
    <input class="title-8f8894ba7a1f5c7a94a170b7dc841190" placeholder="제목" spellcheck="false"/>
      <img id="starBtn-8f8894ba7a1f5c7a94a170b7dc841190" src="chrome-extension://${chrome.runtime.id}/assets/star_e.svg" alt="문서">
    </div>
</header>
<div class="docs-wrapper-8f8894ba7a1f5c7a94a170b7dc841190">
    <div class="content-8f8894ba7a1f5c7a94a170b7dc841190" contenteditable="true" spellcheck="false">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

const url = window.location.href;
const tmp = url.split("?");
const qs = tmp[tmp.length - 1];
const noteId = parseInt(qs);

const app = new App({ $app: $app, mode: "manage", noteId: noteId });
