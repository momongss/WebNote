export default class Caret {
  caret = null;

  static restoreCaret() {
    const $content = document.querySelector(
      ".content-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    if (this.caret == null) {
      this.caret = document.createRange();
      this.caret.setStart($content.firstChild, 0);
      this.caret.setEnd($content.firstChild, 0);
    }
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(this.caret);
  }

  static storeCaret() {
    const selection = document.getSelection();
    this.caret = selection.getRangeAt(0);
    return this.caret;
  }

  static setCaret($el) {
    $el.select();
  }

  static setCaretbyIndex($el, index) {
    this.caret = document.createRange();
    this.caret.setStart($el, index);
    this.caret.setEnd($el, index);

    document.getSelection().addRange(this.caret);
  }

  static getCurrentLine() {
    const selection = document.getSelection();
    return selection.anchorNode;
  }
}
