export default class Caret {
  caret = null;

  static restoreCaret() {
    const $content = document.querySelector(".content");
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

  static setCaretbyIndex($el, index) {
    this.caret = document.createRange();
    this.caret.setStart($el.lastChild, index);
    this.caret.setEnd($el.lastChild, index);

    document.getSelection().addRange(this.caret);
  }

  static selectTextAll($element) {
    let sel, range;
    if (window.getSelection && document.createRange) {
      //Browser compatibility
      sel = window.getSelection();
      if (sel.toString() == "") {
        //no text selection
        window.setTimeout(function () {
          range = document.createRange(); //range object
          range.selectNodeContents($element); //sets Range
          sel.removeAllRanges(); //remove all ranges from selection
          sel.addRange(range); //add Range to a Selection.
        }, 1);
      }
    } else if (document.selection) {
      //older ie
      sel = document.selection.createRange();
      if (sel.text == "") {
        //no text selection
        range = document.body.createTextRange(); //Creates TextRange object
        range.moveToElementText($element); //sets Range
        range.select(); //make selection.
      }
    }
  }
}
