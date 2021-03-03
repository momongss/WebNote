import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";

import { getCurTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

export default class App {
  Note = null;
  NoteLists = [];
  $title = null;
  $content = null;
  mode = null;

  constructor({ $app, mode, noteId }) {
    this._constructor($app, mode, noteId);
  }

  async _constructor($app, mode, noteId) {
    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$content = $app.querySelector(".content");

    this.mode = mode;

    console.log("app running");

    // Storage.getNoteById();

    const NoteLists = await Storage.getItem("noteLists");

    this.NoteLists = NoteLists;

    if (NoteLists == null || NoteLists.length === 0) {
      this.showNoteLists();
      this.setNote();
    } else {
      this.showNoteLists(NoteLists);
      this.setNote(
        mode === "normal"
          ? this.findNoteByURL(window.location.href, NoteLists)
          : this.findNoteById(noteId, NoteLists)
      );
    }

    this.title = new Title({
      $target: this.$app,
      NoteData: this.Note,
      saveNote: () => {
        this.saveNote;
      },
      hideNote:
        this.mode === "normal"
          ? () => {
              this.hideApp();
            }
          : null,
    });
    this.content = new Content({
      $target: this.$app,
      NoteData: this.Note,
      saveNote: () => {
        this.saveNote();
      },
      hideNote:
        this.mode === "normal"
          ? () => {
              this.hideApp();
            }
          : null,
      toggleNote:
        this.mode === "normal"
          ? () => {
              this.toggleApp;
            }
          : null,
    });

    if (this.mode === "normal") {
      this.appEventListeners();
    } else if (this.mode == "manage") {
    }
  }

  appEventListeners() {
    if (this.Note.state) {
      this.$app.style.right = "20px";
    } else {
      this.$app.style.right = "-520px";
    }

    this.$app.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    this.$app.addEventListener("keyup", (e) => {
      e.stopPropagation();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = true;
      } else if (e.key === "Escape") {
        this.hideApp();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      } else if (keyAlt.isAltPressed && (e.key === "w" || e.key === "W")) {
        this.toggleApp();
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
      console.log("manage");
      chrome.runtime.sendMessage({ path: "manage" });
    });

    const $createBtn = this.$app.querySelector("#createBtn");
    $createBtn.addEventListener("click", () => {
      this.createNote();
      this.$app.style.right = "-520px";
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

  findNoteById(id, NoteLists) {
    if (id == null) return NoteLists[NoteLists.length - 1];

    for (const note of NoteLists) {
      if (note.id === id) {
        return note;
      }
    }

    return NoteLists[NoteLists.length - 1];
  }

  findNoteByURL(url, NoteLists) {
    for (let i = NoteLists.length - 1; i >= 0; i--) {
      if (NoteLists[i].url === url) {
        return NoteLists[i];
      }
    }
    return null;
  }

  deleteNote() {
    for (let i = 0; i < this.NoteLists.length; i++) {
      if (this.NoteLists[i].id === this.Note.id) {
        this.NoteLists.splice(i, 1);
        this.hideAppDown();
        this.createNote();
        Storage.setItem("noteLists", this.NoteLists);
        return;
      }
    }
  }

  createNote() {
    this.Note = {
      id: this.createNewId(),
      title: "제목 없는 문서",
      url: window.location.href,
      content: "<div><br /></div>",
      createTime: getCurTime(),
      updateTime: getCurTime(),
      state: false,
    };

    this.title.render(this.Note.title);
    this.content.render(this.Note.content);

    this.NoteLists.push(this.Note);
  }

  async saveNote() {
    console.log(this);
    this.Note.title = this.$title.innerHTML;
    this.Note.content = this.$content.innerHTML;
    this.Note.updateTime = getCurTime();
    console.log(this.Note);

    const tmpNoteLists = await Storage.getItem("noteLists");

    Storage.setItem("noteLists", this.NoteLists);
    Storage.setItem("recentNoteId", this.Note.id);
  }

  async getRecentNoteId() {}

  async getNoteLists() {
    return await Storage.getItem("noteLists");
  }

  createNewId() {
    let id = 0;
    while (true) {
      let flag = true;
      for (const note of this.NoteLists) {
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

  setNote(note) {
    if (note == null) {
      console.log("새로운 노트");
      this.Note = {
        id: this.createNewId(),
        title: "제목 없는 문서",
        url: window.location.href,
        content: "<div><br /></div>",
        createTime: getCurTime(),
        updateTime: getCurTime(),
        state: false,
      };
      this.NoteLists.push(this.Note);
    } else {
      this.Note = note;
    }
  }

  showApp() {
    this.$app.style.animationDuration = "1.2s";
    this.$app.style.animationName = "web-docs-app-slidein";
    this.$app.style.right = "20px";
    this.$content.focus();

    this.Note.state = true;
  }

  hideApp() {
    this.$app.style.animationDuration = "1.2s";
    this.$app.style.animationName = "web-docs-app-slideout";
    this.$app.style.right = "-520px";
    this.Note.state = false;
  }

  toggleApp() {
    console.log("test");
    if (this.$app.style.right === "20px") {
      this.hideApp();
    } else {
      this.showApp();
    }
  }

  hideAppDown() {
    this.$app.style.animationDuration = "3.6s";
    this.$app.style.animationName = "web-docs-app-slideout-down";
    this.$app.style.top = "50%";
    this.$app.style.right = "-520px";
    this.Note.state = false;
  }
}
