import Storage from "../utils/storage.js";
import { getCurTime, getTimeDiff } from "../utils/time.js";

const $noteLists = document.querySelector(".note-list");
const $search = document.querySelector(".search");

const $totalBtn = document.querySelector(".total");
const $staredBtn = document.querySelector(".important");
const $createBtn = document.querySelector("#createBtn");
const $searchBtn = document.querySelector("#searchBtn");

$createBtn.src = `chrome-extension://${chrome.runtime.id}/assets/plus1.svg`;
$searchBtn.src = `chrome-extension://${chrome.runtime.id}/assets/search.svg`;

$createBtn.addEventListener("click", async (e) => {
  const note = await createNote();
  chrome.runtime.sendMessage({ path: "docs", noteId: note.id });
});

const createNote = async () => {
  const noteIdList = await Storage.getNoteIdList();

  const createNewId = (noteLists) => {
    let newId = 0;
    while (true) {
      let flag = true;
      for (const id of noteLists) {
        if (id === newId) {
          flag = false;
          break;
        }
      }
      if (flag) return newId;
      newId++;
    }
  };

  const newId = createNewId(noteIdList);
  noteIdList.push(newId);
  await Storage.setNoteIdList(noteIdList);

  const Note = {
    id: newId,
  };
  Note.title = "제목 없는 문서";
  Note.url = "";
  Note.createTime = getCurTime();
  Note.updateTime = getCurTime();
  Note.state = false;
  Note.star = false;
  Note.content = "<div><br /></div>";

  await Storage.setNote(Note);
  return Note;
};

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

  $totalBtn.addEventListener("click", async (e) => {
    const noteInfoList = await Storage.getNoteInfoList();
    renderNoteList(noteInfoList);
  });

  $staredBtn.addEventListener("click", async (e) => {
    const noteInfoList = await Storage.getNoteInfoList();
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
  target = target.replace(" ", "").toUpperCase();

  const searchedList = [];
  for (const note of noteInfoList) {
    const title = note.title.replace(" ", "").toUpperCase();
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
    const starUrl = noteInfo.star === true ? "star_b" : "star_m";

    const $list = document.createElement("list");
    $list.className = "note";
    $list.innerHTML = `
      <div class="delete">
        <img src="chrome-extension://${
          chrome.runtime.id
        }/assets/trash.svg" alt="del">
      </div>
      <button class="option-btn">
        <img src="chrome-extension://${
          chrome.runtime.id
        }/assets/more.svg" alt=":">
      </button>
      <div class="star-btn-wrapper">
        <img id="starBtn" src="chrome-extension://${
          chrome.runtime.id
        }/assets/${starUrl}.svg" alt="문서">
      </div>
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
        $starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_e.svg`;
        Storage.setStar(noteInfo.id, false);
      } else {
        $starBtn.classList.add("stared");
        $starBtn.src = `chrome-extension://${chrome.runtime.id}/assets/star_b.svg`;
        Storage.setStar(noteInfo.id, true);
      }
    });

    $optionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      $delete.classList.toggle("show");
    });

    $delete.addEventListener("click", (e) => {
      e.stopPropagation();
      $list.remove();
      Storage.deleteNote(noteInfo.id);
    });

    window.addEventListener("click", (e) => {
      $delete.classList.remove("show");
    });
  }
}
