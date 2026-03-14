let lastFrameCanvas = document.createElement("canvas");
let lastFrameCtx = lastFrameCanvas.getContext("2d");
let initialized = false;

export async function initMotionSystem(video) {
  lastFrameCanvas.width = video.videoWidth || 640;
  lastFrameCanvas.height = video.videoHeight || 480;
}

export async function updateMotionSystem(video) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

  const current = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  if (!initialized) {
    lastFrameCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    initialized = true;
    return { motionDetected: false };
  }

  const previous = lastFrameCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  let diff = 0;
  for (let i = 0; i < current.data.length; i += 16) {
    diff += Math.abs(current.data[i] - previous.data[i]);
  }

  lastFrameCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

  return {
    motionDetected: diff > 15000
  };
}