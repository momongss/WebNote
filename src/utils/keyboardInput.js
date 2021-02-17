function keyBackspace() {
  const selection = document.getSelection();
  if (selection.anchorOffset - 3 <= 0) {
    return;
  }

  const newRange = document.createRange();
  newRange.setStart(selection.anchorNode, selection.anchorOffset - 3);
  newRange.setEnd(selection.anchorNode, selection.anchorOffset);
  if (newRange.toString().trim().length === 0) {
    newRange.deleteContents();
  }
}

function keyTab() {
  document.execCommand("insertText", false, "    ");
}

class KeyAlt {
  constructor() {
    this.isAltPressed = false;
  }
}

const keyAlt = new KeyAlt();

export { keyBackspace, keyTab, keyAlt };
