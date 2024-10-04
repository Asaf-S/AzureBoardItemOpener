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

function deprecatedGetClipboardContent() {
  const dummyInput = document.createElement("input");
  document.body.appendChild(dummyInput);
  dummyInput.focus();
  document.execCommand("paste");
  const clipboardContent = dummyInput.value;
  document.body.removeChild(dummyInput);
  console.log("Clipboard content:", clipboardContent);
  return clipboardContent;
  // Process the clipboard content here
}

async function getClipboardContent() {
  try {
    const clipboardContent = await navigator.clipboard.readText();
    return clipboardContent;
  } catch (err) {
    try {
      return deprecatedGetClipboardContent();
    } catch (err2) {
      console.error("Failed to read clipboard contents!\nErr:", err, "Err2:", err2);
      return "";
    }
  }
}

// -----------------------------------------------------------------
// Initial load
// -----------------------------------------------------------------

// Initial setup to get the stored URL and update the input field
window.addEventListener("load", async () => {
  await refreshSettingInput();
  numberInput.focus();
});

// A trigger when the default pop-up window is opened
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(
    getClipboardContent().then((txt) => {
      if (numberInput) {
        console.log("Original clipboard text:", txt);
        numberInput.value = txt;
        numberInput.focus();
        numberInput.select();
      } else {
        console.log("numberInput wasn't loaded yet");
      }
    }),
    50
  );
  console.log("Popup opened");
  // Add any other actions you want to perform when the popup opens
});

numberInput.addEventListener("change", (event) => {
  numberInput.value = removeNonDigits(event.target.value);
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

// -----------------------------------------------------------------
// Utils
// -----------------------------------------------------------------

function removeNonDigits(str) {
  return str.replace(/\D/g, "");
}
