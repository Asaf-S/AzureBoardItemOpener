const settings = document.getElementById("settings");
const numberInput = document.getElementById("numberInput");
const submitButton = document.getElementById("submitButton");
const settingsButton = document.getElementById("settingsButton");
const urlInput = document.getElementById("urlInput");
const saveUrlButton = document.getElementById("saveUrlButton");
const resetUrlButton = document.getElementById("resetUrlButton");

// ------------------------------------------------------------------------------
// Storage and background worker related functions
// ------------------------------------------------------------------------------

async function getStoredUrl() {
  const response = await chrome.runtime.sendMessage({ action: "getUrl" });
  return response.url;
}

async function setStoredUrl(url) {
  chrome.runtime.sendMessage({ action: "setUrl", url });
}

async function refreshSettingInput() {
  const url = await getStoredUrl();
  urlInput.value = url;
  // console.log(`url=${url}`);
}

async function openAzureDevOpsItem(number) {
  chrome.runtime.sendMessage({ action: "openUrl", number });
}

// -----------------------------------------------------------------
// Initial load
// -----------------------------------------------------------------

// Initial setup to get the stored URL and update the input field
window.addEventListener("load", async () => {
  await refreshSettingInput();
  numberInput.focus();
});


// ------------------------------------------------------------------------------
// Submit to open URL
// ------------------------------------------------------------------------------

// Submit click
submitButton.addEventListener("click", async () => {
  const number = numberInput.value;
  if (number) {
    openAzureDevOpsItem(number);
    // window.close();
  } else {
    alert("Please enter a number");
  }
});

// Submit key press
document.body.addEventListener("keyup", function (event) {
  event.preventDefault();
  const doesUrlInputHasTheFocus = document.activeElement === urlInput;
  if (!doesUrlInputHasTheFocus) {
    if (event.key === "Enter" || event.keyCode === 13) {
      submitButton.click();
    }
  }
});

// -----------------------------------------------------------------
// Settings
// -----------------------------------------------------------------

// Setting click
settingsButton.addEventListener("click", async () => {
  settings.classList.toggle("hidden");
});

// Settings Save click
saveUrlButton.addEventListener("click", async () => {
  const url = urlInput.value;
  if (url) {
    setStoredUrl(url);
    // settings.classList.add("hidden");
  } else {
    alert("Please enter a valid URL");
  }
});

// Settings Reset click
resetUrlButton.addEventListener("click", async () => {
  if (confirm("Are you sure you want to reset the URL?")) {
    await setStoredUrl(); // No URL entered
    await refreshSettingInput();
  } else {
    console.log(`pop.resetUrlButton.click = canceled`);
  }
});
