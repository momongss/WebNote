import Caret from "../utils/caret.js";
import {
  keyBackspace,
  keyTab,
  keySpace,
  keyEnter,
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
      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        keyBackspace(e, this.$content);
      } else if (e.keyCode == 0 || e.keyCode == 32) {
        keySpace(e);
      } else if (e.key === "Enter") {
        e.preventDefault();
        keyEnter();
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
