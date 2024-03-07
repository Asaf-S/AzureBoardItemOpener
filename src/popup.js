document.getElementById("submitButton").addEventListener("click", () => {
  const numberInput = document.getElementById("numberInput");
  const number = numberInput.value;
  if (number) {
    chrome.runtime.sendMessage({ action: "openUrl", number });
    // window.close();
  } else {
    alert("Please enter a number");
  }
});
