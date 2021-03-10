import Caret from "../utils/caret.js";
import { getTimeDiff } from "../utils/time.js";

export default class Title {
  constructor({
    $target,
    NoteData,
    recentNoteLists,
    saveNote,
    hideNote,
    openNote,
  }) {
    this.$target = $target;
    this.$title = $target.querySelector(".title");
    this.state = "init";

    this.timeout = null;
    this.hideNote = hideNote;
    this.saveNote = saveNote;
    this.openNote = openNote;

    this.render(NoteData ? NoteData.title : "", recentNoteLists);
  }

  render(title, recentNoteLists) {
    this.$title.innerHTML = title;

    const $recentNoteList = document.createElement("ul");
    $recentNoteList.className = "recent-list";

    $recentNoteList.innerHTML = recentNoteLists
      .map(
        (noteInfo) =>
          `<li data-id=${noteInfo.id}>
        <span class="item-title">${noteInfo.title}</span>
        <span class="item-update">${getTimeDiff(noteInfo.updateTime)}</span>
      </li>`
      )
      .join("");

    $recentNoteList.querySelectorAll("li").forEach(($li) => {
      $li.addEventListener("mousedown", (e) => {
        const id = $li.dataset.id;
        this.openNote(id);
      });
    });

    this.$target.querySelector("header").appendChild($recentNoteList);

    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") Caret.selectTextAll(this.$title);

      $recentNoteList.classList.toggle("showUp");
    });

    this.$title.addEventListener("blur", (e) => {
      $recentNoteList.classList.remove("showUp");
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
}
