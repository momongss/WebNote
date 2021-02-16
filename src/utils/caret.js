export default class Caret {
  static restoreCaret(caret) {
    const $docs = document.querySelector(".docs");
    if (caret == null) {
      caret = document.createRange();
      caret.setStart($docs.firstChild, 0);
      caret.setEnd($docs.firstChild, 0);
    }
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(caret);
  }

  static getCaret() {
    const selection = document.getSelection();
    const caret = selection.getRangeAt(0);
    return caret;
  }

  static setCaretLast() {
    const $docs = document.querySelector(".docs");
    const caret = document.createRange();

    // const node = $docs.lastChild.firstChild;
    // caret.setStart(node, node.length);
    // caret.setEnd(node, node.length);

    document.getSelection().addRange(caret);
  }
}
