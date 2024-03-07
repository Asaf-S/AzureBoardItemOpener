chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openUrl") {
    const url = `https://abc.com?id=${request.number}`;
    chrome.tabs.create({ url });
  }
});
