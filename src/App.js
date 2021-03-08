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
    console.log(mode);

    this.NoteLists = await Storage.getNoteList();

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
        const note = await Storage.getNoteById(recentNoteInfo.id);
        this.Note = note;
        if (this.Note.state) {
          this.$app.classList.add("show");
        } else {
          this.$app.classList.remove("show");
        }
      }
    } else if (mode === "manage") {
      const note = await Storage.getNoteById(noteId);
      this.Note = note;
    } else {
      console.error("모드 에러");
    }

    console.log(this.Note);

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
        Storage.getNoteList().then((noteLists) => {
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
    $logo.addEventListener("click", () => {
      chrome.runtime.sendMessage({ path: "manage" });
    });

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

    const $exitBtn = this.$app.querySelector(".closeBtn");
    $exitBtn.addEventListener("click", () => {
      this.hideApp();
    });
  }

  findNoteByURL(url, NoteLists) {
    for (let i = NoteLists.length - 1; i >= 0; i--) {
      if (NoteLists[i].url === url) {
        return NoteLists[i];
      }
    }
    return null;
  }

  async deleteNote() {
    await Storage.delNoteById(this.Note.id);
    const noteLists = await Storage.getNoteList();
    this.NoteLists = noteLists ? noteLists : [];

    for (let i = 0; i < this.NoteLists.length; i++) {
      if (this.NoteLists[i].id === this.Note.id) {
        this.AppState = false;
        this.NoteLists.splice(i, 1);
        await Storage.setNoteList(this.NoteLists);
        this.hideApp();
        return;
      }
    }
  }

  async createNote() {
    console.log("createMode");

    this.AppState = true;

    const noteLists = await Storage.getNoteList();
    this.NoteLists = noteLists ? noteLists : [];

    const note = {
      id: this.createNewId(this.NoteLists),
      url: window.location.href,
      createTime: getCurTime(),
    };

    this.NoteLists.push(note);

    this.Note = Object.assign({}, note);
    this.Note.title = "제목 없는 문서";
    this.Note.updateTime = getCurTime();
    this.Note.state = false;
    this.Note.content = "<div><br /></div>";
    this.title.render(this.Note.title);
    this.content.render(this.Note.content);

    await Storage.setNoteList(this.NoteLists);
    await Storage.setNoteById(this.Note.id, this.Note);
  }

  saveNote() {
    this.Note.title = this.title.$title.innerHTML;
    this.Note.content = this.content.$content.innerHTML;
    this.Note.updateTime = getCurTime();

    Storage.setNoteById(this.Note.id, this.Note);
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
      this.NoteLists = await Storage.getNoteList();
      const recentNoteInfo = this.findNoteByURL(
        window.location.href,
        this.NoteLists
      );
      if (recentNoteInfo) {
        this.AppState = true;
        const note = await Storage.getNoteById(recentNoteInfo.id);
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
