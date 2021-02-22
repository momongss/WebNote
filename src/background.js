chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.path === "manage") {
    chrome.tabs.create({
      url: `chrome-extension://mgffajndabdbnejmehloekjclmaikagb/manage.html`,
    });
  } else if (message.path === "docs") {
    chrome.tabs.create({
      url: `chrome-extension://mgffajndabdbnejmehloekjclmaikagb/docs.html?${message.noteId}`,
    });
  }
});
