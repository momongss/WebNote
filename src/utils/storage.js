const storage = chrome.storage.local;
const mainKey = "Note everywhere";

export default class Storage {
  static initStorage() {
    let gettingItem = new Promise((resolve) => storage.get(mainKey, resolve));
    gettingItem.then((re) => {});
  }

  static setItem(key, data) {
    storage.set({
      [mainKey + key]: data,
    });
  }

  static getItem(key) {
    let gettingItem = new Promise((resolve) =>
      storage.get(mainKey + key, resolve)
    );

    return gettingItem.then((re) => {
      console.log(re);
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return re[mainKey + key];
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
