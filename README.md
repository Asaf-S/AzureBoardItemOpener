# AzureBoardItemOpener
Opens Azure DevOps board item

Todo:
1. On first load, force set the settings instead of redirecting the user to a 404 page with the default URL
1. Auto-set the keyboard shortcut

## Request permissions (and how they are used)
| **Request permission**        | **Usage**                                                                                                                                                                                                                       |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Local Storage**  | Saves the project's name locally on your browser, so you won't have to re-type it every time.                                                                                                                                          |
| **Clipboard Read** | Whenever the extension is opened, the (numeric) content of the clipboard is already pasted in the right place to save you 1 action. Instead of opening the extension, pasting the Azure board item ID, and hitting submit - you can now just open the extension, and hit submit, as the Azure b

## Privacy
Everything is locally, nothing is being sent to an external server