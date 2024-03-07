const DEFAULT_URL = "https://dev.azure.com/org/project/_workitems/edit/{{input}}"; // Default URL

async function getStoredUrl() {
  try {
    const storedUrl = await chrome.storage.sync.get("url");
    const result = storedUrl.url || DEFAULT_URL;
    console.log(`bg.getStoredUrl=${result}`);
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function storeUrl(url) {
  const parsedURL = url || DEFAULT_URL;
  console.log(`bg.storeUrl=${url}, parsedURL=${parsedURL}`);
  await chrome.storage.sync.set({ url: parsedURL });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    if (request.action === "openUrl") {
      const url = await getStoredUrl();
      const finalUrl = url.replace("{{input}}", request.number);
      chrome.tabs.create({ url: finalUrl });
    } else if (request.action === "setUrl") {
      await storeUrl(request.url);
    } else if (request.action === "getUrl") {
      const url = await getStoredUrl();
      sendResponse({ url });
    }
  })();
  return true;
});
