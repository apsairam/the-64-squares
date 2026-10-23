"""Trace the supplied chess renders into normalized 3D profiles.

The set is a single front view of each turned piece, so its alpha silhouette
becomes a lathe profile. The knight uses the new profile render as its source:
only the turned base is taken from that image, while the head, neck and mane are
modelled in three dimensions by `gen.js`. Run from the project root:

    python scripts/pieces/extract-set.py
"""

import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "chess pieces"
KNIGHT_SOURCE = ROOT / "kniight 3d" / "knight-profile.png"
OUT = Path(__file__).with_name("set-profiles.js")

TYPES = ["pawn", "knight", "bishop", "rook", "queen", "king"]
CUT = {
    "pawn": 1.0,
    "knight": 0.42,
    "bishop": 1.0,
    "rook": 0.79,
    "queen": 0.78,
    "king": 0.81,
}
SAMPLES = 180


def largest_component(mask):
    """Return the largest 8-connected component of a boolean mask."""
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    best = []
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(y, x)])
            seen[y, x] = True
            component = []
            while queue:
                cy, cx = queue.popleft()
                component.append((cy, cx))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy + dy, cx + dx
                        if (
                            0 <= ny < h
                            and 0 <= nx < w
                            and mask[ny, nx]
                            and not seen[ny, nx]
                        ):
                            seen[ny, nx] = True
                            queue.append((ny, nx))
            if len(component) > len(best):
                best = component
    out = np.zeros_like(mask, dtype=bool)
    for y, x in best:
        out[y, x] = True
    return out


def trace_boundary(mask):
    """Moore-neighbour boundary trace, returning points in (x, y) order."""
    padded = np.pad(mask, 1, constant_values=False)
    ys, xs = np.nonzero(padded)
    top = ys.min()
    start = (int(top), int(xs[ys == top].min()))
    directions = [
        (0, 1),
        (1, 1),
        (1, 0),
        (1, -1),
        (0, -1),
        (-1, -1),
        (-1, 0),
        (-1, 1),
    ]
    current = start
    backtrack = (0, -1)
    contour = [start]
    for _ in range(200000):
        start_index = directions.index(backtrack)
        moved = False
        for step in range(8):
            direction = directions[(start_index + 1 + step) % 8]
            nxt = (current[0] + direction[0], current[1] + direction[1])
            if padded[nxt]:
                backtrack = (-direction[0], -direction[1])
                current = nxt
                contour.append(current)
                moved = True
                break
        if not moved:
            break
        if current == start and len(contour) > 3:
            break
    return [(x - 1, y - 1) for y, x in contour]


def rdp(points, epsilon):
    """Ramer-Douglas-Peucker simplification for a closed/open polyline."""
    if len(points) < 3:
        return points
    first = np.asarray(points[0], dtype=float)
    last = np.asarray(points[-1], dtype=float)
    line = last - first
    length = np.hypot(*line)
    if length == 0:
        distances = [np.hypot(*(np.asarray(point) - first)) for point in points]
    else:
        distances = [
            abs(line[0] * (first[1] - point[1]) - (first[0] - point[0]) * line[1])
            / length
            for point in points
        ]
    index = int(np.argmax(distances))
    if distances[index] <= epsilon:
        return [points[0], points[-1]]
    left = rdp(points[: index + 1], epsilon)
    right = rdp(points[index:], epsilon)
    return left[:-1] + right


def normalize(points, height, axis_x, bottom):
    return [
        (float(round((x - axis_x) / height, 5)), float(round((bottom - y) / height, 5)))
        for x, y in points
    ]


def symmetric_profile(mask, cut):
    ys, xs = np.nonzero(mask)
    y0, y1 = ys.min(), ys.max()
    height = y1 - y0 + 1
    bottom = y1
    centers = []
    for y in range(y0, y1 + 1):
        row = np.where(mask[y])[0]
        if len(row):
            centers.append((row.min() + row.max()) / 2)
    axis_x = float(np.median(centers))

    rows = []
    for index in range(SAMPLES + 1):
        fraction = cut * index / SAMPLES
        y = int(round(bottom - fraction * (height - 1)))
        row = np.where(mask[y])[0]
        if not len(row):
            rows.append(rows[-1] if rows else (0.0, fraction))
            continue
        radius = (row.max() - row.min() + 1) / 2 / height
        rows.append((radius, fraction))

    radii = np.array([row[0] for row in rows])
    if len(radii) >= 5:
        padded = np.pad(radii, 2, mode="edge")
        radii = np.convolve(padded, np.ones(5) / 5, mode="valid")
    radii[0] = rows[0][0]
    radii[-1] = rows[-1][0]

    points = [[0.0, 0.0]]
    for radius, fraction in zip(radii, [row[1] for row in rows]):
        points.append([round(float(radius), 5), round(float(fraction), 5)])
    if cut < 0.999:
        points.append([0.0, cut])
    elif points[-1][0] > 0.0015:
        points.append([0.0, 1.0])
    return points, axis_x, bottom, height


def main():
    blocks = []
    for name in TYPES:
        source = KNIGHT_SOURCE if name == "knight" else SOURCE / f"{name}.png"
        image = Image.open(source).convert("RGBA")
        alpha = np.array(image.getchannel("A"))
        mask = largest_component(alpha > 32)
        cut = CUT[name]

        if name == "knight":
            base, _, _, height = symmetric_profile(mask, cut)
            blocks.append(
                f"  knight: {{\n"
                f"    cut: {cut},\n"
                f"    base: {json.dumps(base)},\n"
                f"  }},"
            )
            print(
                f"{name}: {len(base)} base profile points, height {height}px"
            )
            continue

        points, axis_x, bottom, height = symmetric_profile(mask, cut)
        blocks.append(
            f"  {name}: {{\n    cut: {cut},\n    points: {json.dumps(points)},\n  }},"
        )
        print(f"{name}: {len(points)} profile points, height {height}px")

    OUT.write_text(
        "/* Generated by extract-set.py from the supplied chess renders and\n"
        "   the new knight profile. Coordinates are normalised to the piece\n"
        "   height, with y=0 at the bottom and y=1 at the top. Do not edit by\n"
        "   hand. */\n"
        "export const SET_PROFILES = {\n" + "\n".join(blocks) + "\n};\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
