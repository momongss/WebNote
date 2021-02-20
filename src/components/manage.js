import Storage from "../utils/storage.js";

const $noteLists = document.querySelector(".note-list");

Storage.getItem("noteLists").then((NoteLists) => {
  NoteLists.forEach((note) => {
    addNoteList(note);
  });
});

function addNoteList(note) {
  console.log(note.title, note.id, note.updateTime, note.url);
  const $list = document.createElement("list");
  $list.className = "note";
  $list.innerHTML = `
    <div class="note-title">${note.title}</div>
    <a target="_blank" href="${note.url}" class="note-url">${note.url}</a>
    <div class="note-time"></div>
    <i id="option" class="fas fa-ellipsis-v"></i>
    ;`;
  $noteLists.appendChild($list);

  $list.querySelector(".note-url").addEventListener("click", () => {
    Storage.setItem("recentNoteId", note.id);
  });
}
