import Caret from "../utils/caret.js";
import { getTimeDiff } from "../utils/time.js";
import Storage from "../utils/storage.js";

export default class Title {
  constructor({ mode, $target, note, saveNote, openNote, onStarClick }) {
    this.mode = mode;
    this.$target = $target;
    this.$title = $target.querySelector(
      ".title-8f8894ba7a1f5c7a94a170b7dc841190"
    );

    this.$recentWrapper = $target.querySelector(
      ".recent-wrapper-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    this.$recentNoteList = $target.querySelector(
      ".recent-list-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    this.$starBtn = $target.querySelector(
      "#starBtn-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    this.state = "init";

    this.saveNote = saveNote;
    this.openNote = openNote;
    this.onStarClick = onStarClick;

    this.render(note);
    this.eventListeners();
  }

  toggleList() {
    if (
      this.$recentWrapper.classList.contains(
        "showUp-8f8894ba7a1f5c7a94a170b7dc841190"
      )
    ) {
      this.hideList();
    } else {
      Storage.getListingMethod().then((method) => {
        this.showList(method);
      });
    }
  }

  async showList(method) {
    this.$recentWrapper.classList.add(
      "showUp-8f8894ba7a1f5c7a94a170b7dc841190"
    );

    let recentNoteList;
    if (method === "url") {
      this.$target
        .querySelector(".sel-url-8f8894ba7a1f5c7a94a170b7dc841190")
        .classList.add("set-8f8894ba7a1f5c7a94a170b7dc841190");
      this.$target
        .querySelector(".sel-all-8f8894ba7a1f5c7a94a170b7dc841190")
        .classList.remove("set-8f8894ba7a1f5c7a94a170b7dc841190");
      recentNoteList = await this.getUrlNoteList();
    } else {
      this.$target
        .querySelector(".sel-all-8f8894ba7a1f5c7a94a170b7dc841190")
        .classList.add("set-8f8894ba7a1f5c7a94a170b7dc841190");
      this.$target
        .querySelector(".sel-url-8f8894ba7a1f5c7a94a170b7dc841190")
        .classList.remove("set-8f8894ba7a1f5c7a94a170b7dc841190");
      recentNoteList = await this.getNoteList();
    }

    recentNoteList = recentNoteList ? recentNoteList : [];

    this.$recentNoteList.innerHTML = recentNoteList
      .map(
        (noteInfo) =>
          `<li data-id=${noteInfo.id}>
        <span class="item-title-8f8894ba7a1f5c7a94a170b7dc841190">${
          noteInfo.title
        }</span>
        <span class="item-update-8f8894ba7a1f5c7a94a170b7dc841190">${getTimeDiff(
          noteInfo.updateTime
        )}</span>
      </li>`
      )
      .join("");
  }

  hideList() {
    this.$recentWrapper.classList.remove(
      "showUp-8f8894ba7a1f5c7a94a170b7dc841190"
    );
  }

  render(note) {
    this.state = "init";
    if (note == null) return;
    this.$title.value = note.title;
    if (note.star === true) {
      this.$starBtn.classList.add("stared-8f8894ba7a1f5c7a94a170b7dc841190");
      this.$starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_b.svg`;
    } else {
      this.$starBtn.classList.remove("stared-8f8894ba7a1f5c7a94a170b7dc841190");
      this.$starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_e.svg`;
    }
  }

  eventListeners() {
    this.$starBtn.addEventListener("click", () => {
      if (
        this.$starBtn.classList.contains(
          "stared-8f8894ba7a1f5c7a94a170b7dc841190"
        )
      ) {
        this.$starBtn.classList.remove(
          "stared-8f8894ba7a1f5c7a94a170b7dc841190"
        );
        this.$starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_e.svg`;
        this.onStarClick(false);
      } else {
        this.$starBtn.classList.add("stared-8f8894ba7a1f5c7a94a170b7dc841190");
        this.$starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_b.svg`;
        this.onStarClick(true);
      }
    });

    this.$title.addEventListener("click", (e) => {
      if (this.state === "init") this.$title.select();
    });

    this.$title.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.$target
          .querySelector(".content-8f8894ba7a1f5c7a94a170b7dc841190")
          .focus();
        Caret.restoreCaret();
        if (this.$title.value === "") {
          this.$title.value = `${document.querySelector("title").innerHTML}`;
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

    this.$title.addEventListener("keydown", (e) => {
      this.hideList();
    });

    this.$title.addEventListener("click", (e) => {
      this.toggleList();
    });

    this.$target.addEventListener("click", (e) => {
      if (e.target.className === "title") {
      } else if (
        e.target.className === "sel-all-8f8894ba7a1f5c7a94a170b7dc841190"
      ) {
        const method = "all";
        this.showList(method);
        Storage.setListingMethod(method);
      } else if (
        e.target.className === "sel-url-8f8894ba7a1f5c7a94a170b7dc841190"
      ) {
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
