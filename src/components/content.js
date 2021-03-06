import Caret from "../utils/caret.js";
import { keyBackspace, keyTab } from "../utils/keyboardInput.js";

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

    this.$content.addEventListener("keyup", (e) => {
      // 첫 줄의 div 영역이 지워지는 걸 방지
      let text = this.$content.innerHTML;
      if (text.slice(0, 5) !== "<div>") {
        text = "<div>" + text + "</div>";
        this.$content.innerHTML = text;
      }
    });

    this.$content.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        // 첫 줄의 div 영역이 지워지는 걸 방지
        const line = this.$content.innerHTML.trim();
        if (line === "<div><br></div>") {
          e.preventDefault();
          return;
        }

        keyBackspace();
      }
    });

    this.$content.addEventListener("input", (e) => {
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
