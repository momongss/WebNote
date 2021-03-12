import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";

import { getCurTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

export default class App {
  Note = null;
  AppState = true; // 현재 열려있는 노트가 있는지, 없는지

  constructor({ $app, mode, noteId }) {
    this._constructor($app, mode, noteId);
  }

  async _constructor($app, mode, noteId) {
    this.$app = $app;

    console.log("app running");

    if (mode === "normal") {
      const noteLists = await this.getNoteList();
      const urlNoteLists = this.findNotesByURL(window.location.href, noteLists);

      this.recentNoteLists = urlNoteLists;

      const recentNoteInfo = urlNoteLists ? urlNoteLists[0] : null;
      if (recentNoteInfo == null) {
        this.AppState = false;
      } else {
        this.AppState = true;
        console.log(recentNoteInfo);
        const note = await Storage.getNote(recentNoteInfo.id);
        this.Note = note;
        if (this.Note.state) {
          this.$app.classList.add("show");
        } else {
          this.$app.classList.remove("show");
        }
      }
    } else if (mode === "manage") {
      const note = await Storage.getNote(noteId);
      this.Note = note;
    } else {
      console.error("모드 에러");
    }

    this.title = new Title({
      mode: mode,
      $target: this.$app,
      NoteData: this.Note,
      recentNoteLists: this.recentNoteLists,
      saveNote: () => {
        this.saveNote();
      },
      hideNote: () => {
        this.hideApp();
      },

      openNote: async (id) => {
        this.AppState = true;
        const note = await Storage.getNote(id);
        this.Note = note;
        this.title.render(this.Note.title, this.recentNoteLists);
        this.content.render(this.Note.content);
      },
    });
    this.content = new Content({
      mode: mode,
      $target: this.$app,
      NoteData: this.Note,
      saveNote: async () => {
        this.saveNote();

        const noteLists = await this.getNoteList();
        const urlNoteLists = this.findNotesByURL(
          window.location.href,
          noteLists
        );

        this.recentNoteLists = urlNoteLists;
        this.title.render(this.Note.title, urlNoteLists);
      },
      hideNote: () => {
        this.hideApp();
      },
      toggleNote: () => {
        this.toggleApp;
      },
    });

    if (mode === "normal") this.appEventListeners();
  }

  appEventListeners() {
    this.$app.addEventListener("keydown", (e) => {
      e.stopPropagation();

      if (e.key === "Alt") {
        keyAlt.isAltPressed = true;
      } else if (keyAlt.isAltPressed && (e.key === "w" || e.key === "W")) {
        this.toggleApp();
      }
    });

    this.$app.addEventListener("keyup", (e) => {
      e.stopPropagation();

      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = true;
      } else if (keyAlt.isAltPressed && (e.key === "w" || e.key === "W")) {
        this.toggleApp();
      } else if (e.key === "Escape") {
        this.hideApp();
      } else if (e.key === "]") {
        Storage.getNoteInfoList().then((noteLists) => {
          console.log(noteLists);
        });
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      }

      // Debug
      else if (e.key === "Delete") {
        Storage.clearStorage();
        console.log("모든 메모 삭제");
      } else if (e.key === "]") {
        Storage.printStorage();
      }
    });

    const $logo = this.$app.querySelector("#logo");
    console.log($logo, "logo");
    $logo.addEventListener(
      "click",
      () => {
        chrome.runtime.sendMessage({ path: "manage" });
      },
      true
    );

    const $createBtn = this.$app.querySelector("#createBtn");
    $createBtn.addEventListener("click", () => {
      this.createNote();
      setTimeout(() => {
        this.showApp();
      }, 200);
    });

    const $deleteBtn = this.$app.querySelector("#deleteBtn");
    $deleteBtn.addEventListener("click", () => {
      console.log("trash!");
      this.deleteNote();
    });

    const $closeBtn = this.$app.querySelector("#closeBtn");
    $closeBtn.addEventListener("click", () => {
      this.hideApp();
    });
  }

  showRecentNoteList(noteList) {}

  findNotesByURL(url, NoteLists) {
    const urlNoteLists = [];
    for (const note of NoteLists) {
      if (note.url === url) urlNoteLists.push(note);
    }

    if (urlNoteLists.length === 0) return null;

    return urlNoteLists;
  }

  deleteNote() {
    this.AppState = false;
    this.hideApp();
    Storage.delNote(this.Note.id);
  }

  async getNoteList() {
    const noteLists = await Storage.getNoteInfoList();
    noteLists.sort((a, b) => {
      return new Date(b.updateTime) - new Date(a.updateTime);
    });

    return noteLists;
  }

  async createNote() {
    console.log("createMode");

    this.AppState = true;

    const noteLists = await this.getNoteList();

    const urlNoteLists = this.findNotesByURL(window.location.href, noteLists);

    this.recentNoteLists = urlNoteLists;

    const note = {
      id: this.createNewId(noteLists),
    };

    noteLists.push(note);

    this.Note = Object.assign({}, note);
    this.Note.title = "제목 없는 문서";
    this.Note.url = window.location.href;
    this.Note.createTime = getCurTime();
    this.Note.updateTime = getCurTime();
    this.Note.state = false;
    this.Note.content = "<div><br /></div>";
    this.title.render(this.Note.title, urlNoteLists);
    this.content.render(this.Note.content, urlNoteLists);

    Storage.setNoteInfoList(noteLists);
    Storage.setNote(this.Note);
  }

  saveNote() {
    this.Note.title = this.title.$title.innerHTML;
    this.Note.content = this.content.$content.innerHTML;
    this.Note.updateTime = getCurTime();

    console.log(this.Note);

    Storage.setNote(this.Note);
  }

  createNewId(noteLists) {
    let id = 0;
    while (true) {
      let flag = true;
      for (const note of noteLists) {
        if (note.id === id) {
          flag = false;
          break;
        }
      }
      if (flag) return id;
      id++;
    }
  }

  async showApp() {
    if (!this.AppState) {
      noteLists = await this.getNoteList();

      const urlNoteLists = this.findNotesByURL(window.location.href, noteLists);

      this.recentNoteLists = urlNoteLists;

      console.log(urlNoteLists, "url");

      const recentNoteInfo = urlNoteLists ? urlNoteLists[0] : null;
      if (recentNoteInfo) {
        this.AppState = true;
        const note = await Storage.getNote(recentNoteInfo.id);
        this.Note = note;
        this.title.render(this.Note.title, urlNoteLists);
        this.content.render(this.Note.content);
      } else {
        await this.createNote();
      }
    }

    this.$app.classList.add("show");

    this.content.$content.focus();
    this.Note.state = true;
  }

  hideApp() {
    this.$app.classList.remove("show");
    this.Note.state = false;
  }

  toggleApp() {
    if (this.$app.classList.contains("show")) {
      this.hideApp();
    } else {
      this.showApp();
    }
  }
}
