(async () => {
  const src = chrome.extension.getURL("src/main.js");
  const contentScript = await import(src);
  // contentScript.main();
})();
