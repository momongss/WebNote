import Title from "./components/title.js";
import Docs from "./components/docs.js";
import Storage from "./utils/storage.js";

import { getTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";

let classThis;

export default class App {
  NoteData = null;
  NoteLists = [];
  $title = null;
  $docs = null;

  constructor($app) {
    classThis = this;

    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$docs = $app.querySelector(".docs");

    console.log("app running");

    this.loadNoteLists().then((NoteLists) => {
      console.log(NoteLists);
      this.NoteLists = NoteLists;

      if (NoteLists == null || NoteLists.length === 0) {
        this.showNoteLists();
        this.setNoteData();
      } else {
        const url = window.location.href;
        this.showNoteLists(NoteLists);
        this.setNoteData(this.findNoteByURL(url, NoteLists));
      }

      this.render(this.NoteData);

      this.title = new Title(
        this.$app,
        this.NoteData,
        this.hideApp,
        this.saveNote
      );
      this.docs = new Docs(
        this.$app,
        this.NoteData,
        this.hideApp,
        this.toggleApp,
        this.saveNote
      );
    });
  }

  render() {
    if (this.NoteData.state) {
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
      console.log("tab");
      chrome.runtime.sendMessage({ open: true });
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
      if (classThis.NoteLists[i].id === classThis.NoteData.id) {
        classThis.NoteLists.splice(i, 1);
        classThis.hideAppDown();
        classThis.createNote();
        Storage.setItem(classThis.NoteLists);
        return;
      }
    }
  }

  createNote() {
    classThis.NoteData = {
      id: classThis.createNewId(),
      title: "제목 없는 문서",
      url: window.location.href,
      content: "<div><br /></div>",
      createTime: getTime(),
      updateTime: getTime(),
      state: false,
    };

    classThis.title.render(classThis.NoteData.title);
    classThis.docs.render(classThis.NoteData.content);

    classThis.NoteLists.push(classThis.NoteData);
  }

  saveNote() {
    classThis.NoteData.title = classThis.$title.innerHTML;
    classThis.NoteData.content = classThis.$docs.innerHTML;
    classThis.NoteData.updateTime = getTime();

    Storage.setItem(classThis.NoteLists);
  }

  async loadNoteLists() {
    return await Storage.getItem();
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

  setNoteData(noteData) {
    if (noteData == null) {
      console.log("새로운 노트");
      classThis.NoteData = {
        id: classThis.createNewId(),
        title: "제목 없는 문서",
        url: window.location.href,
        content: "<div><br /></div>",
        createTime: getTime(),
        updateTime: getTime(),
        state: false,
      };
      classThis.NoteLists.push(classThis.NoteData);
    } else {
      classThis.NoteData = noteData;
    }
  }

  showApp() {
    classThis.$app.style.animationDuration = "1.2s";
    classThis.$app.style.animationName = "web-docs-app-slidein";
    classThis.$app.style.right = "20px";
    classThis.$docs.focus();

    classThis.NoteData.state = true;
    classThis.saveNote();
  }

  hideApp() {
    classThis.$app.style.animationDuration = "1.2s";
    classThis.$app.style.animationName = "web-docs-app-slideout";
    classThis.$app.style.right = "-520px";
    classThis.NoteData.state = false;
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
    classThis.NoteData.state = false;
  }
}
