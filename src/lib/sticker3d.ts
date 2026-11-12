import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  CanvasTexture,
  Vector2,
  Vector3,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  MeshDepthMaterial,
  DirectionalLight,
  ShadowMaterial,
  Raycaster,
  Ray,
  Matrix4,
  RGBADepthPacking,
  DoubleSide,
} from "three";

const PLANE_SIZE = 4;
const ALPHA_GRID = 96;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function createDieCutCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
  const dw = aspect >= 1 ? 452 : 452 * aspect;
  const dh = aspect >= 1 ? 452 / aspect : 452;
  const dx = (512 - dw) / 2;
  const dy = (512 - dh) / 2;

  // Temp canvas for thresholding alpha
  const temp = document.createElement("canvas");
  temp.width = temp.height = 512;
  const tempCtx = temp.getContext("2d", { willReadFrequently: true })!;
  tempCtx.drawImage(img, dx, dy, dw, dh);
  const imgData = tempCtx.getImageData(0, 0, 512, 512);
  for (let i = 3; i < imgData.data.length; i += 4) {
    if (imgData.data[i] < 150) imgData.data[i] = 0;
  }
  tempCtx.putImageData(imgData, 0, 0);

  // Outline canvas (fill pure white)
  const whiteMask = document.createElement("canvas");
  whiteMask.width = whiteMask.height = 512;
  const whiteCtx = whiteMask.getContext("2d")!;
  whiteCtx.drawImage(temp, 0, 0);
  whiteCtx.globalCompositeOperation = "source-in";
  whiteCtx.fillStyle = "#fff";
  whiteCtx.fillRect(0, 0, 512, 512);

  // Dilate white mask in 40 circular directions for radii 2..22
  for (let r = 2; r <= 22; r += 2) {
    for (let t = 0; t < 40; t++) {
      const angle = (t / 40) * Math.PI * 2;
      ctx.drawImage(whiteMask, Math.cos(angle) * r, Math.sin(angle) * r);
    }
  }

  // Draw crisp original image on top
  ctx.drawImage(temp, 0, 0);
  return canvas;
}

function createWatermarkCanvas(label: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#fff";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.translate(256, 256);
  ctx.rotate(-Math.PI / 6);

  const text = `${label.toUpperCase()}   ·   `;
  const textWidth = ctx.measureText(text).width;
  for (let y = -12; y <= 12; y++) {
    const shift = ((y % 2) * textWidth) / 2;
    for (let x = -512 - textWidth; x <= 512; x += textWidth) {
      ctx.fillText(text, x + shift, y * 58);
    }
  }
  return canvas;
}

const DEFORM_CHUNK = `
uniform float uDepth;
uniform vec2 uAnchor;
uniform vec2 uDir;
uniform vec3 uBend;
vec3 deform(vec3 p){
  float flex = uBend.x * (p.x * p.x * 0.075 - 0.40) + uBend.y * (p.y * p.y * 0.12 - 0.25) + uBend.z * p.x * p.y * 0.10;
  float d = max(uDepth, 0.0);
  float along = dot(p.xy - uAnchor, uDir);
  float q = max(d - along, 0.0);
  if (d > 0.0001 && q > 0.0) {
    float radius = 0.25 + d * 0.105;
    float arc = min(q, radius * 2.94);
    float a = arc / radius;
    float tail = max(q - arc, 0.0);
    float newAlong = d - radius * sin(a) - tail * cos(a);
    p.xy += uDir * (newAlong - along);
    p.z += radius * (1.0 - cos(a)) + tail * sin(a);
  }
  p.z += flex;
  return p;
}
vec3 bentNormal(vec3 p){
  vec3 c = deform(p);
  vec3 dx = deform(p + vec3(0.004, 0.0, 0.0)) - c;
  vec3 dy = deform(p + vec3(0.0, 0.004, 0.0)) - c;
  return normalize(cross(dx, dy));
}
`;

const VERTEX_SHADER = `
${DEFORM_CHUNK}
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vUv = uv;
  vec3 p = deform(position);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * bentNormal(position));
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uMap, uBack;
uniform float uTime, uHolo, uSparkle;
uniform vec2 uLight;
varying vec2 vUv;
varying vec3 vNormal, vView;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 spectrum(float t){ return 0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.333, 0.667))); }

void main(){
  vec4 ink = texture2D(uMap, vUv);
  if (ink.a < 0.46) discard;

  vec3 n = normalize(vNormal);
  vec3 view = normalize(vView);

  // Reverse side: paper backing with repeating label watermark
  if (!gl_FrontFacing) {
    n = -n;
    vec3 key = normalize(vec3(-0.45, 0.8, 1.7));
    float brush = hash(vec2(floor(vUv.x * 1400.0), floor(vUv.y * 40.0))) - 0.5;
    float sweep = 0.5 + 0.5 * sin(vUv.x * 8.0 + vUv.y * 4.5 + n.x * 7.0 + n.y * 4.0 + uLight.x * 2.4 - uLight.y * 1.6);
    float spark = pow(max(dot(n, normalize(key + view)), 0.0), 26.0);
    vec3 paper = mix(vec3(0.56, 0.58, 0.63), vec3(0.94, 0.96, 1.0), pow(sweep, 2.0) * 0.9);
    float pat = texture2D(uBack, vec2(1.0 - vUv.x, vUv.y)).r;
    paper *= 1.0 - pat * 0.2;
    paper += brush * 0.03 + vec3(0.9, 0.93, 1.0) * spark * 0.5;
    float edge = 1.0 - texture2D(uMap, vUv + vec2(0.003, 0.004)).a;
    paper -= edge * 0.08;
    gl_FragColor = vec4(paper, 1.0);
    return;
  }

  // Front side: holographic ink, rainbow sheen, specular highlight, metallic edge
  vec3 color = ink.rgb;
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  float chroma = max(color.r, max(color.g, color.b)) - min(color.r, min(color.g, color.b));
  float white = smoothstep(0.86, 0.99, lum) * (1.0 - smoothstep(0.05, 0.18, chroma));
  vec3 light = normalize(vec3(-0.45, 0.8, 1.7));
  color *= 0.93 + 0.08 * max(dot(n, light), 0.0);

  float nv = max(dot(n, view), 0.0);
  float phase = vUv.x * 1.34 - vUv.y * 0.8 + (1.0 - nv) * 3.5 + n.x * 0.8 - n.y * 0.55 + uLight.x * 0.35 - uLight.y * 0.2;
  vec3 rainbow = spectrum(phase);
  float band = 0.5 + 0.5 * sin(phase * 10.0);
  color = mix(color, color * (0.8 + rainbow * 0.45), uHolo * (1.0 - white) * (0.3 + 0.2 * band));
  color = mix(color, vec3(0.94) + rainbow * 0.10 * (0.55 + 0.45 * band), uHolo * white * 0.7);

  float reflected = vUv.x * 0.74 + vUv.y * 0.48 + n.x * 0.58 + n.y * 0.42 + uLight.x * 0.62 + uLight.y * 0.4;
  float gloss = exp(-pow((reflected - 0.74) * 5.5, 2.0));
  float streak = exp(-pow((reflected - 0.62) * 70.0, 2.0));
  float spec = pow(max(dot(n, normalize(light + view)), 0.0), 85.0);
  color += vec3(1.0, 0.97, 0.98) * (gloss * 0.15 + streak * 0.22 + spec * 0.1);
  color += spectrum(reflected * 2.6) * gloss * uHolo * 0.08;

  // Foil rim: silver and gold leaf along die-cut border
  float outside = 0.0;
  for (int k = 0; k < 8; k++) {
    float ang = float(k) * 0.7853982;
    outside += 1.0 - texture2D(uMap, vUv + vec2(cos(ang), sin(ang)) * 0.034).a;
  }
  float ring = smoothstep(0.0, 2.5, outside) * white;
  float leaf = 0.5 + 0.5 * sin(reflected * 11.0 + vUv.x * 3.0);
  vec3 silver = vec3(0.80, 0.83, 0.88);
  vec3 gold = vec3(0.97, 0.88, 0.70);
  vec3 foil = mix(silver, gold, smoothstep(0.25, 0.75, leaf));
  foil += pow(max(0.0, sin(reflected * 11.0 + vUv.x * 3.0 - 1.4)), 8.0) * 0.16;
  color = mix(color, foil, ring * 0.34);

  // Micro-glitter facets
  vec2 cell = floor(vUv * vec2(110.0, 110.0));
  float facet = hash(cell);
  float flash = pow(max(0.0, sin(facet * 37.0 + uLight.x * 5.0 + uLight.y * 4.0 + n.x * 14.0 + n.y * 11.0)), 70.0);
  vec3 fire = mix(vec3(0.73, 0.88, 1.0), vec3(1.0, 0.87, 0.97), facet);
  color += uSparkle * (flash * 0.3 * fire + (facet - 0.5) * 0.015 * (0.4 + white));

  // Die-cut bevel edge highlight
  float rim = clamp(ink.a - texture2D(uMap, vUv + vec2(-0.004, 0.004)).a, 0.0, 1.0);
  color = mix(color, vec3(1.0), rim * 0.55);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export interface StickerOptions {
  src: string;
  label?: string;
  tilt?: number;
  reduced?: boolean;
}

export interface StickerController {
  reset: () => void;
  setRunning: (running: boolean) => void;
  dispose: () => void;
}

export async function createSticker(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  options: StickerOptions
): Promise<StickerController> {
  const { src, label = "", tilt = 0, reduced = false } = options;

  const rawImage = await loadImage(src);
  const dieCutCanvas = createDieCutCanvas(rawImage);

  // Downsample to 96x96 for ultra-fast alpha silhouette search
  const alphaCanvas = document.createElement("canvas");
  alphaCanvas.width = alphaCanvas.height = ALPHA_GRID;
  const alphaCtx = alphaCanvas.getContext("2d", { willReadFrequently: true })!;
  alphaCtx.drawImage(dieCutCanvas, 0, 0, ALPHA_GRID, ALPHA_GRID);
  const alphaData = alphaCtx.getImageData(0, 0, ALPHA_GRID, ALPHA_GRID).data;

  const isOpaque = (x: number, y: number): boolean => {
    const col = Math.floor((x / PLANE_SIZE + 0.5) * ALPHA_GRID);
    const row = Math.floor((0.5 - y / PLANE_SIZE) * ALPHA_GRID);
    return (
      col >= 0 &&
      row >= 0 &&
      col < ALPHA_GRID &&
      row < ALPHA_GRID &&
      alphaData[(row * ALPHA_GRID + col) * 4 + 3] > 110
    );
  };

  const borderPoints: Vector2[] = [];
  for (let y = 1; y < ALPHA_GRID - 1; y++) {
    for (let x = 1; x < ALPHA_GRID - 1; x++) {
      const opaque = (gx: number, gy: number) =>
        alphaData[(gy * ALPHA_GRID + gx) * 4 + 3] > 110;
      if (
        opaque(x, y) &&
        !(opaque(x + 1, y) && opaque(x - 1, y) && opaque(x, y + 1) && opaque(x, y - 1))
      ) {
        borderPoints.push(
          new Vector2(
            ((x + 0.5) / ALPHA_GRID - 0.5) * PLANE_SIZE,
            (0.5 - (y + 0.5) / ALPHA_GRID) * PLANE_SIZE
          )
        );
      }
    }
  }

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = 3; // PCFSoftShadowMap

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 11.4);

  const group = new Group();
  scene.add(group);

  const backTexture = new CanvasTexture(createWatermarkCanvas(label || " "));
  backTexture.anisotropy = 4;

  const frontTexture = new CanvasTexture(dieCutCanvas);
  frontTexture.anisotropy = 4;

  const uniforms = {
    uMap: { value: frontTexture },
    uBack: { value: backTexture },
    uTime: { value: 0 },
    uHolo: { value: 1 },
    uSparkle: { value: reduced ? 0 : 1 },
    uLight: { value: new Vector2() },
    uDepth: { value: 0 },
    uAnchor: { value: new Vector2() },
    uDir: { value: new Vector2(-1, 0) },
    uBend: { value: new Vector3() },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side: DoubleSide,
  });
  (material as any).map = frontTexture;
  material.alphaTest = 0.46;
  (material as any).shadowSide = DoubleSide;

  const geometry = new PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 96, 96);
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  group.add(mesh);
  group.rotation.z = (tilt * Math.PI) / 180;

  // Custom depth material for peeling shadow cast
  const depthMaterial = new MeshDepthMaterial({
    depthPacking: RGBADepthPacking,
    map: frontTexture,
    alphaTest: 0.46,
    side: DoubleSide,
  });
  depthMaterial.onBeforeCompile = (shader) => {
    for (const key of ["uDepth", "uAnchor", "uDir", "uBend"] as const) {
      shader.uniforms[key] = uniforms[key];
    }
    shader.vertexShader = `${DEFORM_CHUNK}\n${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      "vec3 transformed = deform(position);"
    );
  };
  mesh.customDepthMaterial = depthMaterial;

  const light = new DirectionalLight(0xffffff, 2);
  light.position.set(-3.5, 6, 10);
  light.castShadow = true;
  light.shadow.mapSize.set(512, 512);
  Object.assign(light.shadow.camera, {
    left: -5,
    right: 5,
    top: 5,
    bottom: -5,
    near: 0.5,
    far: 30,
  });
  light.shadow.normalBias = 0.018;
  light.shadow.bias = -0.00015;
  light.shadow.radius = 12;
  light.shadow.blurSamples = 16;
  scene.add(light);

  // Dynamic shadow floor behind sticker (only renders cast shadow, transparent otherwise)
  const shadowPlane = new Mesh(
    new PlaneGeometry(60, 60),
    new ShadowMaterial({ color: 2767440, opacity: 0, depthWrite: false })
  );
  shadowPlane.position.z = -0.35;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const localRay = new Ray();
  const invMatrix = new Matrix4();
  let canvasRect = canvas.getBoundingClientRect();

  function updateSize() {
    canvasRect = canvas.getBoundingClientRect();
    const size = Math.max(1, Math.round(canvas.clientWidth || canvasRect.width));
    renderer.setSize(size, size, false);
  }

  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(canvas);
  updateSize();

  function screenToLocalPlane(e: MouseEvent | PointerEvent): Vector2 | null {
    canvasRect = canvas.getBoundingClientRect();
    ndc.set(
      ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
      1 - ((e.clientY - canvasRect.top) / canvasRect.height) * 2
    );
    raycaster.setFromCamera(ndc, camera);
    group.updateMatrixWorld(true);
    invMatrix.copy(group.matrixWorld).invert();
    localRay.copy(raycaster.ray).applyMatrix4(invMatrix);

    if (Math.abs(localRay.direction.z) < 1e-4) return null;
    const t = -localRay.origin.z / localRay.direction.z;
    return new Vector2(
      localRay.origin.x + localRay.direction.x * t,
      localRay.origin.y + localRay.direction.y * t
    );
  }

  function findNearestEdge(point: Vector2, maxRadius: number) {
    const here = isOpaque(point.x, point.y);
    let bestDist = Infinity;
    let anchor: Vector2 | null = null;
    for (let a = 0; a < 32; a++) {
      const angle = (a / 32) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      for (let r = 0.04; r <= maxRadius; r += 0.04) {
        if (isOpaque(point.x + cosA * r, point.y + sinA * r) !== here) {
          if (r < bestDist) {
            bestDist = r;
            anchor = new Vector2(point.x + cosA * r, point.y + sinA * r);
          }
          break;
        }
      }
    }
    return { here, best: bestDist, anchor };
  }

  function testEdgeProximity(point: Vector2 | null, isTouch: boolean) {
    if (!point) return null;
    const res = findNearestEdge(point, 2.2);
    if (res.here) {
      return { edge: true, anchor: res.anchor || new Vector2(point.x, point.y) };
    }
    if (res.best < (isTouch ? 0.34 : 0.16)) {
      return { edge: true, anchor: res.anchor };
    }
    return null;
  }

  let activePointerId: number | null = null;
  let dragMode = "";
  let downLocalPos: Vector2 | null = null;
  let downClientPos: { x: number; y: number } | null = null;
  let startDepth = 0;
  let stickerPos = { x: 0, y: 0 };
  let dragOrigin: { x: number; y: number; from: { x: number; y: number } } | null = null;
  let isHoverCurled = false;
  let currentDepth = 0;
  let depthVel = 0;
  let targetDepth = 0;
  let maxCurlDepth = 2.4;
  let isInteracting = false;
  let elapsedTime = 0;
  let isRunning = false;
  let rafId = 0;
  let prevTime = 0;

  const bendSpring = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, tx: 0, ty: 0, tz: 0 };
  const lightSpring = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };

  const postcardEl = (container.closest(".pc") as HTMLElement) || container;

  const updateCssPosition = () => {
    container.style.setProperty("--sx", stickerPos.x.toFixed(2));
    container.style.setProperty("--sy", stickerPos.y.toFixed(2));
  };

  const handlePostcardPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const rect = postcardEl.getBoundingClientRect();
    lightSpring.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    lightSpring.ty = (0.5 - (e.clientY - rect.top) / rect.height) * 2;
    requestRender();
  };

  const handlePostcardPointerLeave = () => {
    lightSpring.tx = lightSpring.ty = 0;
    requestRender();
  };

  postcardEl.addEventListener("pointermove", handlePostcardPointerMove);
  postcardEl.addEventListener("pointerleave", handlePostcardPointerLeave);

  function setAnchorPoint(anchor: Vector2) {
    uniforms.uAnchor.value.copy(anchor);
    uniforms.uDir.value.set(-anchor.x, -anchor.y + 0.05).normalize();
    let maxDist = 0;
    for (const pt of borderPoints) {
      maxDist = Math.max(maxDist, pt.clone().sub(anchor).dot(uniforms.uDir.value));
    }
    maxCurlDepth = maxDist * 0.667;
    targetDepth = 0.035;
    depthVel = 0;
  }

  function resetPointerState() {
    const pid = activePointerId;
    activePointerId = null;
    if (pid !== null) {
      try {
        container.releasePointerCapture(pid);
      } catch {}
    }
    dragOrigin = null;
    delete postcardEl.dataset.carrying;
    dragMode = "";
    setTimeout(() => {
      isInteracting = false;
    }, 80);
    targetDepth = 0;
    bendSpring.tx = bendSpring.ty = bendSpring.tz = 0;
    requestRender();
  }

  container.addEventListener("pointerdown", (e: PointerEvent) => {
    if (activePointerId !== null || e.button > 0) return;
    const local = screenToLocalPlane(e);
    const edge = testEdgeProximity(local, e.pointerType === "touch");
    if (edge) {
      e.preventDefault();
      isInteracting = true;
      activePointerId = e.pointerId;
      container.setPointerCapture(e.pointerId);
      downLocalPos = local;
      startDepth = currentDepth;
      downClientPos = { x: e.clientX, y: e.clientY };
      dragOrigin = null;
      dragMode = "peel";
      if (!isHoverCurled && edge.anchor) {
        setAnchorPoint(edge.anchor);
      }
      isHoverCurled = false;
      requestRender();
    }
  });

  container.addEventListener("pointermove", (e: PointerEvent) => {
    if (activePointerId === e.pointerId) {
      e.preventDefault();
      const dxRel = (e.clientX - (downClientPos?.x || 0)) / canvasRect.width;
      const dyRel = (e.clientY - (downClientPos?.y || 0)) / canvasRect.height;

      if (dragMode === "peel") {
        const local = screenToLocalPlane(e);
        if (local && downLocalPos) {
          const delta = local.clone().sub(downLocalPos);
          const along = delta.dot(uniforms.uDir.value);
          targetDepth = Math.min(
            maxCurlDepth,
            Math.max(0.025, startDepth + Math.max(along * 0.73, delta.length() * 0.22))
          );
          bendSpring.tx = -dyRel * 0.13;
          bendSpring.ty = dxRel * 0.1;

          if (!dragOrigin && targetDepth >= maxCurlDepth * 0.82) {
            dragOrigin = { x: e.clientX, y: e.clientY, from: { ...stickerPos } };
            postcardEl.dataset.carrying = "true";
          }
        }

        if (dragOrigin) {
          const pRect = postcardEl.getBoundingClientRect();
          const unit = pRect.width / 100;
          const halfW = container.getBoundingClientRect().width / unit / 2;
          const limitX = 50 - halfW - 1;
          const limitY = pRect.height / unit / 2 - halfW - 1;
          stickerPos = {
            x: Math.max(-limitX, Math.min(limitX, dragOrigin.from.x + (e.clientX - dragOrigin.x) / unit)),
            y: Math.max(-limitY, Math.min(limitY, dragOrigin.from.y + (e.clientY - dragOrigin.y) / unit)),
          };
          updateCssPosition();
          targetDepth = maxCurlDepth * 0.8;
        }
      }
    } else if (activePointerId === null && e.pointerType !== "touch") {
      const edge = testEdgeProximity(screenToLocalPlane(e), false);
      container.style.cursor = edge ? "grab" : "";
      if (edge && !isHoverCurled) {
        if (edge.anchor) setAnchorPoint(edge.anchor);
        targetDepth = Math.min(1.0, maxCurlDepth * 0.45);
        isHoverCurled = true;
        requestRender();
      } else if (!edge && isHoverCurled) {
        isHoverCurled = false;
        targetDepth = 0;
        requestRender();
      }
    }
  });

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId === activePointerId) {
      resetPointerState();
    }
  };

  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerUp);
  container.addEventListener("lostpointercapture", onPointerUp);
  container.addEventListener("pointerleave", () => {
    container.style.cursor = "";
    if (isHoverCurled && activePointerId === null) {
      isHoverCurled = false;
      targetDepth = 0;
      requestRender();
    }
  });

  const stopClick = (e: MouseEvent) => {
    if (isInteracting) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  };
  postcardEl.addEventListener("click", stopClick, true);

  const stepSpring = (
    obj: any,
    prop: string,
    velProp: string,
    target: number,
    dt: number,
    stiffness = 150,
    damping = 19
  ) => {
    obj[velProp] += ((target - obj[prop]) * stiffness - obj[velProp] * damping) * dt;
    obj[prop] += obj[velProp] * dt;
  };

  function tick(timestamp: number) {
    rafId = 0;
    if (!isRunning) return;
    const dt = Math.min((timestamp - prevTime) / 1000 || 0.016, 0.028);
    prevTime = timestamp;
    elapsedTime += dt;

    const isDragging = activePointerId !== null;
    for (let sub = 0; sub < 2; sub++) {
      const halfDt = dt / 2;
      const stiffness = isDragging ? 290 : 205;
      const damping = isDragging ? 28 : 18;
      depthVel += ((targetDepth - currentDepth) * stiffness - depthVel * damping) * halfDt;
      currentDepth += depthVel * halfDt;

      stepSpring(lightSpring, "x", "vx", lightSpring.tx, halfDt, 60, 14);
      stepSpring(lightSpring, "y", "vy", lightSpring.ty, halfDt, 60, 14);
      stepSpring(bendSpring, "x", "vx", bendSpring.tx, halfDt, 115, 17);
      stepSpring(bendSpring, "y", "vy", bendSpring.ty, halfDt, 115, 17);
      stepSpring(bendSpring, "z", "vz", bendSpring.tz, halfDt, 110, 16);
    }

    if (Math.abs(currentDepth) < 5e-5 && Math.abs(depthVel) < 5e-4) {
      currentDepth = depthVel = 0;
    }

    uniforms.uBend.value.set(bendSpring.x, bendSpring.y, bendSpring.z);
    uniforms.uLight.value.set(lightSpring.x, lightSpring.y);
    uniforms.uDepth.value = Math.max(0, currentDepth);

    // Fade shadow in as curl depth rises
    (shadowPlane.material as ShadowMaterial).opacity =
      0.15 * Math.min(1, Math.max(0, (currentDepth - 0.04) / 0.5));
    uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);

    if (
      (isDragging ||
        currentDepth !== 0 ||
        Math.abs(lightSpring.x - lightSpring.tx) + Math.abs(lightSpring.y - lightSpring.ty) > 0.002 ||
        Math.abs(bendSpring.x) + Math.abs(bendSpring.y) > 0.002) &&
      isRunning
    ) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function requestRender() {
    if (isRunning && !rafId) {
      prevTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  }

  // Initial draw
  renderer.render(scene, camera);

  return {
    reset() {
      if (!dragOrigin) {
        stickerPos = { x: 0, y: 0 };
        updateCssPosition();
      }
    },
    setRunning(running: boolean) {
      isRunning = running;
      if (running) {
        requestRender();
      } else {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    dispose() {
      isRunning = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      postcardEl.removeEventListener("pointermove", handlePostcardPointerMove);
      postcardEl.removeEventListener("click", stopClick, true);
      postcardEl.removeEventListener("pointerleave", handlePostcardPointerLeave);
      frontTexture.dispose();
      backTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
