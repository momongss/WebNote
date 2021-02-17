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
      classThis.NoteLists = NoteLists;

      if (NoteLists == null || NoteLists.length === 0) {
        this.showNoteLists();
        this.setNoteData();
      } else {
        this.showNoteLists(NoteLists);
        console.log(NoteLists[NoteLists.length - 1]);
        this.setNoteData(NoteLists[NoteLists.length - 1]);
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
      // this.$app.style.animationName = "slideout";
    }

    const $createBtn = classThis.$app.querySelector("#createBtn");
    $createBtn.addEventListener("click", () => {
      classThis.createNote();
    });

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
      console.log("tab");
      chrome.tabs.create({
        url: "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/options.html",
      });
    });

    const $exitBtn = this.$app.querySelector(".closeBtn");
    $exitBtn.addEventListener("click", () => {
      classThis.hideApp();
    });
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
        console.log(id);
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
      console.log("노트 불러와짐.");
      classThis.NoteData = noteData;
    }
  }

  showApp() {
    classThis.$app.style.animationName = "web-docs-app-slidein";
    classThis.$app.style.right = "20px";
    classThis.$docs.focus();

    classThis.NoteData.state = true;
    classThis.saveNote();
  }

  hideApp() {
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
}
