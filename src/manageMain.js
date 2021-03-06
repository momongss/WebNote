import App from "./App.js";

// app
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
<div class="_header">
    <div class="title-wrapper">
      <div class="title" contenteditable="true"></div>
      <img id="starBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_e.svg" alt="문서">
    </div>
</div>
<div class="docs-wrapper">
    <div class="content" contenteditable="true">
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
