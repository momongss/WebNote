(async () => {
  const src = chrome.extension.getURL("src/contentMain.js");
  const contentScript = await import(src);
  // contentScript.main();  chrome 에서 error 발생
})();
