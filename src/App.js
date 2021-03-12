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
      const urlNoteList = await this.getUrlNoteList();

      const recentNote = urlNoteList ? urlNoteList[0] : null;
      if (recentNote) {
        this.AppState = true;
        this.Note = await Storage.getNote(recentNote.id);
        if (this.Note.state) {
          this.$app.classList.add("show");
        } else {
          this.$app.classList.remove("show");
        }
      } else {
        this.AppState = false;
      }
    } else if (mode === "manage") {
      this.Note = await Storage.getNote(noteId);
    }

    this.title = new Title({
      mode: mode,
      $target: this.$app,
      NoteData: this.Note,
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
        this.title.render(this.Note.title);
        this.content.render(this.Note.content);
      },

      showList: async () => {
        //
        this.sho;
      },
    });
    this.content = new Content({
      mode: mode,
      $target: this.$app,
      NoteData: this.Note,
      saveNote: async () => {
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
      }
    });

    const $logo = this.$app.querySelector("#logo");
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

  findNotesByURL(url, NoteList) {
    const urlNoteList = [];
    for (const note of NoteList) {
      if (note.url === url) urlNoteList.push(note);
    }

    if (urlNoteList.length === 0) return null;

    return urlNoteList;
  }

  deleteNote() {
    this.AppState = false;
    this.hideApp();
    Storage.deleteNote(this.Note.id);
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

  async createNote() {
    console.log("createMode");

    this.AppState = true;

    const noteList = await this.getNoteList();

    const note = {
      id: this.createNewId(noteList),
    };

    noteList.push(note);

    this.Note = Object.assign({}, note);
    this.Note.title = "제목 없는 문서";
    this.Note.url = window.location.href;
    this.Note.createTime = getCurTime();
    this.Note.updateTime = getCurTime();
    this.Note.state = false;
    this.Note.content = "<div><br /></div>";

    this.title.render(this.Note.title);
    this.content.render(this.Note.content);

    Storage.setNoteInfoList(noteList);
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
      const urlNoteList = await this.getUrlNoteList();

      const recentNote = urlNoteList ? urlNoteList[0] : null;
      if (recentNote) {
        this.AppState = true;
        const note = await Storage.getNote(recentNote.id);
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
    this.saveNote();
  }

  hideApp() {
    this.$app.classList.remove("show");
    this.Note.state = false;
    this.saveNote();
  }

  toggleApp() {
    if (this.$app.classList.contains("show")) {
      this.hideApp();
    } else {
      this.showApp();
    }
  }
}
