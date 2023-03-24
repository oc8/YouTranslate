chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('https://www.youtube.com/watch')) {
    chrome.tabs.sendMessage(tab.id, { action: 'start' });
  }
});
