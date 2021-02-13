import { setCaretIndex, applyCaret } from "../utils/caret.js";
import { selectText as selectTextAll } from "../utils/selectDiv.js";

console.log("app running");

const $title = document.querySelector(".title");
const $docs = document.querySelector(".docs");

let titleState = "init";
let caret = null;
const pageTitle = document.querySelector("title").innerText;

$title.innerHTML = pageTitle;

$title.addEventListener("click", (e) => {
  if (titleState === "init") selectTextAll($title);
});

$title.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "Escape") {
    e.preventDefault();
    setCaretIndex(caret);
    $docs.focus();
    if ($title.innerHTML === "") {
      $title.innerHTML = pageTitle;
      titleState = "init";
    }
    return;
  }
  titleState = "stated";
});

let timeout = null;
$docs.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    document.execCommand("insertText", true, "    ");
  } else if (e.key === "Backspace") {
    const selection = document.getSelection();
    if (selection.anchorOffset - 3 <= 0) {
      return;
    }

    const newRange = document.createRange();
    newRange.setStart(selection.anchorNode, selection.anchorOffset - 3);
    newRange.setEnd(selection.anchorNode, selection.anchorOffset);
    if (newRange.toString().trim().length === 0) {
      newRange.deleteContents();
    }
  }

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    caret = applyCaret(caret);
  }, 200);

  console.log(e.key);
});

$docs.addEventListener("click", () => {
  caret = applyCaret(caret);
});
