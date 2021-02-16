import { detectURLChange } from "./utils/detectURLChange.js";

import { selectText as selectTextAll } from "./utils/selectDiv.js";
import { keyBackspace, keyTab } from "./utils/keyboardInput.js";
import { getformattedTime } from "./utils/time.js";

import Storage from "./utils/storage.js";
import Caret from "./utils/caret.js";

app();

export function app() {
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

  console.log("app running");

  const Note = {
    title: null,
    content: "<div><br /></div>",
    createTime: getformattedTime(),
    updateTime: getformattedTime(),
    state: false,
  };

  Storage.getItem().then((preNote) => {
    if (preNote == null) return;
    Note.title = preNote.title ? preNote.title : Note.title;
    Note.content = preNote.content ? preNote.content : Note.content;
    Note.createTime = preNote.createTime ? preNote.createTime : Note.createTime;
    Note.state = preNote.state ? preNote.state : Note.state;

    $title.innerHTML = Note.title;
    $docs.innerHTML = Note.content;

    Caret.setCaretLast();

    if (Note.state) {
      showNoteNoAnimation();
    }
  });

  const $title = $app.querySelector(".title");
  const $docs = $app.querySelector(".docs");
  const $exitBtn = $app.querySelector(".closeBtn");

  const pageTitle = document.querySelector("title").innerText;
  $title.innerHTML = "제목 없는 문서";

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
      Caret.restoreCaret(caret);
      if ($title.innerHTML === "") {
        $title.innerHTML = "제목 없는 문서";
        titleState = "init";
      }
      return;
    } else if (e.key === "Escape") {
      hideNote();
    }

    titleState = "stated";
  });

  let titleTimeout;
  $title.addEventListener("keyup", (e) => {
    clearTimeout(titleTimeout);

    titleTimeout = setTimeout(() => {
      saveNote();
    }, 600);
  });

  $docs.addEventListener("click", () => {
    caret = Caret.getCaret();
  });

  $docs.addEventListener("keyup", (e) => {
    if (e.key === "Backspace") {
      const line = $docs.innerHTML.trim();
      if (line === "<br>" || line === "") {
        $docs.innerHTML = "<div><br></div>";
      }
    }
  });

  let timeout;
  $docs.addEventListener("keydown", (e) => {
    e.stopPropagation();

    if (e.key === "Tab") {
      e.preventDefault();
      keyTab();
    } else if (e.key === "Backspace") {
      keyBackspace();
    } else if (e.key === "Escape") {
      hideNote();
    }

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      caret = Caret.getCaret(caret);
      saveNote();
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
    // Debug
    else if (e.key === "Delete") {
      Storage.clearStorage();
      console.log("모든 메모 삭제");
    } else if (e.key === "]") {
      Storage.printStorage();
    }
  });

  $exitBtn.addEventListener("click", (e) => {
    hideNote();
  });

  function showNoteNoAnimation() {
    $app.style.right = "20px";
    $docs.focus();
  }

  function showNote() {
    $app.style.animationName = "slidein";
    $app.style.right = "20px";
    $docs.focus();
    Note.state = true;
    saveNote();
  }

  function hideNote() {
    $app.style.animationName = "slideout";
    $app.style.right = "-520px";
    document.body.focus();
    Note.state = false;
    saveNote();
  }

  function toggleNote() {
    if ($app.style.animationName === "slidein") {
      hideNote();
    } else {
      showNote();
    }
  }

  function saveNote() {
    Note.title = $title.innerHTML;
    Note.content = $docs.innerHTML;
    Note.updateTime = getformattedTime();
    Storage.setItem(Note);
    console.log("저장~");
  }

  detectURLChange(refreshApp);

  function refreshApp() {
    $app.remove();
    $iconHead.remove();
    app();
  }
}
