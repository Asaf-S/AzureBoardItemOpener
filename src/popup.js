const settings = document.getElementById("settings");
const numberInput = document.getElementById("numberInput");
const submitButton = document.getElementById("submitButton");
const settingsButton = document.getElementById("settingsButton");
const urlInput = document.getElementById("urlInput");
const saveUrlButton = document.getElementById("saveUrlButton");
const resetUrlButton = document.getElementById("resetUrlButton");

// Setting click
settingsButton.addEventListener("click", async () => {
  settings.classList.toggle("hidden");

  const url = await getStoredUrl();
  urlInput.value = url;
  console.log(`url=${url}`);
});

submitButton.addEventListener("click", async () => {
  const number = numberInput.value;
  if (number) {
    chrome.runtime.sendMessage({ action: "openUrl", number });
    // window.close();
  } else {
    alert("Please enter a number");
  }
});

saveUrlButton.addEventListener("click", async () => {
  const url = urlInput.value;
  if (url) {
    setStoredUrl(url);
    // settings.classList.add("hidden");
  } else {
    alert("Please enter a valid URL");
  }
});

resetUrlButton.addEventListener("click", async () => {
  if (confirm("Are you sure you want to reset the URL?")) {
    await setStoredUrl(); // No URL entered

    const url = await getStoredUrl();
    urlInput.value = url;
    console.log(`url=${url}`);
  } else {
    console.log(`pop.resetUrlButton.click = canceled`);
  }
});

// Initial setup to get the stored URL and update the input field
window.addEventListener("load", async () => {
  const url = await getStoredUrl();
  urlInput.value = url;
  console.log(`url=${url}`);
});

async function getStoredUrl() {
  const response = await chrome.runtime.sendMessage({ action: "getUrl" });
  return response.url;
}

async function setStoredUrl(url) {
  chrome.runtime.sendMessage({ action: "setUrl", url });
}
