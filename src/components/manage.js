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
  const $list = document.createElement("list");
  $list.className = "note";
  $list.innerHTML = `
    <div class="delete">삭제</div>
    <button class="option-btn"><img src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/more.svg" alt=":"></button>
    <div class="note-title">${noteInfo.title}</div>
    <div class="note-time">${getTimeDiff(noteInfo.updateTime)}</div>
    <a target="_blank" href="${noteInfo.url}" class="note-url">${
    noteInfo.url
  }</a>`;
  $noteLists.appendChild($list);

  $list.addEventListener("click", () => {
    chrome.runtime.sendMessage({ path: "docs", noteId: noteInfo.id });
  });

  const $url = $list.querySelector(".note-url");
  $url.addEventListener("click", async (e) => {
    e.stopPropagation();
    noteInfo.updateTime = getCurTime();
    await Storage.setNote(noteInfo);
  });

  const $optionBtn = $list.querySelector(".option-btn");
  const $delete = $list.querySelector(".delete");

  $optionBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    $delete.classList.toggle("show");
  });

  $delete.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    $list.remove();
    Storage.delNote(noteInfo.id);
  });

  $optionBtn.addEventListener("blur", (e) => {
    $delete.classList.remove("show");
  });
}

// 공부할 것 : 최외각에서 await 을 쓰고 싶은 경우
