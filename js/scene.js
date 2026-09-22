const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Aura 3D object ---
const canvas = document.getElementById('aura-canvas');
let width = window.innerWidth, height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(width, height);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 4, 16);
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100);

// The orb's world size and camera distance are fixed, so it always subtends
// the same angle vertically. On a narrow/tall aspect ratio that same fixed
// vertical FOV maps to a much narrower horizontal FOV, so the (unchanged)
// orb crops against the screen edges. Widening only the FOV as the aspect
// ratio narrows gives it more horizontal room without touching camera
// distance, so the orb keeps the same close, dramatic scale as desktop
// (and the scroll fly-through, which is tuned against this same fixed
// distance, isn't thrown off) -- it just stops overflowing the edges.
const BASE_FOV = 45, BASE_DIST = 9.5;
const WIDE_REF_ASPECT = 1.3, NARROW_REF_ASPECT = 0.45;
function applyResponsiveCamera() {
  const aspect = width / height;
  const t = Math.min(1, Math.max(0, (WIDE_REF_ASPECT - aspect) / (WIDE_REF_ASPECT - NARROW_REF_ASPECT)));
  camera.fov = BASE_FOV + t * 13;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
applyResponsiveCamera();
camera.position.set(0, 0, BASE_DIST);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const ambient = new THREE.AmbientLight(0x060a0c, 0.22);
scene.add(ambient);
const keyLight = new THREE.PointLight(0x4DE8FF, 3.2, 22, 2);
keyLight.position.set(3.2, 2.4, 4);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x1F8FE8, 0.7, 22, 2);
fillLight.position.set(-3.4, -2.2, -3);
scene.add(fillLight);

const grid = new THREE.GridHelper(80, 64, 0x1F8FE8, 0x0c2733);
grid.position.y = -2.0;
grid.material.transparent = true;
grid.material.opacity = 0.45;
scene.add(grid);
camera.lookAt(0, -0.9, 0);

const particleCount = 340;
const particlePos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 4 + Math.random() * 10;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
  particlePos[i * 3 + 2] = r * Math.cos(phi);
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x4DE8FF, size: 0.03, transparent: true, opacity: 0.18, sizeAttenuation: true });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

const geometry = new THREE.IcosahedronGeometry(2.05, 5);
const basePositions = geometry.attributes.position.array.slice();

const colors = [];
const colorA = new THREE.Color(0x4DE8FF);
const colorB = new THREE.Color(0x1F8FE8);
const colorC = new THREE.Color(0xB8FBFF);
const posAttr = geometry.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const y = posAttr.getY(i);
  const x = posAttr.getX(i);
  const t = (y + 2.05) / 4.10;
  const mix = (x + 2.05) / 4.10;
  const c = colorA.clone().lerp(colorB, t).lerp(colorC, Math.max(0, Math.min(1, mix * 0.6)));
  colors.push(c.r, c.g, c.b);
}
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.MeshBasicMaterial({
  vertexColors: true,
  wireframe: true,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const solidMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0e2630,
  transparent: true,
  opacity: 0.6,
  metalness: 0.5,
  roughness: 0.22,
  clearcoat: 0.8,
  clearcoatRoughness: 0.24,
  emissive: 0x0f4a5c,
  emissiveIntensity: 0.85,
  side: THREE.DoubleSide
});
// smooth sphere with shared vertex normals. The low-poly icosahedron above
// is kept only for the wireframe linework; the lit surface needs a geometry
// where adjacent faces share vertices, or normals can't blend and every
// facet shades as a hard flat plane (the "gem" look)
const sphereGeometry = new THREE.SphereGeometry(2.02, 96, 72);
const sphereBasePositions = sphereGeometry.attributes.position.array.slice();
const solidMesh = new THREE.Mesh(sphereGeometry, solidMaterial);
scene.add(solidMesh);

const glowGeo = new THREE.IcosahedronGeometry(2.02, 4);
const glowMat = new THREE.MeshBasicMaterial({ color: 0x1F8FE8, transparent: true, opacity: 0.05, side: THREE.BackSide });
const glowMesh = new THREE.Mesh(glowGeo, glowMat);

// fresnel rim: the edge-brightening that reads as "real" translucent/energy material
const rimGeo = new THREE.IcosahedronGeometry(2.06, 4);
const rimMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0x8FF3FF) },
    power: { value: 2.6 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    uniform vec3 glowColor;
    uniform float power;
    void main() {
      float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), power);
      gl_FragColor = vec4(glowColor, fresnel * 0.9);
    }
  `,
  transparent: true,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const rimMesh = new THREE.Mesh(rimGeo, rimMaterial);
scene.add(rimMesh);
glowMesh.scale.setScalar(1.08);
scene.add(glowMesh);

let mouseX = 0, mouseY = 0;
let targetRotX = 0, targetRotY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// --- click/tap ripple ---
// Each ripple stores its origin as a unit direction in the mesh's local
// (object) space -- the same space basePositions/sphereBasePositions live
// in, and the same space the per-frame displacement loop below works in.
// Storing it there (rather than in world space) is what makes the ripple
// stay attached to the correct spot on the surface as the orb keeps
// rotating after the click, instead of drifting.
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
const activeRipples = [];
const RIPPLE_WAVE_SPEED = 3.2;      // how fast the wavefront travels outward
// Measured empirically: the wireframe mesh (mesh/geometry) is only an
// IcosahedronGeometry(2.05, 5) -- detail subdivides each face into
// (detail+1)^2 triangles, not 4^detail, so this is just 720 faces total,
// with an average edge length of ~0.42 world units (verified by sampling
// hit.face vertices live). At the previous frequency of 9, the ripple's
// wavelength (2*PI/9 =~ 0.70) was *shorter* than that edge length: fewer
// than 2 samples per wavelength on that mesh, i.e. genuine undersampling/
// aliasing of the wave pattern, not a bug tied to viewing angle. It was
// most visible near the silhouette because that's where the same amount of
// (aliased) radial displacement projects to the largest apparent on-screen
// change -- grazing-angle surfaces amplify radial motion far more than
// front-facing ones do, so an artifact present everywhere reads as
// silhouette-only. 5 keeps wavelength (~1.26) at roughly 3x that edge
// length, comfortably above the Nyquist rate for this mesh.
const RIPPLE_FREQUENCY = 5;         // how many rings within the ripple
const RIPPLE_DISTANCE_DECAY = 2.2;  // higher = more localized around the click
const RIPPLE_TIME_DECAY = 2.8;      // higher = fades faster
const RIPPLE_AMPLITUDE = 0.15;
// Hard ceiling on the *summed* contribution from every overlapping ripple at
// a single vertex, regardless of how many are stacked there. Set just above
// one ripple's own peak so two overlapping ripples still read as slightly
// stronger than one, but rapid clicking can never compound past this.
const RIPPLE_MAX_TOTAL = 0.22;
const RIPPLE_MAX_LIFETIME = 2.0;    // hard cutoff (seconds), well past the point it's visually gone
const RIPPLE_MAX_COUNT = 8;         // bounds worst-case cost if clicked rapidly

let currentT = 0;

// Shared by every ripple source (direct clicks below, and the data-spark's
// through-orb entry/exit points) so they all stay visually consistent.
function addRippleAtWorldPoint(worldPoint) {
  const local = solidMesh.worldToLocal(worldPoint.clone()).normalize();
  if (activeRipples.length >= RIPPLE_MAX_COUNT) activeRipples.shift();
  activeRipples.push({ x: local.x, y: local.y, z: local.z, startTime: currentT });
}

function spawnRippleAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects([solidMesh, mesh], false);
  if (!hits.length) return;
  addRippleAtWorldPoint(hits[0].point);
}

// pointerdown covers both mouse clicks and touch taps with a single listener.
// An attempted click/tap on the spark makes it flee rather than ripple the
// orb underneath it (relevant mainly for touch, which has no hover event to
// have already triggered the proximity-based evade in pointermove above).
canvas.addEventListener('pointerdown', (e) => {
  if (trySparkEvadeClick(e.clientX, e.clientY)) return;
  spawnRippleAt(e.clientX, e.clientY);
});

// Summed displacement from every active ripple at a given point on the unit
// sphere (dx,dy,dz), added into the same radial `scale` factor the ambient
// noise below already uses. The phase (distance - elapsed*speed) is what
// makes the wave crests travel outward over time rather than sit still;
// the two exp() terms decay the effect with distance from the click and
// with time since the click, so it spreads and fades rather than pulsing
// the whole sphere uniformly.
function rippleDisplacement(dx, dy, dz) {
  let sum = 0;
  for (let r = 0; r < activeRipples.length; r++) {
    const ripple = activeRipples[r];
    const ddx = dx - ripple.x, ddy = dy - ripple.y, ddz = dz - ripple.z;
    const distance = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
    if (distance > 1.8) continue; // negligible contribution this far out, skip the transcendental calls
    const elapsed = currentT - ripple.startTime;
    const distanceDecay = Math.exp(-distance * RIPPLE_DISTANCE_DECAY);
    const timeDecay = Math.exp(-elapsed * RIPPLE_TIME_DECAY);
    const phase = distance - elapsed * RIPPLE_WAVE_SPEED;
    sum += RIPPLE_AMPLITUDE * distanceDecay * timeDecay * Math.cos(phase * RIPPLE_FREQUENCY);
  }
  // Clamp the total regardless of how many ripples overlap here, so rapid
  // clicking can't compound into an extreme spike.
  return Math.max(-RIPPLE_MAX_TOTAL, Math.min(RIPPLE_MAX_TOTAL, sum));
}

// --- data spark: a firefly-like light present only during the hero's
// pre-arrival scroll approach. Wanders freely around the orb, occasionally
// darting straight through its volume, and flees if the cursor gets close. ---
const SPARK_COLOR = 0x8FF3FF;
const SPARK_TRAIL_MAX = 14;
const SPARK_WANDER_TRAIL = 7;       // shorter trail while just drifting
const SPARK_THROUGH_TRAIL = 14;     // longer streak while crossing the interior (it's moving faster there)
const SPARK_MIN_RADIUS = 2.6;       // just outside the orb's own ~2.05 radius
const SPARK_MAX_RADIUS = 4.2;       // stays close enough to read as part of the hero scene
const SPARK_ORB_SURFACE_RADIUS = 2.05; // matches the wireframe's own radius
const SPARK_THROUGH_DIM = 0.4;      // dimmed, not hidden, while inside the orb's volume

// Visibility is tied directly to rawScrollProgress -- the same un-eased
// value that drives heroContent's own reveal (contentReveal kicks in past
// 0.78 there). Fading out over the same window and fully retiring at that
// exact threshold means the spark is always gone by the time the headline
// starts appearing, with no separate scroll math to keep in sync. This is
// the hard rule and takes priority over everything below: once retired,
// gone for good, regardless of where the on/off cycle happened to be.
const SPARK_FADE_START = 0.42;
const SPARK_FADE_END = 0.78;

// Recurring presence cycle, independent of scroll speed: visible for 30s,
// hidden for 2 minutes, repeating for as long as someone lingers before
// arrival -- rather than a single one-shot appearance (or the previous
// random per-visit chance), this gives anyone who dawdles at the top or
// scrolls slowly a couple of chances to notice it. Most people scrolling
// at a normal pace will simply arrive within the first on-window anyway.
const SPARK_CYCLE_ON_SECONDS = 30;
const SPARK_CYCLE_OFF_SECONDS = 120;
const SPARK_CYCLE_PERIOD = SPARK_CYCLE_ON_SECONDS + SPARK_CYCLE_OFF_SECONDS;
const SPARK_CYCLE_FADE_SECONDS = 0.6; // smooth fade at each on/off boundary, not an abrupt cut

// Firefly movement: mostly unhurried legs, occasionally a fast "burst" leg,
// linear (not eased) interpolation so direction changes at each waypoint
// read as sharp rather than gently settling in and out.
const SPARK_BURST_CHANCE = 0.22;
const SPARK_NORMAL_LEG_RANGE = [1.5, 3.4];
const SPARK_BURST_LEG_RANGE = [0.28, 0.55];

// The approach window is short (bounded by how long someone spends
// scrolling through the fly-through), so through-passes are triggered by
// scroll position, not a long random real-world interval that might not
// fire in time -- guarantees at least one, likely two, actually happen.
const SPARK_THROUGH_SCROLL_THRESHOLDS = [0.14, 0.34];

// Evade: cursor proximity (or an attempted click/tap, for touch where
// there's no hover) makes it dart away quickly rather than brightening.
const SPARK_EVADE_RADIUS_PX = 90;
const SPARK_EVADE_COOLDOWN = 0.7;
const SPARK_EVADE_DURATION_RANGE = [0.2, 0.35];
const SPARK_EVADE_DISTANCE_RANGE = [1.6, 2.6];

const sparkTrailPositions = new Float32Array(SPARK_TRAIL_MAX * 3);
const sparkTrailAlphas = new Float32Array(SPARK_TRAIL_MAX);
const sparkGeometry = new THREE.BufferGeometry();
sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkTrailPositions, 3));
sparkGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(sparkTrailAlphas, 1));
sparkGeometry.setDrawRange(0, 0);

const sparkMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(SPARK_COLOR) }
  },
  vertexShader: `
    attribute float aAlpha;
    varying float vAlpha;
    void main() {
      vAlpha = aAlpha;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 11.0 + 34.0 * aAlpha;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    uniform vec3 color;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float glow = smoothstep(0.5, 0.0, length(c));
      if (glow <= 0.001) discard;
      gl_FragColor = vec4(color, glow * vAlpha);
    }
  `,
  transparent: true,
  // Explicitly off, not just left at the default. This is what makes the
  // spark stay visible (dimmed via aAlpha below) while "inside" the orb --
  // previously depthTest:true meant the orb's own depth buffer discarded
  // the spark's fragments outright whenever it was behind the near
  // surface, regardless of the orb's own transparency. The "inside" look
  // is now produced entirely by SPARK_THROUGH_DIM, not by real occlusion.
  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial);
sparkPoints.frustumCulled = false;
sparkPoints.visible = false;
// A child of the scene, not the rotating mesh: it flies through fixed space
// around the orb, independent of the orb's own spin.
scene.add(sparkPoints);

function randomPointOnShell() {
  const r = SPARK_MIN_RADIUS + Math.random() * (SPARK_MAX_RADIUS - SPARK_MIN_RADIUS);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.75, // flattened a little so it stays in typical frame
    r * Math.cos(phi)
  );
}

function pickLegDuration() {
  const [nMin, nMax] = SPARK_NORMAL_LEG_RANGE;
  const [bMin, bMax] = SPARK_BURST_LEG_RANGE;
  return Math.random() < SPARK_BURST_CHANCE ? bMin + Math.random() * (bMax - bMin) : nMin + Math.random() * (nMax - nMin);
}

const spark = {
  state: 'wander',          // 'wander' | 'through' | 'evade'
  wanderFrom: randomPointOnShell(),
  wanderTo: randomPointOnShell(),
  wanderProgress: 0,
  wanderDuration: pickLegDuration(),
  wobbleSeed: Math.random() * 100,
  throughFrom: new THREE.Vector3(),
  throughTo: new THREE.Vector3(),
  throughProgress: 0,
  throughDuration: 1,
  throughEntryTt: 0,
  throughExitTt: 1,
  throughEntryFired: false,
  throughExitFired: false,
  nextThroughIndex: 0,
  evadeFrom: new THREE.Vector3(),
  evadeTo: new THREE.Vector3(),
  evadeProgress: 0,
  evadeDuration: 0.25,
  lastEvadeTime: -999,
  cycleStartT: null,        // reference point the 30s-on/2min-off cycle counts from
  retired: false,           // permanent once true -- never re-shown, even if scroll reverses
  lastScreenX: null,
  lastScreenY: null,
  trailHistory: []
};

function beginThroughPass(fromPos) {
  // Antipodal points on the wander shell, so the straight line between them
  // passes exactly through the origin -- i.e. through the orb's centre.
  const entry = randomPointOnShell();
  const exit = entry.clone().negate();
  spark.throughFrom.copy(entry);
  spark.throughTo.copy(exit);
  spark.throughProgress = 0;
  spark.throughDuration = 1.7 + Math.random() * 0.5;
  spark.state = 'through';
  spark.throughEntryFired = false;
  spark.throughExitFired = false;
  // entry/exit are antipodal at the same shell radius R, so the straight
  // line's distance from the origin at progress tt is R*|1-2*tt| -- solving
  // that for the orb's own surface radius gives exactly where along this
  // pass it crosses the surface, once on the way in and once on the way out.
  const ratio = Math.min(1, SPARK_ORB_SURFACE_RADIUS / entry.length());
  spark.throughEntryTt = (1 - ratio) / 2;
  spark.throughExitTt = (1 + ratio) / 2;
}

function triggerSparkEvade() {
  if (!sparkPoints.visible || spark.state === 'through') return;
  if (currentT - spark.lastEvadeTime < SPARK_EVADE_COOLDOWN) return;
  spark.lastEvadeTime = currentT;
  const from = _sparkHead.clone();
  const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
  const [dMin, dMax] = SPARK_EVADE_DISTANCE_RANGE;
  const to = from.clone().addScaledVector(dir, dMin + Math.random() * (dMax - dMin));
  const dist = to.length();
  if (dist < SPARK_MIN_RADIUS) to.setLength(SPARK_MIN_RADIUS);
  else if (dist > SPARK_MAX_RADIUS) to.setLength(SPARK_MAX_RADIUS);
  spark.evadeFrom.copy(from);
  spark.evadeTo.copy(to);
  spark.evadeProgress = 0;
  const [durMin, durMax] = SPARK_EVADE_DURATION_RANGE;
  spark.evadeDuration = durMin + Math.random() * (durMax - durMin);
  spark.state = 'evade';
}

const _sparkHead = new THREE.Vector3();

function updateSpark(dt) {
  if (spark.cycleStartT === null) spark.cycleStartT = currentT;

  // Ratchet: once past the fade-end threshold, gone for good, regardless of
  // scrolling back up afterward. This hard rule takes priority over the
  // on/off cycle below -- it's checked first and, once true, nothing in
  // the cycle can bring the spark back.
  if (rawScrollProgress >= SPARK_FADE_END) spark.retired = true;

  // Recurring 30s-on/2min-off presence cycle, counted from cycleStartT
  // regardless of scroll -- so it keeps running even if someone lingers at
  // the very top of the hero before scrolling at all. cycleAlpha ramps
  // smoothly at each on/off boundary rather than cutting abruptly, and its
  // very first ramp-up (at cycleT=0) doubles as the spark's initial
  // entrance fade-in, so no separate one-shot entrance timer is needed.
  const cycleT = (currentT - spark.cycleStartT) % SPARK_CYCLE_PERIOD;
  const cycleAlpha = cycleT < SPARK_CYCLE_ON_SECONDS
    ? Math.min(1, cycleT / SPARK_CYCLE_FADE_SECONDS, (SPARK_CYCLE_ON_SECONDS - cycleT) / SPARK_CYCLE_FADE_SECONDS)
    : 0;

  // Stop doing any per-frame work when there's nothing to show -- either
  // permanently retired, or just in an "off" window of the presence cycle
  // -- *unless* a through-pass is still in flight, which needs to keep
  // running so it can actually finish (state transition back to 'wander',
  // exit ripple still firing) instead of freezing mid-pass. Found via
  // testing: an earlier version returned unconditionally once retired,
  // and retiring mid-pass left throughProgress permanently stuck and the
  // exit ripple never fired; the same trap would apply to the off-cycle
  // window if it weren't guarded the same way.
  if ((spark.retired || cycleAlpha <= 0.001) && spark.state !== 'through') {
    sparkPoints.visible = false;
    return;
  }

  const scrollAlpha = rawScrollProgress <= SPARK_FADE_START ? 1
    : Math.max(0, 1 - (rawScrollProgress - SPARK_FADE_START) / (SPARK_FADE_END - SPARK_FADE_START));
  const targetAlpha = spark.retired ? 0 : scrollAlpha * cycleAlpha;

  if (targetAlpha <= 0.001 && spark.state !== 'through') {
    sparkPoints.visible = false;
  } else {
    sparkPoints.visible = true;
  }

  let headPos;
  let dimFactor = 1.0;

  if (spark.state === 'wander') {
    // Scroll-triggered through-pass check happens before the normal leg
    // logic so it can interrupt an in-progress leg immediately rather than
    // waiting for it to finish -- the approach window is short enough that
    // waiting could eat into it meaningfully.
    if (spark.nextThroughIndex < SPARK_THROUGH_SCROLL_THRESHOLDS.length
        && rawScrollProgress >= SPARK_THROUGH_SCROLL_THRESHOLDS[spark.nextThroughIndex]) {
      spark.nextThroughIndex++;
      beginThroughPass(spark.wanderTo);
    } else {
      spark.wanderProgress += dt / spark.wanderDuration;
      if (spark.wanderProgress >= 1) {
        spark.wanderFrom.copy(spark.wanderTo);
        spark.wanderTo.copy(randomPointOnShell());
        spark.wanderProgress = 0;
        spark.wanderDuration = pickLegDuration();
      }
      // Linear, not eased: velocity changes abruptly at each waypoint
      // instead of easing in and out, reading as sharper firefly-like turns.
      const tt = Math.min(1, spark.wanderProgress);
      headPos = _sparkHead.copy(spark.wanderFrom).lerp(spark.wanderTo, tt);
      const s = spark.wobbleSeed;
      headPos.x += Math.sin(currentT * 0.85 + s) * 0.18;
      headPos.y += Math.sin(currentT * 0.6 + s * 1.7) * 0.13;
      headPos.z += Math.cos(currentT * 0.7 + s * 2.3) * 0.18;
    }
  }

  if (spark.state === 'through') {
    spark.throughProgress += dt / spark.throughDuration;
    const tt = Math.min(1, spark.throughProgress);
    headPos = _sparkHead.copy(spark.throughFrom).lerp(spark.throughTo, tt);
    if (headPos.length() < SPARK_ORB_SURFACE_RADIUS) dimFactor = SPARK_THROUGH_DIM;
    // Ripple exactly where the pass crosses the orb's real surface, using
    // the same effect the orb's own click interaction already uses.
    if (!spark.throughEntryFired && tt >= spark.throughEntryTt) {
      spark.throughEntryFired = true;
      const entryPoint = spark.throughFrom.clone().lerp(spark.throughTo, spark.throughEntryTt);
      addRippleAtWorldPoint(entryPoint);
    }
    if (!spark.throughExitFired && tt >= spark.throughExitTt) {
      spark.throughExitFired = true;
      const exitPoint = spark.throughFrom.clone().lerp(spark.throughTo, spark.throughExitTt);
      addRippleAtWorldPoint(exitPoint);
    }
    if (spark.throughProgress >= 1) {
      spark.wanderFrom.copy(spark.throughTo);
      spark.wanderTo.copy(randomPointOnShell());
      spark.wanderProgress = 0;
      spark.wanderDuration = pickLegDuration();
      spark.state = 'wander';
    }
  }

  if (spark.state === 'evade') {
    spark.evadeProgress += dt / spark.evadeDuration;
    const tt = Math.min(1, spark.evadeProgress);
    headPos = _sparkHead.copy(spark.evadeFrom).lerp(spark.evadeTo, tt);
    if (spark.evadeProgress >= 1) {
      spark.wanderFrom.copy(spark.evadeTo);
      spark.wanderTo.copy(randomPointOnShell());
      spark.wanderProgress = 0;
      spark.wanderDuration = pickLegDuration();
      spark.state = 'wander';
    }
  }

  if (!headPos) return; // through-pass just started this tick; nothing to draw yet this frame

  spark.trailHistory.unshift(headPos.clone());
  if (spark.trailHistory.length > SPARK_TRAIL_MAX) spark.trailHistory.length = SPARK_TRAIL_MAX;

  const activeTrailLen = spark.state === 'through' ? SPARK_THROUGH_TRAIL : SPARK_WANDER_TRAIL;
  let drawCount = 0;
  for (let i = 0; i < SPARK_TRAIL_MAX; i++) {
    const hp = spark.trailHistory[i];
    if (hp && i < activeTrailLen) {
      sparkTrailPositions[i * 3] = hp.x;
      sparkTrailPositions[i * 3 + 1] = hp.y;
      sparkTrailPositions[i * 3 + 2] = hp.z;
      const fadeT = 1 - i / activeTrailLen;
      sparkTrailAlphas[i] = fadeT * fadeT * targetAlpha * dimFactor;
      drawCount = i + 1;
    } else {
      sparkTrailAlphas[i] = 0;
    }
  }
  sparkGeometry.setDrawRange(0, drawCount);
  sparkGeometry.attributes.position.needsUpdate = true;
  sparkGeometry.attributes.aAlpha.needsUpdate = true;

  // Cache the on-screen position for the evade proximity checks below,
  // which run off mouse/pointer events rather than every render frame.
  const projected = headPos.clone().project(camera);
  const rect = canvas.getBoundingClientRect();
  spark.lastScreenX = rect.left + (projected.x + 1) / 2 * rect.width;
  spark.lastScreenY = rect.top + (1 - projected.y) / 2 * rect.height;
}

// --- evade on cursor proximity or an attempted click/tap ---
window.addEventListener('pointermove', (e) => {
  if (!sparkPoints.visible || spark.lastScreenX === null) return;
  const dx = e.clientX - spark.lastScreenX, dy = e.clientY - spark.lastScreenY;
  if (Math.sqrt(dx * dx + dy * dy) < SPARK_EVADE_RADIUS_PX) triggerSparkEvade();
});

// Returns true if this click/tap was close enough to the spark to count as
// "attempting to click it" (relevant for touch, which has no hover event
// to have already triggered the proximity check above).
function trySparkEvadeClick(clientX, clientY) {
  if (!sparkPoints.visible || spark.lastScreenX === null) return false;
  const dx = clientX - spark.lastScreenX, dy = clientY - spark.lastScreenY;
  if (Math.sqrt(dx * dx + dy * dy) >= SPARK_EVADE_RADIUS_PX) return false;
  triggerSparkEvade();
  return true;
}

// --- scroll progress: how far we've flown into the aura ---
const heroSection = document.getElementById('hero');
const lightWash = document.getElementById('light-wash');
const heroContent = document.getElementById('hero-content');
const introCaption = document.getElementById('intro-caption');
const scrollCue = document.getElementById('scroll-cue');

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

let flyProgress = 0;
// Raw (un-eased) scroll fraction through the hero, exposed at module level
// so the data-spark can tie its own visibility to the exact same value
// that drives the headline/CTA reveal below (contentReveal), rather than
// duplicating scroll math or guessing at an equivalent threshold.
let rawScrollProgress = 0;
function updateScrollProgress() {
  if (prefersReducedMotion) { flyProgress = 0; return; }
  const rect = heroSection.getBoundingClientRect();
  const scrollable = heroSection.offsetHeight - window.innerHeight;
  let raw = scrollable > 0 ? -rect.top / scrollable : 0;
  raw = Math.max(0, Math.min(1, raw));
  rawScrollProgress = raw;
  flyProgress = easeInOutCubic(raw);

  lightWash.style.opacity = Math.min(1, flyProgress * 1.6) * (flyProgress > 0.92 ? Math.max(0, 1 - (flyProgress - 0.92) / 0.08) : 1);

  // fade the centered hero logo out as the camera flies into the aura
  introCaption.style.opacity = Math.max(0, 1 - flyProgress / 0.5);

  const contentReveal = raw > 0.78 ? Math.min(1, (raw - 0.78) / 0.22) : 0;
  heroContent.style.opacity = contentReveal;
  heroContent.style.transform = `translateY(${14 * (1 - contentReveal)}px)`;
  heroContent.style.pointerEvents = contentReveal > 0.9 ? 'all' : 'none';

  scrollCue.style.opacity = raw < 0.04 ? 1 : 0;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const clock = new THREE.Clock();
let firstFrameSignaled = false;
let lastT = 0;
function animate() {
  const t = clock.getElapsedTime();
  // Derived independently of clock.getDelta() (calling both would double-
  // consume the clock's internal delta tracking). Clamped so a long pause
  // (e.g. a backgrounded tab resuming) can't hand the spark one giant jump.
  const dt = Math.min(0.1, t - lastT);
  lastT = t;
  currentT = t;

  // drop ripples once they're old enough to be visually gone, so this array
  // (and the per-vertex work below) doesn't grow across a long session
  if (activeRipples.length) {
    for (let r = activeRipples.length - 1; r >= 0; r--) {
      if (currentT - activeRipples[r].startTime > RIPPLE_MAX_LIFETIME) activeRipples.splice(r, 1);
    }
  }

  // Independent of the orb's own geometry/rotation now, so this can run
  // anywhere in the frame.
  updateSpark(dt);

  const noiseAmp = 0.5 + flyProgress * 0.9;
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ix = basePositions[i * 3];
    const iy = basePositions[i * 3 + 1];
    const iz = basePositions[i * 3 + 2];
    const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
    const dx = ix / len, dy = iy / len, dz = iz / len;
    const noise = Math.sin(ix * 1.6 + t * 0.6) * Math.cos(iy * 1.6 + t * 0.5) * 0.14
                + Math.sin(iz * 2.1 + t * 0.4) * 0.08;
    const ripple = activeRipples.length ? rippleDisplacement(dx, dy, dz) : 0;
    const scale = 1 + noise * noiseAmp + ripple;
    pos.setXYZ(i, dx * len * scale, dy * len * scale, dz * len * scale);
  }
  pos.needsUpdate = true;
  // No computeVertexNormals() here: `material` is a MeshBasicMaterial
  // (unlit, wireframe), which never reads vertex normals, so recomputing
  // them for ~60k vertices every frame was pure wasted CPU work -- likely
  // the main cause of the animation lag, especially on mobile.

  const spherePos = sphereGeometry.attributes.position;
  const sphereNormal = sphereGeometry.attributes.normal;
  for (let i = 0; i < spherePos.count; i++) {
    const ix = sphereBasePositions[i * 3];
    const iy = sphereBasePositions[i * 3 + 1];
    const iz = sphereBasePositions[i * 3 + 2];
    const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
    const dx = ix / len, dy = iy / len, dz = iz / len;
    const noise = Math.sin(ix * 1.6 + t * 0.6) * Math.cos(iy * 1.6 + t * 0.5) * 0.14
                + Math.sin(iz * 2.1 + t * 0.4) * 0.08;
    const ripple = activeRipples.length ? rippleDisplacement(dx, dy, dz) : 0;
    const scale = 1 + noise * noiseAmp + ripple;
    spherePos.setXYZ(i, dx * len * scale, dy * len * scale, dz * len * scale);
    // analytic radial normal instead of computeVertexNormals(): a UV sphere's pole
    // vertices share a position but not a buffer index, so face-normal averaging
    // can't blend them and the pole shows up as a faceted pinwheel. The radial
    // direction is smooth and seamless everywhere, poles included.
    sphereNormal.setXYZ(i, dx, dy, dz);
  }
  spherePos.needsUpdate = true;
  sphereNormal.needsUpdate = true;

  targetRotX += (mouseY * 0.4 - targetRotX) * 0.04;
  targetRotY += (mouseX * 0.4 - targetRotY) * 0.04;

  mesh.rotation.y = t * 0.12 + targetRotY;
  mesh.rotation.x = t * 0.06 + targetRotX;
  solidMesh.rotation.copy(mesh.rotation);
  rimMesh.rotation.copy(mesh.rotation);
  glowMesh.rotation.y = t * 0.05;

  // sweep the lights slowly so the shading on the surface visibly shifts.
  // A static light makes a 3D object read as flat
  keyLight.position.x = Math.sin(t * 0.25) * 4;
  keyLight.position.z = Math.cos(t * 0.25) * 4 + 1.5;
  fillLight.position.x = Math.sin(t * 0.2 + Math.PI) * 4;
  fillLight.position.z = Math.cos(t * 0.2 + Math.PI) * 4 - 1.5;

  particles.rotation.y = t * 0.015;
  grid.material.opacity = 0.45 * Math.max(0, 1 - flyProgress * 0.85);

  // fly the camera through the aura as the user scrolls
  const targetZ = BASE_DIST - flyProgress * 9;
  camera.position.z += (targetZ - camera.position.z) * 0.18;

  renderer.render(scene, camera);

  // Signal that a real, fully set-up frame has actually been drawn (not
  // just that this script finished downloading), so the static HTML loader
  // can hand off to the scene. Fires exactly once.
  if (!firstFrameSignaled) {
    firstFrameSignaled = true;
    if (window.__auraSceneReady) window.__auraSceneReady();
  }

  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  applyResponsiveCamera();
  renderer.setSize(width, height);
});
