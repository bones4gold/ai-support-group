let voices = [];
let isMuted = false;
let voiceQueue = [];
let isSpeaking = false;
let lastSpokenText = "";

export function loadVoices(callback) {
  const synth = window.speechSynthesis;

  const load = () => {
    const voicesList = synth.getVoices();
    if (voicesList.length > 0) {
      voices = voicesList;
      callback(voices);
    } else {
      setTimeout(load, 200);
    }
  };

  const dummy = new SpeechSynthesisUtterance("");
  synth.speak(dummy);
  load();
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function isMutedState() {
  return isMuted;
}

export function speak(text, agentName, customVoices = {}) {
  if (isMuted || !window.speechSynthesis || !text.trim()) return;

  if (text === lastSpokenText) return;
  lastSpokenText = text;

  const chunks = splitTextIntoChunks(text);
  chunks.forEach((chunk, index) => {
    voiceQueue.push({ text: chunk, agentName, delay: index === 0 ? 0 : 300 });
  });

  if (!isSpeaking) {
    processQueue(customVoices);
  }
}

function splitTextIntoChunks(text, maxWords = 25) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }

  return chunks;
}

function processQueue(customVoices) {
  if (voiceQueue.length === 0) {
    isSpeaking = false;
    return;
  }

  isSpeaking = true;
  const { text, agentName, delay } = voiceQueue.shift();

  setTimeout(() => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 1.25;

    const preferredDefaults = {
      Sam: "Google US English",
      Ivy: "Google UK English Female",
      Jordan: "Google UK English Male",
      Leo: "Google espaniol de Estados Unidos" 
    };

    const selectedVoice = voices.find((v) =>
      customVoices[agentName]
        ? v.voiceURI === customVoices[agentName]
        : preferredDefaults[agentName]
        ? v.name.includes(preferredDefaults[agentName])
        : false
    );

    utter.voice = selectedVoice || voices[0] || null;

    utter.onend = () => {
      isSpeaking = false;
      processQueue(customVoices);
    };

    utter.onerror = () => {
      isSpeaking = false;
      processQueue(customVoices);
    };

    synth.speak(utter);
  }, delay);
}