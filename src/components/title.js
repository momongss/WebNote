import Caret from "../utils/caret.js";
import { getTimeDiff } from "../utils/time.js";
import Storage from "../utils/storage.js";

export default class Title {
  constructor({ mode, $target, note, saveNote, openNote, onStarClick }) {
    this.mode = mode;
    this.$target = $target;
    this.$title = $target.querySelector(".title");

    this.$recentWrapper = $target.querySelector(".recent-wrapper");
    this.$recentNoteList = $target.querySelector(".recent-list");
    this.$starBtn = $target.querySelector("#starBtn");
    this.state = "init";

    this.saveNote = saveNote;
    this.openNote = openNote;
    this.onStarClick = onStarClick;

    this.render(note);
    this.eventListeners();
  }

  toggleList() {
    if (this.$recentWrapper.classList.contains("showUp")) {
      this.hideList();
    } else {
      Storage.getListingMethod().then((method) => {
        this.showList(method);
      });
    }
  }

  async showList(method) {
    this.$recentWrapper.classList.add("showUp");

    let recentNoteList;
    if (method === "url") {
      this.$target.querySelector(".sel-url").classList.add("set");
      this.$target.querySelector(".sel-all").classList.remove("set");
      recentNoteList = await this.getUrlNoteList();
    } else {
      this.$target.querySelector(".sel-all").classList.add("set");
      this.$target.querySelector(".sel-url").classList.remove("set");
      recentNoteList = await this.getNoteList();
    }

    recentNoteList = recentNoteList ? recentNoteList : [];

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
    this.$recentWrapper.classList.remove("showUp");
  }

  render(note) {
    console.log(note);

    this.state = "init";
    if (note == null) return;
    this.$title.value = note.title;
    if (note.star === true) {
      this.$starBtn.classList.add("stared");
      this.$starBtn.src =
        "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_b.svg";
    } else {
      this.$starBtn.classList.remove("stared");
      this.$starBtn.src =
        "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_e.svg";
    }
  }

  eventListeners() {
    this.$starBtn.addEventListener("click", () => {
      if (this.$starBtn.classList.contains("stared")) {
        this.$starBtn.classList.remove("stared");
        this.$starBtn.src =
          "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_e.svg";
        this.onStarClick(false);
      } else {
        this.$starBtn.classList.add("stared");
        this.$starBtn.src =
          "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_b.svg";
        this.onStarClick(true);
      }
    });

    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") this.$title.select();
      // if (this.state === "init") Caret.selectTextAll(this.$title);
    });

    this.$title.addEventListener("keydown", (e) => {
      this.hideList();

      if (e.key === "Enter") {
        e.preventDefault();
        this.$target.querySelector(".content").focus();
        Caret.restoreCaret();
        if (this.$title.value === "") {
          this.$title.value = "제목 없는 문서";
          this.state = "init";
        }
        return;
      }

      this.state = "stated";
    });

    this.$title.addEventListener("keyup", (e) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.saveNote();
      }, 50);
    });

    if (this.mode !== "normal") return;

    this.$title.addEventListener("click", (e) => {
      this.toggleList();
    });

    this.$target.addEventListener("click", (e) => {
      if (e.target.className === "title") {
      } else if (e.target.className === "sel-all") {
        const method = "all";
        this.showList(method);
        Storage.setListingMethod(method);
      } else if (e.target.className === "sel-url") {
        const method = "url";
        this.showList(method);
        Storage.setListingMethod(method);
      } else {
        this.hideList();
      }
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
