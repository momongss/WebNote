import Caret from "../utils/caret.js";
import { getTimeDiff } from "../utils/time.js";
import Storage from "../utils/storage.js";

export default class Title {
  constructor({ mode, $target, NoteData, saveNote, hideNote, openNote }) {
    this.mode = mode;
    this.$target = $target;
    this.$title = $target.querySelector(".title");
    this.$recentNoteList = $target.querySelector(".recent-list");
    this.state = "init";

    this.timeout = null;
    this.hideNote = hideNote;
    this.saveNote = saveNote;
    this.openNote = openNote;

    this.render(NoteData ? NoteData.title : "");
    this.eventListeners();
  }

  toggleList() {
    if (this.$recentNoteList.classList.contains("showUp")) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  async showList() {
    this.$recentNoteList.classList.add("showUp");

    const recentNoteList = await this.getUrlNoteList();
    this.$recentNoteList.innerHTML = recentNoteList
      .map(
        (noteInfo) =>
          `<li data-id=${noteInfo.id}>
        <span class="item-title">${noteInfo.title}</span>
        <span class="item-update">${getTimeDiff(noteInfo.updateTime)}</span>
      </li>`
      )
      .join("");
  }

  hideList() {
    this.$recentNoteList.classList.remove("showUp");
  }

  render(title) {
    this.state = "init";
    this.$title.innerHTML = title;
  }

  eventListeners() {
    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") Caret.selectTextAll(this.$title);
      this.toggleList();
    });

    this.$title.addEventListener("blur", (e) => {
      this.hideList();
    });

    this.$recentNoteList.addEventListener("mousedown", (e) => {
      let $li;
      if (e.target.tagName === "LI") {
        $li = e.target;
      } else {
        $li = e.target.parentElement;
      }

      this.openNote($li.dataset.id);
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

  async getNoteList() {
    const noteLists = await Storage.getNoteInfoList();
    noteLists.sort((a, b) => {
      return new Date(b.updateTime) - new Date(a.updateTime);
    });

    return noteLists;
  }

  async getUrlNoteList() {
    const noteLists = await this.getNoteList();
    const urlNoteList = this.findNotesByURL(window.location.href, noteLists);
    return urlNoteList;
  }

  findNotesByURL(url, NoteList) {
    const urlNoteList = [];
    for (const note of NoteList) {
      if (note.url === url) urlNoteList.push(note);
    }

    if (urlNoteList.length === 0) return null;

    return urlNoteList;
  }
}
