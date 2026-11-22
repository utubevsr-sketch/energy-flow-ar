// Energy Flow AR: point at any surface in your room, pinch, and a torrent of luminous energy flows to you.
// Meta Quest 3 mixed reality (passthrough), hands only. WebXR + Three.js, no build step.
import * as THREE from './vendor/three/three.module.js';

// ---------- qualities (copied from Puja VR, with their colours) ----------
// Spiritual qualities to offer instead of liquids, five to a set. Each takes the colour of the planet or deity
// linked with it in Vedic tradition; where tradition gives no single colour, the colour follows the meaning.
// They pour slowly, like honey, as radiant light: white at the core, the colour glowing round it.
const QUALITY_SETS = [
  [['Intelligence', 0xffe6a0], ['Love', 0xff5fa8], ['Power', 0xff4a1c], ['Self-discipline', 0x2f6bff], ['Abundance', 0xffc81a]], // Saraswati, Venus, Sun, Saturn, Jupiter
  // Calm and Clear Under Pressure: staying calm and thinking coolly and clearly when under pressure (the cool Moon).
  [['Courage', 0xff1a30], ['Calm and Clear Under Pressure', 0x4fd8ff], ['Harmony', 0x22e07a], ['Peace', 0xdcd0ff], ['Joy', 0xff9a1f]],             // Mars, Moon (water), Mercury, Moon, Jupiter
  [['Strength', 0xff6010], ['Fame', 0xffd040], ['Devotion', 0x9a6bff], ['Wisdom', 0xfff07a], ['Health', 0xff8a5c]],           // Hanuman's sindoor, Sun, Ketu, Jupiter, Sun
  // Restraint: passing up small pleasures for the greater good (shreyas over preyas, Katha Upanishad).
  // Saturn rules patience and rewards that come late; deep sapphire indigo, set apart from self-discipline's blue.
  // Gratitude: Jupiter, grace and blessings received, in a soft rose, paler than love's pink.
  // Focus: Mercury, the one-pointed mind (ekagrata), in a bright chartreuse set apart from harmony's emerald.
  // Peaceful and Divine Sleep: the Moon rules sleep and the mind at rest (yoga nidra), in a soft moonlit periwinkle.
  // Career, Success and Prosperity: Lakshmi's wealth with Mercury's skill in work and trade,
  // in a rich jade teal, set apart from harmony's emerald and calm-and-clear's cyan.
  [['Restraint', 0x4b3cff], ['Gratitude', 0xff8c9a], ['Focus', 0xa8ff2a], ['Peaceful and Divine Sleep', 0x8fa8ff], ['Career, Success and Prosperity', 0x10c9b8]],
  // Protection of food, home and belongings from negative energies: Durga's guarding shakti,
  // in a vivid magenta, set apart from love's pink and devotion's violet.
  // Deep Connection with the Divine: the inner light (jyoti) of the Self, in a pure radiant white.
  // Transmute Psychic Attacks into Joy and Prosperity: Agni's purifying fire turns harm into blessing,
  // in a deep amethyst, set apart from protection's magenta and devotion's soft violet.
  // Divine Justice: Shani, lord of karma and justice, whose metal is iron, in a burnished steel blue-silver.
  [['Protection of Food, Home and Belongings', 0xe31ee0], ['Deep Connection with the Divine', 0xf4f8ff], ['Transmute Psychic Attacks into Joy and Prosperity', 0xa020f0], ['Divine Justice', 0x9fb6d0]],
].map(set => set.map(([label, hex]) => ({ label, hex, rgb: new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace) })));

const INTENSITIES = [
  { label: 'Gentle', count: 9000, gain: 0.8, speed: 0.8 },
  { label: 'Strong', count: 18000, gain: 1.0, speed: 1.0 },
  { label: 'Torrent', count: 30000, gain: 1.15, speed: 1.3 },
];
const MAX_FLOWS = 3; // guess: a new flow beyond this replaces the oldest

const state = { set: 0, q: 0, intensity: 1, recv: 0 }; // q = -1 means all of the set together; recv: 0 Auto, 1 Heart, 2 Palms
const RECEIVE = ['Auto', 'Heart', 'Palms'];
try {
  const s = JSON.parse(localStorage.getItem('energy-flow') || '{}');
  if (s.set >= 0 && s.set < QUALITY_SETS.length) state.set = s.set;
  if (s.q >= -1 && s.q < QUALITY_SETS[state.set].length) state.q = s.q;
  if (s.intensity >= 0 && s.intensity < INTENSITIES.length) state.intensity = s.intensity;
  if (s.recv >= 0 && s.recv < RECEIVE.length) state.recv = s.recv;
} catch (e) { /* only a convenience */ }
const save = () => { try { localStorage.setItem('energy-flow', JSON.stringify(state)); } catch (e) { /* only a convenience */ } };
const selectedQualities = () => (state.q < 0 ? QUALITY_SETS[state.set] : [QUALITY_SETS[state.set][state.q]]);
// The one shared palette every layer is tinted with: five slots, cycling through the chosen quality (or the set).
// Dark colours (like Restraint's indigo) are lifted so their glow still reads over a bright room; hue is kept.
function palette(qs = selectedQualities()) {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const c = qs[i % qs.length].rgb.clone();
    const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    if (lum < 0.5) c.multiplyScalar(Math.min(1.9, 0.5 / Math.max(lum, 0.05)));
    // Pale colours (like Divine Justice's steel blue) get their hue strengthened so they don't wash out to white;
    // a true white (Deep Connection with the Divine) stays white.
    const spread = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
    if (lum > 0.55 && spread > 0.06 && spread < 0.4) { const k = 2.3; c.setRGB(lum + (c.r - lum) * k, lum + (c.g - lum) * k, lum + (c.b - lum) * k, THREE.LinearSRGBColorSpace); c.r = Math.max(0, c.r); c.g = Math.max(0, c.g); c.b = Math.max(0, c.b); }
    out.push(c);
  }
  return out;
}

const params = new URLSearchParams(location.search);
const DEMO = params.has('demo');
const DEMO_SIDE = params.get('demo') === 'side';
const DEMO_ARRIVAL = params.get('demo') === 'arrival';
const DEMO_PALMS = params.get('demo') === 'palms';
const DEMO_MENU = params.get('demo') === 'menu'; // fakes a left palm turned toward you, to show the hand menu // stand-in person holding both palms out to the flow
const STOP_AT = DEMO ? +params.get('stop') || 0 : 0;
const PHANTOM_MODE = DEMO_SIDE || DEMO_ARRIVAL || DEMO_PALMS; // the target is a stand-in person seen from outside
if (DEMO) document.body.classList.add('demo');

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: DEMO });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');
renderer.xr.setFoveation(0.5);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.02, 60);
camera.rotation.order = 'YXZ';
camera.position.set(0.15, 1.6, 1.6);
scene.add(camera);
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Additive light that also keeps the passthrough visible: colour adds, alpha only slightly veils the room.
const GLOW_BLEND = {
  blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  transparent: true, depthWrite: false, toneMapped: false,
};

// ---------- shared GLSL ----------
const NOISE = /* glsl */`
#define TAU 6.2831853
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// Value noise that repeats every 'per' cells in x, so it wraps seamlessly round a tube or a disk.
float vnoiseP(vec2 p, float per){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  vec2 a = vec2(mod(i.x, per), i.y), b = vec2(mod(i.x + 1., per), i.y);
  return mix(mix(hash12(a), hash12(b), u.x), mix(hash12(a + vec2(0., 1.)), hash12(b + vec2(0., 1.)), u.x), u.y);
}
float fbmP(vec2 p, float per){
  float s = 0., a = .5;
  for (int i = 0; i < 3; i++){ s += a * vnoiseP(p, per); p = p * 2. + vec2(0., 7.31); per *= 2.; a *= .5; }
  return s / .875;
}`;

const FLOW = /* glsl */`
uniform vec3 uS, uC, uD, uN, uPN, uE1, uE2, uPA, uPB; // uPA/uPB: the two palms (both = uD when pouring into the heart)
uniform float uSplit, uGlow, uAge, uLen, uRsrc, uRdst, uRdisk, uReveal, uSpin, uFade, uTwist, uGain, uSpeed, uArrive;
uniform vec3 uColors[5];
uniform float uNC;
vec3 bez(float w){ float a = 1. - w; return a * a * uS + 2. * a * w * uC + w * w * uD; }
vec3 bezT(float w){ return normalize((1. - w) * (uC - uS) + w * (uD - uC) + vec3(1e-5)); }
// The hurricane funnel: wide at the surface, narrowing toward you, pouring into the chest at the end.
float funnelR(float w){ float R = uRdst + (uRsrc - uRdst) * pow(1. - w, 1.6); return R * (1. - smoothstep(0.9, 1.0, w)); }
vec3 colorAt(float k){ int i = int(floor(fract(k) * uNC)); return uColors[clamp(i, 0, 4)]; }
vec3 colorSmooth(float k){
  float x = fract(k) * uNC; int i = int(floor(x)); int j = int(mod(float(i) + 1., uNC));
  return mix(uColors[clamp(i, 0, 4)], uColors[clamp(j, 0, 4)], smoothstep(0.25, 0.75, fract(x)));
}`;

// Spin rule: every swirl turns ANTICLOCKWISE as seen by you looking toward the source (rotation about the
// direction of travel, toward you), and the vortex on the surface anticlockwise as seen from the room.
// The swirl around your body (and anything circling the body) keeps its original turn: clockwise seen from above.
// Where a particle is at time t. u runs 0..1 along its life: the first 15% spirals across the surface into the
// funnel mouth, the rest rides the funnel to you, spinning faster as the funnel narrows (angular momentum).
const FLOW_POS = /* glsl */`
vec3 flowPos(float phase, float t, float rf, float a0, float spd, float seed, out float w, out float vis){
  float u = fract(phase + t * spd * uSpeed / uLen);
  if (u < 0.15){
    float s = u / 0.15;
    float rd = uRdisk * (0.3 + 0.7 * fract(seed * 7.13));
    float Rm = mix(rd, uRsrc, s);
    float r = Rm * mix(1., rf, s);
    float ang = a0 + t * 0.6 + uTwist * (1.5 / (Rm + 0.05) - 3. * pow(1. - s, 1.5)); // extra turn, gained as it spirals in
    vec3 B2 = normalize(cross(bezT(0.), uPN));
    float k = smoothstep(0.35, 1., s);
    vec3 dir = normalize(mix(uE1 * cos(ang) + uE2 * sin(ang), uPN * cos(ang) + B2 * sin(ang), k) + vec3(1e-5));
    w = 0.;
    vis = smoothstep(0., 0.3, s) * uSpin;
    return uS + dir * r + uN * (0.02 + 0.05 * s) * (1. - k);
  }
  w = (u - 0.15) / 0.85;
  float R = funnelR(w);
  vec3 T = bezT(w);
  vec3 B2 = normalize(cross(T, uPN));
  float ang = a0 + t * 0.6 + uTwist * (w * 6. + 1.5 / (R + 0.05));
  float turb = (sin(w * 23. + t * 3.1 + seed * 6.28) + 0.6 * sin(w * 41. - t * 4.7 + seed * 12.57) + 0.4 * sin(w * 67. + t * 6.3 + seed * 3.1))
             * smoothstep(0., 0.06, w);
  float r = R * rf * (1. + 0.15 * turb);
  vis = (1. - smoothstep(uReveal - 0.06, uReveal, w)) * (1. - smoothstep(0.96, 1., w));
  vec3 p = bez(w) + (uPN * cos(ang) + B2 * sin(ang)) * r + T * R * 0.12 * turb;
  // Near the end the stream splits, each particle pouring into one palm or the other.
  vec3 palm = fract(seed * 5.31) < 0.5 ? uPA : uPB;
  return p + (palm - uD) * smoothstep(0.72, 1., w);
}`;

// ---------- shared geometry ----------
const N_MAX = 30000;
const streakGeos = (() => {
  const aA = new Float32Array(N_MAX * 4), aB = new Float32Array(N_MAX * 4);
  for (let i = 0; i < N_MAX; i++) {
    const k = Math.random();
    const core = k < 0.28, mid = k >= 0.28 && k < 0.38;
    const rf = core ? Math.random() * 0.3 : mid ? 0.3 + Math.random() * 0.4 : 0.7 + Math.random() * 0.4;
    const spark = !core && Math.random() < 0.05;
    aA.set([Math.random(), rf, Math.random() * TAU, (core ? 2.4 : 1.8) * (0.8 + 0.4 * Math.random())], i * 4);
    aB.set([Math.random(),
      core ? 0.011 + 0.007 * Math.random() : spark ? 0.004 : 0.005 + 0.005 * Math.random(),
      Math.random(),
      core ? 0.55 + 0.4 * Math.random() : spark ? 0.95 : 0.05 + 0.3 * Math.random()], i * 4);
  }
  const A = new THREE.InstancedBufferAttribute(aA, 4), B = new THREE.InstancedBufferAttribute(aB, 4);
  const quad = new THREE.BufferAttribute(new Float32Array([0, -1, 0, 1, -1, 0, 0, 1, 0, 1, 1, 0]), 3);
  return INTENSITIES.map(it => {
    const g = new THREE.InstancedBufferGeometry();
    g.setIndex([0, 1, 2, 2, 1, 3]);
    g.setAttribute('position', quad);
    g.setAttribute('aA', A); g.setAttribute('aB', B);
    g.instanceCount = it.count;
    return g;
  });
})();

const tubeGeo = (() => {
  const NW = 128, NV = 16, tuv = [], idx = [];
  for (let i = 0; i <= NW; i++) for (let j = 0; j <= NV; j++) tuv.push(i / NW, j / NV);
  for (let i = 0; i < NW; i++) for (let j = 0; j < NV; j++) {
    const a = i * (NV + 1) + j, b = a + NV + 1;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tuv.length / 2 * 3), 3));
  g.setAttribute('tuv', new THREE.Float32BufferAttribute(tuv, 2));
  g.setIndex(idx);
  return g;
})();

const planeGeo = new THREE.PlaneGeometry(2, 2);

const hazeGeo = (() => {
  const N = 320, a = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) a.set([Math.random(), Math.sqrt(Math.random()) * 0.9, Math.random() * TAU, 0.6 + Math.random() * 0.8], i * 4);
  const g = new THREE.InstancedBufferGeometry();
  g.setIndex(planeGeo.index); g.setAttribute('position', planeGeo.attributes.position);
  g.setAttribute('aH', new THREE.InstancedBufferAttribute(a, 4));
  g.instanceCount = N;
  return g;
})();

// ---------- materials ----------
function streakMat(u) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND, side: THREE.DoubleSide,
    vertexShader: NOISE + FLOW + FLOW_POS + /* glsl */`
      attribute vec4 aA; // phase, radial fraction, start angle, speed
      attribute vec4 aB; // colour pick, width, seed, whiteness
      varying vec2 vUv; varying vec3 vCol; varying float vA;
      void main(){
        float w1, w2, v1, v2;
        vec3 H  = flowPos(aA.x, uAge,         aA.y, aA.z, aA.w, aB.z, w1, v1);
        vec3 Tl = flowPos(aA.x, uAge - 0.045, aA.y, aA.z, aA.w, aB.z, w2, v2);
        vec3 d = H - Tl;
        float ok = step(length(d), 0.5); // the particle wrapped round to the start: hide this one frame
        vec3 side = normalize(cross(d + vec3(1e-6), normalize(cameraPosition - H)) + vec3(1e-6));
        float wid = aB.y * (0.7 + 0.6 * clamp(funnelR(w1) / uRsrc, 0., 1.));
        vec3 P = mix(Tl, H, position.x) + side * position.y * wid * ok;
        vUv = position.xy;
        vCol = mix(colorAt(aB.x) * 1.35, vec3(1.), aB.w);
        float head = uReveal < 1. ? exp(-pow((w1 - uReveal) / 0.05, 2.)) * 2.5 : 0.;
        float core = 1. - smoothstep(0.25, 0.6, aA.y);
        float near = smoothstep(0.2, 0.9, distance(H, cameraPosition)); // keep the stream from blinding you as it arrives
        vA = v1 * ok * uFade * uGain * (1. + head) * (0.1 + 0.12 * core) * near;
        gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
      }`,
    fragmentShader: /* glsl */`
      varying vec2 vUv; varying vec3 vCol; varying float vA;
      void main(){
        float a = exp(-vUv.y * vUv.y * 3.2) * pow(vUv.x, 1.4) * vA;
        gl_FragColor = vec4(vCol * a, a * 0.3);
      }`,
  });
}

const TUBE_VERT = (core) => NOISE + FLOW + /* glsl */`
  attribute vec2 tuv;
  varying vec2 vT; varying float vF; varying float vR; varying float vNear;
  void main(){
    float w = tuv.x;
    float R = funnelR(w);
    float rad = ${core ? '(0.022 + 0.07 * R / uRsrc) * (1. - smoothstep(0.93, 1., w)) + 0.004' : 'R * 1.05 + 0.012'};
    vec3 T = bezT(w), B2 = normalize(cross(T, uPN));
    float ang = tuv.y * TAU;
    vec3 nrm = uPN * cos(ang) + B2 * sin(ang);
    vec3 P = bez(w) + nrm * rad;
    vF = abs(dot(nrm, normalize(cameraPosition - P)));
    vT = tuv; vR = R;
    vNear = smoothstep(0.25, 1.0, distance(P, cameraPosition));
    // Looking down the funnel, its walls stack up in view: dim them so the eye of the torrent stays readable.
    vNear *= mix(0.3, 1., length(cross(T, normalize(cameraPosition - P))));
    gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
  }`;

function coreMat(u) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND, side: THREE.DoubleSide,
    vertexShader: TUBE_VERT(true),
    fragmentShader: NOISE + FLOW + /* glsl */`
      varying vec2 vT; varying float vF; varying float vR; varying float vNear;
      void main(){
        float w = vT.x;
        float mask = (1. - smoothstep(uReveal - 0.05, uReveal, w)) * uFade * smoothstep(0., 0.03, w) * (1. - uSplit * smoothstep(0.7, 0.88, w));
        // Bright streaks scrolling toward you along the beam.
        float s1 = fbmP(vec2(vT.y * 6., w * uLen * 4. - uAge * 7. * uSpeed), 6.);
        float s2 = fbmP(vec2(vT.y * 12. + 3., w * uLen * 9. - uAge * 11. * uSpeed), 12.);
        float st = smoothstep(0.3, 0.9, s1 * 0.65 + s2 * 0.5);
        vec3 base = colorSmooth(vT.y + w * 2. - uAge * 0.25);
        vec3 col = mix(base * 1.7, vec3(1.25, 1.22, 1.18), smoothstep(0.5, 0.95, vF));
        float head = uReveal < 1. ? exp(-pow((w - uReveal) / 0.04, 2.)) * 2. : 0.;
        float a = (0.25 * vF + 0.75 * pow(vF, 2.5)) * (0.4 + 1.1 * st) * mask * uGain * (1. + head) * 0.3 * vNear;
        gl_FragColor = vec4(col * a, a * 0.5);
      }`,
  });
}

function sheathMat(u) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND, side: THREE.DoubleSide,
    vertexShader: TUBE_VERT(false),
    fragmentShader: NOISE + FLOW + /* glsl */`
      varying vec2 vT; varying float vF; varying float vR; varying float vNear;
      void main(){
        float w = vT.x;
        float mask = (1. - smoothstep(uReveal - 0.06, uReveal, w)) * uFade * (1. - smoothstep(0.8, 0.97, w)) * smoothstep(0., 0.04, w) * (1. - uSplit * smoothstep(0.6, 0.8, w));
        // Spiral bands that follow the particles' paths round the funnel wall.
        float per = 5.;
        float x = vT.y * per - per * (uTwist * (w * 6. + 1.5 / (vR + 0.05)) + 0.6 * uAge) / TAU;
        float b = fbmP(vec2(x, w * uLen * 2.2 - uAge * 2.4 * uSpeed), per);
        float bands = smoothstep(0.38, 0.85, b);
        float edge = pow(1. - vF, 2.);
        vec3 base = colorSmooth(vT.y + w * 1.5);
        float a = (0.025 + 0.6 * bands * (0.3 + 0.7 * edge)) * mask * uGain * 0.75 * vNear;
        gl_FragColor = vec4(mix(base * 1.3, vec3(1.), bands * 0.25) * a, a * 0.35);
      }`,
  });
}

function diskMat(u) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND, side: THREE.DoubleSide,
    vertexShader: FLOW + /* glsl */`
      varying vec2 vXY;
      void main(){
        vXY = position.xy * uRdisk * 1.15;
        vec3 P = uS + uN * 0.006 + uE1 * vXY.x + uE2 * vXY.y;
        gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
      }`,
    fragmentShader: NOISE + FLOW + /* glsl */`
      varying vec2 vXY;
      float pat(float th, float r, float ph){
        float a = th - ph;
        float arms = pow(0.5 + 0.5 * cos(3. * a + 5. * log(r + 0.02)), 2.5);
        float n = fbmP(vec2(a / TAU * 8., log(r + 0.02) * 3.), 8.);
        return arms * (0.35 + 1.2 * n) + 0.3 * n;
      }
      void main(){
        float r = length(vXY), th = atan(vXY.y, vXY.x);
        // Rotation is faster near the eye. Two time-offset layers cross-fade so the spiral never winds up too tight.
        float om = uSpin * (0.6 + 1.6 / (r + 0.15)) * uTwist;
        float P = 3.;
        float t1 = fract(uAge / P), t2 = fract(uAge / P + 0.5);
        float wA = 1. - abs(2. * t1 - 1.);
        float p = pat(th, r, om * t1 * P) * wA + pat(th, r, om * t2 * P) * (1. - wA);
        float R = uRdisk * (0.4 + 0.6 * uSpin);
        float env = smoothstep(R, R * 0.15, r);
        float eyeR = uRsrc * 0.35;
        float eye = exp(-pow((r - eyeR) / 0.045, 2.));
        float glow = exp(-r * r / (uRsrc * uRsrc * 0.12));
        vec3 base = colorSmooth(th / TAU + r * 0.6 - uAge * 0.1);
        vec3 col = mix(base * 1.5, vec3(1.2), clamp(eye * 0.6 + glow * 0.8, 0., 1.));
        float a = (p * env * 0.5 + eye * 0.55 + glow * 0.3) * uSpin * uFade * uGain;
        gl_FragColor = vec4(col * a, a * 0.4);
      }`,
  });
}

function chestMat(u, at) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND,
    vertexShader: FLOW + /* glsl */`
      varying vec2 vP; varying float vNear;
      void main(){
        vec4 mv = viewMatrix * vec4(${at}, 1.);
        // Your own chest is only ~0.3 m from your eyes: keep its glow small and soft so it never fills the view.
        vNear = smoothstep(0.3, 0.9, distance(${at}, cameraPosition));
        mv.xy += position.xy * uGlow * mix(0.45, 1., vNear);
        vP = position.xy;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: FLOW + /* glsl */`
      varying vec2 vP; varying float vNear;
      void main(){
        float r = length(vP);
        float g = exp(-r * r * 16.) * 0.8 + exp(-r * r * 4.) * 0.2;
        float rings = 0.;
        for (int i = 0; i < 3; i++){
          float p = fract(uAge * 0.45 + float(i) / 3.);
          rings += exp(-pow((r - p) / 0.035, 2.)) * (1. - p) * 0.55;
        }
        vec3 col = mix(colorSmooth(uAge * 0.2) * 1.5, vec3(1.2), exp(-r * r * 30.));
        float a = (g + rings) * uArrive * uFade * uGain * (1. - smoothstep(0.85, 1., r)) * mix(0.5, 0.75, uSplit) * mix(0.3, 1., vNear);
        gl_FragColor = vec4(col * a, a * 0.4);
      }`,
  });
}

function hazeMat(u) {
  return new THREE.ShaderMaterial({
    uniforms: u, ...GLOW_BLEND,
    vertexShader: FLOW + /* glsl */`
      attribute vec4 aH; // start position along, radial fraction, angle, size
      varying vec2 vP; varying vec3 vC; varying float vA;
      void main(){
        float w = fract(aH.x + uAge * 0.04 * uSpeed);
        float R = funnelR(w);
        vec3 T = bezT(w), B2 = normalize(cross(T, uPN));
        float ang = aH.z + uAge * 0.6 + uTwist * (w * 6. + 1.5 / (R + 0.05));
        vec3 c = bez(w) + (uPN * cos(ang) + B2 * sin(ang)) * R * aH.y;
        vec4 mv = viewMatrix * vec4(c, 1.);
        mv.xy += position.xy * (0.06 + 0.55 * R) * aH.w;
        vP = position.xy;
        vC = colorAt(aH.x * 7.13);
        vA = (1. - smoothstep(uReveal - 0.08, uReveal, w)) * smoothstep(0., 0.1, w) * (1. - smoothstep(0.85, 1., w)) * uFade * uGain
           * mix(0.25, 1., length(cross(T, normalize(cameraPosition - c)))) * smoothstep(0.3, 1.2, distance(c, cameraPosition));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying vec2 vP; varying vec3 vC; varying float vA;
      void main(){
        float a = exp(-dot(vP, vP) * 3.5) * vA * 0.05;
        gl_FragColor = vec4(vC * a * 1.4, a * 0.3);
      }`,
  });
}

// ---------- one energy flow ----------
const clockNow = { t: 0 };
class Flow {
  constructor(S, n, qualities, intensity) {
    const it = INTENSITIES[intensity];
    this.S = S.clone(); this.n = n.clone().normalize();
    // The swirl frame is built around the normal: keep it facing you, so the vortex turns anticlockwise as you see it.
    if (this.n.dot(_tv.subVectors(chest, S)) < 0) this.n.negate();
    this.born = clockNow.t; this.dying = false; this.fade = 1; this.arrived = false;
    const ref = Math.abs(this.n.y) < 0.9 ? UP : new THREE.Vector3(1, 0, 0);
    const E1 = new THREE.Vector3().crossVectors(this.n, ref).normalize();
    const E2 = new THREE.Vector3().crossVectors(this.n, E1).normalize();
    const cols = palette(qualities);
    this.target = cols.map(c => c.clone());
    const d0 = Math.max(0.6, S.distanceTo(chest));
    this.u = {
      uS: { value: this.S }, uC: { value: new THREE.Vector3() }, uD: { value: chest.clone() }, uN: { value: this.n },
      uPN: { value: new THREE.Vector3(1, 0, 0) }, uE1: { value: E1 }, uE2: { value: E2 },
      uPA: { value: new THREE.Vector3() }, uPB: { value: new THREE.Vector3() }, uSplit: { value: 0 }, uGlow: { value: 0.3 },
      uAge: { value: 0 }, uLen: { value: 1 }, uReveal: { value: 0 }, uSpin: { value: 0 }, uFade: { value: 1 }, uArrive: { value: 0 },
      // guesses, tuned by eye: funnel and disk scale with distance so a near surface does not swamp you
      uRsrc: { value: Math.min(0.8, Math.max(0.3, d0 * 0.26)) }, uRdst: { value: 0.1 }, uRdisk: { value: Math.min(1.5, Math.max(0.6, d0 * 0.48)) },
      uTwist: { value: 1 }, uGain: { value: it.gain }, uSpeed: { value: it.speed },
      uColors: { value: cols }, uNC: { value: 5 },
    };
    this.updatePath();
    // Fixed at cast time: particle timing must not jump when you move.
    let len = 0; const a = new THREE.Vector3(), b = new THREE.Vector3();
    for (let i = 1; i <= 24; i++) { this.bez((i - 1) / 24, a); this.bez(i / 24, b); len += a.distanceTo(b); }
    this.u.uLen.value = len + this.u.uRdisk.value;
    const mk = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; scene.add(m); return m; };
    this.meshes = [
      mk(planeGeo, diskMat(this.u)),
      mk(tubeGeo, sheathMat(this.u)),
      mk(hazeGeo, hazeMat(this.u)),
      mk(tubeGeo, coreMat(this.u)),
      mk(streakGeos[intensity], streakMat(this.u)),
      mk(planeGeo, chestMat(this.u, 'uPA')),
      mk(planeGeo, chestMat(this.u, 'uPB')),
    ];
    // ?hide=disk,sheath,haze,core,streaks,chest turns layers off, for tuning
    const hide = (params.get('hide') || '').split(',');
    ['disk', 'sheath', 'haze', 'core', 'streaks', 'chest', 'chest'].forEach((k, i) => { if (hide.includes(k)) this.meshes[i].visible = false; });
  }
  bez(w, out) {
    const { uS, uC, uD } = this.u, a = 1 - w;
    return out.copy(uS.value).multiplyScalar(a * a).addScaledVector(uC.value, 2 * a * w).addScaledVector(uD.value, w * w);
  }
  updatePath(dt) {
    const u = this.u, S = this.S;
    // Where it pours: into open palms that face this flow's source (Auto), always the palms, or the heart.
    let recv = [];
    if (state.recv !== 1) recv = handsNow.filter(h => state.recv === 2 || (h.open && _tv.subVectors(S, h.palm).normalize().dot(h.normal) > 0.5));
    recv.forEach(h => { h.receiving = true; });
    const A = recv.length ? recv[0].palm.clone().addScaledVector(recv[0].normal, 0.03) : chest.clone();
    const B = recv.length > 1 ? recv[1].palm.clone().addScaledVector(recv[1].normal, 0.03) : A.clone();
    if (dt === undefined) { u.uPA.value.copy(A); u.uPB.value.copy(B); }
    else { const k = 1 - Math.exp(-dt / 0.1); u.uPA.value.lerp(A, k); u.uPB.value.lerp(B, k); } // settles in about 0.3 s
    u.uSplit.value = Math.min(1, u.uPA.value.distanceTo(u.uPB.value) / 0.15);
    u.uGlow.value += ((recv.length ? 0.16 : 0.3) - u.uGlow.value) * (dt === undefined ? 1 : 1 - Math.exp(-dt / 0.1));
    const D = u.uD.value.copy(u.uPA.value).add(u.uPB.value).multiplyScalar(0.5);
    const dist = Math.max(0.6, S.distanceTo(D));
    // A gentle arc (not a high droop), so the stream arrives nearly level and visibly strikes the chest.
    u.uC.value.copy(S).addScaledVector(this.n, 0.35 * dist).addScaledVector(UP, 0.2 * dist);
    const sc = new THREE.Vector3().subVectors(u.uC.value, S), sd = new THREE.Vector3().subVectors(D, S);
    const pn = new THREE.Vector3().crossVectors(sc, sd);
    if (pn.lengthSq() < 1e-6) pn.crossVectors(sd, Math.abs(sd.y) < 0.9 * sd.length() ? UP : new THREE.Vector3(1, 0, 0));
    pn.normalize();
    if (pn.dot(u.uPN.value) < 0 && this.pnSet) pn.negate(); // keep the frame from flipping
    u.uPN.value.copy(pn); this.pnSet = true;
  }
  update(dt) {
    const u = this.u, age = clockNow.t - this.born;
    u.uAge.value = age;
    u.uSpin.value = smooth(0, 0.8, age);
    const r = Math.min(1, Math.max(0, (age - 0.8) / 1.2));
    u.uReveal.value = (1 - Math.pow(1 - r, 3)) * 1.1;
    u.uArrive.value = smooth(1.9, 2.6, age);
    if (!this.arrived && age > 2.0) { this.arrived = true; empower.arrive(this, age - 2.0); if (!DEMO) audio.chime(); }
    const kc = 1 - Math.exp(-dt * 3); // re-tint over about a second when the quality changes
    u.uColors.value.forEach((c, i) => c.lerp(this.target[i], kc));
    if (this.dying) this.fade -= dt / 0.8;
    u.uFade.value = Math.max(0, this.fade);
    this.updatePath(dt);
    return this.fade > 0;
  }
  level() { return Math.max(0, this.fade) * smooth(0, 1.5, clockNow.t - this.born) * this.u.uGain.value; }
  dispose() { this.meshes.forEach(m => { scene.remove(m); m.material.dispose(); }); }
}

const flows = [];
function castFlow(point, normal) {
  const live = flows.filter(f => !f.dying);
  if (live.length >= MAX_FLOWS) live[0].dying = true;
  flows.push(new Flow(point, normal, selectedQualities(), state.intensity));
  audio.cast();
}
function clearFlows() { flows.forEach(f => { f.dying = true; }); }

// ---------- head and chest ----------
const head = new THREE.Vector3(), headQ = new THREE.Quaternion();
const fwd = new THREE.Vector3(), fwdYaw = new THREE.Vector3(0, 0, -1);
const chest = new THREE.Vector3(0, 1.37, 1.5); // the heart: 0.23 m below the eyes, 0.15 m forward
const receivingNow = [false, false]; // which hand (by index) poured in last frame
let handsNow = []; // tracked hands this frame: palm centre, palm normal, wrist, forearm line, fingertips
const _tv = new THREE.Vector3();
const PHANTOM = new THREE.Vector3(0, 1.6, 0.6); // the person, in the ?demo=side view

// ---------- desktop preview room ----------
const room = new THREE.Group();
scene.add(room);
const roomMat = (side, tint) => new THREE.ShaderMaterial({
  side,
  uniforms: { uTint: { value: new THREE.Color(tint) } },
  vertexShader: `varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform vec3 uTint; varying vec3 vW, vN;
    void main(){
      vec3 g = abs(fract(vW * 2.) - 0.5);
      vec3 l = smoothstep(0.47, 0.5, g) * (1. - abs(vN));
      float line = max(max(l.x, l.y), l.z);
      vec3 c = uTint * (0.75 + 0.25 * smoothstep(0., 3., vW.y)) + vec3(0.05, 0.055, 0.07) * line;
      gl_FragColor = vec4(c, 1.);
    }`,
});
const roomBox = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), roomMat(THREE.BackSide, 0x0d0d12));
roomBox.position.set(0, 1.5, 0);
const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 0.9), roomMat(THREE.FrontSide, 0x1a1418));
sofa.position.set(-1.6, 0.425, -2.5);
const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 0.8), roomMat(THREE.FrontSide, 0x16161c));
table.position.set(1.9, 0.375, -1.2);
room.add(roomBox, sofa, table);
const roomMeshes = [roomBox, sofa, table];

// ---------- the 3D menu panel ----------
const panel = (() => {
  const W = 1024, H = 868;
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.424), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  mesh.renderOrder = 10;
  scene.add(mesh);

  let buttons = [], hover = new Set(), hoverKey = '';
  const css = (c) => '#' + c.getHexString(THREE.LinearSRGBColorSpace);
  const wrap = (text, maxW) => {
    const words = text.split(' '), lines = []; let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  };
  const button = (id, x, y, w, h, on) => {
    buttons.push({ id, x, y, w, h });
    const hot = hover.has(id);
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 14);
    ctx.fillStyle = on ? 'rgba(200,146,46,.95)' : hot ? 'rgba(90,64,34,.95)' : 'rgba(44,32,22,.92)';
    ctx.fill();
    ctx.lineWidth = hot ? 4 : 2; ctx.strokeStyle = hot ? '#ffd88a' : '#8a6a32'; ctx.stroke();
    return on ? '#1a0f05' : '#f4e4c1';
  };
  const swatch = (x, y, color, r = 24) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.fill();
  };
  function draw() {
    buttons = [];
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath(); ctx.roundRect(4, 4, W - 8, H - 8, 28);
    ctx.fillStyle = 'rgba(16,11,8,.88)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#8a6a32'; ctx.stroke();
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f4e4c1'; ctx.font = 'bold 38px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Energy Flow', 30, 46);
    ctx.fillStyle = '#cbb48a'; ctx.font = '24px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('Point at a surface and pinch', W - 30, 46);
    // set tabs
    const tw = (W - 48 - 4 * 12) / 5;
    for (let i = 0; i < QUALITY_SETS.length; i++) {
      const x = 24 + i * (tw + 12);
      const fg = button('set:' + i, x, 86, tw, 60, state.set === i);
      ctx.fillStyle = fg; ctx.font = 'bold 28px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Set ' + (i + 1), x + tw / 2, 117);
    }
    // qualities of the set, plus "All of this set together"
    const set = QUALITY_SETS[state.set];
    const cells = set.map((q, i) => ({ id: 'q:' + i, label: q.label, on: state.q === i, colors: [css(q.rgb)] }));
    cells.push({ id: 'q:all', label: 'All of this set together', on: state.q < 0, colors: set.map(q => css(q.rgb)) });
    cells.forEach((c, i) => {
      const x = 24 + (i % 2) * (482 + 12), y = 162 + Math.floor(i / 2) * 140;
      const fg = button(c.id, x, y, 482, 128, c.on);
      if (c.colors.length === 1) swatch(x + 50, y + 64, c.colors[0]);
      else c.colors.forEach((col, k) => {
        const a = -Math.PI / 2 + k * TAU / c.colors.length;
        swatch(x + 50 + Math.cos(a) * 20, y + 64 + Math.sin(a) * 20, col, 11);
      });
      ctx.fillStyle = fg; ctx.textAlign = 'left';
      let size = 30, lines;
      do { ctx.font = `600 ${size}px system-ui, sans-serif`; lines = wrap(c.label, 482 - 110); size -= 2; } while (lines.length > 3 && size > 18);
      const lh = size + 6;
      lines.forEach((l, k) => ctx.fillText(l, x + 96, y + 64 + (k - (lines.length - 1) / 2) * lh));
    });
    // receive into, and intensity
    const iw = (W - 24 - 230 - 2 * 12) / 3;
    [['Receive into', 'recv', RECEIVE, state.recv, 586], ['Intensity', 'int', INTENSITIES.map(it => it.label), state.intensity, 676]].forEach(([title, key, labels, cur, y]) => {
      ctx.fillStyle = '#cbb48a'; ctx.font = '600 28px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(title, 28, y + 30);
      labels.forEach((label, i) => {
        const x = 230 + i * (iw + 12);
        const fg = button(key + ':' + i, x, y, iw, 60, cur === i);
        ctx.fillStyle = fg; ctx.font = 'bold 28px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(label, x + iw / 2, y + 31);
      });
    });
    {
      const fg = button('clear', 24, 754, W - 48, 86, false);
      ctx.fillStyle = fg; ctx.font = 'bold 30px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Clear flows', W / 2, 798);
    }
    tex.needsUpdate = true;
  }
  draw();

  const idAt = (uv) => {
    const x = uv.x * W, y = (1 - uv.y) * H;
    const b = buttons.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    return b ? b.id : null;
  };
  function press(id) {
    if (!id) return;
    const [k, v] = id.split(':');
    if (k === 'set') { state.set = +v; if (state.q >= QUALITY_SETS[state.set].length) state.q = 0; }
    else if (k === 'q') state.q = v === 'all' ? -1 : +v;
    else if (k === 'int') state.intensity = +v;
    else if (k === 'recv') state.recv = +v;
    else if (k === 'clear') clearFlows();
    if (k === 'set' || k === 'q') { const p = palette(); flows.forEach(f => { f.target = p.map(c => c.clone()); }); }
    save(); audio.click(); draw();
  }
  function setHover(ids) {
    const key = [...ids].sort().join('|');
    if (key !== hoverKey) { hoverKey = key; hover = ids; draw(); }
  }
  // Placement: ahead of you and below eye level, facing you.
  const target = { pos: new THREE.Vector3(), q: new THREE.Quaternion(), set: false };
  const dummy = new THREE.Object3D();
  function place(instant, side = 0, ahead = 0.7, below = 0.45) {
    const right = new THREE.Vector3(-fwdYaw.z, 0, fwdYaw.x);
    dummy.position.copy(head).addScaledVector(fwdYaw, ahead).addScaledVector(right, side);
    dummy.position.y -= below;
    dummy.lookAt(head);
    target.pos.copy(dummy.position); target.q.copy(dummy.quaternion); target.set = true;
    if (instant) { mesh.position.copy(target.pos); mesh.quaternion.copy(target.q); }
  }
  // Hand menu: it appears only while you turn your LEFT palm toward your face (held ~0.3 s), floats ~12 cm above
  // and beside that hand facing you, and fades ~0.5 s after you turn the palm away. It never moves in front of you.
  // Without tracked hands it stays world-locked where it was placed.
  let facingFor = 0, awayFor = 9, opacity = 0, handMode = false, handModeShown = false, poked = false;
  function worldLock() { handMode = false; handModeShown = false; opacity = 0; mesh.visible = true; mesh.material.opacity = 1; mesh.scale.setScalar(1); }
  const _p = new THREE.Vector3(), _l = new THREE.Vector3();
  function handMenu(dt, hands) {
    const left = hands.find(h => h.handedness === 'left');
    if (hands.length) handMode = true;
    const wasHidden = !mesh.visible || !handModeShown;
    if (!handMode) return; // no tracked hands yet: stays world-locked
    const facing = left && !receivingNow[left.idx] && _p.subVectors(head, left.palm).normalize().dot(left.normal) > 0.6;
    facingFor = facing ? facingFor + dt : 0;
    awayFor = facing ? 0 : awayFor + dt;
    const show = facingFor > 0.3 || (opacity > 0 && awayFor < 0.5);
    opacity = Math.max(0, Math.min(1, opacity + (show ? dt / 0.15 : -dt / 0.25)));
    mesh.visible = opacity > 0.01;
    mesh.material.opacity = opacity;
    handModeShown = mesh.visible;
    if (left && mesh.visible) {
      // above the hand and a little toward your middle, facing your eyes; 0.28 m wide
      const inward = _l.subVectors(head, left.palm).setY(0).normalize().cross(UP).negate();
      dummy.position.copy(left.palm).add(new THREE.Vector3(0, 0.12, 0)).addScaledVector(inward, 0.06);
      dummy.lookAt(head);
      const k = wasHidden ? 1 : 1 - Math.exp(-dt * 14); // appear right at the hand, then follow it smoothly
      mesh.position.lerp(dummy.position, k); mesh.quaternion.slerp(dummy.quaternion, k);
      mesh.scale.setScalar(0.56);
    }
    // a direct poke with the right index fingertip presses a button
    const right = hands.find(h => h.handedness === 'right');
    if (mesh.visible && right && right.indexTip) {
      mesh.updateMatrixWorld();
      const local = mesh.worldToLocal(_p.copy(right.indexTip));
      const inside = Math.abs(local.x) < 0.25 && Math.abs(local.y) < 0.212;
      if (inside && Math.abs(local.z) < 0.012 && !poked) { poked = true; press(idAt({ x: local.x / 0.5 + 0.5, y: local.y / 0.424 + 0.5 })); }
      if (!inside || local.z > 0.025) poked = false;
    }
  }
  return { mesh, idAt, press, setHover, place, handMenu, worldLock, draw };
})();

// ---------- pointing: hand rays and reticles ----------
const raycaster = new THREE.Raycaster();
const rayGeo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -0.5);
function makeReticle() {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, ...GLOW_BLEND, side: THREE.DoubleSide, opacity: 1 });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.034, 0.042, 48), mat);
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.07, 48), mat.clone());
  halo.material.opacity = 0.25; halo.material.transparent = true;
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), mat);
  g.add(halo, ring, dot);
  g.visible = false;
  g.userData = { mat, halo };
  scene.add(g);
  return g;
}
function makePointer(controller) {
  const p = { c: controller, source: null, hitSource: null, target: null, hoverId: null,
    point: new THREE.Vector3(), normal: new THREE.Vector3(), fallback: false, lastSel: 0, reticle: makeReticle() };
  if (controller) {
    const core = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, ...GLOW_BLEND }));
    core.scale.set(0.0012, 0.0012, 1);
    const glow = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, ...GLOW_BLEND }));
    glow.scale.set(0.004, 0.004, 1);
    controller.add(core, glow);
    controller.visible = false;
    p.rays = [core, glow];
  }
  return p;
}
const pointers = [0, 1].map(i => {
  const c = renderer.xr.getController(i);
  scene.add(c);
  const p = makePointer(c);
  c.addEventListener('connected', (e) => {
    p.source = e.data; c.visible = true;
    const s = renderer.xr.getSession();
    if (s && s.requestHitTestSource && e.data && e.data.targetRaySpace) {
      s.requestHitTestSource({ space: e.data.targetRaySpace }).then(src => { p.hitSource = src; }).catch(() => {});
    }
  });
  c.addEventListener('disconnected', () => {
    p.source = null; c.visible = false; p.reticle.visible = false;
    if (p.hitSource) { try { p.hitSource.cancel(); } catch (e) { /* already gone */ } p.hitSource = null; }
  });
  c.addEventListener('select', () => onSelect(p));
  return p;
});
const mouse = makePointer(null);

function onSelect(p) {
  if (clockNow.t - p.lastSel < 0.25) return;
  p.lastSel = clockNow.t;
  if (p.target === 'panel') panel.press(p.hoverId); // pinching on the panel never casts a flow
  else if (p.target === 'surface') castFlow(p.point, p.normal);
}

const _q = new THREE.Quaternion(), _o = new THREE.Vector3(), _d = new THREE.Vector3();
function aim(p, origin, dir, frame, refSpace) {
  raycaster.set(origin, dir);
  raycaster.far = 20;
  p.target = null; p.hoverId = null;
  let len = 2.5;
  if (panel.mesh.visible) {
    const hit = raycaster.intersectObject(panel.mesh, false)[0];
    if (hit) { p.target = 'panel'; p.hoverId = panel.idAt(hit.uv); len = hit.distance; }
  }
  if (!p.target) {
    p.target = 'surface';
    let got = false;
    if (frame && p.hitSource) {
      const res = frame.getHitTestResults(p.hitSource);
      const pose = res.length ? res[0].getPose(refSpace) : null;
      if (pose) {
        const { position: a, orientation: o } = pose.transform;
        p.point.set(a.x, a.y, a.z);
        p.normal.set(0, 1, 0).applyQuaternion(_q.set(o.x, o.y, o.z, o.w)).normalize();
        got = true;
      }
    } else if (!frame && room.visible) {
      const hit = raycaster.intersectObjects(roomMeshes, false)[0];
      if (hit) {
        p.point.copy(hit.point);
        p.normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
        if (p.normal.dot(dir) > 0) p.normal.negate();
        got = true;
      }
    }
    // No surface found: cast from a point in the air 2.5 m along the ray, facing you.
    if (!got) { p.point.copy(origin).addScaledVector(dir, 2.5); p.normal.subVectors(head, p.point).normalize(); }
    p.fallback = !got;
    len = origin.distanceTo(p.point);
  }
  const col = palette()[Math.floor(clockNow.t / 1.2) % 5];
  if (p.rays) p.rays.forEach((r, i) => { r.scale.z = len; r.material.color.copy(col).multiplyScalar(i ? 0.35 : 0.9).lerp(new THREE.Color(1, 1, 1), i ? 0 : 0.4); });
  const R = p.reticle;
  R.visible = p.target === 'surface';
  if (R.visible) {
    R.position.copy(p.point).addScaledVector(p.normal, 0.004);
    R.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.normal);
    R.scale.setScalar((p.fallback ? 0.7 : 1) * (1 + 0.08 * Math.sin(clockNow.t * 5)));
    R.userData.mat.color.copy(col).multiplyScalar(p.fallback ? 0.5 : 1).lerp(new THREE.Color(1, 1, 1), 0.25);
    R.userData.halo.material.color.copy(col);
  }
}

// ---------- desktop preview controls ----------
let yaw = 0, pitch = -0.05, dragging = false, moved = 0, lastX = 0, lastY = 0;
const ndc = new THREE.Vector2(0, 0); let mouseIn = false;
renderer.domElement.addEventListener('pointerdown', (e) => { audio.init(); dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; });
addEventListener('pointerup', () => {
  if (dragging && moved < 6 && !renderer.xr.isPresenting) onSelect(mouse);
  dragging = false;
});
addEventListener('pointermove', (e) => {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); mouseIn = true;
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  moved += Math.abs(dx) + Math.abs(dy); lastX = e.clientX; lastY = e.clientY;
  if (moved >= 6) { yaw += dx * 0.004; pitch = Math.max(-1.3, Math.min(1.3, pitch + dy * 0.004)); }
});

// ---------- sound ----------
const audio = (() => {
  let ctx = null, master, rumble, whoosh, lp, bp, white;
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    // Brown noise: a deep rumble and an airy whoosh, both following how much energy is flowing.
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch); let last = 0;
      for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    }
    white = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    { const d = white.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
    rumble = ctx.createGain(); rumble.gain.value = 0;
    bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.8;
    whoosh = ctx.createGain(); whoosh.gain.value = 0;
    src.connect(lp).connect(rumble).connect(master);
    src.connect(bp).connect(whoosh).connect(master);
    src.start();
  }
  const tone = (f0, f1, dur, peak, type = 'sine', delay = 0) => {
    const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.4, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  };
  return {
    init,
    cast() { if (!ctx) return; tone(160, 480, 1.9, 0.09); tone(240, 720, 1.9, 0.04); tone(80, 160, 1.6, 0.06, 'triangle'); },
    chime() { if (!ctx) return; [[660, 0.09], [990, 0.05], [1320 * 1.0, 0.035], [1782, 0.02]].forEach(([f, g], i) => tone(f, f * 1.002, 2.8, g, 'sine', i * 0.04)); },
    click() { if (!ctx) return; tone(880, 660, 0.12, 0.04); },
    // The energy reaches you: a deep falling whoosh with a sub-bass drop.
    arrive() {
      if (!ctx) return;
      const t = ctx.currentTime, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = white; f.type = 'lowpass'; f.Q.value = 2;
      f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(90, t + 1.8);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      src.connect(f).connect(g).connect(master); src.start(t, Math.random()); src.stop(t + 2.5);
      tone(70, 32, 2.2, 0.3);
    },
    // Electric crackle, a few short bright noise ticks.
    crackle(level) {
      if (!ctx) return;
      const n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + Math.random() * 0.09, d = 0.008 + Math.random() * 0.03;
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = white; f.type = 'highpass'; f.frequency.value = 1500 + Math.random() * 2500;
        g.gain.setValueAtTime(Math.min(0.2, 0.05 + 0.08 * level) * Math.random(), t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        src.connect(f).connect(g).connect(master); src.start(t, Math.random() * 3); src.stop(t + d + 0.01);
      }
    },
    update(level, t) {
      if (!ctx) return;
      const L = Math.min(1.3, level);
      rumble.gain.setTargetAtTime(0.55 * L, ctx.currentTime, 0.4);
      whoosh.gain.setTargetAtTime(L * 0.16 * (0.65 + 0.35 * Math.sin(t * 0.7) * Math.sin(t * 0.31)), ctx.currentTime, 0.3);
      bp.frequency.setTargetAtTime(550 + 350 * Math.sin(t * 0.37), ctx.currentTime, 0.5);
      lp.frequency.setTargetAtTime(180 + 120 * L, ctx.currentTime, 0.5);
    },
  };
})();

// A short floating hint on first entry: how to open the hand menu.
const menuHint = (() => {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(16,11,8,.8)'; x.beginPath(); x.roundRect(4, 4, 1016, 120, 30); x.fill();
  x.strokeStyle = '#8a6a32'; x.lineWidth = 3; x.stroke();
  x.fillStyle = '#f4e4c1'; x.font = '600 46px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('Turn your left palm toward you for the menu', 512, 66);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.075), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  mesh.visible = false; mesh.renderOrder = 11; scene.add(mesh);
  let left = 0;
  return {
    show() {
      mesh.position.copy(head).addScaledVector(fwdYaw, 0.9).add(new THREE.Vector3(0, -0.12, 0));
      mesh.lookAt(head); left = 6; mesh.visible = true;
    },
    update(dt) {
      if (left <= 0) return;
      left -= dt; mesh.material.opacity = Math.min(1, left / 0.6, (6 - left) / 0.4);
      if (left <= 0) mesh.visible = false;
    },
  };
})();

// ---------- AR session ----------
const enterBtn = document.getElementById('enter');
const hint = document.getElementById('hint');
let needPlace = false;
const noAR = () => { enterBtn.textContent = 'AR needs the Meta Quest 3 browser (desktop preview below)'; enterBtn.disabled = true; };
if (navigator.xr && navigator.xr.isSessionSupported) {
  navigator.xr.isSessionSupported('immersive-ar').then(ok => {
    if (ok) { enterBtn.disabled = false; enterBtn.textContent = 'Enter AR'; } else noAR();
  }).catch(noAR);
} else noAR();
enterBtn.addEventListener('click', async () => {
  audio.init();
  try {
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking', 'hit-test', 'anchors', 'plane-detection', 'mesh-detection'],
    });
    session.addEventListener('end', () => {
      room.visible = true; enterBtn.style.display = ''; hint.style.display = '';
      pointers.forEach(p => { p.reticle.visible = false; });
      panel.worldLock(); panel.place(true, -0.45, 1.0, 0.3);
    });
    await renderer.xr.setSession(session);
    room.visible = false; enterBtn.style.display = 'none'; hint.style.display = 'none';
    needPlace = true;
  } catch (e) {
    enterBtn.textContent = 'Could not start AR: ' + e.message;
  }
});

// ---------- demo (for screenshots) ----------
function startDemo() {
  const p = DEMO_SRC.clone(), n = new THREE.Vector3(0, 0, 1);
  if (DEMO_PALMS && params.get('cam') === 'hand') { // close-up of the right hand drawing motes in
    camera.position.set(0.62, 1.42, 0.02); yaw = -2.1; pitch = -0.45;
  } else if (DEMO_PALMS) {
    camera.position.set(0.35, 2.35, -0.75); yaw = -2.95; pitch = -0.85;
  } else if (DEMO_ARRIVAL) {
    camera.position.set(2.3, 1.6, 2.7); yaw = -0.72; pitch = -0.17;
  } else if (DEMO_SIDE) {
    camera.position.set(2.55, 1.75, 0.9); yaw = -1.05; pitch = -0.12;
  } else {
    camera.position.set(0.25, 1.6, 1.6); yaw = 0.1; pitch = 0.0;
  }
  if (params.has('set')) state.set = Math.min(4, Math.max(0, +params.get('set')));
  if (params.has('q')) state.q = Math.min(QUALITY_SETS[state.set].length - 1, Math.max(-1, +params.get('q')));
  if (params.has('recv')) state.recv = Math.min(2, Math.max(0, +params.get('recv')));
  if (params.has('i')) state.intensity = Math.min(2, Math.max(0, +params.get('i')));
  castFlow(p, n);
  panel.draw();
  // &cam=src: stand where the energy arrives and look straight at the source (used to verify the spin direction)
  if (params.get('cam') === 'src') {
    if (PHANTOM_MODE) { camera.position.copy(PHANTOM); phantomBody.visible = false; }
    const d = new THREE.Vector3().subVectors(DEMO_SRC, camera.position);
    yaw = -Math.atan2(-d.x, -d.z); pitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
  }
  if (params.has('noroom')) room.visible = false;
  window.__dbg = { flows, camera };
  flows[0].born = clockNow.t - (+params.get('age') || 6);
}

// ---------- arrival / empowerment: the energy reaches you, passes through you and fills the room ----------
// Everything here is tinted from one shared palette (eu.uColors), the same colours as the flow that arrived.
const eu = {
  uBody: { value: new THREE.Vector3(0, 1.6, 0) }, // head; the body runs from here down to the floor (y = 0)
  uChest: { value: new THREE.Vector3() }, uDir: { value: new THREE.Vector3(0, 0, 1) },
  uT: { value: 0 }, uE: { value: 0 }, uBurst: { value: 0 }, uTime: { value: 0 },
  uColors: { value: palette() }, uNC: { value: 5 },
};
const EMP_COMMON = /* glsl */`
uniform vec3 uBody, uChest, uDir; uniform float uT, uE, uBurst, uTime;
uniform vec3 uColors[5]; uniform float uNC;
vec3 colorAt(float k){ int i = int(floor(fract(k) * uNC)); return uColors[clamp(i, 0, 4)]; }`;

// 1) Interpenetration: particles carry on through the chest, out of the back, then fan out into a slowly
// rotating swirl round the whole body, floor to above the head, and drift off into the room.
const arrivalGeo = (() => {
  const N = 7000, a = new Float32Array(N * 4), b = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    a.set([Math.random(), (Math.random() * 2 - 1) * Math.PI, 0.16 + Math.random() * 0.12, Math.random()], i * 4);
    const core = Math.random() < 0.2;
    b.set([Math.random(), core ? 0.007 : 0.0028 + 0.003 * Math.random(), Math.random(), core ? 0.7 : 0.1 + 0.3 * Math.random()], i * 4);
  }
  const g = new THREE.InstancedBufferGeometry();
  g.setIndex([0, 1, 2, 2, 1, 3]);
  g.setAttribute('position', streakGeos[0].attributes.position);
  g.setAttribute('aA', new THREE.InstancedBufferAttribute(a, 4));
  g.setAttribute('aB', new THREE.InstancedBufferAttribute(b, 4));
  g.instanceCount = N;
  return g;
})();
const arrivalMesh = new THREE.Mesh(arrivalGeo, new THREE.ShaderMaterial({
  uniforms: eu, ...GLOW_BLEND, side: THREE.DoubleSide,
  vertexShader: EMP_COMMON + /* glsl */`
    attribute vec4 aA; // phase, fan angle, speed, height
    attribute vec4 aB; // colour pick, width, seed, whiteness
    varying vec2 vUv; varying vec3 vCol; varying float vA;
    vec3 arrPos(float t, out float vis, out float s){
      s = fract(aA.x + t * aA.z);
      vec3 jit = vec3(fract(aB.z * 13.1), fract(aB.z * 29.7), fract(aB.z * 47.3)) - 0.5; // fan out as it leaves your back
      vec3 through = uChest + uDir * (0.7 * smoothstep(0., 0.08, s) + s * 0.4) + jit * s * 2.5;
      float base = atan(uDir.z, uDir.x);
      float k = smoothstep(0.03, 0.45, s);
      float r = mix(0.12, 0.5 + 1.5 * fract(aB.z * 3.7), k) + max(0., s - 0.6) * 1.6;
      float y = mix(uChest.y, mix(0.05, uBody.y + 0.45, aA.w), smoothstep(0.03, 0.5, s)) + max(0., s - 0.6) * 0.4;
      float ang = base + aA.y * k + s * 3.2 + uTime * 0.15; // body swirl: keeps its original direction (clockwise seen from above)
      vec3 swirl = vec3(uBody.x + cos(ang) * r, y, uBody.z + sin(ang) * r);
      vis = smoothstep(0., 0.02, s) * (1. - smoothstep(0.65, 1., s));
      return mix(through, swirl, smoothstep(0.05, 0.22, s));
    }
    void main(){
      float v1, v2, s1, s2;
      vec3 H = arrPos(uT, v1, s1), Tl = arrPos(uT - 0.11, v2, s2);
      vec3 d = H - Tl;
      float ok = step(length(d), 0.5);
      vec3 side = normalize(cross(d + vec3(1e-6), normalize(cameraPosition - H)) + vec3(1e-6));
      vec3 P = mix(Tl, H, position.x) + side * position.y * aB.y * ok;
      vUv = position.xy;
      vCol = mix(colorAt(aB.x) * 1.35, vec3(1.), aB.w);
      // During the crescendo the swirl grows outward from you as a front.
      float front = uT < 2. ? step(s1, uT * 0.55 + 0.03) : 1.;
      float near = smoothstep(0.35, 1.3, distance(H, cameraPosition));
      vA = v1 * ok * front * near * uE * (0.16 + 0.35 * uBurst);
      gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
    }`,
  fragmentShader: /* glsl */`
    varying vec2 vUv; varying vec3 vCol; varying float vA;
    void main(){
      float a = exp(-vUv.y * vUv.y * 3.2) * pow(vUv.x, 1.4) * vA;
      gl_FragColor = vec4(vCol * a, a * 0.3);
    }`,
}));
arrivalMesh.frustumCulled = false;

// 2) Body aura: layered shells round the body, head to floor, plus a white-hot inner core and soft volume.
const auraMat = (layer) => new THREE.ShaderMaterial({
  uniforms: eu, ...GLOW_BLEND, side: THREE.DoubleSide,
  vertexShader: /* glsl */`
    uniform vec3 uBody; varying vec3 vW, vN; varying vec2 vUv;
    void main(){
      float h = (uBody.y + 0.25) * 0.5;   // an egg of light from the floor to just above the head
      vec3 p = position * vec3(1., h, 1.);
      vec4 w = vec4(p.x + uBody.x, p.y + h - 0.05, p.z + uBody.z, 1.);
      vW = w.xyz; vN = normalize(normal / vec3(1., h, 1.)); vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragmentShader: NOISE + EMP_COMMON + /* glsl */`
    varying vec3 vW, vN; varying vec2 vUv;
    void main(){
      vec3 v = normalize(cameraPosition - vW);
      float f = abs(dot(vN, v));
      float n = fbmP(vec2(vUv.x * 8. + ${layer.toFixed(1)} * 3., vW.y * 3. - uTime * (1.2 + ${layer.toFixed(1)} * 0.4)), 8.);
      float edge = pow(1. - f, 1.5);
      float pulse = 0.8 + 0.2 * sin(uTime * 3.1 + vW.y * 2.);
      float ends = smoothstep(0., 0.2, vUv.y) * smoothstep(1., 0.8, vUv.y);
      float near = smoothstep(0.3, 0.8, distance(vW, cameraPosition));
      // From inside your own aura, only the part you see when looking down at your body glows.
      float hh = (uBody.y + 0.25) * 0.5;
      vec3 cl = (cameraPosition - vec3(uBody.x, hh - 0.05, uBody.z)) / vec3(0.6, hh, 0.6);
      float down = smoothstep(-0.35, -0.75, normalize(vW - cameraPosition).y);
      near *= mix(1., down, step(length(cl), 1.));
      vec3 col = ${layer === 0 ? 'mix(colorAt(vUv.x + uTime * 0.05) * 1.4, vec3(1.2), 0.75 * f)' : 'colorAt(vUv.x + uTime * 0.05) * 1.3'};
      float a = (${layer === 0 ? '0.35 * pow(f, 4.) + 0.02' : '0.015 + 0.4 * edge * n'}) * (0.35 + n) * pulse * ends * near * uE * (0.6 + 0.8 * uBurst) * ${layer === 0 ? '0.7' : '0.5'};
      gl_FragColor = vec4(col * a, a * 0.3);
    }`,
});
const aura = new THREE.Group();
[[0.16, 0], [0.38, 1], [0.6, 2]].forEach(([r, layer]) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24).scale(r, 1, r), auraMat(layer));
  m.frustumCulled = false; aura.add(m);
});

// The ring shockwave of the crescendo, expanding through the room at chest height and along the floor.
const shockMat = new THREE.ShaderMaterial({
  uniforms: eu, ...GLOW_BLEND, side: THREE.DoubleSide,
  vertexShader: /* glsl */`
    uniform vec3 uBody, uChest; varying vec2 vP; uniform float uT;
    void main(){ vP = position.xy * 7.; vec3 w = vec3(uBody.x + vP.x, ${'uChest.y - 0.15'}, uBody.z + vP.y);
      gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.); }`,
  fragmentShader: EMP_COMMON + /* glsl */`
    varying vec2 vP;
    void main(){
      float r = length(vP), k = clamp(uT / 1.8, 0., 1.);
      float R = (1. - pow(1. - k, 2.)) * 4.5;
      float ring = exp(-pow((r - R) / (0.06 + 0.12 * k), 2.)) + 0.35 * exp(-pow((r - R * 0.8) / 0.25, 2.));
      vec3 col = mix(colorAt(atan(vP.y, vP.x) / 6.2831853), vec3(1.), 0.3 * exp(-pow((r - R) / 0.04, 2.)));
      float a = ring * pow(1. - k, 1.2) * step(uT, 1.8) * uE * smoothstep(0.3, 0.9, r) * 1.2;
      gl_FragColor = vec4(col * a, a * 0.3);
    }`,
});
const shock = new THREE.Mesh(planeGeo, shockMat);
shock.frustumCulled = false;
const shockFloorMat = shockMat.clone();
shockFloorMat.uniforms = eu;
shockFloorMat.vertexShader = shockMat.vertexShader.replace('uChest.y - 0.15', '0.02');
const shockFloor = new THREE.Mesh(planeGeo, shockFloorMat);
shockFloor.frustumCulled = false;

// 3) Lightning: jagged branching arcs as camera-facing ribbons, rebuilt every 2 to 4 frames.
const bolts = (() => {
  const MAX = 420;
  const P0 = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const P1 = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const C = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 4), 4).setUsage(THREE.DynamicDrawUsage);
  const g = new THREE.InstancedBufferGeometry();
  g.setIndex([0, 1, 2, 2, 1, 3]);
  g.setAttribute('position', streakGeos[0].attributes.position);
  g.setAttribute('aP0', P0); g.setAttribute('aP1', P1); g.setAttribute('aC', C);
  g.instanceCount = 0;
  const mat = (width, white, alpha) => new THREE.ShaderMaterial({
    uniforms: { uE: eu.uE }, ...GLOW_BLEND, side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      attribute vec3 aP0, aP1; attribute vec4 aC;
      varying float vY; varying vec3 vCol; varying float vI; varying float vNear;
      void main(){
        vec3 d = aP1 - aP0, m = mix(aP0, aP1, position.x);
        float w = ${width} * aC.w;
        vec3 side = normalize(cross(d + vec3(1e-6), cameraPosition - m) + vec3(1e-6));
        vec3 P = m + side * position.y * w + normalize(d + vec3(1e-6)) * w * 0.5 * (position.x * 2. - 1.);
        vY = position.y; vCol = mix(aC.rgb, vec3(1.), ${white}); vI = aC.w;
        vNear = smoothstep(0.15, 0.55, distance(P, cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
      }`,
    fragmentShader: /* glsl */`
      uniform float uE; varying float vY; varying vec3 vCol; varying float vI; varying float vNear;
      void main(){ float a = exp(-vY * vY * 3.) * ${alpha} * min(1.5, vI) * min(1., uE * 1.5) * vNear; gl_FragColor = vec4(vCol * a, a * 0.3); }`,
  });
  const glow = new THREE.Mesh(g, mat('0.03', '0.0', '0.22'));
  const core = new THREE.Mesh(g, mat('0.0045', '0.8', '1.0'));
  glow.frustumCulled = core.frustumCulled = false;
  let n = 0;
  const seg = (a, b, c, w) => {
    if (n >= MAX) return;
    P0.setXYZ(n, a.x, a.y, a.z); P1.setXYZ(n, b.x, b.y, b.z); C.setXYZW(n, c.r, c.g, c.b, w); n++;
  };
  const tmp = new THREE.Vector3(), perp1 = new THREE.Vector3(), perp2 = new THREE.Vector3();
  // A random-walk bolt between a and b, pinned at both ends, with an optional branch or two.
  function bolt(a, b, c, w, steps, amp, branch) {
    const d = tmp.subVectors(b, a), len = d.length();
    if (len < 0.01) return;
    perp1.crossVectors(d, Math.abs(d.y) < 0.9 * len ? UP : new THREE.Vector3(1, 0, 0)).normalize();
    perp2.crossVectors(d, perp1).normalize();
    const p1 = perp1.clone(), p2 = perp2.clone();
    let o1 = 0, o2 = 0, prev = a.clone();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      o1 = o1 * 0.8 + (Math.random() - 0.5) * amp * len; o2 = o2 * 0.8 + (Math.random() - 0.5) * amp * len;
      const pin = Math.sin(Math.PI * t);
      const p = a.clone().lerp(b, t).addScaledVector(p1, o1 * pin).addScaledVector(p2, o2 * pin);
      if (i === steps) p.copy(b);
      seg(prev, p, c, w * (1 - 0.4 * t));
      if (branch && i > 1 && i < steps - 1 && Math.random() < 0.18) {
        const e = p.clone().add(new THREE.Vector3().randomDirection().multiplyScalar(len * (0.12 + Math.random() * 0.2)));
        bolt(p, e, c, w * 0.55, 5, amp * 1.2, false);
      }
      prev = p;
    }
  }
  return { meshes: [glow, core], bolt, begin() { n = 0; }, end() { g.instanceCount = n; P0.needsUpdate = P1.needsUpdate = C.needsUpdate = true; } };
})();

// Sparks and embers: a small pool of points, like puja-vr's motes.
const dotTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const sparks = (() => {
  const N = 700, pos = new Float32Array(N * 3).fill(-50), col = new Float32Array(N * 3), parts = [];
  for (let i = 0; i < N; i++) parts.push({ p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), c: new THREE.Color(), life: 0, max: 1, g: 0 });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.016, map: dotTex, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  pts.frustumCulled = false;
  let cursor = 0;
  const spawn = (p, c, v, life, grav) => {
    const q = parts[cursor = (cursor + 1) % N];
    q.p.copy(p); q.v.copy(v); q.c.copy(c).lerp(new THREE.Color(1, 1, 1), Math.random() * 0.5);
    q.max = q.life = life; q.g = grav;
  };
  const v = new THREE.Vector3();
  return {
    pts,
    burst(p, c, n) { for (let i = 0; i < n; i++) spawn(p, c, v.randomDirection().multiplyScalar(0.4 + Math.random() * 1.2), 0.25 + Math.random() * 0.4, -3); },
    ember(p, c) { spawn(p, c, v.set((Math.random() - 0.5) * 0.06, 0.12 + Math.random() * 0.15, (Math.random() - 0.5) * 0.06), 0.8 + Math.random() * 0.8, 0.05); },
    update(dt) {
      parts.forEach((q, i) => {
        if (q.life > 0) {
          q.life -= dt; q.v.y += q.g * dt; q.v.multiplyScalar(Math.exp(-2 * dt)); q.p.addScaledVector(q.v, dt);
          if (q.life <= 0) q.p.y = -50;
        }
        const k = q.life > 0 ? Math.sin(Math.PI * q.life / q.max) * 1.5 : 0;
        pos[i * 3] = q.p.x; pos[i * 3 + 1] = q.p.y; pos[i * 3 + 2] = q.p.z;
        col[i * 3] = q.c.r * k; col[i * 3 + 1] = q.c.g * k; col[i * 3 + 2] = q.c.b * k;
      });
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    },
  };
})();

// 4) Hands: glow on the fingertips and palm of your real hands (hand tracking), arcs between fingers and hands.
const TIP_JOINTS = ['thumb-tip', 'index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip'];
const xrHands = [0, 1].map(i => {
  const h = renderer.xr.getHand(i); scene.add(h);
  h.addEventListener('connected', (e) => { h.userData.handedness = e.data && e.data.handedness; });
  return h;
});
const handGlow = (() => {
  const N = 12, pos = new Float32Array(N * 3).fill(-50), col = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, map: dotTex, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  pts.frustumCulled = false;
  return { pts, pos, col, geo };
})();
// In the desktop demo, stand-in hands: at the sides (?demo=arrival) or held out, palms to the flow (?demo=palms).
const DEMO_SRC = new THREE.Vector3(-0.5, 1.35, -2.99);
function demoHands() {
  return [-1, 1].map((s, idx) => {
    const palm = DEMO_PALMS ? new THREE.Vector3(PHANTOM.x + s * 0.2, 1.24, PHANTOM.z - 0.34) : new THREE.Vector3(PHANTOM.x + s * 0.34, 1.0, PHANTOM.z - 0.12);
    const normal = DEMO_PALMS ? new THREE.Vector3().subVectors(DEMO_SRC, palm).normalize() : new THREE.Vector3(-s, 0, 0);
    const forearm = DEMO_PALMS ? new THREE.Vector3(s * 0.2, -0.4, 1).normalize() : new THREE.Vector3(0, 1, 0.1).normalize();
    const wrist = palm.clone().addScaledVector(forearm, 0.07);
    const tips = [0, 1, 2, 3, 4].map(k => palm.clone().addScaledVector(forearm, -0.09).add(new THREE.Vector3(s * (0.035 - k * 0.017), 0.01 * Math.sin(k), 0)));
    return { idx, palm, normal, wrist, forearm, tips, open: true, receiving: false, handedness: s < 0 ? 'left' : 'right', indexTip: null };
  });
}
// Real hands from WebXR hand tracking. Quest tracks the hand joints only (not the forearm), so the forearm line
// is estimated from the wrist joint: back along its +Z axis, away from the fingers.
// ?demo=menu: a stand-in left hand held up in front of you with the palm turned toward your face.
function menuDemoHand() {
  const right = new THREE.Vector3(-fwdYaw.z, 0, fwdYaw.x);
  const palm = head.clone().addScaledVector(fwdYaw, 0.38).addScaledVector(right, -0.16).add(new THREE.Vector3(0, -0.26, 0));
  const normal = new THREE.Vector3().subVectors(head, palm).normalize();
  const forearm = new THREE.Vector3(0, -1, 0.3).normalize();
  return { idx: 0, palm, normal, wrist: palm.clone().addScaledVector(forearm, 0.07), forearm, tips: [], open: true, receiving: false, handedness: 'left', indexTip: null };
}
function readHands() {
  if (DEMO_MENU) return [menuDemoHand()];
  if (DEMO_ARRIVAL || DEMO_PALMS) return demoHands();
  if (!renderer.xr.isPresenting) return [];
  const out = [];
  xrHands.forEach((h, idx) => {
    const j = h.joints; if (!j) return;
    const meta = j['middle-finger-metacarpal'], prox = j['middle-finger-phalanx-proximal'], wr = j.wrist;
    if (!meta || !meta.visible || !wr || !wr.visible) return;
    const palm = meta.position.clone();
    if (prox && prox.visible) palm.lerp(prox.position, 0.5); // palm centre
    const normal = new THREE.Vector3(0, -1, 0).applyQuaternion(meta.quaternion).normalize(); // out of the palm
    const forearm = new THREE.Vector3(0, 0, 1).applyQuaternion(wr.quaternion).normalize();
    const tips = TIP_JOINTS.map(n => j[n]).filter(t => t && t.visible).map(t => t.position);
    const reach = tips.length ? tips.reduce((s, t) => s + t.distanceTo(palm), 0) / tips.length : 0;
    const it = j['index-finger-tip'];
    out.push({ idx, palm, normal, wrist: wr.position, forearm, tips, open: reach > 0.065, receiving: false,
      handedness: h.userData.handedness || (idx ? 'right' : 'left'), indexTip: it && it.visible ? it.position : null });
  });
  return out;
}

// Motes drawn INTO your hands: they appear a few cm in front of the palm, are pulled into its centre,
// then run up the inside of the forearm and fade about 25 cm past the wrist. Stronger while that palm receives.
const handMotes = (() => {
  const N = 360, pos = new Float32Array(N * 3).fill(-50), col = new Float32Array(N * 3), parts = [];
  for (let i = 0; i < N; i++) parts.push({ s: Math.random(), sp: 0.5 + Math.random() * 0.4, ox: Math.random() * 2 - 1, oy: Math.random() * 2 - 1, d: Math.random() });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.011, map: dotTex, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  pts.frustumCulled = false;
  const e1 = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  const ease = (x) => x * x;
  return {
    pts,
    update(dt, hands, E, cols) {
      parts.forEach((q, i) => {
        const h = hands.find(hh => hh.idx === (i & 1));
        const strength = h ? E * (h.receiving ? 1 : 0.35) : 0;
        if (!h || strength < 0.01) { pos[i * 3 + 1] = -50; return; }
        q.s += dt * q.sp * (h.receiving ? 1.6 : 1);
        if (q.s >= 1) { q.s -= 1; q.ox = Math.random() * 2 - 1; q.oy = Math.random() * 2 - 1; q.d = Math.random(); }
        e1.crossVectors(h.normal, h.forearm).normalize();
        const s = q.s;
        if (s < 0.35) { // drawn in from in front of the palm
          a.copy(h.palm).addScaledVector(h.normal, 0.05 + 0.07 * q.d).addScaledVector(e1, q.ox * 0.05).addScaledVector(h.forearm, q.oy * 0.05);
          b.copy(h.palm).addScaledVector(h.normal, 0.005);
          p.lerpVectors(a, b, ease(s / 0.35));
        } else if (s < 0.55) { // palm centre to the wrist
          a.copy(h.palm).addScaledVector(h.normal, 0.005).addScaledVector(e1, q.ox * 0.01);
          b.copy(h.wrist).addScaledVector(h.normal, 0.012).addScaledVector(e1, q.ox * 0.012);
          p.lerpVectors(a, b, (s - 0.35) / 0.2);
        } else { // up the inside of the forearm
          a.copy(h.wrist).addScaledVector(h.normal, 0.012).addScaledVector(e1, q.ox * 0.012);
          b.copy(h.wrist).addScaledVector(h.forearm, 0.25).addScaledVector(h.normal, 0.02).addScaledVector(e1, q.ox * 0.018);
          p.lerpVectors(a, b, (s - 0.55) / 0.45);
        }
        const k = smooth(0, 0.12, s) * (1 - smooth(0.8, 1, s)) * strength * 1.4;
        c.copy(cols[i % 5]).lerp(new THREE.Color(1, 1, 1), 0.3).multiplyScalar(k);
        pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      });
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    },
  };
})();

// 5) Flare and bloom: a head-locked overlay in front of your eyes, drawn last. Capped so the room stays visible.
const flare = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.ShaderMaterial({
  uniforms: { uQ: { value: new THREE.Vector3(0, 0, -1) }, uWash: { value: 0 }, uStreak: { value: 0 }, uColors: eu.uColors, uTime: eu.uTime },
  ...GLOW_BLEND, depthTest: false,
  vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: /* glsl */`
    uniform vec3 uQ; uniform float uWash, uStreak, uTime; uniform vec3 uColors[5]; varying vec2 vP;
    void main(){
      vec2 q = uQ.z < -0.01 ? uQ.xy * (0.12 / -uQ.z) : vec2(0., -9.);
      vec2 d = vP - q;
      float glow = exp(-dot(d, d) / 0.003);
      float streak = exp(-pow(d.y / 0.0022, 2.)) * exp(-abs(d.x) / 0.13) + 0.35 * exp(-pow(d.y / 0.01, 2.)) * exp(-abs(d.x) / 0.05);
      vec3 tint = uColors[int(mod(floor(uTime / 1.5), 5.))];
      vec3 c = tint * uWash * (0.6 + 0.4 * glow) + mix(tint, vec3(1.), 0.35) * (streak + glow * 0.6) * uStreak;
      gl_FragColor = vec4(c, uWash * 0.12);
    }`,
}));
flare.position.set(0, 0, -0.12);
flare.renderOrder = 999; flare.frustumCulled = false; flare.visible = false;
camera.add(flare);

// A simple translucent stand-in body for the ?demo=arrival third-person view.
const phantomBody = (() => {
  const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: 0x8090b0, transparent: true, opacity: 0.18, depthWrite: false });
  const add = (geo, x, y, z, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.z = rz; g.add(m); };
  add(new THREE.SphereGeometry(0.11, 24, 16), 0, 1.58, 0);
  add(new THREE.CapsuleGeometry(0.17, 0.42, 6, 16), 0, 1.13, 0);
  add(new THREE.CapsuleGeometry(0.07, 0.68, 6, 12), -0.1, 0.42, 0);
  add(new THREE.CapsuleGeometry(0.07, 0.68, 6, 12), 0.1, 0.42, 0);
  if (DEMO_PALMS) [-1, 1].forEach(s => { // arms held out, palms to the flow
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.3, 6, 12), mat);
    m.position.set(s * 0.21, 1.31, -0.17); m.rotation.x = 0.85; g.add(m);
  });
  else {
    add(new THREE.CapsuleGeometry(0.05, 0.5, 6, 12), -0.29, 1.15, -0.06, -0.35);
    add(new THREE.CapsuleGeometry(0.05, 0.5, 6, 12), 0.29, 1.15, -0.06, 0.35);
  }
  g.position.set(PHANTOM.x, 0, PHANTOM.z);
  g.visible = DEMO_ARRIVAL || DEMO_PALMS;
  scene.add(g);
  return g;
})();

const empowerGroup = new THREE.Group();
empowerGroup.add(arrivalMesh, aura, shock, shockFloor, ...bolts.meshes, sparks.pts, handGlow.pts, handMotes.pts);
scene.add(empowerGroup);

const empower = (() => {
  let tArr = -99, flow = null, frames = 0, nextBuild = 0, E = 0;
  const lastHits = [];
  const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _c = new THREE.Color();
  function pickFlow() {
    const live = flows.filter(f => f.arrived && !f.dying);
    return live.length ? live[live.length - 1] : flows.filter(f => f.arrived).pop() || null;
  }
  function randomTarget(out) {
    const a = Math.random() * TAU, r = 1 + Math.random() * 1.5;
    const b = eu.uBody.value;
    return out.set(b.x + Math.cos(a) * r, Math.random() * 2.2, b.z + Math.sin(a) * r);
  }
  function build(hands) {
    const b = eu.uBody.value, burst = eu.uBurst.value, cols = eu.uColors.value;
    const col = () => cols[Math.floor(Math.random() * 5)];
    const shoulder = b.y - 0.25;
    bolts.begin();
    // around the torso and legs
    const nWrap = Math.round(1 + E * 2 + burst * 5);
    for (let i = 0; i < nWrap; i++) {
      const a1 = Math.random() * TAU, a2 = a1 + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2.5);
      const y1 = 0.15 + Math.random() * (shoulder - 0.15), y2 = Math.min(shoulder, Math.max(0.1, y1 + (Math.random() - 0.5) * 0.9));
      const r = 0.22 + Math.random() * 0.14, steps = 14, c = col();
      let prev = null;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps, a = a1 + (a2 - a1) * t;
        const p = new THREE.Vector3(b.x + Math.cos(a) * r, y1 + (y2 - y1) * t, b.z + Math.sin(a) * r)
          .add(_v.randomDirection().multiplyScalar(0.025));
        if (prev) bolts.bolt(prev, p, c, 1.0, 2, 0.25, k === steps >> 1);
        prev = p;
      }
    }
    // out to nearby surfaces: where you last pointed, the flow's source, else somewhere 1 to 2.5 m away
    const nReach = Math.round(E * 1.5 + burst * 5 + (Math.random() < 0.3 ? 1 : 0));
    for (let i = 0; i < nReach; i++) {
      const choice = Math.random();
      const target = new THREE.Vector3();
      if (choice < 0.3 && flow) target.copy(flow.S);
      else if (choice < 0.6 && lastHits.length) target.copy(lastHits[Math.floor(Math.random() * lastHits.length)]);
      else randomTarget(target);
      const from = new THREE.Vector3(b.x, 0.5 + Math.random() * (shoulder - 0.75), b.z); // from below the shoulders, away from your eyes
      from.add(_w.subVectors(target, from).setY(0).normalize().multiplyScalar(0.25));
      const c = col();
      bolts.bolt(from, target, c, 1.3, 22, 0.12, true);
      sparks.burst(target, c, 8);
    }
    // hands: arms, between fingers, between the two hands
    for (const h of hands) {
      if (Math.random() < 0.5 + burst * 0.5) {
        const s = new THREE.Vector3(b.x, shoulder + 0.05, b.z).lerp(h.palm, 0.15);
        bolts.bolt(s, h.palm, col(), 0.8, 10, 0.18, false);
      }
      for (let k = 0; k + 1 < h.tips.length; k++) if (Math.random() < 0.45) bolts.bolt(h.tips[k], h.tips[k + 1], col(), 0.45, 4, 0.5, false);
      if (h.tips.length && Math.random() < 0.6) bolts.bolt(h.palm, h.tips[Math.floor(Math.random() * h.tips.length)], col(), 0.5, 5, 0.4, false);
    }
    if (hands.length === 2 && hands[0].palm.distanceTo(hands[1].palm) < 0.4 && Math.random() < 0.85) {
      bolts.bolt(hands[0].palm, hands[1].palm, col(), 0.9, 12, 0.2, true);
    }
    bolts.end();
    if (!DEMO && Math.random() < 0.55) audio.crackle(E + burst);
  }
  return {
    arrive(f, ago) {
      tArr = clockNow.t - ago; flow = f;
      if (!DEMO) audio.arrive();
    },
    update(dt, frame) {
      // remember real surfaces you pointed at, for lightning to reach out to
      for (const p of pointers) if (p.source && p.target === 'surface' && !p.fallback) {
        if (!lastHits.length || lastHits[lastHits.length - 1].distanceTo(p.point) > 0.3) { lastHits.push(p.point.clone()); if (lastHits.length > 8) lastHits.shift(); }
      }
      if (!flow || flow.dying) flow = pickFlow() || flow;
      const target = flows.reduce((m, f) => Math.max(m, f.arrived && !f.dying ? Math.max(0, f.fade) * f.u.uGain.value : 0), 0);
      E += (target - E) * (1 - Math.exp(-dt * (target > E ? 3 : 1.2)));
      const t = clockNow.t - tArr;
      const burst = E > 0.02 ? smooth(0, 0.25, t) * (1 - smooth(0.5, 1.6, t)) : 0;
      eu.uE.value = E; eu.uT.value = t; eu.uBurst.value = burst; eu.uTime.value = clockNow.t;
      empowerGroup.visible = E > 0.005;
      flare.visible = E > 0.005 && !!flow;
      if (!empowerGroup.visible) { bolts.begin(); bolts.end(); return; }
      if (flow) {
        const ff = flow.u;
        eu.uDir.value.subVectors(ff.uD.value, ff.uC.value); eu.uDir.value.y *= 0.3; eu.uDir.value.normalize(); // out of your back, not into the floor
        ff.uColors.value.forEach((c, i) => eu.uColors.value[i].copy(c));
      }
      eu.uChest.value.copy(chest);
      eu.uBody.value.copy(PHANTOM_MODE ? PHANTOM : head);
      // lightning rebuilt every 2 to 4 frames
      const hands = handsNow;
      if (++frames >= nextBuild) { frames = 0; nextBuild = 2 + Math.floor(Math.random() * 3); build(hands); }
      // hand glow
      let n = 0;
      const pulse = 0.8 + 0.3 * Math.sin(clockNow.t * 9) * Math.sin(clockNow.t * 5.3);
      for (const h of hands) {
        for (const p of [h.palm, ...h.tips]) {
          if (n >= 12) break;
          _c.copy(eu.uColors.value[n % 5]).lerp(new THREE.Color(1, 1, 1), p === h.palm ? 0.5 : 0.25).multiplyScalar(E * pulse * (p === h.palm ? 1.2 : 0.8));
          handGlow.pos.set([p.x, p.y, p.z], n * 3); handGlow.col.set([_c.r, _c.g, _c.b], n * 3); n++;
        }
      }
      for (; n < 12; n++) handGlow.pos[n * 3 + 1] = -50;
      handGlow.geo.attributes.position.needsUpdate = true; handGlow.geo.attributes.color.needsUpdate = true;
      handMotes.update(dt, hands, E, eu.uColors.value);
      if (burst > 0.3 && Math.random() < 0.5) sparks.burst(_v.copy(chest).add(_w.randomDirection().multiplyScalar(0.2)), eu.uColors.value[Math.floor(Math.random() * 5)], 3);
      sparks.update(dt);
      // flare strength follows how directly you look at the incoming torrent, and the arrival intensity
      if (flow) {
        const lp = flow.bez(0.8, _v);
        const look = smooth(0.55, 0.97, _w.subVectors(lp, head).normalize().dot(fwd));
        const wash = Math.min(0.35, burst * 0.3 + E * 0.08 * (1 + 0.25 * Math.sin(clockNow.t * 2.2))) * (0.5 + 0.5 * look);
        const fu = flare.material.uniforms;
        fu.uWash.value = wash;
        fu.uStreak.value = look * (0.2 * E + 0.8 * burst);
        fu.uQ.value.copy(lp).sub(head).applyQuaternion(_q.copy(headQ).invert());
      }
    },
  };
})();

// ---------- loop ----------
const clock = new THREE.Clock();
const _ref = new THREE.Vector3(), _hov = new Set();
let started = false;
renderer.setAnimationLoop((ts, frame) => {
  let dt = Math.min(clock.getDelta(), 0.05);
  if (STOP_AT) dt = Math.min(1 / 30, Math.max(0, STOP_AT - clockNow.t)); // ?stop=: fixed steps, then freeze, for screenshots
  clockNow.t += dt;
  const xr = renderer.xr.isPresenting && frame;
  const refSpace = xr ? renderer.xr.getReferenceSpace() : null;

  if (xr) {
    const pose = frame.getViewerPose(refSpace);
    if (pose) {
      const { position: a, orientation: o } = pose.transform;
      head.set(a.x, a.y, a.z); headQ.set(o.x, o.y, o.z, o.w);
    }
  } else {
    camera.rotation.set(pitch, -yaw, 0);
    camera.updateMatrixWorld();
    head.copy(camera.position); headQ.copy(camera.quaternion);
  }
  fwd.set(0, 0, -1).applyQuaternion(headQ);
  _ref.set(fwd.x, 0, fwd.z);
  if (_ref.lengthSq() > 1e-4) fwdYaw.copy(_ref.normalize());
  if (PHANTOM_MODE) chest.copy(PHANTOM).add(new THREE.Vector3(0, -0.23, 0.0)).addScaledVector(new THREE.Vector3(0, 0, -1), 0.15);
  else chest.copy(head).add(new THREE.Vector3(0, -0.23, 0)).addScaledVector(fwdYaw, 0.15);

  if (!started) {
    started = true;
    panel.place(true, -0.45, 1.0, 0.3);
    if (DEMO) { startDemo(); if (!DEMO_MENU) panel.mesh.visible = false; }
  }
  if (xr && needPlace && frame.getViewerPose(refSpace)) { needPlace = false; panel.place(true); menuHint.show(); }

  // pointing
  _hov.clear();
  if (xr) {
    for (const p of pointers) {
      if (!p.source) continue;
      p.c.updateMatrixWorld();
      _o.setFromMatrixPosition(p.c.matrixWorld);
      _d.set(0, 0, -1).transformDirection(p.c.matrixWorld);
      aim(p, _o, _d, frame, refSpace);
      if (p.hoverId) _hov.add(p.hoverId);
    }
    mouse.reticle.visible = false;
  } else if (mouseIn && !DEMO) {
    raycaster.setFromCamera(ndc, camera);
    _o.copy(raycaster.ray.origin); _d.copy(raycaster.ray.direction);
    aim(mouse, _o, _d, null, null);
    if (mouse.hoverId) _hov.add(mouse.hoverId);
  }
  panel.setHover(new Set(_hov));

  handsNow = readHands();
  if (xr || DEMO_MENU) panel.handMenu(dt, handsNow);
  menuHint.update(dt);
  let level = 0;
  for (let i = flows.length - 1; i >= 0; i--) {
    const f = flows[i];
    if (!f.update(dt)) { f.dispose(); flows.splice(i, 1); continue; }
    level += f.level();
  }
  empower.update(dt, frame, refSpace);
  receivingNow[0] = receivingNow[1] = false;
  handsNow.forEach(h => { if (h.receiving) receivingNow[h.idx] = true; });
  audio.update(level, clockNow.t);
  renderer.render(scene, camera);
});
