import { FilesetResolver, PoseLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

let poseLandmarker;

export async function initPersonSystem() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "./assets/pose_landmarker.task"
    },
    runningMode: "VIDEO",
    numPoses: 1
  });
}

export async function updatePersonSystem(video, canvas) {
  const result = poseLandmarker.detectForVideo(video, performance.now());

  const data = {
    personDetected: false,
    box: null,
    landmarks: null
  };

  if (!result.landmarks || result.landmarks.length === 0) {
    return data;
  }

  const lm = result.landmarks[0];
  data.personDetected = true;
  data.landmarks = lm;

  const xs = lm.map(p => p.x * canvas.width);
  const ys = lm.map(p => p.y * canvas.height);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  data.box = {
    x: minX - 20,
    y: minY - 20,
    w: (maxX - minX) + 40,
    h: (maxY - minY) + 40
  };

  return data;
}