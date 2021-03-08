import Storage from "../utils/storage.js";
import { getCurTime, getTimeDiff } from "../utils/time.js";

console.log("managing");
const $noteLists = document.querySelector(".note-list");

(async () => {
  const NoteList = [];

  const noteInfoList = await Storage.getNoteList();
  for (const noteInfo of noteInfoList) {
    const note = await Storage.getNoteById(noteInfo.id);
    NoteList.push(note);
  }

  NoteList.sort((a, b) => {
    return new Date(b.updateTime) - new Date(a.updateTime);
  });

  for (const note of NoteList) {
    addNoteList(note);
  }
})();

function addNoteList(note) {
  // const note = await Storage.getNoteById(id);
  const $list = document.createElement("list");
  $list.className = "note";
  $list.innerHTML = `
    <div class="note-title">${note.title}</div>
    <a target="_blank" href="${note.url}" class="note-url">${note.url}</a>
    <div class="note-time">${getTimeDiff(note.updateTime)}</div>
    :`;
  $noteLists.appendChild($list);

  $list.querySelector(".note-url").addEventListener("click", async (e) => {
    note.updateTime = getCurTime();
    await Storage.setNoteById(note.id, note);
    e.stopPropagation();
  });

  $list.addEventListener("click", () => {
    chrome.runtime.sendMessage({ path: "docs", noteId: note.id });
  });
}

// 공부할 것 : 최외각에서 await 을 쓰고 싶은 경우
