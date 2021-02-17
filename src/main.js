import App from "./App.js";

// for icon
const $iconHead = document.createElement("script");
$iconHead.src = "https://kit.fontawesome.com/2fda1b0923.js";
$iconHead.crossOrigin = "anonymous";
document.querySelector("head").appendChild($iconHead);

// app
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
<header>
    <div class="title-wrapper">
      <i id="logo" class="fas fa-book"></i>
      <div class="title" contenteditable="true"></div>      
      <i id="createBtn" class="fas fa-plus-square" aria-hidden="true"></i>
    </div>
    <div class="closeBtn">
      <i class="fas fa-times"></i>
    </div>
</header>
<div class="docs-wrapper">
    <div class="docs" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

const app = new App($app);
