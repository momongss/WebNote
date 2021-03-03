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
      <i id="deleteBtn" class="fas fa-trash-alt"></i>
    </div>
    <div class="closeBtn">
      <i class="fas fa-times"></i>
    </div>
</header>
<div class="docs-wrapper">
    <div class="content" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

import apiTest from "./utils/apitest.js";

// for test api
let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
window.addEventListener("keydown", async (e) => {
  if (e.key === "=") {
    console.log(data);
    data.pop();
    await apiTest.setItem("a", data);
  } else if (e.key === "-") {
    data = await apiTest.getItem("a");
    console.log(data);
  }
});

const app = new App({ $app: $app, mode: "normal" });
