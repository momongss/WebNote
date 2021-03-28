import Caret from "./caret.js";

const removeHeadings = (node) => {
  node.classList.remove("h1-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("h2-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("h3-8f8894ba7a1f5c7a94a170b7dc841190");
};

const removeTabs = (node) => {
  node.classList.remove("tab1-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("tab2-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("tab3-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("tab4-8f8894ba7a1f5c7a94a170b7dc841190");
  node.classList.remove("tab5-8f8894ba7a1f5c7a94a170b7dc841190");
};

function keyBackspace(e) {
  const range = document.getSelection().getRangeAt(0);
  let node = range.startContainer;
  if (node == null) return;
  while (
    !node.parentElement.classList.contains(
      "content-8f8894ba7a1f5c7a94a170b7dc841190"
    ) &&
    node.tagName !== "BODY"
  ) {
    node = node.parentElement;
  }

  if (!(range.startOffset === 0 && range.endOffset === 0)) {
    return;
  }
  if (
    node.classList.contains("h1-8f8894ba7a1f5c7a94a170b7dc841190") ||
    node.classList.contains("h2-8f8894ba7a1f5c7a94a170b7dc841190") ||
    node.classList.contains("h3-8f8894ba7a1f5c7a94a170b7dc841190")
  ) {
    e.preventDefault();
    removeHeadings(node);
  } else if (node.classList.contains("tab1-8f8894ba7a1f5c7a94a170b7dc841190")) {
    e.preventDefault();
    node.classList.remove("tab1-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab2-8f8894ba7a1f5c7a94a170b7dc841190")) {
    e.preventDefault();
    node.classList.add("tab1-8f8894ba7a1f5c7a94a170b7dc841190");
    node.classList.remove("tab2-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab3-8f8894ba7a1f5c7a94a170b7dc841190")) {
    e.preventDefault();
    node.classList.add("tab2-8f8894ba7a1f5c7a94a170b7dc841190");
    node.classList.remove("tab3-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab4-8f8894ba7a1f5c7a94a170b7dc841190")) {
    e.preventDefault();
    node.classList.add("tab3-8f8894ba7a1f5c7a94a170b7dc841190");
    node.classList.remove("tab4-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab5-8f8894ba7a1f5c7a94a170b7dc841190")) {
    e.preventDefault();
    node.classList.add("tab4-8f8894ba7a1f5c7a94a170b7dc841190");
    node.classList.remove("tab5-8f8894ba7a1f5c7a94a170b7dc841190");
  }
}

function keyTab() {
  const range = document.getSelection().getRangeAt(0);
  let node = range.startContainer;
  while (
    !node.parentElement.classList.contains(
      "content-8f8894ba7a1f5c7a94a170b7dc841190"
    ) &&
    node.tagName !== "BODY"
  ) {
    node = node.parentElement;
  }

  if (node.classList.contains("tab1-8f8894ba7a1f5c7a94a170b7dc841190")) {
    removeTabs(node);
    node.classList.add("tab2-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab2-8f8894ba7a1f5c7a94a170b7dc841190")) {
    removeTabs(node);
    node.classList.add("tab3-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab3-8f8894ba7a1f5c7a94a170b7dc841190")) {
    removeTabs(node);
    node.classList.add("tab4-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab4-8f8894ba7a1f5c7a94a170b7dc841190")) {
    removeTabs(node);
    node.classList.add("tab5-8f8894ba7a1f5c7a94a170b7dc841190");
  } else if (node.classList.contains("tab5-8f8894ba7a1f5c7a94a170b7dc841190")) {
    //
  } else {
    node.classList.add("tab1-8f8894ba7a1f5c7a94a170b7dc841190");
  }
}

function keySpace(e) {
  const anchorNode = Caret.getCurrentLine();
  const line = anchorNode.textContent;
  if (line === "#") {
    e.preventDefault();
    anchorNode.parentElement.classList.add(
      "h1-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h2-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h3-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.innerHTML = "";
  } else if (line === "##") {
    e.preventDefault();
    anchorNode.parentElement.classList.add(
      "h2-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h1-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h3-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.innerHTML = "";
  } else if (line === "###") {
    e.preventDefault();
    anchorNode.parentElement.classList.add(
      "h3-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h1-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.classList.remove(
      "h2-8f8894ba7a1f5c7a94a170b7dc841190"
    );
    anchorNode.parentElement.innerHTML = "";
  }
}

function keyEnter() {
  const range = document.getSelection().getRangeAt(0);
  const $newLine = range.startContainer;
  if ($newLine == null) return;
  removeHeadings($newLine);
}

class KeyAlt {
  constructor() {
    this.isAltPressed = false;
  }
}

const keyAlt = new KeyAlt();

export { keyBackspace, keyTab, keySpace, keyEnter, keyAlt };
