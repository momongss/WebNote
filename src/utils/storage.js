const storage = chrome.storage.local;
const mainKey = "e352cadab3cc08";

export default class Storage {
  static async getListingMethod() {
    return await this.getItem("L-method");
  }

  static async setListingMethod(method) {
    await this.setItem("L-method", method);
  }

  static async getNote(id) {
    const note = {
      id: id,
      title: await this.getTitle(id),
      content: await this.getContent(id),
      url: await this.getUrl(id),
      createTime: await this.getCreateTime(id),
      updateTime: await this.getUpdateTime(id),
      star: await this.getStar(id),
      state: await this.getState(id),
      top: await this.getTop(id),
      bottom: await this.getBottom(id),
      width: await this.getWidth(id),
      right: await this.getRight(id),
    };

    return note;
  }

  static setNote(note) {
    if (note.title != null) this.setTitle(note.id, note.title);
    if (note.content != null) this.setContent(note.id, note.content);
    if (note.url != null) this.setUrl(note.id, note.url);
    if (note.createTime != null) this.setCreateTime(note.id, note.createTime);
    if (note.updateTime != null) this.setUpdateTime(note.id, note.updateTime);
    if (note.star != null) this.setStar(note.id, note.star);
    if (note.state != null) this.setState(note.id, note.state);
    if (note.top != null) this.setTop(note.id, note.top);
    if (note.bottom != null) this.setBottom(note.id, note.bottom);
    if (note.width != null) this.setWidth(note.id, note.width);
    if (note.right != null) this.setRight(note.id, note.right);
  }

  static async getNoteIdList() {
    const noteIdList = await this.getItem("noteIdList");
    return noteIdList == null ? [] : noteIdList;
  }

  static setNoteIdList(noteIdList) {
    this.setItem("noteIdList", noteIdList);
  }

  static async getNoteInfoList() {
    let noteIdList = await this.getNoteIdList();
    noteIdList = noteIdList == null ? [] : noteIdList;
    const noteInfoList = [];
    for (const id of noteIdList) {
      noteInfoList.push({
        id: id,
        title: await this.getTitle(id),
        url: await this.getUrl(id),
        createTime: await this.getCreateTime(id),
        updateTime: await this.getUpdateTime(id),
        star: await this.getStar(id),
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

  static async deleteNote(id) {
    this.setTitle(id, {});
    this.setContent(id, {});
    this.setUrl(id, {});
    this.setCreateTime(id, {});
    this.setUpdateTime(id, {});
    this.setStar(id, {});
    this.setState(id, {});
    this.setTop(id, {});
    this.setBottom(id, {});
    this.setWidth(id, {});
    this.setRight(id, {});

    const noteIdList = await this.getNoteIdList();

    for (let i = 0; i < noteIdList.length; i++) {
      if (noteIdList[i] === id) {
        noteIdList.splice(i, 1);
        await Storage.setNoteIdList(noteIdList);
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

  static async getStar(id) {
    return await this.getItem(`star${id}`);
  }

  static async getState(id) {
    return await this.getItem(`state${id}`);
  }

  static async getWidth(id) {
    return await this.getItem(`width${id}`);
  }

  static async getTop(id) {
    return await this.getItem(`top${id}`);
  }

  static async getBottom(id) {
    return await this.getItem(`bottom${id}`);
  }

  static async getRight(id) {
    return await this.getItem(`right${id}`);
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

  static async setStar(id, star) {
    return await this.setItem(`star${id}`, star);
  }

  static async setState(id, state) {
    return await this.setItem(`state${id}`, state);
  }

  static async setWidth(id, width) {
    return await this.setItem(`width${id}`, width);
  }

  static async setTop(id, top) {
    return await this.setItem(`top${id}`, top);
  }

  static async setBottom(id, bottom) {
    return await this.setItem(`bottom${id}`, bottom);
  }

  static async setRight(id, right) {
    return await this.setItem(`right${id}`, right);
  }

  static async setUrlNoteState(url, state) {
    return await this.setItem(`urlNoteState${url}`, state);
  }

  static async getUrlNoteState(url) {
    return await this.getItem(`urlNoteState${url}`);
  }

  static getItem(key) {
    let gettingItem = new Promise((resolve) =>
      storage.get(mainKey + key, resolve)
    );

    return gettingItem.then((re) => {
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return null;
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
      console.error(err);
    });
  }
}
