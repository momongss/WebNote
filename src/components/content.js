import Caret from "../utils/caret.js";
import {
  keyBackspace,
  keyTab,
  keySpace,
  keyEnter,
} from "../utils/keyboardInput.js";

export default class Content {
  constructor({ mode, $target, NoteData, saveNote }) {
    this.mode = mode;
    this.$content = $target.querySelector(
      ".content-8f8894ba7a1f5c7a94a170b7dc841190"
    );

    this.timeout = null;

    this.saveNote = saveNote;

    this.addEventListeners();
    this.render(NoteData ? NoteData.content : "<div><br /></div>");
  }

  addEventListeners() {
    let imgResize = false;
    let $img;
    let rect;
    let initWidth;
    let initX;
    this.$content.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "IMG") {
        imgResize = true;
        $img = e.target;
        rect = $img.getBoundingClientRect();
        initWidth = rect.width;
        initX = e.clientX;

        $img.removeAttribute("width");
        $img.removeAttribute("height");
      }
    });

    this.$content.addEventListener("mousemove", (e) => {
      if (imgResize && $img != null) {
        e.preventDefault();
        $img.style.cssText = `
          display: inline-block;
          outline: dashed 6px black;
          width: ${initWidth - initX + e.clientX}px !important`;
      }
    });

    this.$content.addEventListener("mouseup", (e) => {
      if (imgResize) {
        $img.style.cssText = `
        width: ${initWidth - initX + e.clientX}px !important`;
        imgResize = false;
        this.saveNote();
      }
    });

    // target vs currentTarget

    this.$content.addEventListener("click", (e) => {
      if (e.target.tagName !== "IMG") Caret.storeCaret();
    });

    let isControl = false;

    this.$content.addEventListener("keydown", (e) => {
      if (this.$content.childElementCount === 0) {
        const $div = document.createElement("div");
        $div.innerHTML = "<br>";
        this.$content.appendChild($div);

        const range = document.getSelection().getRangeAt(0);
        range.setStart($div, 0);
        range.setEnd($div, 0);
      } else if (this.$content.firstChild.nodeType === Node.TEXT_NODE) {
        const $div = document.createElement("div");
        const textNode = this.$content.firstChild;
        $div.innerHTML = textNode.textContent;
        this.$content.insertBefore($div, textNode);
        textNode.remove();
      } else if (this.$content.firstChild.tagName === "BR") {
        const $div = document.createElement("div");
        const textNode = this.$content.firstChild;
        $div.innerHTML = "<br>";
        this.$content.insertBefore($div, textNode);
        textNode.remove();

        const range = document.getSelection().getRangeAt(0);
        range.setStart($div, 0);
        range.setEnd($div, 0);
      }

      if (e.key === "Tab") {
        e.preventDefault();
        keyTab();
      } else if (e.key === "Backspace") {
        keyBackspace(e);
      } else if (e.keyCode === 0 || e.keyCode === 32) {
        keySpace(e);
      } else if (e.key === "Control") {
        isControl = true;
      } else if (e.key === "z" || e.key === "Z") {
        if (isControl) {
          keyBackspace(e);
        }
      }
    });

    this.$content.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        keyEnter();
      } else if (e.key === "Control") {
        isControl = false;
      }
    });

    this.$content.addEventListener("input", (e) => {
      this.$content.querySelectorAll("img").forEach(($img) => {
        $img.className = "";
      });

      this.$content.querySelectorAll("a").forEach(($anchor) => {
        console.log($anchor);
        $anchor.setAttribute("contenteditable", "false");
      });

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        Caret.storeCaret();
        this.saveNote();
      }, 600);

      const lastChild = this.$content.lastChild;
      if (lastChild == null) return;
      if (
        lastChild.tagName !== "DIV" ||
        lastChild.className !== "" ||
        lastChild.innerHTML.trim() !== "<br>"
      ) {
        const $div = document.createElement("div");
        $div.innerHTML = "<br>";
        this.$content.appendChild($div);
      }
    });
  }

  render(content) {
    this.$content.innerHTML = content;
  }
}
