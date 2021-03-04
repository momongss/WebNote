import Storage from "../utils/storage.js";
import { getTimeDiff } from "../utils/time.js";

console.log("managing");

const $noteLists = document.querySelector(".note-list");

Storage.getNoteList().then((NoteLists) => {
  NoteLists.forEach((note) => {
    addNoteList(note.id);
  });
});

async function addNoteList(id) {
  const note = await Storage.getNoteById(id);
  const timeDiff = getTimeDiff(note.updateTime);

  const $list = document.createElement("list");
  $list.className = "note";
  $list.innerHTML = `
    <div class="note-title">${note.title}</div>
    <a target="_blank" href="${note.url}" class="note-url">${note.url}</a>
    <div class="note-time">${timeDiff}</div>
    :`;
  $noteLists.appendChild($list);

  $list.querySelector(".note-url").addEventListener("click", (e) => {
    e.stopPropagation();
    Storage.setItem("recentNoteId", note.id);
  });

  $list.addEventListener("click", () => {
    chrome.runtime.sendMessage({ path: "docs", noteId: note.id });
  });
}
