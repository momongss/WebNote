import Caret from "./caret.js";

function keyBackspace(e, $content) {
  // 첫 줄 영역이 지워지는 걸 방지
  const line = Caret.getCurrentLine();
  if (line.nodeType === Node.ELEMENT_NODE) {
    if (line.classList.contains("h1")) {
      line.className = "";
      e.preventDefault();
      return;
    } else if ($content.firstChild === line) {
      e.preventDefault();
      return;
    }
  }

  const selection = document.getSelection();
  if (selection.anchorOffset - 3 > 0) {
    const newRange = document.createRange();
    newRange.setStart(selection.anchorNode, selection.anchorOffset - 3);
    newRange.setEnd(selection.anchorNode, selection.anchorOffset);
    if (newRange.toString().trim().length === 0) {
      newRange.deleteContents();
    }
  }
}

function keyTab() {
  document.execCommand("insertText", false, "    ");
}

function keySpace(e) {
  const anchorNode = Caret.getCurrentLine();
  const line = anchorNode.textContent;
  if (line === "#") {
    e.preventDefault();
    console.log(anchorNode, anchorNode.parentElement);
    anchorNode.parentElement.classList.add("h1");
    anchorNode.parentElement.innerHTML = "";
  }
}

function keyEnter() {
  const anchorNode = Caret.getCurrentLine();
  let lineNode;
  if (anchorNode.nodeType === Node.ELEMENT_NODE) {
    lineNode = anchorNode;
  } else if (anchorNode.nodeType === Node.TEXT_NODE) {
    lineNode = anchorNode.parentElement;
  }

  const $nextLine = document.createElement("div");
  $nextLine.innerHTML = "</br>";
  lineNode.after($nextLine);
  Caret.selectLineAll($nextLine);
}

class KeyAlt {
  constructor() {
    this.isAltPressed = false;
  }
}

const keyAlt = new KeyAlt();

export { keyBackspace, keyTab, keySpace, keyEnter, keyAlt };
