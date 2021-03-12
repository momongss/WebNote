import Caret from "../utils/caret.js";
import { getTimeDiff } from "../utils/time.js";

export default class Title {
  constructor({
    mode,
    $target,
    NoteData,
    recentNoteLists,
    saveNote,
    hideNote,
    openNote,
  }) {
    this.mode = mode;
    this.$target = $target;
    this.$title = $target.querySelector(".title");
    console.log(this.$title);
    this.$recentNoteList = $target.querySelector(".recent-list");
    this.state = "init";

    this.timeout = null;
    this.hideNote = hideNote;
    this.saveNote = saveNote;
    this.openNote = openNote;

    this.render(NoteData ? NoteData.title : "", recentNoteLists);
    if (this.mode === "normal") {
      this.normalAddEvent();
    } else {
      this.manageAddEvent();
    }
  }

  manageAddEvent() {
    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") Caret.selectTextAll(this.$title);
    });

    this.$title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.$target.querySelector(".content").focus();
        Caret.restoreCaret();
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
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.saveNote();
      }, 50);
    });
  }

  normalAddEvent() {
    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") Caret.selectTextAll(this.$title);
      this.$recentNoteList.classList.toggle("showUp");
    });

    this.$title.addEventListener("blur", (e) => {
      this.$recentNoteList.classList.remove("showUp");
    });

    this.$title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.$target.querySelector(".content").focus();
        Caret.restoreCaret();
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

    this.$title.addEventListener("input", (e) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.saveNote();
      }, 50);
    });

    this.$recentNoteList.addEventListener("mousedown", (e) => {
      if (
        e.target.className === "item-title" ||
        e.target.className === "item-update"
      ) {
        const id = e.target.parentElement.dataset.id;
        this.openNote(id);
      }
    });
  }

  render(title, recentNoteLists) {
    this.$title.innerHTML = title;

    if (this.mode === "manage" || recentNoteLists == null) return;
    this.$recentNoteList.innerHTML = recentNoteLists
      .map(
        (noteInfo) =>
          `<li data-id=${noteInfo.id}>
        <span class="item-title">${noteInfo.title}</span>
        <span class="item-update">${getTimeDiff(noteInfo.updateTime)}</span>
      </li>`
      )
      .join("");
  }
}
