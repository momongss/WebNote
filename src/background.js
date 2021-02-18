chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.create({
    url: "chrome-extension://mgffajndabdbnejmehloekjclmaikagb/index.html",
  });
});
