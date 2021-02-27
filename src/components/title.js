import Caret from "../utils/caret.js";

export default class Title {
  constructor({ $target, NoteData, saveNote, hideNote }) {
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
      if (this.state === "init") Caret.selectTextAll(this.$title);
    });

    this.$title.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        this.$target.querySelector(".content").focus();
        if (this.$title.innerHTML === "") {
          this.$title.innerHTML = "제목 없는 문서";
          this.state = "init";
        }
        return;
      } else if (e.key === "Escape") {
        this.hideNote();
      }

      this.state = "stated";
    });

    this.$title.addEventListener("keyup", (e) => {
      e.stopPropagation();
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.saveNote();
      }, 600);
    });
  }
}
