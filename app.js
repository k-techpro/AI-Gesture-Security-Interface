import { CONFIG } from "./config.js";
import { initHandSystem, updateHandSystem } from "./hand-writing.js";
import { initPersonSystem, updatePersonSystem } from "./person-tracking.js";
import { initMotionSystem, updateMotionSystem } from "./motion.js";
import { updateStatusUI, drawAllOverlays, clearOverlay } from "./ui-overlay.js";

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");

overlay.width = window.innerWidth;
overlay.height = window.innerHeight;

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: CONFIG.videoWidth, height: CONFIG.videoHeight },
    audio: false
  });
  video.srcObject = stream;
  await video.play();
}

async function init() {
  await startCamera();
  await initHandSystem(video);
  await initPersonSystem(video);
  await initMotionSystem(video);

  requestAnimationFrame(loop);
}

async function loop() {
  clearOverlay(ctx, overlay);

  const motionData = await updateMotionSystem(video);
  const personData = await updatePersonSystem(video, overlay);
  const handData = await updateHandSystem(video, overlay);

  updateStatusUI(motionData, personData, handData);
  drawAllOverlays(ctx, motionData, personData, handData);

  requestAnimationFrame(loop);
}

init();