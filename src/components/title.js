import Caret from "../utils/caret.js";

let classThis;

export default class Title {
  constructor($target, NoteData, hideNote, saveNote) {
    classThis = this;

    this.$target = $target;
    this.$title = $target.querySelector(".title");
    this.state = "init";

    this.timeout = null;
    this.hideNote = hideNote;
    this.saveNote = saveNote;

    this.render(NoteData.title);
  }

  render(title) {
    this.$title.innerHTML = title;

    this.$title.addEventListener("click", (e) => {
      if (classThis.state === "init") Caret.selectTextAll(classThis.$title);
    });

    this.$title.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        classThis.$target.querySelector(".content").focus();
        if (classThis.$title.innerHTML === "") {
          classThis.$title.innerHTML = "제목 없는 문서";
          classThis.state = "init";
        }
        return;
      } else if (e.key === "Escape") {
        classThis.hideNote();
      }

      this.state = "stated";
    });

    this.$title.addEventListener("keyup", (e) => {
      e.stopPropagation();
      clearTimeout(classThis.timeout);

      classThis.timeout = setTimeout(() => {
        classThis.saveNote();
      }, 600);
    });
  }
}
