import Caret from "../utils/caret.js";
import { keyBackspace, keyTab, keyAlt } from "../utils/keyboardInput.js";

let classThis;

export default class Docs {
  constructor($target, NoteData, hideNote, toggleNote, saveNote) {
    classThis = this;

    this.$docs = $target.querySelector(".docs");

    this.timeout = null;

    this.hideNote = hideNote;
    this.toggleNote = toggleNote;
    this.saveNote = saveNote;

    this.render(NoteData.content);
  }

  render(content) {
    this.$docs.innerHTML = content;

    this.$docs.addEventListener("click", () => {
      Caret.storeCaret();
    });

    this.$docs.addEventListener("keyup", (e) => {
      e.stopPropagation();

      // 첫 줄의 div 영역이 지워지는 걸 방지
      let text = classThis.$docs.innerHTML;
      if (text.slice(0, 5) !== "<div>") {
        const length = text.length;
        text = "<div>" + text + "</div>";
        classThis.$docs.innerHTML = text;
      }

      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      } else if (keyAlt.isAltPressed && (e.key === "w" || e.key === "W")) {
        classThis.toggleNote();
      }
    });

    this.$docs.addEventListener("keydown", (e) => {
      e.stopPropagation();

      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        // 첫 줄의 div 영역이 지워지는 걸 방지
        const line = classThis.$docs.innerHTML.trim();
        if (line === "<div><br></div>") {
          e.preventDefault();
          return;
        }

        keyBackspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        classThis.hideNote();
      } else if (e.key === "Alt") {
        keyAlt.isAltPressed = true;
      }

      clearTimeout(classThis.timeout);

      classThis.timeout = setTimeout(() => {
        Caret.storeCaret();
        classThis.saveNote();
      }, 600);
    });
  }
}
