import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";

import { getTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

let classThis;

export default class App {
  Note = null;
  NoteLists = [];
  $title = null;
  $content = null;

  constructor($app) {
    this._constructor($app);
  }

  async _constructor($app) {
    classThis = this;

    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$content = $app.querySelector(".content");

    console.log("app running");

    const NoteLists = await Storage.getItem("noteLists");
    const recentNoteId = await Storage.getItem("recentNoteId");

    this.NoteLists = NoteLists;

    if (NoteLists == null || NoteLists.length === 0) {
      this.showNoteLists();
      this.setNoteData();
    } else {
      this.showNoteLists(NoteLists);
      this.setNoteData(this.findNoteById(recentNoteId, NoteLists));
    }

    this.render();

    this.title = new Title(this.$app, this.Note, this.hideApp, this.saveNote);
    this.content = new Content(
      this.$app,
      this.Note,
      this.hideApp,
      this.toggleApp,
      this.saveNote
    );
  }

  render() {
    console.log(this.Note.state);

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
      createTime: getTime(),
      updateTime: getTime(),
      state: false,
    };

    classThis.title.render(classThis.Note.title);
    classThis.content.render(classThis.Note.content);

    classThis.NoteLists.push(classThis.Note);
  }

  saveNote() {
    classThis.Note.title = classThis.$title.innerHTML;
    classThis.Note.content = classThis.$content.innerHTML;
    classThis.Note.updateTime = getTime();

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
        createTime: getTime(),
        updateTime: getTime(),
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
    classThis.saveNote();
  }

  hideApp() {
    classThis.$app.style.animationDuration = "1.2s";
    classThis.$app.style.animationName = "web-docs-app-slideout";
    classThis.$app.style.right = "-520px";
    classThis.Note.state = false;
    classThis.saveNote();
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
