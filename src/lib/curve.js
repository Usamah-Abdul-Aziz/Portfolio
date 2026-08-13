/**
 * Small geometry helper for smooth, hand-drawn-feeling curves — used by the
 * site's connecting "thread" motif that runs from the Hero wave down into
 * the Experience timeline.
 */

// Catmull-Rom spline through an ordered list of {x,y} control points,
// sampled into a dense polyline suitable for a smooth SVG path.
export function sampleCatmullRom(points, samplesPerSegment = 14) {
  const pts = points;
  const n = pts.length;
  const result = [];

  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;

    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      result.push({ x, y });
    }
  }
  result.push(pts[n - 1]);
  return result;
}

export function samplesToPath(samples) {
  return samples
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}
