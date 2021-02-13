import { URL } from "../const/URL.js";

const key = "Note everywhere";
const storage = chrome.storage.local;

export default class Storage {
  static setItem(data) {
    console.log(memoLists);
    storage.set({
      [key]: JSON.stringify(data),
    });
  }

  static getItem() {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    return gettingItem.then((re) => {
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return JSON.parse(JSON.parse(re[key]));
    });
  }

  static clearStorage() {
    chrome.storage.local.clear(function () {
      const error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
  }
}
