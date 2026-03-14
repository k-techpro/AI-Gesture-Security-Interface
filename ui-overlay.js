import { eraseAtPoint } from "./eraser.js";

const motionStatus = document.getElementById("motionStatus");
const personStatus = document.getElementById("personStatus");
const handStatus = document.getElementById("handStatus");
const modeStatus = document.getElementById("modeStatus");

export function clearOverlay(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function updateStatusUI(motionData, personData, handData) {
  motionStatus.textContent = motionData.motionDetected ? "Motion: Detected" : "Motion: None";
  personStatus.textContent = personData.personDetected ? "Person: Detected" : "Person: None";
  handStatus.textContent = handData.handDetected ? "Hand: Detected" : "Hand: None";
  modeStatus.textContent = "Mode: " + handData.mode;
}

export function drawAllOverlays(ctx, motionData, personData, handData) {
  if (personData.box) {
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 3;
    ctx.strokeRect(personData.box.x, personData.box.y, personData.box.w, personData.box.h);
  }

  if (handData.strokes) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 4;

    for (const stroke of handData.strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }

  if (handData.eraserPoint) {
    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(handData.eraserPoint.x, handData.eraserPoint.y, 30, 0, Math.PI * 2);
    ctx.stroke();
  }
}