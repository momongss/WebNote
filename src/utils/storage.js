const storage = chrome.storage.local;
const mainKey = "Note everywhere";

export default class Storage {
  static initStorage() {
    let gettingItem = new Promise((resolve) => storage.get(mainKey, resolve));
    gettingItem.then((re) => {});
  }

  static setNoteById(id, note) {
    console.log(id, note);
    this.setItem(`noteId${id}`, note);
  }

  static async getNoteById(id) {
    const note = await this.getItem(`noteId${id}`);
    console.log(note);
    return note;
  }

  static delNoteById(id) {
    this.setNoteById(id, {});
  }

  static async getNoteList() {
    const noteLists = await this.getItem("noteLists");
    return noteLists;
  }

  static async setNoteList(noteLists) {
    return await this.setItem("noteLists", noteLists);
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
