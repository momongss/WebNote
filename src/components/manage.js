import Storage from "../utils/storage.js";
import { getCurTime, getTimeDiff } from "../utils/time.js";

console.log("managing");
const $noteLists = document.querySelector(".note-list");

(async () => {
  const noteInfoList = await Storage.getNoteInfoList();

  noteInfoList.sort((a, b) => {
    return new Date(b.updateTime) - new Date(a.updateTime);
  });

  for (const noteInfo of noteInfoList) {
    addNoteList(noteInfo);
  }
})();

function addNoteList(noteInfo) {
  // const note = await Storage.getNoteById(id);
  const $list = document.createElement("list");
  $list.className = "note";
  $list.innerHTML = `
    <div class="note-title">${noteInfo.title}</div>
    <a target="_blank" href="${noteInfo.url}" class="note-url">${
    noteInfo.url
  }</a>
    <div class="note-time">${getTimeDiff(noteInfo.updateTime)}</div>
    :`;
  $noteLists.appendChild($list);

  $list.querySelector(".note-url").addEventListener("click", async (e) => {
    e.stopPropagation();
    noteInfo.updateTime = getCurTime();
    await Storage.setNote(noteInfo);
  });

  $list.addEventListener("click", () => {
    chrome.runtime.sendMessage({ path: "docs", noteId: noteInfo.id });
  });
}

// 공부할 것 : 최외각에서 await 을 쓰고 싶은 경우
