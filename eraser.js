export function eraseAtPoint(strokes, point, radius) {
  return strokes
    .map(stroke =>
      stroke.filter(p => Math.hypot(p.x - point.x, p.y - point.y) > radius)
    )
    .filter(stroke => stroke.length > 1);
}