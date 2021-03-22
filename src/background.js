chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.path === "manage") {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/manage.html`,
    });
  } else if (message.path === "docs") {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/docs.html?${message.noteId}`,
    });
  }
});