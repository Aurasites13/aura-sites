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
camera.position.set(0, 0, 9.5);

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
  let raw = -rect.top / scrollable;
  raw = Math.max(0, Math.min(1, raw));
  flyProgress = easeInOutCubic(raw);

  lightWash.style.opacity = Math.min(1, flyProgress * 1.6) * (flyProgress > 0.92 ? Math.max(0, 1 - (flyProgress - 0.92) / 0.08) : 1);

  introCaption.style.opacity = raw < 0.06 ? 1 : Math.max(0, 1 - (raw - 0.06) / 0.1);

  const contentReveal = raw > 0.78 ? Math.min(1, (raw - 0.78) / 0.22) : 0;
  heroContent.style.opacity = contentReveal;
  heroContent.style.transform = `translateY(${14 * (1 - contentReveal)}px)`;
  heroContent.style.pointerEvents = contentReveal > 0.9 ? 'all' : 'none';

  scrollCue.style.opacity = raw < 0.04 ? 1 : 0;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  const noiseAmp = 0.5 + flyProgress * 0.9;
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ix = basePositions[i * 3];
    const iy = basePositions[i * 3 + 1];
    const iz = basePositions[i * 3 + 2];
    const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
    const noise = Math.sin(ix * 1.6 + t * 0.6) * Math.cos(iy * 1.6 + t * 0.5) * 0.14
                + Math.sin(iz * 2.1 + t * 0.4) * 0.08;
    const scale = 1 + noise * noiseAmp;
    pos.setXYZ(i, (ix / len) * len * scale, (iy / len) * len * scale, (iz / len) * len * scale);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();

  const spherePos = sphereGeometry.attributes.position;
  const sphereNormal = sphereGeometry.attributes.normal;
  for (let i = 0; i < spherePos.count; i++) {
    const ix = sphereBasePositions[i * 3];
    const iy = sphereBasePositions[i * 3 + 1];
    const iz = sphereBasePositions[i * 3 + 2];
    const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
    const noise = Math.sin(ix * 1.6 + t * 0.6) * Math.cos(iy * 1.6 + t * 0.5) * 0.14
                + Math.sin(iz * 2.1 + t * 0.4) * 0.08;
    const scale = 1 + noise * noiseAmp;
    spherePos.setXYZ(i, (ix / len) * len * scale, (iy / len) * len * scale, (iz / len) * len * scale);
    // analytic radial normal instead of computeVertexNormals(): a UV sphere's pole
    // vertices share a position but not a buffer index, so face-normal averaging
    // can't blend them and the pole shows up as a faceted pinwheel. The radial
    // direction is smooth and seamless everywhere, poles included.
    sphereNormal.setXYZ(i, ix / len, iy / len, iz / len);
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
  const targetZ = 9.5 - flyProgress * 9;
  camera.position.z += (targetZ - camera.position.z) * 0.18;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
