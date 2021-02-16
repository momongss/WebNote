import Caret from "../utils/caret.js";
import { keyBackspace, keyTab } from "../utils/keyboardInput.js";

let classThis;

export default class Docs {
  constructor($target, hideNote, toggleNote, saveNote) {
    classThis = this;

    this.$docs = $target.querySelector(".docs");

    this.timeout = null;
    this.isAltPressed = false;

    this.hideNote = hideNote;
    this.toggleNote = toggleNote;
    this.saveNote = saveNote;

    this.render();
  }

  render() {
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
