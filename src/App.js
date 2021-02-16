import Title from "./components/title.js";
import Docs from "./components/docs.js";
import { getTime } from "./utils/time.js";

let classThis;

export default class App {
  NoteData = {
    title: null,
    content: "<div><br /></div>",
    createTime: getTime(),
    updateTime: getTime(),
    state: false,
  };
  $title = null;
  $docs = null;

  constructor($app) {
    classThis = this;

    this.$app = $app;
    this.$title = $app.querySelector(".title");
    this.$docs = $app.querySelector(".docs");

    console.log("app running");

    const title = new Title(this.$app, this.hideApp, this.saveNote);
    const docs = new Docs(
      this.$app,
      this.hideApp,
      this.toggleApp,
      this.saveNote
    );

    this.isAltPressed = false;

    this.render();
  }

  render() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Alt") {
        this.isAltPressed = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt") {
        this.isAltPressed = false;
      } else if (e.key === "w" || e.key === "W") {
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
