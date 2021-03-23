import Caret from "./caret.js";

const removeHeadings = (node) => {
  node.classList.remove("h1");
  node.classList.remove("h2");
  node.classList.remove("h3");
};

const removeTabs = (node) => {
  node.classList.remove("tab1");
  node.classList.remove("tab2");
  node.classList.remove("tab3");
  node.classList.remove("tab4");
  node.classList.remove("tab5");
};

function keyBackspace(e) {
  const range = document.getSelection().getRangeAt(0);
  let node = range.startContainer;
  while (
    !node.parentElement.classList.contains("content") &&
    node.tagName !== "BODY"
  ) {
    node = node.parentElement;
  }

  if (!(range.startOffset === 0 && range.endOffset === 0)) {
    return;
  }
  if (
    node.classList.contains("h1") ||
    node.classList.contains("h2") ||
    node.classList.contains("h3")
  ) {
    console.log("hit");
    e.preventDefault();
    removeHeadings(node);
  } else if (node.classList.contains("tab1")) {
    e.preventDefault();
    node.classList.remove("tab1");
  } else if (node.classList.contains("tab2")) {
    e.preventDefault();
    node.classList.add("tab1");
    node.classList.remove("tab2");
  } else if (node.classList.contains("tab3")) {
    e.preventDefault();
    node.classList.add("tab2");
    node.classList.remove("tab3");
  } else if (node.classList.contains("tab4")) {
    e.preventDefault();
    node.classList.add("tab3");
    node.classList.remove("tab4");
  } else if (node.classList.contains("tab5")) {
    e.preventDefault();
    node.classList.add("tab4");
    node.classList.remove("tab5");
  }
}

function keyTab() {
  const range = document.getSelection().getRangeAt(0);
  let node = range.startContainer;
  while (
    !node.parentElement.classList.contains("content") &&
    node.tagName !== "BODY"
  ) {
    node = node.parentElement;
  }

  if (node.classList.contains("tab1")) {
    removeTabs(node);
    node.classList.add("tab2");
  } else if (node.classList.contains("tab2")) {
    removeTabs(node);
    node.classList.add("tab3");
  } else if (node.classList.contains("tab3")) {
    removeTabs(node);
    node.classList.add("tab4");
  } else if (node.classList.contains("tab4")) {
    removeTabs(node);
    node.classList.add("tab5");
  } else if (node.classList.contains("tab5")) {
    // pass
  } else {
    node.classList.add("tab1");
  }
}

function keySpace(e) {
  const anchorNode = Caret.getCurrentLine();
  const line = anchorNode.textContent;
  if (line === "#") {
    e.preventDefault();
    anchorNode.parentElement.classList.add("h1");
    anchorNode.parentElement.classList.remove("h2");
    anchorNode.parentElement.classList.remove("h3");
    anchorNode.parentElement.innerHTML = "";
  } else if (line === "##") {
    e.preventDefault();
    anchorNode.parentElement.classList.add("h2");
    anchorNode.parentElement.classList.remove("h1");
    anchorNode.parentElement.classList.remove("h3");
    anchorNode.parentElement.innerHTML = "";
  } else if (line === "###") {
    e.preventDefault();
    anchorNode.parentElement.classList.add("h3");
    anchorNode.parentElement.classList.remove("h1");
    anchorNode.parentElement.classList.remove("h2");
    anchorNode.parentElement.innerHTML = "";
  }
}

function keyEnter() {
  const range = document.getSelection().getRangeAt(0);
  const $newLine = range.startContainer;
  removeHeadings($newLine);
}

class KeyAlt {
  constructor() {
    this.isAltPressed = false;
  }
}

const keyAlt = new KeyAlt();

export { keyBackspace, keyTab, keySpace, keyEnter, keyAlt };
