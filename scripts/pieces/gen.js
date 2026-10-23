import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SET_PROFILES } from './set-profiles.js';

const FRAMES = 72;
const COLS = 6;
const ROWS = 12;
const CELL_W = 420;
const CELL_H = 525;
const TYPES = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];

const TARGET_HEIGHT = {
  pawn: 1.72,
  knight: 1.98,
  bishop: 2.03,
  rook: 1.9,
  queen: 2.07,
  king: 2.15,
};

const START_ANGLE = {
  pawn: 0.24,
  knight: 0.02,
  bishop: 0.24,
  rook: 0.2,
  queen: 0.18,
  king: 0.18,
};

// The knight sheet opens on the profile render. Keep the frame order aligned
// with that view so the article sculpture rests close to the supplied hero.
const FRAME_OFFSET = {
  knight: 0,
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(1);
renderer.setSize(CELL_W, CELL_H, false);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);

function studioEnvironment() {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x000000);

  const panel = (width, height, color, intensity, position, rotation) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    material.toneMapped = false;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    mesh.position.copy(position);
    mesh.rotation.set(...rotation);
    env.add(mesh);
  };

  // Broad overhead wash.
  panel(14, 14, 0xffffff, 0.48, new THREE.Vector3(0, 7, 0), [Math.PI / 2, 0, 0]);
  // Two large softboxes make the broad white reflections in the supplied set.
  panel(5, 10, 0xffffff, 2.4, new THREE.Vector3(-4.6, 3.4, 3.2), [0, Math.PI / 3, 0]);
  panel(4, 9, 0xffffff, 1.8, new THREE.Vector3(4.4, 3, 3), [0, -Math.PI / 3, 0]);
  // Broad frontal strips put a long white reflection down the front-left.
  panel(2.2, 8, 0xffffff, 3.1, new THREE.Vector3(-2.8, 2.8, 4.6), [0, -0.3, 0]);
  panel(1.6, 7, 0xffffff, 1.7, new THREE.Vector3(2.9, 2.3, 4.4), [0, 0.3, 0]);
  // Bright back wall and a soft front fill keep the chrome from going black.
  panel(10, 8, 0xffffff, 1.3, new THREE.Vector3(0, 3, -5.2), [0, 0, 0]);
  panel(9, 5, 0xffffff, 0.82, new THREE.Vector3(0, 2.2, 6), [0, 0, 0]);
  // A crisp strip adds the long specular line seen on the reference renders.
  panel(1.2, 7, 0xffffff, 2.8, new THREE.Vector3(-3.6, 2.8, 1.6), [0, Math.PI / 2, 0]);

  return pmrem.fromScene(env, 0.025).texture;
}

scene.environment = studioEnvironment();
scene.environmentIntensity = 1.38;

const camera = new THREE.PerspectiveCamera(23, CELL_W / CELL_H, 0.1, 40);
camera.position.set(0, 2.18, 7.35);
camera.lookAt(0, 1.03, 0);

const key = new THREE.DirectionalLight(0xfff4e4, 2.7);
key.position.set(4.2, 7.2, 5.2);
scene.add(key);

const fill = new THREE.DirectionalLight(0xc4d6ff, 0.9);
fill.position.set(-5.4, 3.2, 3.6);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffffff, 4.2);
rim.position.set(-4.1, 5.1, -5.2);
scene.add(rim);

const rimWarm = new THREE.DirectionalLight(0xffe5c8, 1.7);
rimWarm.position.set(4.4, 2.2, -4.6);
scene.add(rimWarm);

const baseMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0.17,
  clearcoat: 0.6,
  clearcoatRoughness: 0.12,
  envMapIntensity: 1.5,
  vertexColors: true,
});

const trimMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc4c4c9,
  metalness: 1,
  roughness: 0.06,
  clearcoat: 0.8,
  clearcoatRoughness: 0.07,
  envMapIntensity: 1.8,
});

const darkChromeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x1d1d21,
  metalness: 0.92,
  roughness: 0.3,
  clearcoat: 0.35,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.0,
});

const collarMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x46464c,
  metalness: 1,
  roughness: 0.26,
  clearcoat: 0.5,
  clearcoatRoughness: 0.18,
  envMapIntensity: 1.1,
});

const cavityMaterial = new THREE.MeshStandardMaterial({
  color: 0x030304,
  metalness: 0.15,
  roughness: 0.85,
  side: THREE.DoubleSide,
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x050506,
  metalness: 0.55,
  roughness: 0.4,
  side: THREE.DoubleSide,
});

const bottomTone = new THREE.Color(0x2d2d32);
const topTone = new THREE.Color(0x9a9aa2);

function applyGradient(geometry, yOffset = 0) {
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const color = new THREE.Color();
  for (let index = 0; index < positions.count; index += 1) {
    const t = THREE.MathUtils.clamp(positions.getY(index) + yOffset, 0, 1);
    color.copy(bottomTone).lerp(topTone, Math.pow(t, 0.82));
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function bodyMesh(geometry, yOffset = 0) {
  return new THREE.Mesh(applyGradient(geometry, yOffset), baseMaterial);
}

function bodyFromProfile(points) {
  const vectors = points.map(([radius, y]) => new THREE.Vector2(radius, y));
  return bodyMesh(new THREE.LatheGeometry(vectors, 96));
}



function radiusAt(points, y) {
  let radius = 0;
  for (const [candidate, height] of points) {
    if (height > y) break;
    radius = candidate;
  }
  return radius;
}

function trimRing(group, radius, tube, y) {
  if (radius <= 0) return null;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 14, 96),
    trimMaterial
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = y;
  group.add(ring);
  return ring;
}

function addBeadRing(group, radius, y, count, bead) {
  const geometry = new THREE.SphereGeometry(bead, 12, 10);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const mesh = new THREE.Mesh(geometry, trimMaterial);
    mesh.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );
    group.add(mesh);
  }
}

function addBaseTrim(group, points, cut) {
  const levels = [0.032, 0.09, 0.15];
  levels.forEach((level, index) => {
    if (level >= cut - 0.02) return;
    trimRing(
      group,
      radiusAt(points, level),
      index === 0 ? 0.006 : 0.005,
      level
    );
  });
  if (cut > 0.12) {
    addBeadRing(
      group,
      radiusAt(points, 0.105) * 1.003,
      0.105,
      40,
      0.0042
    );
  }
  if (cut > 0.2) {
    trimRing(group, radiusAt(points, 0.195), 0.004, 0.195);
  }
}

function addCylinder(group, radius, height, y, material = darkMaterial) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 72, 1, true),
    material
  );
  mesh.position.y = y;
  group.add(mesh);
  return mesh;
}

function addDisc(group, radius, y, material = darkMaterial) {
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 72), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  group.add(mesh);
  return mesh;
}

function buildPawn() {
  const group = new THREE.Group();
  const points = SET_PROFILES.pawn.points;
  group.add(bodyFromProfile(points));
  addBaseTrim(group, points, 1);
  trimRing(group, radiusAt(points, 0.29), 0.006, 0.29);
  trimRing(group, radiusAt(points, 0.775), 0.004, 0.775);
  addBeadRing(group, radiusAt(points, 0.79) * 1.02, 0.79, 28, 0.0055);
  return group;
}

function buildRook() {
  const group = new THREE.Group();
  const profile = SET_PROFILES.rook;
  const points = profile.points;
  group.add(bodyFromProfile(points));
  addBaseTrim(group, points, profile.cut);
  trimRing(group, radiusAt(points, 0.26), 0.006, 0.26);
  trimRing(group, radiusAt(points, 0.31), 0.005, 0.31);
  trimRing(group, radiusAt(points, 0.785), 0.011, 0.785);

  const innerRadius = radiusAt(points, 0.78) * 0.79;
  addCylinder(group, innerRadius, 0.2, 0.885, cavityMaterial);
  addDisc(group, innerRadius, 0.8, cavityMaterial);

  const merlonGeometry = new RoundedBoxGeometry(0.062, 0.2, 0.08, 3, 0.01);
  const capGeometry = new RoundedBoxGeometry(0.05, 0.008, 0.062, 2, 0.003);
  const merlonRadius = 0.165;
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const merlon = new THREE.Mesh(merlonGeometry.clone(), darkChromeMaterial);
    merlon.position.set(
      Math.cos(angle) * merlonRadius,
      0.895,
      Math.sin(angle) * merlonRadius
    );
    merlon.rotation.y = -angle;
    group.add(merlon);

    const cap = new THREE.Mesh(capGeometry, trimMaterial);
    cap.position.set(
      Math.cos(angle) * merlonRadius,
      0.997,
      Math.sin(angle) * merlonRadius
    );
    cap.rotation.y = -angle;
    group.add(cap);
  }
  return group;
}

function buildBishop() {
  const group = new THREE.Group();
  const points = SET_PROFILES.bishop.points;
  group.add(bodyFromProfile(points));
  addBaseTrim(group, points, 1);
  trimRing(group, radiusAt(points, 0.58), 0.005, 0.58);
  trimRing(group, radiusAt(points, 0.68), 0.005, 0.68);
  trimRing(group, radiusAt(points, 0.775), 0.005, 0.775);

  const slash = [
    [-0.072, 0.665],
    [-0.035, 0.725],
    [0.012, 0.795],
    [0.061, 0.862],
  ];
  [1, -1].forEach((side) => {
    const curvePoints = slash.map(([x, y]) => {
      const radius = radiusAt(points, y);
      const z = Math.sqrt(Math.max(radius * radius - x * x, 0)) * side;
      return new THREE.Vector3(x, y, z);
    });
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, 0.012, 8, false),
        darkMaterial
      )
    );

    const edgePoints = slash.map(([x, y]) => {
      const shiftedX = x + 0.015 * side;
      const radius = radiusAt(points, y);
      const z =
        Math.sqrt(Math.max(radius * radius - shiftedX * shiftedX, 0)) *
        side *
        1.008;
      return new THREE.Vector3(shiftedX, y, z);
    });
    const edge = new THREE.CatmullRomCurve3(edgePoints);
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(edge, 28, 0.0032, 6, false),
        trimMaterial
      )
    );
  });
  return group;
}

function crossShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.024, 0.095);
  shape.lineTo(0.024, 0.095);
  shape.lineTo(0.024, 0.028);
  shape.lineTo(0.095, 0.028);
  shape.lineTo(0.095, -0.028);
  shape.lineTo(0.024, -0.028);
  shape.lineTo(0.024, -0.095);
  shape.lineTo(-0.024, -0.095);
  shape.lineTo(-0.024, -0.028);
  shape.lineTo(-0.095, -0.028);
  shape.lineTo(-0.095, 0.028);
  shape.lineTo(-0.024, 0.028);
  shape.closePath();
  return shape;
}

function buildQueen() {
  const group = new THREE.Group();
  const profile = SET_PROFILES.queen;
  const points = profile.points;
  group.add(bodyFromProfile(points));
  addBaseTrim(group, points, profile.cut);
  trimRing(group, radiusAt(points, 0.62), 0.005, 0.62);
  trimRing(group, radiusAt(points, 0.71), 0.005, 0.71);
  trimRing(group, radiusAt(points, 0.776), 0.007, 0.776);

  const cupPoints = [
    [0.094, 0.775],
    [0.106, 0.8],
    [0.122, 0.84],
    [0.142, 0.875],
    [0.155, 0.888],
  ].map(([radius, y]) => new THREE.Vector2(radius, y));
  group.add(bodyMesh(new THREE.LatheGeometry(cupPoints, 96)));

  const innerPoints = [
    [0.145, 0.886],
    [0.133, 0.868],
    [0.114, 0.838],
    [0.098, 0.8],
    [0.09, 0.777],
  ].map(([radius, y]) => new THREE.Vector2(radius, y));
  const inner = new THREE.Mesh(
    new THREE.LatheGeometry(innerPoints, 96),
    darkMaterial
  );
  inner.material.side = THREE.DoubleSide;
  group.add(inner);

  const rimPoints = [];
  for (let index = 0; index < 144; index += 1) {
    const angle = (index / 144) * Math.PI * 2;
    const radius = 0.155;
    rimPoints.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0.888 + Math.cos(angle * 9) * 0.015,
        Math.sin(angle) * radius
      )
    );
  }
  const rimCurve = new THREE.CatmullRomCurve3(rimPoints, true);
  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(rimCurve, 240, 0.0065, 8, true),
      trimMaterial
    )
  );

  const finial = [
    [0.031, 0.912],
    [0.024, 0.952],
    [0.017, 0.984],
  ];
  finial.forEach(([radius, y]) => {
    group.add(bodyMesh(new THREE.SphereGeometry(radius, 32, 20), y));
  });
  group.children.slice(-3).forEach((ball, index) => {
    ball.position.y = finial[index][1];
  });
  const tip = bodyMesh(new THREE.SphereGeometry(0.009, 20, 14), 1);
  tip.position.y = 1.0;
  group.add(tip);
  return group;
}

function buildKing() {
  const group = new THREE.Group();
  const profile = SET_PROFILES.king;
  const points = profile.points;
  group.add(bodyFromProfile(points));
  addBaseTrim(group, points, profile.cut);
  trimRing(group, radiusAt(points, 0.57), 0.005, 0.57);
  trimRing(group, radiusAt(points, 0.735), 0.005, 0.735);
  trimRing(group, radiusAt(points, 0.795), 0.006, 0.795);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.082, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    baseMaterial
  );
  dome.position.y = 0.805;
  applyGradient(dome.geometry, 0.805);
  group.add(dome);

  const geometry = new THREE.ExtrudeGeometry(crossShape(), {
    depth: 0.052,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 4,
  });
  geometry.translate(0, 0, -0.026);

  const cross = new THREE.Mesh(geometry, trimMaterial);
  cross.position.set(0, 0.925, 0.001);
  group.add(cross);

  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(0.011, 20, 14),
    trimMaterial
  );
  finial.position.y = 1.018;
  group.add(finial);
  return group;
}

function sampleValues(values, t) {
  const position =
    THREE.MathUtils.clamp(t, 0, 1) * Math.max(0, values.length - 1);
  const index = Math.floor(position);
  const next = Math.min(values.length - 1, index + 1);
  const mix = position - index;
  return values[index] * (1 - mix) + values[next] * mix;
}

function samplePairs(pairs, x) {
  if (x <= pairs[0][0]) return pairs[0][1];
  for (let index = 0; index < pairs.length - 1; index += 1) {
    const [leftX, leftY] = pairs[index];
    const [rightX, rightY] = pairs[index + 1];
    if (x <= rightX) {
      const t = (x - leftX) / Math.max(1e-6, rightX - leftX);
      return THREE.MathUtils.lerp(leftY, rightY, t);
    }
  }
  return pairs[pairs.length - 1][1];
}

function createTaperedTube(
  curve,
  startRadius,
  endRadius,
  tubularSegments = 22,
  radialSegments = 8,
  options = {}
) {
  const widthScale = options.widthScale ?? 1;
  const flatten = options.flatten ?? 1;
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions = [];
  const indices = [];

  for (let index = 0; index <= tubularSegments; index += 1) {
    const t = index / tubularSegments;
    const point = curve.getPointAt(t);
    const radius = THREE.MathUtils.lerp(startRadius, endRadius, t);
    const tangent = curve.getTangentAt(t).normalize();
    let widthAxis;
    let thicknessAxis;

    if (widthScale === 1 && flatten === 1) {
      widthAxis = frames.normals[index];
      thicknessAxis = frames.binormals[index];
    } else {
      const reference = options.referenceAxis
        ? new THREE.Vector3(...options.referenceAxis)
        : new THREE.Vector3(0, 0, 1);
      widthAxis = reference
        .clone()
        .sub(tangent.clone().multiplyScalar(reference.dot(tangent)));
      if (widthAxis.lengthSq() < 0.0001) {
        widthAxis.set(1, 0, 0);
      }
      widthAxis.normalize();
      thicknessAxis = new THREE.Vector3()
        .crossVectors(tangent, widthAxis)
        .normalize();
    }

    for (let side = 0; side < radialSegments; side += 1) {
      const angle = (side / radialSegments) * Math.PI * 2;
      const width = Math.cos(angle) * radius * widthScale;
      const thickness = Math.sin(angle) * radius * flatten;
      positions.push(
        point.x + widthAxis.x * width + thicknessAxis.x * thickness,
        point.y + widthAxis.y * width + thicknessAxis.y * thickness,
        point.z + widthAxis.z * width + thicknessAxis.z * thickness
      );
    }
  }

  for (let segment = 0; segment < tubularSegments; segment += 1) {
    const current = segment * radialSegments;
    const next = (segment + 1) * radialSegments;
    for (let side = 0; side < radialSegments; side += 1) {
      const a = current + side;
      const b = current + ((side + 1) % radialSegments);
      const c = next + side;
      const d = next + ((side + 1) % radialSegments);
      indices.push(a, c, b, b, c, d);
    }
  }

  const startCentre = positions.length / 3;
  const start = curve.getPointAt(0);
  positions.push(start.x, start.y, start.z);
  const endCentre = positions.length / 3;
  const end = curve.getPointAt(1);
  positions.push(end.x, end.y, end.z);
  for (let side = 0; side < radialSegments; side += 1) {
    const next = (side + 1) % radialSegments;
    indices.push(startCentre, next, side);
    const last = tubularSegments * radialSegments;
    indices.push(endCentre, last + side, last + next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createHorizontalLoft(sections, radial = 72) {
  const positions = [];
  const indices = [];
  const rings = [];

  for (const section of sections) {
    rings.push(positions.length / 3);
    for (let side = 0; side < radial; side += 1) {
      const angle = (side / radial) * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const radius = cosine >= 0 ? section.back : section.front;
      positions.push(
        section.cx + radius * cosine,
        section.y,
        section.width * sine
      );
    }
  }

  for (let index = 0; index < sections.length - 1; index += 1) {
    const current = rings[index];
    const next = rings[index + 1];
    for (let side = 0; side < radial; side += 1) {
      const a = current + side;
      const b = current + ((side + 1) % radial);
      const c = next + side;
      const d = next + ((side + 1) % radial);
      indices.push(a, c, b, b, c, d);
    }
  }

  const bottom = sections[0];
  const bottomCentre = positions.length / 3;
  positions.push(bottom.cx, bottom.y, 0);
  const top = sections[sections.length - 1];
  const topCentre = positions.length / 3;
  positions.push(top.cx, top.y, 0);
  for (let side = 0; side < radial; side += 1) {
    const next = (side + 1) % radial;
    indices.push(bottomCentre, rings[0] + side, rings[0] + next);
    const last = rings[rings.length - 1];
    indices.push(topCentre, last + next, last + side);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const KNIGHT_NECK = [
  { y: 0.34, cx: 0.012, front: 0.16, back: 0.13, width: 0.16 },
  { y: 0.42, cx: 0.008, front: 0.15, back: 0.135, width: 0.155 },
  { y: 0.5, cx: 0.002, front: 0.14, back: 0.135, width: 0.15 },
  { y: 0.54, cx: 0.0, front: 0.135, back: 0.13, width: 0.145 },
  { y: 0.58, cx: -0.004, front: 0.115, back: 0.125, width: 0.14 },
  { y: 0.66, cx: -0.008, front: 0.085, back: 0.115, width: 0.125 },
  { y: 0.74, cx: -0.014, front: 0.065, back: 0.105, width: 0.11 },
  { y: 0.8, cx: -0.02, front: 0.06, back: 0.09, width: 0.095 },
  { y: 0.85, cx: -0.026, front: 0.055, back: 0.075, width: 0.08 },
];

const KNIGHT_FACE = [
  { y: 0.6, cx: -0.25, front: 0.045, back: 0.045, width: 0.085 },
  { y: 0.625, cx: -0.245, front: 0.055, back: 0.052, width: 0.09 },
  { y: 0.655, cx: -0.23, front: 0.07, back: 0.06, width: 0.1 },
  { y: 0.685, cx: -0.205, front: 0.085, back: 0.068, width: 0.11 },
  { y: 0.715, cx: -0.175, front: 0.095, back: 0.075, width: 0.12 },
  { y: 0.76, cx: -0.135, front: 0.1, back: 0.08, width: 0.128 },
  { y: 0.81, cx: -0.1, front: 0.095, back: 0.085, width: 0.13 },
  { y: 0.86, cx: -0.07, front: 0.075, back: 0.07, width: 0.115 },
  { y: 0.885, cx: -0.05, front: 0.06, back: 0.06, width: 0.105 },
];

function sectionAt(sections, y) {
  if (y <= sections[0].y) return sections[0];
  for (let index = 0; index < sections.length - 1; index += 1) {
    const current = sections[index];
    const next = sections[index + 1];
    if (y <= next.y) {
      const t = (y - current.y) / Math.max(1e-6, next.y - current.y);
      return {
        y,
        cx: THREE.MathUtils.lerp(current.cx, next.cx, t),
        front: THREE.MathUtils.lerp(current.front, next.front, t),
        back: THREE.MathUtils.lerp(current.back, next.back, t),
        width: THREE.MathUtils.lerp(current.width, next.width, t),
      };
    }
  }
  return sections[sections.length - 1];
}

function sectionSurfaceZ(section, x) {
  const radius = x >= section.cx ? section.back : section.front;
  const normalized = THREE.MathUtils.clamp((x - section.cx) / radius, -1, 1);
  return section.width * Math.sqrt(Math.max(0, 1 - normalized * normalized));
}

function maneSection(y) {
  const t = THREE.MathUtils.clamp((0.91 - y) / 0.45, 0, 1);
  return {
    y,
    cx:
      0.028 +
      0.12 * Math.sin(Math.min(1, t * 1.08) * Math.PI * 0.5) +
      0.01 * Math.sin(t * Math.PI * 4.8 + 0.6),
    xHalf:
      0.04 +
      0.062 * Math.sin(Math.PI * Math.min(1, t * 0.95)) +
      0.006 * Math.sin(t * Math.PI * 6.2),
    zHalf:
      0.075 +
      0.09 * Math.sin(Math.PI * Math.min(1, t * 0.95)) +
      0.006 * Math.sin(t * Math.PI * 5.1),
  };
}

function maneSurfaceZ(section, x) {
  const normalized = THREE.MathUtils.clamp(
    (x - section.cx) / Math.max(0.001, section.xHalf),
    -1,
    1
  );
  return section.zHalf * Math.sqrt(Math.max(0, 1 - normalized * normalized));
}

function createKnightNeckFace() {
  const group = new THREE.Group();
  group.add(bodyMesh(createHorizontalLoft(KNIGHT_NECK, 72)));
  group.add(bodyMesh(createHorizontalLoft(KNIGHT_FACE, 72)));

  const throat = new THREE.SphereGeometry(1, 32, 22);
  throat.scale(0.065, 0.075, 0.105);
  throat.translate(-0.12, 0.67, 0);
  group.add(bodyMesh(throat));

  const muzzle = new THREE.SphereGeometry(1, 36, 24);
  muzzle.scale(0.08, 0.062, 0.085);
  muzzle.translate(-0.225, 0.655, 0);
  group.add(bodyMesh(muzzle));

  const nose = new THREE.SphereGeometry(1, 36, 24);
  nose.scale(0.032, 0.03, 0.045);
  nose.translate(-0.285, 0.645, 0);
  group.add(bodyMesh(nose));

  const chin = new THREE.SphereGeometry(1, 32, 20);
  chin.scale(0.042, 0.027, 0.052);
  chin.translate(-0.24, 0.615, 0);
  group.add(bodyMesh(chin));

  const bridge = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.145, 0.86, 0),
    new THREE.Vector3(-0.195, 0.81, 0),
    new THREE.Vector3(-0.235, 0.76, 0),
    new THREE.Vector3(-0.27, 0.715, 0),
    new THREE.Vector3(-0.3, 0.655, 0),
    new THREE.Vector3(-0.295, 0.605, 0),
  ]);
  group.add(
    new THREE.Mesh(createTaperedTube(bridge, 0.008, 0.004, 26, 7), baseMaterial)
  );

  const neckRidge = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.135, 0.54, 0),
    new THREE.Vector3(-0.108, 0.62, 0),
    new THREE.Vector3(-0.084, 0.7, 0),
    new THREE.Vector3(-0.079, 0.78, 0),
  ]);
  group.add(
    new THREE.Mesh(
      createTaperedTube(neckRidge, 0.007, 0.004, 24, 6),
      baseMaterial
    )
  );

  return group;
}

function createKnightMane() {
  const group = new THREE.Group();
  const sections = [];
  for (let index = 0; index <= 28; index += 1) {
    const t = index / 28;
    const section = maneSection(0.91 - 0.45 * t);
    sections.push({
      y: section.y,
      cx: section.cx,
      front: section.xHalf,
      back: section.xHalf,
      width: section.zHalf,
    });
  }
  group.add(bodyMesh(createHorizontalLoft(sections, 80)));

  const locks = [];
  const addLock = (points, radius, options = {}) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = createTaperedTube(curve, radius, 0.0025, 28, 9, {
      widthScale: 1.8,
      flatten: 0.55,
      ...options,
    });
    applyGradient(geometry);
    locks.push(geometry);
  };

  for (const side of [-1, 1]) {
    for (let layer = 0; layer < 2; layer += 1) {
      for (let index = 0; index < 4; index += 1) {
        const top = 0.905 - index * 0.018 - layer * 0.006;
        const bottom =
          0.47 +
          index * 0.015 +
          0.03 * Math.abs(Math.sin(index * 1.7 + layer));
        const phase = index * 1.43 + layer * 2.05 + side * 0.7;
        const points = [];

        for (let step = 0; step <= 8; step += 1) {
          const t = step / 8;
          const y = THREE.MathUtils.lerp(top, bottom, t);
          const section = maneSection(y);
          const across =
            0.28 +
            layer * 0.38 +
            0.1 * Math.sin(t * Math.PI * 2.2 + phase);
          const x =
            section.cx +
            section.xHalf * across +
            0.012 * Math.sin(t * Math.PI * 3.1 + phase);
          const surface = Math.max(0.004, maneSurfaceZ(section, x));
          points.push(
            new THREE.Vector3(
              x,
              y + 0.008 * Math.sin(t * Math.PI * 3.2 + phase),
              side * surface * 0.92
            )
          );
        }

        addLock(points, 0.024 + 0.004 * Math.sin(index + layer * 1.4), {
          widthScale: 2.2,
          flatten: 0.5,
          referenceAxis: [1, 0, 0],
        });
      }
    }

    for (let index = 0; index < 3; index += 1) {
      const top = 0.895 - index * 0.016;
      const bottom = 0.48 + index * 0.025;
      const phase = index * 1.9 + side * 0.4;
      const points = [];
      for (let step = 0; step <= 7; step += 1) {
        const t = step / 7;
        const y = THREE.MathUtils.lerp(top, bottom, t);
        const section = maneSection(y);
        const x =
          section.cx +
          section.xHalf * (0.9 + 0.05 * Math.sin(t * Math.PI * 2 + phase));
        points.push(
          new THREE.Vector3(
            x,
            y,
            side *
              Math.max(0.004, maneSurfaceZ(section, x)) *
              (0.62 + 0.08 * Math.sin(t * Math.PI * 2.4 + phase))
          )
        );
      }
      addLock(points, 0.021, { widthScale: 2.1, flatten: 0.55 });
    }
  }

  for (let index = 0; index < 4; index += 1) {
    const top = 0.9 - index * 0.012;
    const bottom = 0.49 + index * 0.02;
    const phase = index * 1.6;
    const points = [];
    for (let step = 0; step <= 7; step += 1) {
      const t = step / 7;
      const y = THREE.MathUtils.lerp(top, bottom, t);
      const section = maneSection(y);
      points.push(
        new THREE.Vector3(
          section.cx +
            section.xHalf * 0.96 +
            0.006 * Math.sin(t * Math.PI * 2.2 + phase),
          y,
          0.012 * Math.sin(t * Math.PI * 2.7 + phase)
        )
      );
    }
    addLock(points, 0.019, { widthScale: 1.9, flatten: 0.55 });
  }

  for (const side of [-1, 1]) {
    for (let index = 0; index < 2; index += 1) {
      const top = 0.56 - index * 0.035;
      const bottom = 0.448 - index * 0.01;
      const phase = index * 2.2 + side;
      const points = [];
      for (let step = 0; step <= 6; step += 1) {
        const t = step / 6;
        const y = THREE.MathUtils.lerp(top, bottom, t);
        const section = maneSection(y);
        const x =
          section.cx +
          section.xHalf * (1.03 + 0.06 * Math.sin(t * Math.PI * 2 + phase));
        const surface = Math.max(0.004, maneSurfaceZ(section, x));
        points.push(
          new THREE.Vector3(
            x + 0.012 * Math.sin(t * Math.PI * 2.6 + phase),
            y,
            side * surface * (0.55 + index * 0.22)
          )
        );
      }
      addLock(points, 0.024, {
        widthScale: 2,
        flatten: 0.5,
        referenceAxis: [1, 0, 0],
      });
    }
  }

  for (let index = 0; index < 3; index += 1) {
    const offset = (index / 2 - 0.5) * 0.06;
    const phase = index * 2.1;
    const points = [
      new THREE.Vector3(0.0, 0.878, offset * 0.4),
      new THREE.Vector3(
        -0.02,
        0.865,
        offset * 0.55 + 0.004 * Math.sin(phase)
      ),
      new THREE.Vector3(
        -0.05,
        0.84,
        offset * 0.68 + 0.006 * Math.sin(phase + 1.2)
      ),
      new THREE.Vector3(-0.075, 0.81, offset * 0.55),
      new THREE.Vector3(-0.095, 0.782, offset * 0.3),
    ];
    addLock(points, 0.015, {
      widthScale: 1.9,
      flatten: 0.5,
      referenceAxis: [1, 0, 0],
    });
  }

  if (locks.length) {
    const merged = mergeGeometries(locks, false);
    group.add(new THREE.Mesh(merged, baseMaterial));
    locks.forEach((geometry) => geometry.dispose());
  }

  return group;
}

function earShape(scale = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.05 * scale, 0);
  shape.quadraticCurveTo(
    -0.062 * scale,
    0.04 * scale,
    -0.034 * scale,
    0.085 * scale
  );
  shape.quadraticCurveTo(
    -0.022 * scale,
    0.105 * scale,
    -0.018 * scale,
    0.112 * scale
  );
  shape.quadraticCurveTo(
    0.004 * scale,
    0.075 * scale,
    0.034 * scale,
    0.012 * scale
  );
  shape.quadraticCurveTo(0.04 * scale, 0, 0.034 * scale, 0);
  shape.closePath();
  return shape;
}

function addKnightEars(group) {
  const outerShape = earShape(0.85);
  const outer = new THREE.ExtrudeGeometry(outerShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
    curveSegments: 10,
  });
  outer.scale(1.12, 0.95, 1);
  outer.translate(0, 0, -0.008);

  const innerShape = earShape(0.58);
  const inner = new THREE.ExtrudeGeometry(innerShape, {
    depth: 0.002,
    bevelEnabled: false,
    curveSegments: 10,
  });
  inner.scale(1.12, 0.95, 1);
  inner.translate(0, 0.01, 0);

  for (const side of [-1, 1]) {
    const earGroup = new THREE.Group();
    earGroup.position.set(-0.075, 0.878, side * 0.07);
    earGroup.rotation.y = side * 0.32;
    earGroup.rotation.z = -0.16;

    const ear = bodyMesh(outer.clone(), 0.878);
    earGroup.add(ear);

    const cavity = new THREE.Mesh(inner.clone(), darkMaterial);
    cavity.position.z = side * 0.011;
    earGroup.add(cavity);

    group.add(earGroup);
  }

  outer.dispose();
  inner.dispose();
}

function addKnightFaceDetails(group) {
  for (const side of [-1, 1]) {
    const eyeX = -0.105;
    const eyeY = 0.813;
    const eyeZ = Math.max(
      0.01,
      sectionSurfaceZ(sectionAt(KNIGHT_FACE, eyeY), eyeX)
    );

    const socket = new THREE.SphereGeometry(1, 28, 20);
    socket.scale(0.027, 0.017, 0.0025);
    socket.translate(eyeX, eyeY, side * (eyeZ + 0.0005));
    group.add(new THREE.Mesh(socket, darkMaterial));

    const eye = new THREE.SphereGeometry(1, 22, 16);
    eye.scale(0.016, 0.011, 0.0015);
    eye.translate(eyeX - 0.002, eyeY + 0.001, side * (eyeZ + 0.003));
    group.add(new THREE.Mesh(eye, darkChromeMaterial));

    const glint = new THREE.SphereGeometry(0.0028, 12, 8);
    glint.translate(eyeX - 0.007, eyeY + 0.005, side * (eyeZ + 0.004));
    group.add(new THREE.Mesh(glint, trimMaterial));

    const lidPoints = [
      [-0.07, 0.828],
      [-0.105, 0.823],
      [-0.15, 0.813],
    ].map(([x, y]) => {
      const surface = sectionSurfaceZ(sectionAt(KNIGHT_FACE, y), x);
      return new THREE.Vector3(x, y, side * (surface + 0.002));
    });
    group.add(
      new THREE.Mesh(
        createTaperedTube(
          new THREE.CatmullRomCurve3(lidPoints),
          0.005,
          0.0032,
          18,
          6
        ),
        baseMaterial
      )
    );

    const nostrilY = 0.655;
    const nostrilX = -0.26;
    const nostrilZ = Math.max(
      0.008,
      sectionSurfaceZ(sectionAt(KNIGHT_FACE, nostrilY), nostrilX) * 0.94
    );
    const nostril = new THREE.SphereGeometry(1, 20, 14);
    nostril.scale(0.02, 0.012, 0.008);
    nostril.translate(nostrilX, nostrilY, side * nostrilZ);
    group.add(new THREE.Mesh(nostril, darkMaterial));

    const browPoints = [
      [-0.06, 0.845],
      [-0.105, 0.832],
      [-0.155, 0.81],
    ].map(([x, y]) => {
      const surface = sectionSurfaceZ(sectionAt(KNIGHT_FACE, y), x);
      return new THREE.Vector3(x, y, side * (surface + 0.003));
    });
    group.add(
      new THREE.Mesh(
        createTaperedTube(
          new THREE.CatmullRomCurve3(browPoints),
          0.007,
          0.0045,
          20,
          7
        ),
        baseMaterial
      )
    );

  }

  const mouth = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.278, 0.61, -0.038),
    new THREE.Vector3(-0.292, 0.617, 0),
    new THREE.Vector3(-0.278, 0.61, 0.038),
  ]);
  group.add(
    new THREE.Mesh(
      createTaperedTube(mouth, 0.003, 0.0022, 18, 5),
      darkMaterial
    )
  );

  const lip = new THREE.SphereGeometry(1, 24, 16);
  lip.scale(0.032, 0.018, 0.04);
  lip.translate(-0.255, 0.605, 0);
  group.add(bodyMesh(lip));
}

function fleurGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.031, -0.05);
  shape.lineTo(0.031, -0.05);
  shape.lineTo(0.031, -0.035);
  shape.lineTo(0.009, -0.035);
  shape.quadraticCurveTo(0.012, -0.011, 0.028, -0.002);
  shape.quadraticCurveTo(0.041, 0.009, 0.034, 0.022);
  shape.quadraticCurveTo(0.025, 0.031, 0.014, 0.014);
  shape.lineTo(0.006, 0.004);
  shape.quadraticCurveTo(0.01, 0.03, 0.004, 0.052);
  shape.quadraticCurveTo(0, 0.06, -0.004, 0.052);
  shape.quadraticCurveTo(-0.01, 0.03, -0.006, 0.004);
  shape.lineTo(-0.014, 0.014);
  shape.quadraticCurveTo(-0.025, 0.031, -0.034, 0.022);
  shape.quadraticCurveTo(-0.041, 0.009, -0.028, -0.002);
  shape.quadraticCurveTo(-0.012, -0.011, -0.009, -0.035);
  shape.lineTo(-0.031, -0.035);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.004,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0012,
    bevelSegments: 2,
    curveSegments: 5,
  });
  geometry.translate(0, 0, -0.002);
  return geometry;
}

function createKnightCollar() {
  const group = new THREE.Group();
  const points = [
    [0.166, 0.405],
    [0.171, 0.425],
    [0.175, 0.45],
    [0.176, 0.475],
    [0.171, 0.5],
    [0.163, 0.52],
    [0.154, 0.536],
  ];
  const lathePoints = points.map(
    ([radius, y]) => new THREE.Vector2(radius, y)
  );
  group.add(
    new THREE.Mesh(
      new THREE.LatheGeometry(lathePoints, 96),
      collarMaterial
    )
  );
  trimRing(group, radiusAt(points, 0.412) + 0.001, 0.0035, 0.412);
  trimRing(group, radiusAt(points, 0.532) + 0.001, 0.0038, 0.532);

  const baseMotif = fleurGeometry();
  const ornaments = [];
  const count = 14;
  const rows = [
    { y: 0.492, scale: 0.48 },
    { y: 0.444, scale: 0.32 },
  ];
  for (const row of rows) {
    const radius = radiusAt(points, row.y) + 0.0015;
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const geometry = baseMotif.clone();
      geometry.scale(row.scale, row.scale, 1);
      geometry.rotateY(Math.PI / 2 - angle);
      geometry.translate(
        Math.cos(angle) * radius,
        row.y,
        Math.sin(angle) * radius
      );
      ornaments.push(geometry);
    }
  }
  baseMotif.dispose();
  const merged = mergeGeometries(ornaments, false);
  ornaments.forEach((geometry) => geometry.dispose());
  group.add(new THREE.Mesh(merged, trimMaterial));

  return group;
}

function addKnightBridle(group) {
  for (const side of [-1, 1]) {
    const cheekPoints = [
      [-0.06, 0.84],
      [-0.075, 0.8],
      [-0.135, 0.74],
      [-0.19, 0.7],
      [-0.235, 0.668],
    ].map(([x, y]) => {
      const surface = Math.max(
        0.01,
        sectionSurfaceZ(sectionAt(KNIGHT_FACE, y), x)
      );
      return new THREE.Vector3(x, y, side * (surface + 0.003));
    });
    group.add(
      new THREE.Mesh(
        createTaperedTube(
          new THREE.CatmullRomCurve3(cheekPoints),
          0.0045,
          0.0038,
          24,
          6
        ),
        trimMaterial
      )
    );

  }

  const browband = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.062, 0.844, -0.062),
    new THREE.Vector3(-0.082, 0.858, 0),
    new THREE.Vector3(-0.062, 0.844, 0.062),
  ]);
  group.add(
    new THREE.Mesh(
      createTaperedTube(browband, 0.0038, 0.0038, 20, 6),
      trimMaterial
    )
  );

  const noseband = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.235, 0.677, -0.085),
    new THREE.Vector3(-0.252, 0.682, 0),
    new THREE.Vector3(-0.235, 0.677, 0.085),
  ]);
  group.add(
    new THREE.Mesh(
      createTaperedTube(noseband, 0.0038, 0.0038, 20, 6),
      trimMaterial
    )
  );
}

function buildKnight() {
  const group = new THREE.Group();
  const profile = SET_PROFILES.knight;
  const base = profile.base;
  group.add(bodyFromProfile(base));
  trimRing(group, radiusAt(base, 0.035) + 0.001, 0.004, 0.035);
  trimRing(group, radiusAt(base, 0.1) + 0.001, 0.0035, 0.1);
  trimRing(group, radiusAt(base, 0.22) + 0.001, 0.0035, 0.22);
  trimRing(group, radiusAt(base, 0.292) + 0.001, 0.0045, 0.292);
  trimRing(group, radiusAt(base, 0.385) + 0.001, 0.0045, 0.385);

  group.add(createKnightCollar());
  group.add(createKnightNeckFace());

  const head = new THREE.Group();
  addKnightEars(head);
  addKnightFaceDetails(head);
  addKnightBridle(head);
  group.add(head);

  group.add(createKnightMane());
  return group;
}

const BUILDERS = {
  pawn: buildPawn,
  knight: buildKnight,
  bishop: buildBishop,
  rook: buildRook,
  queen: buildQueen,
  king: buildKing,
};

function preparePiece(type) {
  const group = BUILDERS[type]();
  const bounds = new THREE.Box3().setFromObject(group);
  const size = bounds.getSize(new THREE.Vector3());
  const scale = TARGET_HEIGHT[type] / size.y;
  group.scale.setScalar(scale);

  const scaledBounds = new THREE.Box3().setFromObject(group);
  const center = scaledBounds.getCenter(new THREE.Vector3());
  group.position.set(-center.x, 1.03 - center.y, -center.z);
  return group;
}

const sheetCanvas = document.createElement('canvas');
sheetCanvas.width = CELL_W * COLS;
sheetCanvas.height = CELL_H * ROWS;
const sheetContext = sheetCanvas.getContext('2d');

function renderSheet(type) {
  scene.clear();
  scene.add(key, fill, rim, rimWarm);
  const piece = preparePiece(type);
  scene.add(piece);

  sheetContext.clearRect(0, 0, sheetCanvas.width, sheetCanvas.height);

  const offset = FRAME_OFFSET[type] ?? 0;
  for (let frame = 0; frame < FRAMES; frame += 1) {
    const angle =
      START_ANGLE[type] +
      (((frame + offset) % FRAMES) / FRAMES) * Math.PI * 2;
    piece.rotation.y = angle;

    renderer.clear();
    renderer.render(scene, camera);

    const column = frame % COLS;
    const row = Math.floor(frame / COLS);
    sheetContext.drawImage(
      renderer.domElement,
      column * CELL_W,
      row * CELL_H,
      CELL_W,
      CELL_H
    );
  }

  scene.remove(piece);
  piece.traverse((child) => {
    if (child.isMesh) child.geometry.dispose();
  });

  return sheetCanvas.toDataURL('image/webp', 0.9);
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${source}`));
    image.src = source;
  });
}

function setStill(image) {
  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const sourceContext = source.getContext('2d');
  sourceContext.drawImage(image, 0, 0);
  const pixels = sourceContext.getImageData(0, 0, source.width, source.height);
  const data = pixels.data;

  let minX = source.width;
  let minY = source.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (data[(y * source.width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const targetH = 720;
  const targetW = Math.max(1, Math.round((cropW / cropH) * targetH));
  const output = document.createElement('canvas');
  output.width = targetW;
  output.height = targetH;
  const context = output.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    image,
    minX,
    minY,
    cropW,
    cropH,
    0,
    0,
    targetW,
    targetH
  );

  // The source renders were made on white, so anti-aliased edges carry a
  // white fringe. Un-premultiply against white so the chrome sits cleanly
  // on the site's near-black background.
  const result = context.getImageData(0, 0, targetW, targetH);
  const out = result.data;
  for (let index = 0; index < out.length; index += 4) {
    const alpha = out[index + 3] / 255;
    if (alpha <= 0.015) {
      out[index + 3] = 0;
      out[index] = 0;
      out[index + 1] = 0;
      out[index + 2] = 0;
      continue;
    }
    if (alpha < 0.985) {
      out[index] = Math.max(
        0,
        Math.min(255, (out[index] - 255 * (1 - alpha)) / alpha)
      );
      out[index + 1] = Math.max(
        0,
        Math.min(255, (out[index + 1] - 255 * (1 - alpha)) / alpha)
      );
      out[index + 2] = Math.max(
        0,
        Math.min(255, (out[index + 2] - 255 * (1 - alpha)) / alpha)
      );
    }
  }
  context.putImageData(result, 0, 0);
  return output.toDataURL('image/webp', 0.94);
}

function renderPreview(sheets) {
  const canvas = document.createElement('canvas');
  const cellW = 430;
  const cellH = 565;
  canvas.width = cellW * 3;
  canvas.height = cellH * 2 + 20;
  const context = canvas.getContext('2d');
  const background = context.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, '#101013');
  background.addColorStop(0.55, '#08080a');
  background.addColorStop(1, '#030304');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const images = {};
  TYPES.forEach((type) => {
    const image = new Image();
    image.src = sheets[type];
    images[type] = image;
  });

  return Promise.all(
    TYPES.map(
      (type) =>
        new Promise((resolve) => {
          images[type].onload = () => resolve();
        })
    )
  ).then(() => {
    TYPES.forEach((type, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = column * cellW;
      const y = row * cellH;
      context.drawImage(
        images[type],
        0,
        0,
        CELL_W,
        CELL_H,
        x + 5,
        y + 5,
        cellW - 10,
        (cellW - 10) * (CELL_H / CELL_W)
      );
      context.fillStyle = 'rgba(245,245,242,0.62)';
      context.font = '300 12px Inter, sans-serif';
      context.textAlign = 'center';
      context.fillText(type.toUpperCase(), x + cellW / 2, y + cellH - 14);
    });
    return canvas.toDataURL('image/png');
  });
}

window.renderAll = async () => {
  const images = {};
  for (const type of TYPES) {
    const source =
      type === 'knight'
        ? '/kniight%203d/knight-hero.png'
        : `/chess%20pieces/${type}.png`;
    images[type] = await loadImage(source);
  }

  const sheets = {};
  const setStills = {};
  for (const type of TYPES) {
    sheets[type] = renderSheet(type);
    setStills[type] = setStill(images[type]);
  }
  const preview = await renderPreview(sheets);
  return {
    sheets,
    setStills,
    preview,
    frames: FRAMES,
    cellWidth: CELL_W,
    cellHeight: CELL_H,
  };
};

window.__ready = true;
