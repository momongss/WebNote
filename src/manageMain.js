import App from "./App.js";

// app
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
<header>
    <div class="title-wrapper">
      <i id="logo" class="fas fa-book"></i>
      <div class="title" contenteditable="true"></div>      
    </div>
</header>
<div class="docs-wrapper">
    <div class="content" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

const app = new App({ $app: $app, mode: "manage" });