let synth = window.speechSynthesis;
let lastSubtitle = 'start';
let run = false;
let all = '';
let utterance = new SpeechSynthesisUtterance();

function speak(text) {
	if (synth.speaking) {
		synth.cancel();
	}

	return new Promise((resolve, reject) => {
		if (!text)
			text = '';
		utterance.text = text;
		synth.speak(utterance);
		utterance.onend = resolve;
		utterance.onerror = reject;
	});
}

async function checkSubtitles() {
	let subtitles = document.querySelectorAll('.ytp-caption-segment');
	if (subtitles.length > 0) {
		let lastElement = subtitles[0];
		let text = lastElement.textContent;
		// console.log(text.search(lastSubtitle), text, lastSubtitle);
		if (text.search(lastSubtitle) == -1) {
			all += lastSubtitle;
		}
		lastSubtitle = text;
	}
	return true;
}

async function speakLoop() {
	while (run) {
		if (all != '') {
			const curent = all;
			all = '';
			await speak(curent);
		}
		else {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}
	// return true;
}

async function readLoop() {
	while (run) {
		await checkSubtitles();
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'start') {
		const voices = synth.getVoices();
		const selectedVoice = voices.find((voice) => voice.voiceURI === request.voiceURI);
		if (selectedVoice) {
			utterance.voice = selectedVoice;
			utterance.lang = selectedVoice.lang;
		}
		// utterance.rate = 1;
		toggleMute();
		toggleSubtitles(selectedVoice.lang);
		run = true;
		readLoop();
		speakLoop();
		sendResponse({ result: 'Started' });
	} else if (request.action === 'stop') {
		run = false;
		synth.cancel();
		sendResponse({ result: 'Stopped' });
	}
	return true;
});


// Mute the video
function toggleMute() {
	const muteButton = document.querySelector('.ytp-mute-button');
	if (muteButton) {
		// if (muteButton.ariaPressed != 'true') {
		// 	muteButton.click();
		// }
	}
}

// Activate the subtitles
function toggleSubtitles(lang) {
	const captionsButton = document.querySelector('.ytp-subtitles-button');
	if (captionsButton) {
		if (captionsButton.ariaPressed != 'true') {
			captionsButton.click();
		}
	}

	setTimeout(() => {
		const trackMenu = document.querySelector('.ytp-caption-window.ytp-caption-window-rollup');
		if (trackMenu) {
			const tracks = trackMenu.querySelectorAll('.ytp-caption-window-text');
			for (const track of tracks) {
				if (track.textContent.includes('Français')) {
					track.click();
					break;
				}
			}
		}
	}, 500);
}

