"use client";

import { useEffect, useRef } from "react";

// The hero's field of drifting dots: about 10,000 of them, pushed around by
// the pointer, drawn with WebGL point sprites.
//
// Why WebGL. With Canvas 2D every frame rebuilt a path for every dot on the
// main thread and blurred two full-canvas layers for the halos; that sat at
// 10-16ms a frame and spiked to 50ms while the pointer moved. Here the CPU
// only integrates positions in typed arrays (no per-dot allocation) and
// uploads them, and the GPU draws each dot as a sprite whose disc and halo
// are computed per fragment, so there is no blur pass at all.
//
// The look is the old one: same distribution, colours, opacity tiers,
// halo shape and motion constants.

const HERO_BLUE = [60, 92, 207] as const;
const HERO_RED = [215, 38, 56] as const;
const HERO_BACKGROUND = [7, 13, 24] as const;
const CELL_SIZE = 120;
const DESKTOP_DOT_CAP = 9800;
const MOBILE_DOT_CAP = 3400;
const FRAME_UNIT = 1000 / 60;
// A pause (hidden tab, hero scrolled away) must not become one giant step.
const MAX_FRAME_STEP = FRAME_UNIT * 4;
const POINTER_RADIUS = 220;
const RIPPLE_RING_WIDTH = 92;
const MAX_RIPPLE_WAKES = 6;
const GLOW_THRESHOLD = 0.86;
// The halo used to be a canvas shadow blurred by 12 device pixels.
const HALO_BLUR_DEVICE_PX = 12;
// The old loop drew at most 50 times a second (30 on a 60Hz screen), so
// that is how often pointer movement left a ripple; keep that cadence at any
// refresh rate or the rings crowd each other.
const WAKE_INTERVAL = FRAME_UNIT * 2;
const DOT_FEATHER = 1;
const MAX_DEVICE_PIXEL_RATIO = 2;

const ATTRIBUTE_STRIDE = 5; // radius, r, g, b, alpha
const DYNAMIC_STRIDE = 3; // x, y, glow radius

type Grid = {
  cols: number;
  rows: number;
  start: Int32Array;
  items: Int32Array;
};

type Field = {
  count: number;
  width: number;
  height: number;
  baseX: Float32Array;
  baseY: Float32Array;
  x: Float32Array;
  y: Float32Array;
  velocityX: Float32Array;
  velocityY: Float32Array;
  driftSpeed: Float32Array;
  driftRange: Float32Array;
  responsiveness: Float32Array;
  // The four angles of the drift field, minus the time term, fixed per dot.
  flowA: Float32Array;
  flowB: Float32Array;
  flowC: Float32Array;
  flowD: Float32Array;
  // Where the drift currently wants each dot; refreshed on alternate frames.
  targetX: Float32Array;
  targetY: Float32Array;
  glowMax: Float32Array;
  glowAlways: Uint8Array;
  attributes: Float32Array;
  dynamic: Float32Array;
  grid: Grid;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const progress = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function getDotCount(width: number, height: number) {
  const area = width * height;

  if (width < 640) {
    return Math.min(MOBILE_DOT_CAP, Math.max(3000, Math.floor(area / 88)));
  }

  return Math.min(DESKTOP_DOT_CAP, Math.max(9000, Math.floor(area / 125)));
}

function isRedCluster(x: number, y: number, width: number, height: number) {
  const region =
    Math.sin((x / width) * Math.PI * 3.15 + (y / height) * Math.PI * 0.9) +
    Math.cos((y / height) * Math.PI * 3.45) +
    Math.sin(((x - y) / Math.max(width, height)) * Math.PI * 2.4);

  return region > 0.2;
}

// Dots under the headline stay calmer and fainter so the text reads.
function getTextAreaOpacity(x: number, y: number, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height * 0.48;
  const radiusX = width < 640 ? width * 0.42 : Math.min(width * 0.3, 450);
  const radiusY = width < 640 ? height * 0.23 : Math.min(height * 0.24, 240);
  const normalizedX = (x - centerX) / radiusX;
  const normalizedY = (y - centerY) / radiusY;
  const normalizedDistance = Math.hypot(normalizedX, normalizedY);
  const textAreaCalm = 1 - smoothstep(0.62, 1.16, normalizedDistance);

  return 1 - textAreaCalm * 0.48;
}

function getDotAlpha(isRed: boolean, textOpacity: number) {
  if (isRed) {
    return textOpacity < 0.68 ? 0.2 : textOpacity < 0.9 ? 0.36 : 0.56;
  }

  return textOpacity < 0.68 ? 0.22 : textOpacity < 0.9 ? 0.38 : 0.58;
}

// Cells over the dots' base positions (they drift at most a few dozen px),
// stored compactly: cell c owns items[start[c] .. start[c + 1]).
function buildGrid(baseX: Float32Array, baseY: Float32Array, count: number, width: number, height: number): Grid {
  const cols = Math.floor(width / CELL_SIZE) + 1;
  const rows = Math.floor(height / CELL_SIZE) + 1;
  const cellOf = new Int32Array(count);
  const start = new Int32Array(cols * rows + 1);

  for (let i = 0; i < count; i += 1) {
    const col = clamp(Math.floor(baseX[i] / CELL_SIZE), 0, cols - 1);
    const row = clamp(Math.floor(baseY[i] / CELL_SIZE), 0, rows - 1);
    const cell = row * cols + col;

    cellOf[i] = cell;
    start[cell + 1] += 1;
  }

  for (let cell = 0; cell < cols * rows; cell += 1) {
    start[cell + 1] += start[cell];
  }

  const cursor = start.slice(0, cols * rows);
  const items = new Int32Array(count);

  for (let i = 0; i < count; i += 1) {
    items[cursor[cellOf[i]]] = i;
    cursor[cellOf[i]] += 1;
  }

  return { cols, rows, start, items };
}

function forEachNearby(grid: Grid, x: number, y: number, radius: number, visit: (index: number) => void) {
  const minCol = clamp(Math.floor((x - radius) / CELL_SIZE), 0, grid.cols - 1);
  const maxCol = clamp(Math.floor((x + radius) / CELL_SIZE), 0, grid.cols - 1);
  const minRow = clamp(Math.floor((y - radius) / CELL_SIZE), 0, grid.rows - 1);
  const maxRow = clamp(Math.floor((y + radius) / CELL_SIZE), 0, grid.rows - 1);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      const cell = row * grid.cols + col;

      for (let slot = grid.start[cell]; slot < grid.start[cell + 1]; slot += 1) {
        visit(grid.items[slot]);
      }
    }
  }
}

function createField(width: number, height: number): Field {
  const count = getDotCount(width, height);
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const flowA = new Float32Array(count);
  const flowB = new Float32Array(count);
  const flowC = new Float32Array(count);
  const flowD = new Float32Array(count);
  const driftSpeed = new Float32Array(count);
  const driftRange = new Float32Array(count);
  const responsiveness = new Float32Array(count);
  const glowMax = new Float32Array(count);
  const glowAlways = new Uint8Array(count);
  const attributes = new Float32Array(count * ATTRIBUTE_STRIDE);

  for (let i = 0; i < count; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const textOpacity = getTextAreaOpacity(x, y, width, height);
    const brightness = Math.random();
    const isLargeParticle = brightness > 0.82;
    const radius = isLargeParticle ? Math.random() * 2.5 + 2.8 : Math.random() * 1.55 + 1.55;
    const isRed = isRedCluster(x, y, width, height);
    const color = isRed ? HERO_RED : HERO_BLUE;

    const phase = Math.random() * Math.PI * 2;

    baseX[i] = x;
    baseY[i] = y;
    flowA[i] = y * 0.006 + phase;
    flowB[i] = (x + y) * 0.0034;
    flowC[i] = x * 0.005 + phase;
    flowD[i] = (y - x) * 0.003;
    driftRange[i] = Math.random() * 18 + 12;
    driftSpeed[i] = Math.random() * 0.42 + 0.28;
    responsiveness[i] = Math.random() * 0.55 + 0.65;
    // Only bright dots outside the text zone can glow; the brightest always
    // do, the rest only while they are moving fast.
    glowMax[i] = textOpacity > 0.78 && brightness > 0.58 ? radius * (1.8 + brightness * 0.7) : 0;
    glowAlways[i] = brightness > GLOW_THRESHOLD ? 1 : 0;

    const offset = i * ATTRIBUTE_STRIDE;
    attributes[offset] = radius;
    attributes[offset + 1] = color[0] / 255;
    attributes[offset + 2] = color[1] / 255;
    attributes[offset + 3] = color[2] / 255;
    attributes[offset + 4] = getDotAlpha(isRed, textOpacity);
  }

  return {
    count,
    width,
    height,
    baseX,
    baseY,
    x: baseX.slice(),
    y: baseY.slice(),
    velocityX: new Float32Array(count),
    velocityY: new Float32Array(count),
    driftSpeed,
    driftRange,
    responsiveness,
    flowA,
    flowB,
    flowC,
    flowD,
    targetX: baseX.slice(),
    targetY: baseY.slice(),
    glowMax,
    glowAlways,
    attributes,
    dynamic: new Float32Array(count * DYNAMIC_STRIDE),
    grid: buildGrid(baseX, baseY, count, width, height)
  };
}

// ---------------------------------------------------------------- renderer

const VERTEX_SHADER = `
attribute vec2 a_position;
attribute float a_glowRadius;
attribute float a_radius;
attribute vec3 a_color;
attribute float a_alpha;

uniform vec2 u_resolution;
uniform float u_dpr;
// Shared with the fragment shader, which runs at mediump: the precision
// must match on both sides or the program will not link.
uniform mediump float u_mode;
uniform float u_maxPointSize;

varying vec3 v_color;
varying float v_alpha;
varying float v_edge;
varying float v_feather;
varying float v_haloPeak;
varying float v_haloInv;

void main() {
  bool isGlow = u_mode > 0.5;

  if (isGlow && a_glowRadius <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  float radius = isGlow ? a_glowRadius : a_radius;
  // The old halo was a canvas shadow blurred in device pixels, so its
  // softness in CSS pixels depends on the screen; sigma is half the blur.
  float sigma = ${HALO_BLUR_DEVICE_PX.toFixed(1)} * 0.5 / u_dpr;
  float extent = isGlow ? radius + 3.0 * sigma : radius + ${DOT_FEATHER.toFixed(1)};

  vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = min(extent * 2.0 * u_dpr, u_maxPointSize);

  v_color = a_color;
  v_alpha = a_alpha;
  // Fractions of the uncapped extent: where a device caps sprite size, the
  // disc shrinks with the sprite instead of being clipped to a square.
  v_edge = radius / extent;
  v_feather = ${DOT_FEATHER.toFixed(1)} / extent;

  if (isGlow) {
    // A disc blurred by a Gaussian: the exact centre value as the peak, and
    // a Gaussian falloff whose variance folds in the disc's own size.
    float sigma2 = sigma * sigma;
    float blob2 = sigma2 + radius * radius * 0.25;
    v_haloPeak = 1.0 - exp(-radius * radius / (2.0 * sigma2));
    v_haloInv = extent * extent / (2.0 * blob2);
  } else {
    v_haloPeak = 0.0;
    v_haloInv = 0.0;
  }
}
`;

// Additive output (blend ONE, ONE) reproduces canvas "lighter". The halo is
// the old shadow: a 0.2 fill plus a 0.48 blurred copy.
const FRAGMENT_SHADER = `
precision mediump float;

uniform mediump float u_mode;

varying vec3 v_color;
varying float v_alpha;
varying float v_edge;
varying float v_feather;
varying float v_haloPeak;
varying float v_haloInv;

void main() {
  // 0 at the sprite's centre, 1 at its edge. (Not named "distance": that is
  // a GLSL built-in and some drivers refuse to shadow it.)
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = 1.0 - smoothstep(v_edge - v_feather * 0.5, v_edge + v_feather * 0.5, d);
  float alpha;

  if (u_mode > 0.5) {
    alpha = 0.2 * disc + 0.48 * v_haloPeak * exp(-d * d * v_haloInv);
  } else {
    alpha = disc * v_alpha;
  }

  gl_FragColor = vec4(v_color * alpha, alpha);
}
`;

type Renderer = {
  resize: (width: number, height: number, dpr: number) => void;
  setField: (field: Field) => void;
  draw: (field: Field) => void;
  dispose: () => void;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Hero field shader failed to compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  // A decorative background: never a reason to wake a discrete GPU.
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true
  });

  if (!gl) {
    return null;
  }

  // Paint the hero colour first, so any bail-out below leaves the ground
  // rather than an opaque black buffer stretched over the section.
  gl.clearColor(HERO_BACKGROUND[0] / 255, HERO_BACKGROUND[1] / 255, HERO_BACKGROUND[2] / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  const attributeBuffer = gl.createBuffer();
  const dynamicBuffer = gl.createBuffer();

  const bail = () => {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    if (program) gl.deleteProgram(program);
    if (attributeBuffer) gl.deleteBuffer(attributeBuffer);
    if (dynamicBuffer) gl.deleteBuffer(dynamicBuffer);
    return null;
  };

  if (!vertexShader || !fragmentShader || !program || !attributeBuffer || !dynamicBuffer) {
    return bail();
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Hero field program failed to link:", gl.getProgramInfoLog(program));
    return bail();
  }

  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const glowRadiusLocation = gl.getAttribLocation(program, "a_glowRadius");
  const radiusLocation = gl.getAttribLocation(program, "a_radius");
  const colorLocation = gl.getAttribLocation(program, "a_color");
  const alphaLocation = gl.getAttribLocation(program, "a_alpha");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const dprLocation = gl.getUniformLocation(program, "u_dpr");
  const modeLocation = gl.getUniformLocation(program, "u_mode");
  const maxPointSizeLocation = gl.getUniformLocation(program, "u_maxPointSize");
  const pointSizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array;
  const floatBytes = Float32Array.BYTES_PER_ELEMENT;

  gl.uniform1f(maxPointSizeLocation, pointSizeRange[1]);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);

  gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
  gl.enableVertexAttribArray(radiusLocation);
  gl.vertexAttribPointer(radiusLocation, 1, gl.FLOAT, false, ATTRIBUTE_STRIDE * floatBytes, 0);
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, ATTRIBUTE_STRIDE * floatBytes, floatBytes);
  gl.enableVertexAttribArray(alphaLocation);
  gl.vertexAttribPointer(alphaLocation, 1, gl.FLOAT, false, ATTRIBUTE_STRIDE * floatBytes, 4 * floatBytes);

  gl.bindBuffer(gl.ARRAY_BUFFER, dynamicBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, DYNAMIC_STRIDE * floatBytes, 0);
  gl.enableVertexAttribArray(glowRadiusLocation);
  gl.vertexAttribPointer(glowRadiusLocation, 1, gl.FLOAT, false, DYNAMIC_STRIDE * floatBytes, 2 * floatBytes);

  let count = 0;

  return {
    resize(width, height, dpr) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(dprLocation, dpr);
    },
    setField(field) {
      count = field.count;
      gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, field.attributes, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, dynamicBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, field.dynamic, gl.DYNAMIC_DRAW);
    },
    draw(field) {
      gl.bindBuffer(gl.ARRAY_BUFFER, dynamicBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, field.dynamic);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(modeLocation, 0);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.uniform1f(modeLocation, 1);
      gl.drawArrays(gl.POINTS, 0, count);
    },
    dispose() {
      gl.deleteBuffer(attributeBuffer);
      gl.deleteBuffer(dynamicBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    }
  };
}

// Without WebGL the field is still there, just still: one Canvas 2D pass.
// (If WebGL exists but its shaders fail, the canvas already holds a WebGL
// context and cannot take a 2D one; the hero then shows its plain ground.)
function drawStaticFallback(canvas: HTMLCanvasElement, field: Field, dpr: number) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  canvas.width = Math.floor(field.width * dpr);
  canvas.height = Math.floor(field.height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.fillStyle = `rgb(${HERO_BACKGROUND.join(" ")})`;
  context.fillRect(0, 0, field.width, field.height);
  context.globalCompositeOperation = "lighter";

  for (let i = 0; i < field.count; i += 1) {
    const offset = i * ATTRIBUTE_STRIDE;
    const alpha = field.attributes[offset + 4];

    context.fillStyle = `rgba(${Math.round(field.attributes[offset + 1] * 255)}, ${Math.round(
      field.attributes[offset + 2] * 255
    )}, ${Math.round(field.attributes[offset + 3] * 255)}, ${alpha})`;
    context.beginPath();
    context.arc(field.baseX[i], field.baseY[i], field.attributes[offset], 0, Math.PI * 2);
    context.fill();
  }
}

// --------------------------------------------------------------- component

export function DecisionMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");

    let renderer = createRenderer(canvas);
    let field: Field | null = null;
    let dpr = 1;
    let reducedMotion = motionQuery.matches;
    let frameId: number | null = null;
    let lastFrameTime = 0;
    // Advances only while frames are drawn, so a pause does not move every
    // dot's drift target at once when the field comes back.
    let flowTime = 0;
    let isInView = true;
    let isContextLost = false;
    let canvasRect = canvas.getBoundingClientRect();

    const pointer = { x: 0, y: 0, movementX: 0, movementY: 0, active: false };

    // Ripple wakes left by pointer movement, newest first.
    const wakeX = new Float32Array(MAX_RIPPLE_WAKES);
    const wakeY = new Float32Array(MAX_RIPPLE_WAKES);
    const wakeMoveX = new Float32Array(MAX_RIPPLE_WAKES);
    const wakeMoveY = new Float32Array(MAX_RIPPLE_WAKES);
    const wakeAge = new Float32Array(MAX_RIPPLE_WAKES);
    const wakeStrength = new Float32Array(MAX_RIPPLE_WAKES);
    let wakeCount = 0;
    let lastWakeTime = -Infinity;

    const canUseCursor = () => finePointerQuery.matches && canvas.clientWidth >= 640;

    const resetCursorState = () => {
      pointer.active = false;
      pointer.movementX = 0;
      pointer.movementY = 0;
      wakeCount = 0;
    };

    const pushWake = (x: number, y: number, moveX: number, moveY: number, strength: number) => {
      const last = Math.min(wakeCount, MAX_RIPPLE_WAKES - 1);

      for (let k = last; k > 0; k -= 1) {
        wakeX[k] = wakeX[k - 1];
        wakeY[k] = wakeY[k - 1];
        wakeMoveX[k] = wakeMoveX[k - 1];
        wakeMoveY[k] = wakeMoveY[k - 1];
        wakeAge[k] = wakeAge[k - 1];
        wakeStrength[k] = wakeStrength[k - 1];
      }

      wakeX[0] = x;
      wakeY[0] = y;
      wakeMoveX[0] = moveX;
      wakeMoveY[0] = moveY;
      wakeAge[0] = 0;
      wakeStrength[0] = strength;
      wakeCount = Math.min(wakeCount + 1, MAX_RIPPLE_WAKES);
    };

    const applyCursorForces = (current: Field, frameScale: number) => {
      if (!pointer.active || !canUseCursor()) {
        return;
      }

      const { x, y, velocityX, velocityY, responsiveness } = current;
      const pointerDistance = Math.hypot(pointer.movementX, pointer.movementY);
      const pointerSpeed = Math.min(pointerDistance, 64);
      const moveX = pointerDistance > 0 ? pointer.movementX / pointerDistance : 0;
      const moveY = pointerDistance > 0 ? pointer.movementY / pointerDistance : 0;
      const radiusSquared = POINTER_RADIUS * POINTER_RADIUS;

      if (pointerDistance > 2.5 && flowTime - lastWakeTime >= WAKE_INTERVAL) {
        lastWakeTime = flowTime;
        pushWake(pointer.x, pointer.y, moveX, moveY, clamp(pointerSpeed / 44, 0.42, 1));
      }

      forEachNearby(current.grid, pointer.x, pointer.y, POINTER_RADIUS + 48, (i) => {
        const dx = x[i] - pointer.x;
        const dy = y[i] - pointer.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared === 0 || distanceSquared > radiusSquared) {
          return;
        }

        const distance = Math.sqrt(distanceSquared);
        const proximity = 1 - distance / POINTER_RADIUS;
        const eased = proximity * proximity * (3 - 2 * proximity);
        const push = eased * responsiveness[i] * 8.6 * frameScale;
        const wake = proximity * pointerSpeed * responsiveness[i] * 0.22 * frameScale;

        velocityX[i] += (dx / distance) * push + moveX * wake;
        velocityY[i] += (dy / distance) * push + moveY * wake;
      });

      pointer.movementX = 0;
      pointer.movementY = 0;
    };

    const applyRippleWakes = (current: Field, frameScale: number) => {
      if (wakeCount === 0 || !canUseCursor()) {
        return;
      }

      const { x, y, velocityX, velocityY, responsiveness } = current;
      let kept = 0;

      for (let k = 0; k < wakeCount; k += 1) {
        const nextAge = wakeAge[k] + 0.038 * frameScale;

        if (nextAge >= 1) {
          continue;
        }

        const radius = 28 + nextAge * 360;
        const originX = wakeX[k];
        const originY = wakeY[k];
        const moveX = wakeMoveX[k];
        const moveY = wakeMoveY[k];
        const strength = wakeStrength[k];

        forEachNearby(current.grid, originX, originY, radius + RIPPLE_RING_WIDTH, (i) => {
          const dx = x[i] - originX;
          const dy = y[i] - originY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ringDistance = Math.abs(distance - radius);

          if (distance === 0 || ringDistance > RIPPLE_RING_WIDTH) {
            return;
          }

          const ringPower =
            (1 - ringDistance / RIPPLE_RING_WIDTH) * (1 - nextAge) * strength * responsiveness[i] * frameScale;

          velocityX[i] += ((dx / distance) * 3.4 + moveX * 1.35) * ringPower;
          velocityY[i] += ((dy / distance) * 3.4 + moveY * 1.35) * ringPower;
        });

        // Compact the survivors in place, keeping order.
        wakeX[kept] = originX;
        wakeY[kept] = originY;
        wakeMoveX[kept] = moveX;
        wakeMoveY[kept] = moveY;
        wakeAge[kept] = nextAge;
        wakeStrength[kept] = strength;
        kept += 1;
      }

      wakeCount = kept;
    };

    let frameParity = 0;

    const stepField = (current: Field, frameScale: number) => {
      applyCursorForces(current, frameScale);
      applyRippleWakes(current, frameScale);

      const { count, baseX, baseY, x, y, velocityX, velocityY, driftSpeed, driftRange } = current;
      const { flowA, flowB, flowC, flowD, targetX, targetY, responsiveness, glowMax, glowAlways, dynamic } = current;
      const spring = 0.024 * frameScale;
      const damping = Math.pow(0.89, frameScale);
      const seconds = flowTime * 0.001;

      // The drift target costs four trig calls per dot, most of the frame's
      // work; each dot refreshes it every other frame and the spring smooths
      // the rest (the old loop only ever drew at 30 on a 60Hz screen).
      frameParity ^= 1;

      for (let i = 0; i < count; i += 1) {
        if ((i & 1) === frameParity) {
          const flow = seconds * driftSpeed[i];
          const currentX = Math.sin(flowA[i] + flow) + Math.cos(flowB[i] - flow * 1.28);
          const currentY = Math.cos(flowC[i] + flow * 1.15) + Math.sin(flowD[i] + flow * 0.92);

          targetX[i] = baseX[i] + currentX * driftRange[i];
          targetY[i] = baseY[i] + currentY * driftRange[i] * 0.86;
        }

        velocityX[i] = (velocityX[i] + (targetX[i] - x[i]) * spring * responsiveness[i]) * damping;
        velocityY[i] = (velocityY[i] + (targetY[i] - y[i]) * spring * responsiveness[i]) * damping;
        x[i] += velocityX[i] * frameScale;
        y[i] += velocityY[i] * frameScale;

        const motionEnergy = Math.abs(velocityX[i]) + Math.abs(velocityY[i]);
        const offset = i * DYNAMIC_STRIDE;

        dynamic[offset] = x[i];
        dynamic[offset + 1] = y[i];
        dynamic[offset + 2] = glowMax[i] > 0 && (glowAlways[i] === 1 || motionEnergy > 2.4) ? glowMax[i] : 0;
      }
    };

    // Reduced motion: every dot at rest on its base position, drawn once.
    const settleField = (current: Field) => {
      const { count, baseX, baseY, x, y, velocityX, velocityY, glowMax, glowAlways, dynamic } = current;

      for (let i = 0; i < count; i += 1) {
        x[i] = baseX[i];
        y[i] = baseY[i];
        velocityX[i] = 0;
        velocityY[i] = 0;

        const offset = i * DYNAMIC_STRIDE;

        dynamic[offset] = x[i];
        dynamic[offset + 1] = y[i];
        dynamic[offset + 2] = glowAlways[i] === 1 ? glowMax[i] : 0;
      }
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    // Runs only while the hero is on screen in a visible tab. The canvas
    // fades to transparent over its bottom third, so once less than 30% of
    // it is visible only the faded tail remains and the loop stops.
    const VISIBLE_RATIO_TO_ANIMATE = 0.3;

    const shouldAnimate = () =>
      isInView && document.visibilityState === "visible" && !reducedMotion && !isContextLost && renderer !== null;

    const drawFrame = (time: number) => {
      if (!field || !renderer) {
        frameId = null;
        return;
      }

      const elapsed = lastFrameTime ? time - lastFrameTime : FRAME_UNIT;

      // Two callbacks with the same timestamp are one frame.
      if (lastFrameTime && elapsed < 1) {
        frameId = window.requestAnimationFrame(drawFrame);
        return;
      }

      // Scaled to the real interval, so a 144Hz screen does not run the
      // springs faster; the ceiling keeps a long gap from becoming a jump.
      const frameScale = clamp(elapsed / FRAME_UNIT, 0.1, 2.1);

      lastFrameTime = time;
      flowTime += Math.min(elapsed, MAX_FRAME_STEP);

      stepField(field, frameScale);
      renderer.draw(field);

      frameId = shouldAnimate() ? window.requestAnimationFrame(drawFrame) : null;
    };

    const startAnimation = () => {
      if (frameId !== null) {
        return;
      }

      lastFrameTime = 0;
      frameId = window.requestAnimationFrame(drawFrame);
    };

    const syncAnimation = () => {
      if (shouldAnimate()) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    const drawStill = () => {
      if (!field) {
        return;
      }

      settleField(field);

      if (renderer) {
        renderer.draw(field);
      } else {
        drawStaticFallback(canvas, field, dpr);
      }
    };

    const resize = () => {
      canvasRect = canvas.getBoundingClientRect();

      const width = Math.max(canvasRect.width, 1);
      const height = Math.max(canvasRect.height, 1);
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

      // Same size, same density: nothing to rebuild. (A phone's URL bar
      // showing and hiding fires resize without changing the hero, and the
      // field must not re-randomise for that.)
      if (field && field.width === width && field.height === height && dpr === nextDpr) {
        return;
      }

      stopAnimation();
      dpr = nextDpr;
      field = createField(width, height);
      resetCursorState();
      lastFrameTime = 0;

      if (renderer && !isContextLost) {
        renderer.resize(width, height, dpr);
        renderer.setField(field);
      }

      if (reducedMotion || !renderer || isContextLost) {
        drawStill();
        return;
      }

      // One frame right away, then the loop if the hero is on screen.
      drawFrame(0);
      syncAnimation();
    };

    const updateMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      stopAnimation();
      resetCursorState();

      if (reducedMotion) {
        drawStill();
      } else {
        syncAnimation();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion || !canUseCursor()) {
        return;
      }

      if (
        event.clientX < canvasRect.left ||
        event.clientX > canvasRect.right ||
        event.clientY < canvasRect.top ||
        event.clientY > canvasRect.bottom
      ) {
        resetCursorState();
        return;
      }

      const nextX = event.clientX - canvasRect.left;
      const nextY = event.clientY - canvasRect.top;

      pointer.movementX = pointer.active ? nextX - pointer.x : 0;
      pointer.movementY = pointer.active ? nextY - pointer.y : 0;
      pointer.x = nextX;
      pointer.y = nextY;
      pointer.active = true;
    };

    const refreshRect = () => {
      canvasRect = canvas.getBoundingClientRect();
    };

    // A lost GPU context (driver reset, tab backgrounded on some devices)
    // stops the loop; when it comes back everything is rebuilt.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      isContextLost = true;
      stopAnimation();
    };

    const handleContextRestored = () => {
      isContextLost = false;
      renderer = createRenderer(canvas);
      field = null;
      resize();
    };

    // The hero can change height without a window resize (its content
    // reflowing); the observer catches that, the window listener catches
    // zoom (a density change at the same size).
    const sizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => resize());

    const viewObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              isInView = entries.some((entry) => entry.intersectionRatio >= VISIBLE_RATIO_TO_ANIMATE);
              refreshRect();
              syncAnimation();
            },
            { threshold: [0, VISIBLE_RATIO_TO_ANIMATE] }
          );

    resize();
    updateMotionPreference();

    viewObserver?.observe(canvas);
    sizeObserver?.observe(canvas);
    document.addEventListener("visibilitychange", syncAnimation);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetCursorState);
    window.addEventListener("blur", resetCursorState);
    motionQuery.addEventListener("change", updateMotionPreference);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      viewObserver?.disconnect();
      sizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetCursorState);
      window.removeEventListener("blur", resetCursorState);
      motionQuery.removeEventListener("change", updateMotionPreference);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      stopAnimation();
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full bg-hero" />;
}
