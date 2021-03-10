const storage = chrome.storage.local;
const mainKey = "Note everywhere";

export default class Storage {
  static async delNote(id) {
    this.setTitle(id, {});
    this.setContent(id, {});
    this.setUrl(id, {});
    this.setCreateTime(id, {});
    this.setUpdateTime(id, {});
    this.setState(id, {});

    const noteIdList = await this.getNoteIdList();

    for (let i = 0; i < noteIdList.length; i++) {
      if (noteIdList[i] === id) {
        noteIdList.splice(i, 1);
        Storage.setNoteIdList(noteIdList);
        return;
      }
    }
  }

  static async getTitle(id) {
    const title = await this.getItem(`title${id}`);
    return title;
  }

  static async getContent(id) {
    return await this.getItem(`content${id}`);
  }

  static async getUrl(id) {
    return await this.getItem(`url${id}`);
  }

  static async getCreateTime(id) {
    return await this.getItem(`createTime${id}`);
  }

  static async getUpdateTime(id) {
    return await this.getItem(`updateTime${id}`);
  }

  static async getState(id) {
    return await this.getItem(`state${id}`);
  }

  static async setTitle(id, title) {
    return await this.setItem(`title${id}`, title);
  }

  static async setContent(id, content) {
    return await this.setItem(`content${id}`, content);
  }

  static async setUrl(id, url) {
    return await this.setItem(`url${id}`, url);
  }

  static async setCreateTime(id, createTime) {
    return await this.setItem(`createTime${id}`, createTime);
  }

  static async setUpdateTime(id, updateTime) {
    return await this.setItem(`updateTime${id}`, updateTime);
  }

  static async setState(id, state) {
    return await this.setItem(`state${id}`, state);
  }

  static async getNote(id) {
    const note = {
      id: id,
      title: await this.getTitle(id),
      content: await this.getContent(id),
      url: await this.getUrl(id),
      createTime: await this.getCreateTime(id),
      updateTime: await this.getUpdateTime(id),
      state: await this.getState(id),
    };

    return note;
  }

  static setNote(note) {
    if (note.title != null) this.setTitle(note.id, note.title);
    if (note.content != null) this.setContent(note.id, note.content);
    if (note.url != null) this.setUrl(note.id, note.url);
    if (note.createTime != null) this.setCreateTime(note.id, note.createTime);
    if (note.updateTime != null) this.setUpdateTime(note.id, note.updateTime);
    if (note.state != null) this.setState(note.id, note.state);
  }

  static async getNoteIdList() {
    return await this.getItem("noteIdList");
  }

  static setNoteIdList(noteIdList) {
    this.setItem("noteIdList", noteIdList);
  }

  static async getNoteInfoList() {
    const noteIdList = await this.getNoteIdList();
    const noteInfoList = [];
    for (const id of noteIdList) {
      noteInfoList.push({
        id: id,
        title: await this.getTitle(id),
        url: await this.getUrl(id),
        createTime: await this.getCreateTime(id),
        updateTime: await this.getUpdateTime(id),
      });
    }

    return noteInfoList;
  }

  static setNoteInfoList(noteInfoList) {
    const noteIdList = [];
    for (const noteInfo of noteInfoList) {
      noteIdList.push(noteInfo.id);
    }

    Storage.setNoteIdList(noteIdList);
  }

  static delNoteById(id) {
    this.setNoteById(id, {});
  }

  static getItem(key) {
    let gettingItem = new Promise((resolve) =>
      storage.get(mainKey + key, resolve)
    );

    return gettingItem.then((re) => {
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return re[mainKey + key];
    });
  }

  static setItem(key, data) {
    return new Promise((resolve) => {
      storage.set(
        {
          [mainKey + key]: data,
        },
        resolve
      );
    }).catch((err) => {
      console.warn(err);
    });
  }

  static clearStorage() {
    storage.clear(function () {
      const error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
  }

  static printStorage() {
    let gettingItem = new Promise((resolve) =>
      storage.get(mainKey + "noteLists", resolve)
    );
    gettingItem.then((re) => {
      Object.keys(re[mainKey + "noteLists"]).forEach((url) => {
        console.log(url);
      });
      Object.keys(re[mainKey + "noteLists"]).forEach((url) => {
        console.log(re[mainKey + "noteLists"][url]);
      });
    });

    gettingItem = new Promise((resolve) =>
      storage.get(mainKey + "recentNoteId", resolve)
    );
    gettingItem.then((re) => {
      console.log(re);
    });
  }
}

// throw e , console.error 차이
// 위에서 resolve 가 어떻게 쓰이고 있는지

// re constructor 가 뭔지. 왜 썼는지.
