function restoreCaret(caret) {
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

function getCaret() {
  const selection = document.getSelection();
  const caret = selection.getRangeAt(0);
  return caret;
}

export { restoreCaret, getCaret };
