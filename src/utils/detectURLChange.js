import { getURL } from "../const/URL.js";

export function detectURLChange(refreshApp) {
  let currentPage = location.href;

  let refresh = setInterval(function () {
    if (currentPage != location.href) {
      currentPage = location.href;

      console.log("url changed");
      clearInterval(refresh);
      refreshApp();
    }
  }, 500);
}
