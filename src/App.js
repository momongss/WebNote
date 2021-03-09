import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";

import { getCurTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

export default class App {
  Note = null;
  NoteLists = [];

  AppState = true; // 현재 열려있는 노트가 있는지, 없는지

  constructor({ $app, mode, noteId }) {
    this._constructor($app, mode, noteId);
  }

  async _constructor($app, mode, noteId) {
    this.$app = $app;

    console.log("app running");

    this.NoteLists = await Storage.getNoteInfoList();

    console.log(this.NoteLists);

    if (mode === "normal") {
      const recentNoteInfo = this.findNoteByURL(
        window.location.href,
        this.NoteLists
      );
      if (recentNoteInfo == null) {
        this.AppState = false;
      } else {
        this.AppState = true;
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
      $target: this.$app,
      NoteData: this.Note,
      saveNote: () => {
        this.saveNote();
      },
      hideNote: () => {
        this.hideApp();
      },
    });
    this.content = new Content({
      $target: this.$app,
      NoteData: this.Note,
      saveNote: () => {
        this.saveNote();
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

  findNoteByURL(url, NoteLists) {
    const urlNoteList = [];
    for (const note of NoteLists) {
      if (note.url === url) urlNoteList.push(note);
    }

    if (urlNoteList.length === 0) return null;

    urlNoteList.sort((a, b) => {
      return new Date(b.updateTime) - new Date(a.updateTime);
    });

    return urlNoteList[0];
  }

  deleteNote() {
    this.AppState = false;
    this.hideApp();
    Storage.delNote(this.Note.id);
  }

  async createNote() {
    console.log("createMode");

    this.AppState = true;

    const noteLists = await Storage.getNoteInfoList();
    this.NoteLists = noteLists ? noteLists : [];

    const note = {
      id: this.createNewId(this.NoteLists),
    };

    this.NoteLists.push(note);

    this.Note = Object.assign({}, note);
    this.Note.title = "제목 없는 문서";
    this.Note.url = window.location.href;
    this.Note.createTime = getCurTime();
    this.Note.updateTime = getCurTime();
    this.Note.state = false;
    this.Note.content = "<div><br /></div>";
    this.title.render(this.Note.title);
    this.content.render(this.Note.content);

    Storage.setNoteInfoList(this.NoteLists);
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

  showNoteLists(NoteLists) {}

  async showApp() {
    if (!this.AppState) {
      this.NoteLists = await Storage.getNoteInfoList();
      const recentNoteInfo = this.findNoteByURL(
        window.location.href,
        this.NoteLists
      );
      if (recentNoteInfo) {
        this.AppState = true;
        const note = await Storage.getNote(recentNoteInfo.id);
        this.Note = note;
        this.title.render(this.Note.title);
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
