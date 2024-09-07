(async () => {
  const src = chrome.runtime.getURL("src/main.js");
  const contentScript = await import(src);
})();
