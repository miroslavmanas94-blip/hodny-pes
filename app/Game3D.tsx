"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { Dog, Footprints, Heart, Keyboard, Map, Pause, Play, RotateCcw, Sparkles, Trophy, UserRound, Volume2, VolumeX, Settings, Navigation, Target, CheckCircle2 } from "lucide-react";

type Mode = "dog" | "human";
type Props = { onExit?: () => void };

export default function Game3D({ onExit }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{ setMode: (mode: Mode) => void; reset: () => void; togglePause: () => void; setKey: (key: string, down: boolean) => void; setDogStyle: (color: string) => void } | null>(null);
  const [mode, setModeState] = useState<Mode>("dog");
  const [collected, setCollected] = useState(0);
  const [xp, setXp] = useState(0);
  const [task, setTask] = useState("Nasbírej 8 pamlsků v areálu");
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cameraSensitivity, setCameraSensitivity] = useState(50);
  const cameraSensitivityRef = useRef(0.008);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(["#c58b58"]);
  const [selectedSkin, setSelectedSkin] = useState("#c58b58");
  const [notice, setNotice] = useState("Vítej v akademii! Rozhlédni se a vydej se na průzkum.");
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickKnob, setJoystickKnob] = useState({ x: 0, y: 0 });
  const collectedRef = useRef(0);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#b9d9f2");
    scene.fog = new THREE.Fog("#b9d9f2", 38, 115);

    const camera = new THREE.PerspectiveCamera(58, host.clientWidth / host.clientHeight, 0.1, 220);
    camera.position.set(0, 7, 11);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight("#eaf5ff", "#6b7950", 2.1);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight("#fff2d4", 3.2);
    sun.position.set(-18, 30, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -45; sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45; sun.shadow.camera.bottom = -45;
    scene.add(sun);

    const mat = (color: string, roughness = 0.9) => new THREE.MeshStandardMaterial({ color, roughness });
    const grassMat = mat("#78a95b");
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), grassMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.position.y = -0.12; scene.add(ground);

    const pathMat = mat("#d8c39b");
    const path = new THREE.Mesh(new THREE.PlaneGeometry(10, 105), pathMat);
    path.rotation.x = -Math.PI / 2; path.position.set(0, -0.06, -24); path.receiveShadow = true; scene.add(path);
    const sidePath = new THREE.Mesh(new THREE.PlaneGeometry(65, 5), pathMat);
    sidePath.rotation.x = -Math.PI / 2; sidePath.position.set(5, -0.055, -17); scene.add(sidePath);

    // Low-poly garden, deliberately built from geometry so the first game is self-contained.
    const worldColliders: { x: number; z: number; r: number }[] = [];
    const trunkMat = mat("#78513b"), leafMats = [mat("#3f8250"), mat("#58965b"), mat("#75a85d")];
    for (let i = 0; i < 54; i++) {
      const x = (Math.sin(i * 78.23) * 0.5 + 0.5) * 100 - 50;
      const z = (Math.cos(i * 31.7) * 0.5 + 0.5) * 100 - 62;
      if (Math.abs(x) < 9 && z > -65 && z < 16) continue;
      worldColliders.push({ x, z, r: 0.82 });
      const tree = new THREE.Group();
      const h = 1.4 + (i % 5) * 0.18;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, h, 6), trunkMat);
      trunk.position.y = h / 2; trunk.castShadow = true; tree.add(trunk);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8 + (i % 3) * 0.15, 1), leafMats[i % leafMats.length]);
      crown.position.y = h + 0.55; crown.scale.y = 1.05; crown.castShadow = true; tree.add(crown);
      tree.position.set(x, 0, z); scene.add(tree);
    }

    // Fenced training paddock.
    const fenceMat = mat("#f4e4c8");
    for (let i = 0; i < 34; i++) {
      const side = i < 17 ? -1 : 1;
      const j = i % 17;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), fenceMat);
      post.position.set(side * 13, 0.43, 10 - j * 2.05); post.castShadow = true; scene.add(post);
    }
    for (const z of [-6.4, -2.3, 1.8, 5.9, 10]) {
      for (const x of [-13, 13]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 4.1), fenceMat);
        rail.position.set(x, 0.28, z - 1.9); scene.add(rail);
      }
    }
    for (const y of [0.35, 0.68]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(26, 0.1, 0.1), fenceMat);
      rail.position.set(0, y, 10); scene.add(rail);
    }

    // Training equipment.
    const purple = mat("#6A00F4"), peach = mat("#FFD6A5"), white = mat("#fff9f0"), orange = mat("#ed8d47");
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.09, 10, 24), purple);
    hoop.position.set(-5.3, 1.12, -12); hoop.rotation.y = Math.PI / 2; hoop.castShadow = true; scene.add(hoop);
    for (const z of [-0.62, 0.62]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.55, 8), peach);
      foot.position.set(-5.3, 0.28, -12 + z); scene.add(foot);
    }
    for (let i = 0; i < 4; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.62, 8), orange);
      cone.position.set(3.2 + i * 1.3, 0.31, -11 - (i % 2) * 0.4); cone.castShadow = true; scene.add(cone);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.08, 8), white);
      base.position.set(3.2 + i * 1.3, 0.04, -11 - (i % 2) * 0.4); scene.add(base);
    }

    // Small academy cabin and sign.
    const cabin = new THREE.Group();
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.7, 3.8), mat("#fff1dc"));
    cabinBody.position.y = 1.35; cabinBody.castShadow = true; cabinBody.receiveShadow = true; cabin.add(cabinBody);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.65, 1.65, 4), mat("#6A00F4"));
    roof.position.y = 3.35; roof.rotation.y = Math.PI / 4; roof.castShadow = true; cabin.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.55, 0.12), mat("#976b4d"));
    door.position.set(0, 0.78, 1.96); cabin.add(door);
    const windowMat = new THREE.MeshStandardMaterial({ color: "#a9d9ed", roughness: 0.25, metalness: 0.1 });
    for (const x of [-1.45, 1.45]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.8, 0.12), windowMat);
      win.position.set(x, 1.65, 1.96); cabin.add(win);
    }
    cabin.position.set(0, 0, -28); scene.add(cabin);
    worldColliders.push({ x: 0, z: -28, r: 3.0 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.75, 0.18), purple);
    sign.position.set(0, 2.9, -25.9); scene.add(sign);

    // Stylized dog character with animated legs and tail.
    const dog = new THREE.Group(); scene.add(dog);
    const dogBodyMat = mat("#c58b58"), dogCream = mat("#f8e7cc"), dogDark = mat("#49362c"), eyeMat = mat("#1f1b1a", 0.3);
    const ellipsoid = (parent: THREE.Group, color: THREE.Material, scale: [number, number, number], pos: [number, number, number]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 9), color);
      mesh.scale.set(...scale); mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };
    ellipsoid(dog, dogBodyMat, [0.58, 0.42, 0.92], [0, 0.76, 0]);
    ellipsoid(dog, dogCream, [0.4, 0.3, 0.65], [0, 0.58, 0.22]);
    const head = new THREE.Group(); head.position.set(0, 1.12, -0.66); dog.add(head);
    ellipsoid(head, dogBodyMat, [0.43, 0.43, 0.43], [0, 0.12, -0.05]);
    ellipsoid(head, dogCream, [0.3, 0.23, 0.34], [0, -0.04, -0.36]);
    ellipsoid(head, dogDark, [0.12, 0.1, 0.11], [0, 0.03, -0.65]);
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 7), dogDark);
      ear.position.set(s * 0.3, 0.45, -0.04); ear.rotation.z = s * -0.2; ear.castShadow = true; head.add(ear);
      ellipsoid(head, eyeMat, [0.045, 0.05, 0.035], [s * 0.22, 0.2, -0.36]);
    }
    const legs: THREE.Mesh[] = [];
    for (const x of [-0.36, 0.36]) for (const z of [-0.55, 0.57]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.42, 3, 6), dogBodyMat);
      leg.position.set(x, 0.34, z); leg.castShadow = true; dog.add(leg); legs.push(leg);
    }
    const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.34, 3, 6), dogBodyMat);
    tail.position.set(0, 0.94, 0.86); tail.rotation.x = -0.9; tail.castShadow = true; dog.add(tail);
    dog.position.set(0, 0, 3);

    // Human avatar used when switching to trainer mode.
    const human = new THREE.Group(); scene.add(human);
    const shirt = mat("#6A00F4"), skin = mat("#d8a27a"), pants = mat("#3f4762"), shoe = mat("#fff1dc");
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.62, 4, 8), shirt); torso.position.y = 1.15; torso.castShadow = true; human.add(torso);
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 10), skin); face.position.y = 1.83; face.castShadow = true; human.add(face);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.275, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), dogDark); hair.position.y = 1.92; human.add(hair);
    const humanLegs: THREE.Mesh[] = [];
    for (const x of [-0.16, 0.16]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.55, 3, 6), pants);
      leg.position.set(x, 0.43, 0); leg.castShadow = true; human.add(leg); humanLegs.push(leg);
      const shoeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.35), shoe);
      shoeMesh.position.set(x, 0.12, -0.06); human.add(shoeMesh);
    }
    human.position.copy(dog.position); human.visible = false;

    // Collectible treats, placed around the play space.
    const treatMat = new THREE.MeshStandardMaterial({ color: "#e89c48", roughness: 0.55, emissive: "#65310b", emissiveIntensity: 0.12 });
    const treats: { group: THREE.Group; baseY: number; taken: boolean }[] = [];
    const treatPositions: [number, number][] = [[-7, 0], [7, 1], [-8, -8], [0, -15], [8, -19], [-10, -22], [4, 7], [10, -3], [-3, -30], [13, -26], [-14, -15], [1, -5]];
    for (const [x, z] of treatPositions) {
      const group = new THREE.Group();
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), treatMat);
      center.scale.set(1.25, 0.7, 0.75); group.add(center);
      for (const s of [-1, 1]) {
        const end = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), treatMat);
        end.position.x = s * 0.19; group.add(end);
      }
      group.position.set(x, 0.48, z); group.traverse(o => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
      scene.add(group); treats.push({ group, baseY: 0.48, taken: false });
    }

    // Mission stations have a glowing beacon and a clear physical location.
    const stations: { group: THREE.Group; title: string; description: string; done: boolean }[] = [];
    const makeStation = (x: number, z: number, color: string, title: string, description: string) => {
      const group = new THREE.Group();
      const ringMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, roughness: 0.35 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.1, 8, 22), ringMat);
      ring.position.y = 0.95; group.add(ring);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.22, 1.6, 8, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
      beam.position.y = 1.5; group.add(beam);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.12, 12), white); base.position.y = 0.02; group.add(base);
      group.position.set(x, 0, z); scene.add(group);
      stations.push({ group, title, description, done: false });
    };
    makeStation(-5.3, -12, "#6A00F4", "Průzkumník", "Prošel jsi tréninkovou bránou. Zkus se teď projít mezi kužely.");
    makeStation(5.5, -12, "#ed8d47", "Slalom", "Našel jsi slalomovou zónu. Každá překážka je nový zážitek.");
    makeStation(0, -26, "#33a879", "Základna akademie", "Dobrá práce! Tady začíná tvoje cesta pozitivním výcvikem.");
    const markerMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), markerMat); marker.position.y = 2.1; scene.add(marker);

    const keys: Record<string, boolean> = {};
    let cameraYaw = Math.PI;
    let cameraPitch = 5.2;
    let dragPointer: number | null = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let activeMode: Mode = "dog";
    let isPaused = false;
    let frame = 0;
    let jumpVelocity = 0;
    let vertical = 0;
    let lastTime = 0;
    let noticeCooldown = 0;
    const player = () => activeMode === "dog" ? dog : human;
    const setMode = (next: Mode) => {
      activeMode = next;
      setModeState(next);
      dog.visible = next === "dog";
      human.visible = next === "human";
      human.position.copy(dog.position);
      setNotice(next === "dog" ? "Ovládáš psa. Prozkoumej areál a hledej pamlsky." : "Ovládáš trenéra. Dojdi k zářícím stanovištím a stiskni E.");
    };
    const reset = () => {
      dog.position.set(0, 0, 3); dog.rotation.set(0, Math.PI, 0);
      human.position.copy(dog.position);
      for (const treat of treats) { treat.taken = false; treat.group.visible = true; }
      for (const station of stations) station.done = false;
      collectedRef.current = 0; setCollected(0); setXp(0); setTask("Nasbírej 8 pamlsků v areálu");
      setNotice("Nový začátek! Vydej se na průzkum.");
    };
    const togglePause = () => { isPaused = !isPaused; setPaused(isPaused); };
    const setKey = (key: string, down: boolean) => { keys[key.toLowerCase()] = down; };
    const setDogStyle = (color: string) => { dogBodyMat.color.set(color); dogBodyMat.needsUpdate = true; };
    gameRef.current = { setMode, reset, togglePause, setKey, setDogStyle };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
      keys[key] = true;
      if (key === " " && !event.repeat && vertical <= 0.001) jumpVelocity = activeMode === "dog" ? 5.2 : 6.1;
      if (key === "e" && !event.repeat) {
        const p = player().position;
        const nearest = stations.filter(s => !s.done).sort((a,b) => a.group.position.distanceTo(p) - b.group.position.distanceTo(p))[0];
        if (nearest && nearest.group.position.distanceTo(p) < 3.1) {
          nearest.done = true; setXp(v => v + 100);
          setNotice("✦ " + nearest.title + " — " + nearest.description);
          setTask(stations.every(s => s.done || s === nearest) ? "Stanoviště dokončena! Volně prozkoumávej svět." : "Najdi další zářící stanoviště");
        } else {
          setNotice("Najdi zářící kruh na zemi a přibliž se k němu.");
        }
      }
      if (key === "v" && !event.repeat) setMode(activeMode === "dog" ? "human" : "dog");
      if (key === "escape" && !event.repeat) togglePause();
    };
    const onKeyUp = (event: KeyboardEvent) => { keys[event.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    const onBlur = () => { Object.keys(keys).forEach(k => keys[k] = false); };
    window.addEventListener("blur", onBlur);
    const canvas = renderer.domElement;
    // Use the DOM Event type at the listener boundary, then narrow to PointerEvent.
    // This avoids collisions with React's synthetic PointerEvent type in TSX files.
    const onPointerDown: EventListener = (rawEvent) => {
      const event = rawEvent as globalThis.PointerEvent;
      dragPointer = event.pointerId;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove: EventListener = (rawEvent) => {
      const event = rawEvent as globalThis.PointerEvent;
      if (dragPointer !== event.pointerId) return;
      const dx = event.clientX - lastPointerX, dy = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      cameraYaw -= dx * cameraSensitivityRef.current;
      cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.018, 2.8, 8.5);
    };
    const onPointerUp: EventListener = (rawEvent) => {
      const event = rawEvent as globalThis.PointerEvent;
      if (dragPointer === event.pointerId) dragPointer = null;
    };
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("lostpointercapture", onPointerUp);

    const resize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
      camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight);
    };
    const observer = new ResizeObserver(resize); observer.observe(host);

    const clock = new THREE.Clock();
    let animationId = 0;
    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.04);
      frame += delta;
      if (!isPaused) {
        const p = player();
        let fwd = 0, side = 0;
        if (keys.w || keys.arrowup) fwd += 1;
        if (keys.s || keys.arrowdown) fwd -= 1;
        if (keys.a || keys.arrowleft) side -= 1;
        if (keys.d || keys.arrowright) side += 1;
        const length = Math.hypot(fwd, side);
        if (length > 0) {
          fwd /= length; side /= length;
          const speed = activeMode === "dog" ? 6.1 : 4.6;
          // Camera-relative movement: W always moves toward the camera look direction.
          // The previous basis was inverted, so forward/backward felt reversed.
          const moveX = fwd * Math.sin(cameraYaw) + side * Math.cos(cameraYaw);
          const moveZ = fwd * Math.cos(cameraYaw) - side * Math.sin(cameraYaw);
          const angle = Math.atan2(moveX, -moveZ);
          p.rotation.y = THREE.MathUtils.damp(p.rotation.y, angle, 10, delta);
          const nextX = p.position.x + moveX * speed * delta;
          const nextZ = p.position.z + moveZ * speed * delta;
          const inFenceRange = nextZ > -24 && nextZ < 10.5;
          const hitsSideFence = inFenceRange && Math.abs(nextX) > 12.15 && Math.abs(p.position.x) <= 12.15;
          const hitsFrontFence = nextZ > 9.2 && p.position.z <= 9.2 && Math.abs(nextX) < 13.2;
          // Resolve each axis separately so the player slides along obstacles.
          if (!hitsSideFence && !hitsFrontFence && !worldColliders.some(o => Math.hypot(nextX - o.x, p.position.z - o.z) < o.r + 0.35)) p.position.x = nextX;
          if (!hitsFrontFence && !hitsSideFence && !worldColliders.some(o => Math.hypot(p.position.x - o.x, nextZ - o.z) < o.r + 0.35)) p.position.z = nextZ;
        }
        jumpVelocity -= 13 * delta;
        vertical = Math.max(0, vertical + jumpVelocity * delta);
        if (vertical <= 0) { vertical = 0; jumpVelocity = 0; }
        p.position.y = vertical;
        // Keep both avatars at one shared position so switching never teleports the player.
        if (activeMode === "dog") human.position.copy(dog.position);
        else dog.position.copy(human.position);
        if (activeMode === "dog") {
          legs.forEach((leg, i) => { leg.rotation.x = length > 0 ? Math.sin(frame * 12 + i * Math.PI) * 0.48 : 0; });
          tail.rotation.x = -0.9 + Math.sin(frame * 6) * 0.24;
          head.rotation.x = Math.sin(frame * 2.4) * 0.035;
        } else {
          humanLegs.forEach((leg, i) => { leg.rotation.x = length > 0 ? Math.sin(frame * 10 + i * Math.PI) * 0.45 : 0; });
        }
        p.position.x = THREE.MathUtils.clamp(p.position.x, -55, 55);
        p.position.z = THREE.MathUtils.clamp(p.position.z, -62, 24);
        if (activeMode === "dog") human.position.copy(dog.position);
        else dog.position.copy(human.position);
        const target = new THREE.Vector3(p.position.x, p.position.y + 1.0, p.position.z);
        const desiredCamera = new THREE.Vector3(p.position.x - Math.sin(cameraYaw) * 7.2, p.position.y + cameraPitch, p.position.z - Math.cos(cameraYaw) * 7.2);
        camera.position.lerp(desiredCamera, 1 - Math.exp(-4.2 * delta));
        camera.lookAt(target);

        for (const treat of treats) {
          if (treat.taken) continue;
          treat.group.position.y = treat.baseY + Math.sin(frame * 2.4 + treat.baseY * 10) * 0.13;
          treat.group.rotation.y += delta * 0.7;
          if (treat.group.position.distanceTo(p.position) < 1.15) {
            treat.taken = true; treat.group.visible = false;
            collectedRef.current += 1; setCollected(collectedRef.current); setXp(v => v + 15);
            setNotice("Mňam! +15 XP. Pamlsek nalezen.");
            if (collectedRef.current >= 8) setTask("Výzva splněna! Zkus prozkoumat tréninková stanoviště.");
          }
        }
        for (const station of stations) {
          station.group.rotation.y += delta * 0.35;
          station.group.position.y = Math.sin(frame * 1.8 + station.group.position.x) * 0.025;
        }
        const activeStation = stations.filter(s => !s.done).sort((a,b) => a.group.position.distanceTo(p.position) - b.group.position.distanceTo(p.position))[0];
        if (activeStation) marker.position.set(activeStation.group.position.x, 2.1 + Math.sin(frame * 3) * 0.14, activeStation.group.position.z);
        noticeCooldown += delta;
        if (noticeCooldown > 6 && length > 0) { noticeCooldown = 0; }
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", onBlur);
      canvas.removeEventListener("pointerdown", onPointerDown); canvas.removeEventListener("pointermove", onPointerMove); canvas.removeEventListener("pointerup", onPointerUp); canvas.removeEventListener("pointercancel", onPointerUp); canvas.removeEventListener("lostpointercapture", onPointerUp);
      renderer.dispose();
      scene.traverse(o => { const mesh = o as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); if (mesh.material) { const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; materials.forEach(m => m.dispose()); } });
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      gameRef.current = null;
    };
  }, []);

  const hold = (key: string) => ({ onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => { e.preventDefault(); gameRef.current?.setKey(key, true); }, onPointerUp: () => gameRef.current?.setKey(key, false), onPointerLeave: () => gameRef.current?.setKey(key, false), onPointerCancel: () => gameRef.current?.setKey(key, false) });
  const updateJoystick = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    const radius = Math.min(rect.width, rect.height) * 0.34;
    let x = e.clientX - (rect.left + rect.width / 2);
    let y = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(x, y);
    if (distance > radius) { x = x / distance * radius; y = y / distance * radius; }
    const nx = x / radius, ny = y / radius;
    setJoystickKnob({ x, y });
    gameRef.current?.setKey("a", nx < -0.24); gameRef.current?.setKey("d", nx > 0.24);
    gameRef.current?.setKey("w", ny < -0.24); gameRef.current?.setKey("s", ny > 0.24);
  };
  const releaseJoystick = () => { setJoystickKnob({ x: 0, y: 0 }); ["w", "a", "s", "d"].forEach(key => gameRef.current?.setKey(key, false)); };
  const changeCameraSensitivity = (value: number) => { setCameraSensitivity(value); cameraSensitivityRef.current = value / 6250; };
  return <section className="gameShell">
    <div className="gameTop">
      <div className="gameBrand"><span className="gameBrandIcon"><Dog size={20}/></span><div><b>HODNÝ PES</b><small>3D AKADEMIE</small></div></div>
      <div className="gameTopCenter"><span className="liveDot"/> VOLNÝ VÝCVIK <span className="gameWorld">· AREÁL AKADEMIE</span></div>
      <div className="gameTopActions"><button title="Mapa světa" aria-label="Mapa světa" onClick={() => setMapOpen(v => !v)}><Map size={17}/></button><button title="Obchod a vzhled psa" aria-label="Obchod a vzhled psa" onClick={() => setShopOpen(v => !v)}><Sparkles size={17}/></button><button title="Nastavení" aria-label="Nastavení" onClick={() => setSettingsOpen(v => !v)}><Settings size={17}/></button><button title="Nápověda" aria-label="Nápověda" onClick={() => setShowHelp(v => !v)}><Keyboard size={17}/></button><button title={sound ? "Vypnout zvuk" : "Zapnout zvuk"} aria-label={sound ? "Vypnout zvuk" : "Zapnout zvuk"} onClick={() => setSound(v => !v)}>{sound ? <Volume2 size={17}/> : <VolumeX size={17}/>}</button><button title="Pozastavit" aria-label="Pozastavit" onClick={() => gameRef.current?.togglePause()}>{paused ? <Play size={17}/> : <Pause size={17}/>}</button></div>
    </div>
    <div className="gameViewport">
      <div className="threeMount" ref={mountRef}/>
      <div className="gameVignette"/>
      <div className="gameObjective"><div className="objectiveIcon"><Sparkles size={17}/></div><div><small>AKTUÁLNÍ VÝZVA</small><b>{task}</b><span>Prozkoumej svět vlastním tempem</span></div></div>
      <div className="gameStats"><div><span className="statBubble purpleBubble"><Trophy size={16}/></span><div><small>ZÍSKANÉ XP</small><b>{xp.toLocaleString("cs-CZ")}</b></div></div><div><span className="statBubble peachBubble"><Heart size={16}/></span><div><small>PAMLSEK</small><b>{collected} / 8</b></div></div></div>
      <div className="gameCompass"><Map size={15}/><span>AREÁL</span><i>●</i></div>
      {notice && <div className="gameNotice" key={notice}>{notice}</div>}
      {showHelp && <div className="gameHelp"><button onClick={() => setShowHelp(false)}>×</button><b>Ovládání hry</b><p><kbd>W A S D</kbd> / šipky — pohyb (W dopředu, S dozadu)</p><p>Na mobilu — podrž a táhni joystickem</p><p><kbd>Mezerník</kbd> — skok</p><p><kbd>V</kbd> — přepnout psa / trenéra</p><p><kbd>E</kbd> — aktivovat blízké stanoviště</p><p><kbd>Esc</kbd> — pauza</p><p>Myš / prst na herní obrazovce — otáčení kamery; směr pohybu se řídí kamerou.</p></div>}
      {mapOpen && <div className="academyOverlay"><section className="academyPanel mapPanel"><header><div><small>PRŮZKUM SVĚTA</small><h2>Mapa akademie</h2><p>Vyber si další cíl a vydej se za dobrodružstvím.</p></div><button aria-label="Zavřít mapu" onClick={() => setMapOpen(false)}>×</button></header><div className="academyMap"><div className="mapPath mapPathVertical"/><div className="mapPath mapPathHorizontal"/><span className="mapPoint mapBase"><Dog size={17}/><small>Základna</small></span><span className="mapPoint mapPuller"><Target size={17}/><small>Dog Puller</small></span><span className="mapPoint mapSlalom"><Navigation size={17}/><small>Slalom</small></span><span className="mapPoint mapGate"><CheckCircle2 size={17}/><small>Brána</small></span></div><div className="mapLocations"><div><span className="mapLocationIcon"><Dog size={16}/></span><span><b>Základna akademie</b><small>Start dobrodružství</small></span><button onClick={() => {setMapOpen(false);gameRef.current?.reset();}}>Start</button></div><div><span className="mapLocationIcon"><Target size={16}/></span><span><b>Dog Puller</b><small>Trénink a aportovací výzva</small></span><button onClick={() => {setMapOpen(false);setTask("Najdi stanoviště Dog Puller a stiskni E.");setNotice("Výzva Dog Puller: vydej se k tréninkové zóně.");}}>Cíl</button></div><div><span className="mapLocationIcon"><Navigation size={16}/></span><span><b>Slalomová zóna</b><small>Procvič pohyb a přesnost</small></span><button onClick={() => {setMapOpen(false);setTask("Najdi slalomovou zónu.");setNotice("Slalom: sleduj značky v areálu.");}}>Cíl</button></div></div><footer><span>Tip: pohyb je nyní vztažený ke směru kamery.</span><button onClick={() => setMapOpen(false)}>Zpět do hry</button></footer></section></div>}
      {settingsOpen && <div className="academyOverlay"><section className="academyPanel settingsPanel"><header><div><small>PŘIZPŮSOB SI HRU</small><h2>Nastavení hry</h2><p>Uprav si citlivost kamery a ovládání pro své zařízení.</p></div><button aria-label="Zavřít nastavení" onClick={() => setSettingsOpen(false)}>×</button></header><label className="settingLabel">Citlivost kamery <b>{cameraSensitivity}%</b></label><input className="sensitivityRange" type="range" min="20" max="100" step="5" value={cameraSensitivity} onChange={e => changeCameraSensitivity(Number(e.target.value))}/><div className="settingScale"><span>Pomalá</span><span>Rychlá</span></div><div className="settingInfo"><span><Keyboard size={17}/></span><div><b>Počítač</b><p>WASD / šipky – pohyb · Mezerník – skok · V – pes / trenér · E – interakce</p></div></div><div className="settingInfo"><span><Navigation size={17}/></span><div><b>Mobil a tablet</b><p>Joystick pro pohyb, tlačítka pro skok a akci, tažením po světě otáčíš kamerou.</p></div></div><div className="settingInfo"><span><Volume2 size={17}/></span><div><b>Zvukové efekty</b><p>{sound ? "Zvukové přepnutí je zapnuté." : "Zvuk je aktuálně vypnutý."} Použij ikonu zvuku v horní liště.</p></div></div><footer><button onClick={() => changeCameraSensitivity(50)}>Obnovit výchozí</button><button onClick={() => setSettingsOpen(false)}>Hotovo</button></footer></section></div>}
      {shopOpen && <div className="shopOverlay"><section className="shopPanel"><header><div><small>AKADEMICKÝ OBCHOD</small><h2>Vzhled tvého parťáka</h2><p>Utrácej získané XP za nové barvy srsti. Odemčené vzhledy zůstávají při hraní v tomto okně.</p></div><button aria-label="Zavřít obchod" onClick={() => setShopOpen(false)}>×</button></header><div className="shopBalance"><Trophy size={16}/> Tvoje XP <b>{xp.toLocaleString("cs-CZ")}</b></div><div className="shopItems">{[{color:"#c58b58",name:"Klasický parťák",price:0,desc:"Přírodní hnědá srst"},{color:"#d6d8e0",name:"Stříbrný obláček",price:60,desc:"Světlá elegantní srst"},{color:"#252333",name:"Noční průzkumník",price:100,desc:"Tmavá srst"},{color:"#d97a45",name:"Liščí dobrodruh",price:150,desc:"Teplý měděný odstín"}].map(item => {const owned = ownedSkins.includes(item.color); const selected = selectedSkin === item.color; return <article className={"shopItem" + (selected ? " shopItemSelected" : "")} key={item.color}><div className="shopDogSwatch" style={{background:item.color}}>🐕</div><div className="shopItemInfo"><b>{item.name}</b><span>{item.desc}</span><small>{item.price === 0 ? "ZDARMA" : item.price + " XP"}</small></div><button disabled={!owned && xp < item.price} onClick={() => {if (!owned) {setXp(v => v - item.price);setOwnedSkins(v => [...v,item.color]);}setSelectedSkin(item.color);gameRef.current?.setDogStyle(item.color);}}>{selected ? "Vybráno" : owned ? "Použít" : "Odemknout"}</button></article>;})}</div><footer><span>XP získáš sbíráním pamlsků a plněním stanovišť.</span><button onClick={() => setShopOpen(false)}>Zpět do hry</button></footer></section></div>}
      {paused && <div className="pauseOverlay"><div><Pause size={28}/><h2>Hra pozastavena</h2><p>Svět na tebe počká.</p><button className="gamePrimary" onClick={() => gameRef.current?.togglePause()}><Play size={16}/> Pokračovat</button><button className="gameSecondary" onClick={() => gameRef.current?.reset()}><RotateCcw size={15}/> Začít znovu</button></div></div>}
      <div className="gameControls">
        <div className="mobileJoystick" aria-label="Joystick pro pohyb">
          <div className="joystickBase" ref={joystickRef} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); updateJoystick(e); }} onPointerMove={e => { if (e.buttons !== 0) updateJoystick(e); }} onPointerUp={releaseJoystick} onPointerCancel={releaseJoystick} onLostPointerCapture={releaseJoystick}>
            <span className="joystickDirection north">▲</span><span className="joystickDirection west">◀</span><span className="joystickDirection east">▶</span><span className="joystickDirection south">▼</span>
            <span className="joystickKnob" style={{ transform: "translate(calc(-50% + " + joystickKnob.x + "px), calc(-50% + " + joystickKnob.y + "px))" }} />
          </div>
          <small>POHYB</small>
        </div>
        <div className="rightControls"><button className="actionControl" onClick={() => { const keyEvent = new KeyboardEvent("keydown", { key: " " }); window.dispatchEvent(keyEvent); setTimeout(() => window.dispatchEvent(new KeyboardEvent("keyup", { key: " " })), 70); }}><span>↑</span><small>SKOK</small></button><button className="actionControl" onClick={() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "e" })); }}><span>✦</span><small>AKCE</small></button></div>
      </div>
    </div>
    <div className="gameBottom">
      <div className="modeSwitch"><button className={mode === "dog" ? "modeActive" : ""} onClick={() => gameRef.current?.setMode("dog")}><Dog size={16}/> Pes</button><button className={mode === "human" ? "modeActive" : ""} onClick={() => gameRef.current?.setMode("human")}><UserRound size={16}/> Trenér</button></div>
      <div className="gameHint"><Footprints size={15}/><span>{mode === "dog" ? "Prozkoumávej, sbírej pamlsky a najdi tréninkové zóny." : "Dojdi ke svítícím kruhům a stiskni E pro dokončení úkolu."}</span></div>
      <button className="resetGame" onClick={() => gameRef.current?.reset()}><RotateCcw size={15}/> Reset</button>
      {onExit && <button className="resetGame" onClick={onExit}>Menu</button>}
    </div>
  </section>;
}
