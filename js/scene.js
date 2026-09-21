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

function spawnRippleAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects([solidMesh, mesh], false);
  if (!hits.length) return;

  const local = solidMesh.worldToLocal(hits[0].point.clone()).normalize();
  if (activeRipples.length >= RIPPLE_MAX_COUNT) activeRipples.shift();
  activeRipples.push({ x: local.x, y: local.y, z: local.z, startTime: currentT });
}

// pointerdown covers both mouse clicks and touch taps with a single listener
canvas.addEventListener('pointerdown', (e) => spawnRippleAt(e.clientX, e.clientY));

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
function updateScrollProgress() {
  if (prefersReducedMotion) { flyProgress = 0; return; }
  const rect = heroSection.getBoundingClientRect();
  const scrollable = heroSection.offsetHeight - window.innerHeight;
  let raw = scrollable > 0 ? -rect.top / scrollable : 0;
  raw = Math.max(0, Math.min(1, raw));
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
function animate() {
  const t = clock.getElapsedTime();
  currentT = t;

  // drop ripples once they're old enough to be visually gone, so this array
  // (and the per-vertex work below) doesn't grow across a long session
  if (activeRipples.length) {
    for (let r = activeRipples.length - 1; r >= 0; r--) {
      if (currentT - activeRipples[r].startTime > RIPPLE_MAX_LIFETIME) activeRipples.splice(r, 1);
    }
  }

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
