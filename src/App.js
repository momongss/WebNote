import Title from "./components/title.js";
import Docs from "./components/docs.js";
import { getTime } from "./utils/time.js";

let classThis;

export default class App {
  NoteData = null;
  $title = null;
  $docs = null;

  constructor($app) {
    classThis = this;

    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$docs = $app.querySelector(".docs");

    console.log("app running");

    const NoteLists = this.loadNoteLists();
    if (NoteLists == null || NoteLists.length === 0) {
      this.showNoteLists();
      this.setNoteData();
    } else {
      this.showNoteLists(NoteLists);
      this.setNoteData(NoteLists[0]);
    }

    const title = new Title(
      this.$app,
      this.NoteData,
      this.hideApp,
      this.saveNote
    );
    const docs = new Docs(
      this.$app,
      this.NoteData,
      this.hideApp,
      this.toggleApp,
      this.saveNote
    );

    this.isAltPressed = false;

    this.render(this.NoteData);
  }

  render() {
    window.addEventListener("keydown", (e) => {
      console.log(e.key);
      if (e.key === "Alt") {
        this.isAltPressed = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      console.log(e.key);
      if (e.key === "Alt") {
        this.isAltPressed = false;
      } else if (this.isAltPressed && (e.key === "w" || e.key === "W")) {
        this.toggleApp();
      }
    });

    const $exitBtn = this.$app.querySelector(".closeBtn");
    $exitBtn.addEventListener("click", () => {
      classThis.hideApp();
    });
  }

  saveNote() {
    classThis.NoteData.title = classThis.$title.innerHTML;
    classThis.NoteData.content = classThis.$docs.innerHTML;
    classThis.NoteData.updateTime = getTime();
  }

  loadNoteLists() {}

  showNoteLists(NoteLists) {}

  setNoteData(noteData) {
    if (noteData == null) {
      console.log("새로운 노트");
      classThis.NoteData = {
        id: 0,
        title: "제목 없는 문서",
        url: window.location.href,
        content: "<div><br /></div>",
        createTime: getTime(),
        updateTime: getTime(),
        state: false,
      };
    } else {
      console.log("노트 불러와짐.");
      classThis.NoteData = noteData;
    }
  }

  showApp() {
    classThis.$app.style.animationName = "slidein";
    classThis.$app.style.right = "20px";
    classThis.$docs.focus();

    classThis.NoteData.state = true;
    classThis.saveNote();
  }

  hideApp() {
    classThis.$app.style.animationName = "slideout";
    classThis.$app.style.right = "-520px";
    classThis.NoteData.state = false;
    classThis.saveNote();
  }

  toggleApp() {
    if (classThis.$app.style.animationName === "slidein") {
      classThis.hideApp();
    } else {
      classThis.showApp();
    }
  }
}
