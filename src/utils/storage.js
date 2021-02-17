const storage = chrome.storage.local;
const key = "Note everywhere";

export default class Storage {
  static initStorage() {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    gettingItem.then((re) => {});
  }

  static setItem(data) {
    storage.set({
      [key]: data,
    });
  }

  static getItem() {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    return gettingItem.then((re) => {
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return re[key];
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
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    return gettingItem.then((re) => {
      Object.keys(re[key]).forEach((url) => {
        console.log(url);
      });
      Object.keys(re[key]).forEach((url) => {
        console.log(re[key][url]);
      });
    });
  }
}
