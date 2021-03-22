import Caret from "../utils/caret.js";
import {
  keyBackspace,
  keyTab,
  keySpace,
} from "../utils/keyboardInput.js";

export default class Content {
  constructor({ mode, $target, NoteData, saveNote, toggleNote }) {
    this.mode = mode;
    this.$content = $target.querySelector(".content");

    this.timeout = null;

    this.toggleNote = toggleNote;
    this.saveNote = saveNote;

    this.addEventListeners();
    this.render(NoteData ? NoteData.content : "<div><br /></div>");
  }

  addEventListeners() {
    this.$content.addEventListener("click", () => {
      Caret.storeCaret();
    });

    this.$content.addEventListener("keydown", (e) => {
      // 첫 줄 요소가 없어지는 걸 방지
      if (this.$content.childElementCount === 0) {
        const $div = document.createElement("div");
        $div.innerHTML = "<br>";
        this.$content.appendChild($div);

        const range = document.getSelection().getRangeAt(0);
        range.setStart($div, 0);
        range.setEnd($div, 0);
      } else if (this.$content.firstChild.nodeType === Node.TEXT_NODE) {
        const $div = document.createElement("div");
        const textNode = this.$content.firstChild;
        $div.innerHTML = textNode.textContent;
        this.$content.insertBefore($div, textNode);
        textNode.remove();
      } else if (this.$content.firstChild.tagName === "BR") {
        const $div = document.createElement("div");
        const textNode = this.$content.firstChild;
        $div.innerHTML = "<br>";
        this.$content.insertBefore($div, textNode);
        textNode.remove();

        const range = document.getSelection().getRangeAt(0);
        range.setStart($div, 0);
        range.setEnd($div, 0);
      }

      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        keyBackspace(e);
      } else if (e.keyCode == 0 || e.keyCode == 32) {
        keySpace(e);
      } 
    });

    this.$content.addEventListener("keydown", (e) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        Caret.storeCaret();
        this.saveNote();
      }, 600);
    });
  }

  render(content) {
    this.$content.innerHTML = content;
  }
}
