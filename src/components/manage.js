import Storage from "../utils/storage.js";
import { getCurTime, getTimeDiff } from "../utils/time.js";

console.log("managing");
const $noteLists = document.querySelector(".note-list");
const $search = document.querySelector(".search");

const $totalBtn = document.querySelector(".total");
const $staredBtn = document.querySelector(".important");

(async () => {
  const noteInfoList = await Storage.getNoteInfoList();
  renderNoteList(noteInfoList);

  let timeout = null;
  $search.addEventListener("input", (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      search($search.value, noteInfoList);
    }, 200);
  });

  $totalBtn.addEventListener("click", (e) => {
    renderNoteList(noteInfoList);
  });

  $staredBtn.addEventListener("click", (e) => {
    const staredList = [];
    for (const note of noteInfoList) {
      if (note.star === true) {
        staredList.push(note);
      }
    }

    renderNoteList(staredList);
  });
})();

function search(target, noteInfoList) {
  target = target.toUpperCase();

  const searchedList = [];
  for (const note of noteInfoList) {
    const title = note.title.toUpperCase();
    const url = note.url.toUpperCase();
    if (isMatching(title, target) || isMatching(url, target)) {
      searchedList.push(note);
    }
  }

  renderNoteList(searchedList);

  function isMatching(title, target) {
    if (title.includes(target)) return true;
    else return false;
  }
}

function renderNoteList(noteInfoList) {
  noteInfoList.sort((a, b) => {
    return new Date(b.updateTime) - new Date(a.updateTime);
  });

  $noteLists.innerHTML = "";

  for (const noteInfo of noteInfoList) {
    const starUrl = noteInfo.star === true ? "star_b" : "star_e";

    const $list = document.createElement("list");
    $list.className = "note";
    $list.innerHTML = `
      <div class="delete">삭제</div>
      <button class="option-btn"><img src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/more.svg" alt=":"></button>
      <img id="starBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/${starUrl}.svg" alt="문서">
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
    const $starBtn = $list.querySelector("#starBtn");

    if (noteInfo.star === true) $starBtn.classList.add("stared");

    $starBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if ($starBtn.classList.contains("stared")) {
        $starBtn.classList.remove("stared");
        $starBtn.src =
          "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_e.svg";
        Storage.setStar(noteInfo.id, false);
      } else {
        $starBtn.classList.add("stared");
        $starBtn.src =
          "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/star_b.svg";
        Storage.setStar(noteInfo.id, true);
      }
    });

    $optionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      $delete.classList.toggle("show");
    });

    $delete.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      $list.remove();
      Storage.deleteNote(noteInfo.id);
    });

    $optionBtn.addEventListener("blur", (e) => {
      $delete.classList.remove("show");
    });
  }
}

// 공부할 것 : 최외각에서 await 을 쓰고 싶은 경우
