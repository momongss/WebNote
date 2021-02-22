import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";

import { getCurTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

let classThis;

export default class App {
  Note = null;
  NoteLists = [];
  $title = null;
  $content = null;
  mode = null;

  constructor({ $app, mode, noteId }) {
    classThis = this;

    this._constructor($app, mode, noteId);
  }

  async _constructor($app, mode, noteId) {
    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$content = $app.querySelector(".content");

    this.mode = mode;

    console.log("app running");

    const NoteLists = await Storage.getItem("noteLists");

    this.NoteLists = NoteLists;

    if (NoteLists == null || NoteLists.length === 0) {
      this.showNoteLists();
      this.setNoteData();
    } else {
      this.showNoteLists(NoteLists);
      this.setNoteData(
        mode === "normal"
          ? this.findNoteByURL(window.location.href, NoteLists)
          : this.findNoteById(noteId, NoteLists)
      );
    }

    this.title = new Title({
      $target: this.$app,
      NoteData: this.Note,
      saveNote: this.saveNote,
      hideNote: this.mode === "normal" ? this.hideApp : null,
    });
    this.content = new Content({
      $target: this.$app,
      NoteData: this.Note,
      saveNote: this.saveNote,
      hideNote: this.mode === "normal" ? this.hideApp : null,
      toggleNote: this.mode === "normal" ? this.toggleApp : null,
    });

    if (this.mode === "normal") {
      this._render_normal();
    } else if (this.mode == "manage") {
      this._render_manage();
    }
  }

  _render_manage() {}

  _render_normal() {
    if (this.Note.state) {
      this.$app.style.right = "20px";
    } else {
      this.$app.style.right = "-520px";
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = true;
      } else if (e.key === "Escape") {
        classThis.hideApp();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      } else if (keyAlt.isAltPressed && (e.key === "w" || e.key === "W")) {
        classThis.toggleApp();
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
      classThis.createNote();
      classThis.$app.style.right = "-520px";
      setTimeout(classThis.showApp, 200);
    });

    const $deleteBtn = this.$app.querySelector("#deleteBtn");
    $deleteBtn.addEventListener("click", () => {
      console.log("trash!");
      classThis.deleteNote();
    });

    const $exitBtn = this.$app.querySelector(".closeBtn");
    $exitBtn.addEventListener("click", () => {
      classThis.hideApp();
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
    for (let i = 0; i < classThis.NoteLists.length; i++) {
      if (classThis.NoteLists[i].id === classThis.Note.id) {
        classThis.NoteLists.splice(i, 1);
        classThis.hideAppDown();
        classThis.createNote();
        Storage.setItem("noteLists", classThis.NoteLists);
        return;
      }
    }
  }

  createNote() {
    classThis.Note = {
      id: classThis.createNewId(),
      title: "제목 없는 문서",
      url: window.location.href,
      content: "<div><br /></div>",
      createTime: getCurTime(),
      updateTime: getCurTime(),
      state: false,
    };

    classThis.title.render(classThis.Note.title);
    classThis.content.render(classThis.Note.content);

    classThis.NoteLists.push(classThis.Note);
  }

  async saveNote() {
    classThis.Note.title = classThis.$title.innerHTML;
    classThis.Note.content = classThis.$content.innerHTML;
    classThis.Note.updateTime = getCurTime();
    console.log(classThis.Note);

    console.log("saving note");

    const tmpNoteLists = await Storage.getItem("noteLists");

    Storage.setItem("noteLists", classThis.NoteLists);
    Storage.setItem("recentNoteId", classThis.Note.id);
  }

  async getRecentNoteId() {}

  async getNoteLists() {
    return await Storage.getItem("noteLists");
  }

  createNewId() {
    let id = 0;
    while (true) {
      let flag = true;
      for (const note of classThis.NoteLists) {
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

  setNoteData(note) {
    if (note == null) {
      console.log("새로운 노트");
      classThis.Note = {
        id: classThis.createNewId(),
        title: "제목 없는 문서",
        url: window.location.href,
        content: "<div><br /></div>",
        createTime: getCurTime(),
        updateTime: getCurTime(),
        state: false,
      };
      classThis.NoteLists.push(classThis.Note);
    } else {
      classThis.Note = note;
    }
  }

  showApp() {
    classThis.$app.style.animationDuration = "1.2s";
    classThis.$app.style.animationName = "web-docs-app-slidein";
    classThis.$app.style.right = "20px";
    classThis.$content.focus();

    classThis.Note.state = true;
  }

  hideApp() {
    classThis.$app.style.animationDuration = "1.2s";
    classThis.$app.style.animationName = "web-docs-app-slideout";
    classThis.$app.style.right = "-520px";
    classThis.Note.state = false;
  }

  toggleApp() {
    if (classThis.$app.style.right === "20px") {
      classThis.hideApp();
    } else {
      classThis.showApp();
    }
  }

  hideAppDown() {
    classThis.$app.style.animationDuration = "3.6s";
    classThis.$app.style.animationName = "web-docs-app-slideout-down";
    classThis.$app.style.top = "50%";
    classThis.$app.style.right = "-520px";
    classThis.Note.state = false;
  }
}
