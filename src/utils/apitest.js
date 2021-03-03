const storage = chrome.storage.local;

export default class apiTest {
  static getItem(key) {
    let gettingItem = new Promise((resolve) => storage.get(key, resolve));

    return gettingItem.then((re) => {
      console.log(re);
      if (Object.keys(re).length === 0 && re.constructor === Object) {
        return [];
      }
      return re[key];
    });
  }

  static setItem(key, data) {
    return new Promise((resolve) => {
      storage.set(
        {
          [key]: data,
        },
        resolve
      );
    }).catch((err) => {
      console.warn(err);
    });
  }
}
