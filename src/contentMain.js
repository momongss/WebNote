// for icon
const $iconHead = document.createElement("script");
$iconHead.src = "https://kit.fontawesome.com/2fda1b0923.js";
$iconHead.crossOrigin = "anonymous";
document.querySelector("head").appendChild($iconHead);

// app
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.style.display = "none";
$app.innerHTML = `
<header>
    <div class="title-wrapper">
      <i id="logo" class="fas fa-book"></i>
      <div class="title" contenteditable="true"></div>
    </div>
    <div class="exitBtn">x</div>
</header>
<div class="docs-wrapper">
    <div class="docs" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

console.log("app running");

import { restoreCaret, getCaret } from "./utils/caret.js";
import { selectText as selectTextAll } from "./utils/selectDiv.js";
import { keyBackspace, keyTab } from "./utils/keyboardInput.js";

const $title = $app.querySelector(".title");
const $docs = $app.querySelector(".docs");
const $exitBtn = $app.querySelector(".exitBtn");

const pageTitle = document.querySelector("title").innerText;
$title.innerHTML = pageTitle;

let titleState = "init";
$title.addEventListener("click", (e) => {
  if (titleState === "init") selectTextAll($title);
});

let caret = null; // 키보드 커서 객체

$title.addEventListener("keydown", (e) => {
  e.stopPropagation();
  if (e.key === "Enter") {
    e.preventDefault();
    $docs.focus();
    restoreCaret(caret);
    if ($title.innerHTML === "") {
      $title.innerHTML = pageTitle;
      titleState = "init";
    }
    return;
  } else if (e.key === "Escape") {
    toggleNote();
  }
  titleState = "stated";
});

$docs.addEventListener("click", () => {
  caret = getCaret();
});

let timeout = null;
$docs.addEventListener("keydown", (e) => {
  e.stopPropagation();
  if (e.key === "Tab") {
    e.preventDefault();
    keyTab();
  } else if (e.key === "Backspace") {
    keyBackspace();
  } else if (e.key === "Escape") {
    toggleNote();
  }

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    caret = getCaret(caret);
  }, 600);
});

let isAltPressed = false;
window.addEventListener("keydown", (e) => {
  if (e.key === "Alt") {
    isAltPressed = true;
  } else if (isAltPressed && (e.key === "w" || e.key === "W")) {
    toggleNote();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Alt") {
    isAltPressed = false;
  }
});

$exitBtn.addEventListener("click", (e) => {
  toggleNote();
});

function toggleNote() {
  if ($app.style.display === "none") {
    $app.style.display = "flex";
  } else {
    $app.style.display = "none";
  }
}
