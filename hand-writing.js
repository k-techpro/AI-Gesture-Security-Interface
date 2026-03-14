import { FilesetResolver, HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

let handLandmarker;
let strokes = [];
let currentStroke = null;

export async function initHandSystem() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "./assets/hand_landmarker.task"
    },
    runningMode: "VIDEO",
    numHands: 1
  });
}

function isIndexOnlyUp(lm) {
  const indexUp = lm[8].y < lm[6].y;
  const middleUp = lm[12].y < lm[10].y;
  const ringUp = lm[16].y < lm[14].y;
  const pinkyUp = lm[20].y < lm[18].y;
  return indexUp && !middleUp && !ringUp && !pinkyUp;
}

function isOpenHand(lm) {
  return (
    lm[8].y < lm[6].y &&
    lm[12].y < lm[10].y &&
    lm[16].y < lm[14].y &&
    lm[20].y < lm[18].y
  );
}

export async function updateHandSystem(video, canvas) {
  const now = performance.now();
  const result = handLandmarker.detectForVideo(video, now);

  const data = {
    handDetected: false,
    mode: "Idle",
    strokes,
    eraserPoint: null,
    landmarks: null
  };

  if (!result.landmarks || result.landmarks.length === 0) {
    currentStroke = null;
    return data;
  }

  const lm = result.landmarks[0];
  data.handDetected = true;
  data.landmarks = lm;

  const x = lm[8].x * canvas.width;
  const y = lm[8].y * canvas.height;

  if (isIndexOnlyUp(lm)) {
    data.mode = "Writing";

    if (!currentStroke) {
      currentStroke = [];
      strokes.push(currentStroke);
    }

    currentStroke.push({ x, y });
  } else if (isOpenHand(lm)) {
    data.mode = "Erase";
    currentStroke = null;

    const ex = ((lm[0].x + lm[5].x + lm[17].x) / 3) * canvas.width;
    const ey = ((lm[0].y + lm[5].y + lm[17].y) / 3) * canvas.height;

    data.eraserPoint = { x: ex, y: ey };
  } else {
    currentStroke = null;
  }

  return data;
}