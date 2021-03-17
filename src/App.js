import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";
import Caret from "./utils/caret.js";

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
      note: this.Note,
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
        this.title.render(this.Note);
        this.content.render(this.Note.content);
      },

      onStarClick: async (star) => {
        console.log(star);
        this.Note.star = star;
        Storage.setStar(this.Note.id, this.Note.star);
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
      } else if (keyAlt.isAltPressed && e.key === "1") {
        this.toggleApp();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.hideApp();
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
      } else if (keyAlt.isAltPressed && e.key === "1") {
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
      } else if (e.key === "-") {
        console.log("resize");
        window.resizeBy(
          window.screen.availWidth / 2,
          window.screen.availHeight / 2
        );
      }
    });

    // 이 버튼 이벤트들 싹다 title 로 보내기.

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
      // 여기서 왜 setTimeout 을 썻더라?
    });

    const $deleteBtn = this.$app.querySelector("#deleteBtn");
    $deleteBtn.addEventListener("click", async () => {
      console.log("trash!");
      await this.deleteNote();
      const urlNoteList = await this.getUrlNoteList();

      const recentNote = urlNoteList ? urlNoteList[0] : null;
      if (recentNote != null) {
        this.AppState = true;
        const note = await Storage.getNote(recentNote.id);
        this.Note = note;
        this.title.render(this.Note);
        this.content.render(this.Note.content);
      } else {
        this.hideApp();
        this.AppState = false;
      }

      this.showAlarmUI("노트가 삭제되었습니다");
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

  showAlarmUI(message) {
    const $alarmUI = document.querySelector(".alarm-ui");
    $alarmUI.innerHTML = message;
    $alarmUI.classList.add("show");
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      $alarmUI.innerHTML = "";
      $alarmUI.classList.remove("show");
    }, 2000);
  }

  async deleteNote() {
    await Storage.deleteNote(this.Note.id);
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
    this.Note.star = false;
    this.Note.content = "<div><br /></div>";

    this.title.render(this.Note);
    this.content.render(this.Note.content);

    this.title.$title.focus();
    Caret.selectLineAll(this.title.$title);

    Storage.setNoteInfoList(noteList);
    Storage.setNote(this.Note);
  }

  saveNote() {
    this.Note.title = this.title.$title.value;
    this.Note.content = this.content.$content.innerHTML;
    this.Note.updateTime = getCurTime();

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
        this.title.render(this.Note);
        this.content.render(this.Note.content);
      } else {
        await this.createNote();
      }
    }

    this.$app.classList.add("show");

    this.content.$content.focus();
    this.Note.state = true;
    this.saveNote();

    this.showAlarmUI("새로운 노트가 열렸습니다");
  }

  hideApp() {
    this.$app.classList.remove("show");
    this.Note.state = false;
    this.saveNote();

    this.title.$title.blur();
    this.content.$content.blur();
  }

  toggleApp() {
    if (this.$app.classList.contains("show")) {
      this.hideApp();
    } else {
      this.showApp();
    }
  }
}
