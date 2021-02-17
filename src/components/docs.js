import Caret from "../utils/caret.js";
import { keyBackspace, keyTab } from "../utils/keyboardInput.js";

let classThis;

export default class Docs {
  constructor($target, NoteData, hideNote, toggleNote, saveNote) {
    classThis = this;

    this.$docs = $target.querySelector(".docs");

    this.timeout = null;
    this.isAltPressed = false;

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

      if (e.key === "w" || e.key === "W") {
        classThis.toggleNote();
      } else if (e.key === "Alt") {
        classThis.isAltPressed = false;
      }
    });

    this.$docs.addEventListener("keydown", (e) => {
      e.stopPropagation();

      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        // 첫 줄의 div 영역이 지워지는 걸 방지
        let text = classThis.$docs.innerHTML;
        if (text.slice(0, 5) !== "<div>") {
          const length = text.length;
          text = "<div>" + text + "</div>";
          classThis.$docs.innerHTML = text;
          console.log(text);
        }

        const line = classThis.$docs.innerHTML.trim();
        if (line === "<div><br></div>") {
          e.preventDefault();
        }
        keyBackspace();
      } else if (e.key === "Escape") {
        classThis.hideNote();
      } else if (e.key === "Alt") {
        classThis.isAltPressed = true;
      }

      clearTimeout(classThis.timeout);

      classThis.timeout = setTimeout(() => {
        Caret.storeCaret();
        classThis.saveNote();
      }, 600);
    });
  }
}
