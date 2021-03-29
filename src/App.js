import Title from "./components/title.js";
import Content from "./components/content.js";
import Storage from "./utils/storage.js";
import Caret from "./utils/caret.js";

import { getCurTime } from "./utils/time.js";
import { keyAlt } from "./utils/keyboardInput.js";
import { isEmpty } from "./utils/checkNull.js";

export default class App {
  Note = null;
  running = true;

  constructor({ $app, mode, noteId }) {
    this._constructor($app, mode, noteId);
  }

  async _constructor($app, mode, noteId) {
    this.$app = $app;

    if (mode === "normal") {
      const recentNote = await this.getRecentNote();
      if (recentNote) {
        this.running = true;
        this.Note = await Storage.getNote(recentNote.id);
        if (this.Note.state) {
          this.$app.classList.add("show-8f8894ba7a1f5c7a94a170b7dc841190");
        } else {
          this.$app.classList.remove("show-8f8894ba7a1f5c7a94a170b7dc841190");
        }

        this.$app.style.top = isEmpty(this.Note.top) ? "0px" : this.Note.top;
        this.$app.style.bottom = isEmpty(this.Note.bottom)
          ? "0px"
          : this.Note.bottom;
        this.$app.style.width = isEmpty(this.Note.width)
          ? "440px"
          : this.Note.width;
        this.$app.style.right = isEmpty(this.Note.right)
          ? "0px"
          : this.Note.right;
      } else {
        this.running = false;
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

      openNote: async (id) => {
        this.running = true;
        const note = await Storage.getNote(id);
        this.Note = note;
        this.title.render(this.Note);
        this.content.render(this.Note.content);
      },

      onStarClick: async (star) => {
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
      } else if (e.key === "-") {
        Storage.clearStorage();
        console.log("clear");
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt") {
        keyAlt.isAltPressed = false;
      }
    });

    const $logo = this.$app.querySelector(
      "#logo-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    $logo.addEventListener(
      "click",
      () => {
        chrome.runtime.sendMessage({ path: "manage" });
      },
      true
    );

    const $createBtn = this.$app.querySelector(
      "#createBtn-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    $createBtn.addEventListener("click", async () => {
      await this.createNote();
      this.showApp({ createMode: true });
    });

    const $deleteBtn = this.$app.querySelector(
      "#deleteBtn-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    $deleteBtn.addEventListener("click", async () => {
      await this.deleteNote();

      const recentNote = await this.getRecentNote();
      if (recentNote != null) {
        this.running = true;
        const note = await Storage.getNote(recentNote.id);
        this.Note = note;
        this.title.render(this.Note);
        this.content.render(this.Note.content);
      } else {
        this.hideApp();
        this.running = false;
      }

      this.showAlarmUI("노트가 삭제되었습니다");
    });

    const $closeBtn = this.$app.querySelector(
      "#closeBtn-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    $closeBtn.addEventListener("click", () => {
      this.hideApp();
    });

    // resize event
    let resizeTop = false;
    let resizeBottom = false;
    let resizeLeft = false;
    let resizeRight = false;

    let initX, initY;

    let initTop;
    let initBottom;
    let initWidth;
    let initRight;

    // top
    this.$app
      .querySelector(".resize-btn-top-8f8894ba7a1f5c7a94a170b7dc841190")
      .addEventListener("mousedown", (e) => {
        resizeTop = true;
        initY = e.clientY;
        initTop = parseInt(this.$app.style.top.slice(0, -2));
      });

    // bottom
    this.$app
      .querySelector(".resize-btn-bottom-8f8894ba7a1f5c7a94a170b7dc841190")
      .addEventListener("mousedown", (e) => {
        resizeBottom = true;
        initY = e.clientY;
        initBottom = parseInt(this.$app.style.bottom.slice(0, -2));
      });

    // left
    this.$app
      .querySelector(".resize-btn-left-8f8894ba7a1f5c7a94a170b7dc841190")
      .addEventListener("mousedown", (e) => {
        resizeLeft = true;
        initX = e.clientX;
        initWidth = parseInt(this.$app.style.width.slice(0, -2));
      });

    // right
    this.$app
      .querySelector(".resize-btn-right-8f8894ba7a1f5c7a94a170b7dc841190")
      .addEventListener("mousedown", (e) => {
        resizeRight = true;
        initX = e.clientX;
        initRight = parseInt(this.$app.style.right.slice(0, -2));
        initWidth = parseInt(this.$app.style.width.slice(0, -2));
      });

    this.$app.addEventListener("mouseup", (e) => {
      if (resizeTop || resizeBottom || resizeLeft || resizeRight)
        this.saveNote();
      resizeTop = false;
      resizeBottom = false;
      resizeLeft = false;
      resizeRight = false;
    });

    window.addEventListener("mouseup", (e) => {
      if (resizeTop || resizeBottom || resizeLeft || resizeRight)
        this.saveNote();
      resizeTop = false;
      resizeBottom = false;
      resizeLeft = false;
      resizeRight = false;
    });

    const MINWIDTH = 250;
    window.addEventListener("mousemove", (e) => {
      if (resizeTop) {
        const top = initTop - initY + e.clientY;
        this.$app.style.top = `${top}px`;
      } else if (resizeBottom) {
        const bottom = initBottom + initY - e.clientY;
        this.$app.style.bottom = `${bottom}px`;
      } else if (resizeLeft) {
        const width = initWidth + initX - e.clientX;
        if (width < MINWIDTH) return;
        this.$app.style.width = `${width}px`;
      } else if (resizeRight) {
        const width = initWidth - initX + e.clientX;
        if (width < MINWIDTH) return;
        this.$app.style.right = `${initRight + initX - e.clientX}px`;
        this.$app.style.width = `${width}px`;
      }
    });
  }

  showAlarmUI(message) {
    const $alarmUI = document.querySelector(
      ".alarm-ui-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    $alarmUI.innerHTML = message;
    $alarmUI.classList.add("show-8f8894ba7a1f5c7a94a170b7dc841190");
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      $alarmUI.innerHTML = "";
      $alarmUI.classList.remove("show-8f8894ba7a1f5c7a94a170b7dc841190");
    }, 2000);
  }

  async deleteNote() {
    await Storage.deleteNote(this.Note.id);
  }

  async getRecentNote() {
    // const urlNoteList = await this.getUrlNoteList();
    const urlNoteList = await this.getNoteList();
    return urlNoteList ? urlNoteList[0] : null;
  }

  async getUrlNoteList() {
    const noteLists = await this.getNoteList();
    const urlNoteList = this.findNotesByURL(window.location.href, noteLists);
    return urlNoteList;
  }

  async getNoteList() {
    const noteLists = await Storage.getNoteInfoList();
    noteLists.sort((a, b) => {
      return new Date(b.updateTime) - new Date(a.updateTime);
    });

    return noteLists;
  }

  findNotesByURL(url, NoteList) {
    const urlNoteList = [];
    for (const note of NoteList) {
      if (note.url === url) urlNoteList.push(note);
    }

    if (urlNoteList.length === 0) return null;

    return urlNoteList;
  }

  saveNote() {
    this.Note.title = this.title.$title.value;
    this.Note.content = this.content.$content.innerHTML;
    this.Note.updateTime = getCurTime();
    this.Note.top = this.$app.style.top;
    this.Note.bottom = this.$app.style.bottom;
    this.Note.width = this.$app.style.width;
    this.Note.right = this.$app.style.right;

    Storage.setNote(this.Note);
  }

  showApp({ createMode }) {
    this.$app.classList.add("show-8f8894ba7a1f5c7a94a170b7dc841190");
    this.Note.state = true;
    this.saveNote();

    if (createMode) {
      this.title.$title.focus();
      this.title.$title.select();
    } else {
      this.content.$content.focus();
      Caret.restoreCaret();
    }
  }

  hideApp() {
    this.$app.classList.remove("show-8f8894ba7a1f5c7a94a170b7dc841190");
    if (this.Note == null) return;
    this.Note.state = false;
    this.saveNote();

    this.title.$title.blur();
    this.content.$content.blur();
  }

  async toggleApp() {
    if (this.$app.classList.contains("show-8f8894ba7a1f5c7a94a170b7dc841190")) {
      this.hideApp();
    } else {
      if (this.running) {
        this.showApp({});
      } else {
        this.running = true;

        const recentNote = await this.getRecentNote();
        if (recentNote) {
          const note = await Storage.getNote(recentNote.id);
          this.Note = note;
          this.title.render(this.Note);
          this.content.render(this.Note.content);
          this.showApp({});
        } else {
          await this.createNote();
          this.showApp({ createMode: true });
        }
      }
    }
  }

  async createNote() {
    const noteIdList = await Storage.getNoteIdList();

    const createNewId = (noteLists) => {
      let newId = 0;
      while (true) {
        let flag = true;
        for (const id of noteLists) {
          if (id === newId) {
            flag = false;
            break;
          }
        }
        if (flag) return newId;
        newId++;
      }
    };

    const newId = createNewId(noteIdList);
    noteIdList.push(newId);
    Storage.setNoteIdList(noteIdList);

    console.log(noteIdList, newId);

    this.Note = {
      id: newId,
    };
    this.Note.title = `${document.querySelector("title").innerHTML}`;
    this.Note.url = window.location.href;
    this.Note.createTime = getCurTime();
    this.Note.updateTime = getCurTime();
    this.Note.state = false;
    this.Note.star = false;
    this.Note.content = "<div><br /></div>";

    this.title.render(this.Note);
    this.content.render(this.Note.content);

    Storage.setNote(this.Note);

    this.showAlarmUI("새로운 노트가 열렸습니다");
  }
}
