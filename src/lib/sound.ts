// Synthesized UI sounds (Web Audio, no files). Browsers only allow audio after a
// click or key press, so nothing plays until unlockAudio() runs from one.

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let lastTick = 0;

const MIN_GAP = 0.035; // s; keeps a fast sweep from turning into a buzz

export function unlockAudio() {
  ctx ??= new AudioContext();
  void ctx.resume();
}

function noiseBuffer(ac: AudioContext) {
  if (noise) return noise;
  const length = Math.floor(ac.sampleRate * 0.05);
  noise = ac.createBuffer(1, length, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
}

// A very short, quiet tick: high-passed noise with a 15ms decay.
export function playSoftTick() {
  if (!ctx || ctx.state !== "running") return;
  const ac = ctx;
  const now = ac.currentTime;
  if (now - lastTick < MIN_GAP) return;
  lastTick = now;

  const pitch = 0.92 + Math.random() * 0.16; // slight variation so a sweep isn't robotic

  const tick = ac.createBufferSource();
  tick.buffer = noiseBuffer(ac);
  const highpass = ac.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 4500 * pitch;
  highpass.Q.value = 4;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.11, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
  tick.connect(highpass).connect(gain).connect(ac.destination);
  tick.start(now);
  tick.stop(now + 0.035);
}

// A soft rising "bubble" for link and button clicks. Called from the click
// itself, so it unlocks audio and plays even on the first click of a visit.
export function playBubble() {
  unlockAudio();
  if (!ctx) return;
  const ac = ctx;
  const now = ac.currentTime;
  const pitch = 0.94 + Math.random() * 0.12;

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(380 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(820, now + 0.07);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.13, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.09);
}
