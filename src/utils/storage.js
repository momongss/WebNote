import { getURL } from "../const/URL.js";

const storage = chrome.storage.local;
const key = "Note everywhere";

export default class Storage {
  static initStorage() {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    gettingItem.then((re) => {});
  }

  static async setItem(data) {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    gettingItem.then((re) => {
      if (Object.keys(re).length === 0) {
        re = {
          [key]: {
            [getURL()]: data,
          },
        };
      } else {
        re[key][getURL()] = data;
      }
      storage.set({
        [key]: re[key],
      });
    });
  }

  static getItem() {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));
    return gettingItem.then((re) => {
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return re[key][getURL()];
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
