let read = false;

function handleMessageError(error) {
	if (error) {
		console.log(`Error: ${error}`);
	}
}

document.getElementById('status').addEventListener('click', () => {
	const voiceURI = document.getElementById('voice-select').value;
	if (read) {
		document.getElementById('status').textContent = 'start';
		read = false;
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, {}, handleMessageError);
		});
		displaySubtitles(true);
	}
	else {
		document.getElementById('status').textContent = 'stop';
		read = true;
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'start', voiceURI }, {}, handleMessageError);
		});
		displaySubtitles(false);
	}
});

window.addEventListener('load', () => {
});

// Choice language and voice
function fillVoiceList() {
  const select = document.getElementById('voice-select');
  const voices = speechSynthesis.getVoices();

	if (!select)
		return;
  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = voice.voiceURI;
    select.appendChild(option);
  });
}

// Wait for the voices to be loaded
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = fillVoiceList;
}

// Fill the voice options
fillVoiceList();

// Display the subtitles
function displaySubtitles(run) {
	const captionsWindow = document.querySelector('.ytp-caption-window');
	if (captionsWindow) {
		if (run)
			captionsWindow.style.opacity = '0 !important';
		else
			captionsWindow.style.opacity = '1';
	}
}
