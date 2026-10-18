"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Sky } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Mode = "world" | "school" | "puller";
type DogAppearance = { body: string; head: string; legs: string; ear: string; bodyScale: [number, number, number]; legScale: number };
const DOG_APPEARANCES: Record<string, DogAppearance> = {
  "border-collie": { body: "#27272a", head: "#f4eee4", legs: "#f4eee4", ear: "#27272a", bodyScale: [0.55, 0.62, 0.88], legScale: 1 },
  sheltie: { body: "#47382d", head: "#e6d8bd", legs: "#d4c5a8", ear: "#514137", bodyScale: [0.49, 0.58, 0.82], legScale: 0.88 },
  "australian-shepherd": { body: "#5b6570", head: "#e4d5bd", legs: "#e4d5bd", ear: "#47382d", bodyScale: [0.56, 0.63, 0.88], legScale: 0.98 },
  "golden-retriever": { body: "#c99a52", head: "#e4bd79", legs: "#d8ad6c", ear: "#b98243", bodyScale: [0.59, 0.66, 0.92], legScale: 1.08 },
  labrador: { body: "#49372b", head: "#49372b", legs: "#49372b", ear: "#34271f", bodyScale: [0.62, 0.66, 0.92], legScale: 1.02 },
  "german-shepherd": { body: "#40352b", head: "#b48b56", legs: "#b48b56", ear: "#34271f", bodyScale: [0.58, 0.68, 0.92], legScale: 1.1 },
  "cattle-dog": { body: "#7b8588", head: "#c9c8b9", legs: "#c9c8b9", ear: "#4e5c61", bodyScale: [0.53, 0.61, 0.86], legScale: 0.98 },
  beagle: { body: "#b77842", head: "#f0e5d2", legs: "#f0e5d2", ear: "#70472f", bodyScale: [0.52, 0.58, 0.82], legScale: 0.86 },
  corgi: { body: "#b77842", head: "#f0e5d2", legs: "#f0e5d2", ear: "#70472f", bodyScale: [0.57, 0.52, 0.82], legScale: 0.62 },
  poodle: { body: "#c79a70", head: "#d7b18b", legs: "#c79a70", ear: "#b4865f", bodyScale: [0.5, 0.58, 0.78], legScale: 1.05 },
  dalmatian: { body: "#f0ede6", head: "#f0ede6", legs: "#f0ede6", ear: "#292725", bodyScale: [0.54, 0.62, 0.88], legScale: 1.02 },
  "belgian-shepherd": { body: "#282522", head: "#5b4635", legs: "#5b4635", ear: "#282522", bodyScale: [0.54, 0.65, 0.9], legScale: 1.1 },
  dachshund: { body: "#8c5735", head: "#a56b43", legs: "#8c5735", ear: "#70432c", bodyScale: [0.48, 0.48, 1.02], legScale: 0.58 },
  shiba: { body: "#bc7441", head: "#f1e3ce", legs: "#f1e3ce", ear: "#9b542e", bodyScale: [0.5, 0.57, 0.8], legScale: 0.82 },
  cavalier: { body: "#8d5738", head: "#f0dfc7", legs: "#f0dfc7", ear: "#8d5738", bodyScale: [0.48, 0.55, 0.78], legScale: 0.78 }
};
const DEFAULT_APPEARANCE = DOG_APPEARANCES.sheltie;
function Grass() {
  const blades = useMemo(() => Array.from({ length: 550 }, () => ({ x: (Math.random() - .5) * 26, z: (Math.random() - .5) * 25, h: .12 + Math.random() * .28, r: Math.random() * Math.PI })), []);
  return <group>{blades.map((b, i) => <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.r, .12]}><coneGeometry args={[.035, b.h, 3]}/><meshStandardMaterial color={i % 4 === 0 ? "#8eab72" : "#6f8f59"} roughness={1}/></mesh>)}</group>;
}
function Dog({ active, mode, cameraMode, breedId }: { active: boolean; mode: Mode; cameraMode: "third-person" | "first-person"; breedId: string }) {
  const root = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const legs = useRef<(THREE.Group | null)[]>([]);
  const cameraTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const appearance = DOG_APPEARANCES[breedId] ?? DEFAULT_APPEARANCE;
  const ring = useRef<THREE.Mesh>(null);
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const ringVelocity = useRef(new THREE.Vector3());
  const ringState = useRef<"ready" | "flying" | "returning">("ready");
  const ringAge = useRef(0);
  const lastThrow = useRef(0);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      keys.current[e.key.toLowerCase()] = true;
      if (e.code === "Space" && mode === "puller" && !e.repeat) window.dispatchEvent(new CustomEvent("puller:throw"));
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    const moveControl = (event: Event) => { const detail = (event as CustomEvent<{key:string;pressed:boolean}>).detail; keys.current[detail.key] = detail.pressed; };
    const rotateCamera = (event: PointerEvent) => { if (event.buttons === 1 && event.target instanceof HTMLCanvasElement && root.current) root.current.rotation.y -= event.movementX * 0.004; };
    const throwRing = () => {
      if (!root.current || !ring.current || ringState.current !== "ready") return;
      ringState.current = "flying"; ringAge.current = 0;
      const yaw = root.current.rotation.y;
      ring.current.visible = true;
      ring.current.position.set(root.current.position.x - Math.sin(yaw) * .7, 1.25, root.current.position.z - Math.cos(yaw) * .7);
      ring.current.rotation.set(Math.PI / 2, 0, 0);
      ringVelocity.current.set(-Math.sin(yaw) * 5.5, 4.2, -Math.cos(yaw) * 5.5);
      lastThrow.current = performance.now();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("puller:throw", throwRing);
    window.addEventListener("game:control", moveControl);
    window.addEventListener("pointermove", rotateCamera);
    if (ring.current) ring.current.visible = false;
    return () => {
      window.removeEventListener("keydown", down); window.removeEventListener("keyup", up);
      window.removeEventListener("puller:throw", throwRing);
      window.removeEventListener("game:control", moveControl);
      window.removeEventListener("pointermove", rotateCamera);
    };
  }, [mode]);
  useFrame((state, dt) => {
    if (!root.current) return;
    const k = keys.current;
    const forward = Number(k.w || k.arrowup) - Number(k.s || k.arrowdown);
    const turn = Number(k.a || k.arrowleft) - Number(k.d || k.arrowright);
    if (active) {
      root.current.rotation.y += turn * dt * 1.8;
      const target = forward * (k.shift ? 5.2 : 2.8);
      velocity.current.z = THREE.MathUtils.damp(velocity.current.z, target, 4, dt);
      root.current.position.x -= Math.sin(root.current.rotation.y) * velocity.current.z * dt;
      root.current.position.z -= Math.cos(root.current.rotation.y) * velocity.current.z * dt;
      root.current.position.x = THREE.MathUtils.clamp(root.current.position.x, -11, 11);
      root.current.position.z = THREE.MathUtils.clamp(root.current.position.z, -10, 10);
    }
    root.current.position.y = .03 + Math.abs(velocity.current.z) * .008 * Math.sin(state.clock.elapsedTime * 12);
    const moving = Math.abs(velocity.current.z) > 0.15 && active;
    if (tail.current) tail.current.rotation.x = Math.sin(state.clock.elapsedTime * (moving ? 8 : 5)) * (moving ? .38 : .2);
    const stride = moving ? Math.sin(state.clock.elapsedTime * (Math.abs(velocity.current.z) * 2.5 + 3)) * Math.min(0.65, Math.abs(velocity.current.z) * 0.13) : Math.sin(state.clock.elapsedTime * 2) * 0.025;
    legs.current.forEach((leg, index) => { if (leg) leg.rotation.x = stride * (index % 2 === 0 ? 1 : -1); });
    const yaw = root.current.rotation.y;
    if (cameraMode === "first-person") {
      cameraTarget.current.set(root.current.position.x + Math.sin(yaw) * .12, root.current.position.y + 1.25, root.current.position.z + Math.cos(yaw) * .12);
      lookTarget.current.set(root.current.position.x - Math.sin(yaw) * 4, root.current.position.y + .95, root.current.position.z - Math.cos(yaw) * 4);
      state.camera.position.lerp(cameraTarget.current, 1 - Math.exp(-dt * 5));
      state.camera.lookAt(lookTarget.current);
    } else {
      cameraTarget.current.set(root.current.position.x + 5.8 * Math.sin(yaw + .5), 4.1, root.current.position.z + 7.5 * Math.cos(yaw + .5));
      lookTarget.current.set(root.current.position.x, 1, root.current.position.z);
      state.camera.position.lerp(cameraTarget.current, 1 - Math.exp(-dt * 2.5));
      state.camera.lookAt(lookTarget.current);
    }
    if (ring.current && ringState.current !== "ready") {
      ringAge.current += dt;
      if (ringState.current === "flying") {
        ringVelocity.current.y -= 9.8 * dt;
        ring.current.position.addScaledVector(ringVelocity.current, dt);
        ring.current.rotation.x += dt * 5;
        if (ring.current.position.y < .16) {
          ring.current.position.y = .16;
          ringVelocity.current.y = Math.abs(ringVelocity.current.y) * .38;
          ringVelocity.current.x *= .68; ringVelocity.current.z *= .68;
          if (Math.abs(ringVelocity.current.y) < .8) ringVelocity.current.y = 0;
        }
        const distance = ring.current.position.distanceTo(root.current.position.clone().add(new THREE.Vector3(0, .8, 0)));
        if (distance < 1.05 && ringAge.current > .35) {
          ringState.current = "ready"; ring.current.visible = false;
          window.dispatchEvent(new CustomEvent("puller:caught", { detail: { distance: Math.min(30, Math.hypot(ring.current.position.x-root.current.position.x, ring.current.position.z-root.current.position.z)), airtime: Math.min(3, ringAge.current), returned: true, safeLanding: true } }));
        } else if (ringAge.current > 6 || Math.abs(ring.current.position.x) > 14 || Math.abs(ring.current.position.z) > 14) {
          ringState.current = "returning";
        }
      }
      if (ringState.current === "returning") {
        ring.current.position.lerp(root.current.position.clone().add(new THREE.Vector3(0, .6, 0)), Math.min(1, dt * 1.8));
        if (ring.current.position.distanceTo(root.current.position) < .6) { ringState.current = "ready"; ring.current.visible = false; }
      }
    }
  });
  return <group>
    <group ref={root} position={[0,0,2]}>
      <mesh castShadow position={[0,.67,0]} scale={appearance.bodyScale}><capsuleGeometry args={[.48,.52,5,7]}/><meshStandardMaterial color={appearance.body} roughness={.92}/></mesh>
      <mesh castShadow position={[0,.88,-.62]} scale={[.42,.43,.42]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color={appearance.head} roughness={.9}/></mesh>
      <mesh castShadow position={[0,.93,-.96]} scale={[.29,.22,.28]}><sphereGeometry args={[1,10,7]}/><meshStandardMaterial color={appearance.ear} roughness={.8}/></mesh>
      {[-1,1].map(side => <group key={side}><mesh castShadow position={[side*.23,1.18,-.72]} rotation={[0,0,side*-.25]}><coneGeometry args={[.12,.4,6]}/><meshStandardMaterial color={appearance.ear} roughness={.9}/></mesh><mesh position={[side*.14,1,-.88]}><sphereGeometry args={[.045,8,6]}/><meshStandardMaterial color="#181d19" roughness={.25}/></mesh>{[-1,1].map(front => {
        const index = (side === -1 ? 0 : 1) * 2 + (front === -1 ? 0 : 1);
        return <group key={front} ref={node => { legs.current[index] = node; }} position={[side*.3,.34,front*.43]}>
          <mesh castShadow scale={[1, appearance.legScale, 1]}><capsuleGeometry args={[.09,.3,3,5]}/><meshStandardMaterial color={appearance.legs} roughness={1}/></mesh>
        </group>;
      })}</group>)}
      <group ref={tail} position={[0,.82,.76]}><mesh rotation={[.55,0,0]}><capsuleGeometry args={[.09,.5,4,7]}/><meshStandardMaterial color="#d5c8ad" roughness={.9}/></mesh></group>
      <mesh position={[0,.94,-1.22]}><sphereGeometry args={[.07,12,8]}/><meshStandardMaterial color="#201e1a"/></mesh>
    </group>
    <mesh ref={ring} visible={false} castShadow><torusGeometry args={[.28,.07,12,28]}/><meshStandardMaterial color="#e3b95d" metalness={.35} roughness={.3}/></mesh>
  </group>;
}
function World({ mode, active, cameraMode, breedId }: { mode: Mode; active: boolean; cameraMode: "third-person" | "first-person"; breedId: string }) {
  return <>
    <Sky sunPosition={[80,25,40]} turbidity={7} rayleigh={1.8} />
    <ambientLight intensity={1.1}/><directionalLight castShadow position={[-5,10,4]} intensity={2.1} shadow-mapSize={[1024,1024]}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.05,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#526d48" roughness={1}/></mesh>
    <Grass/>
    <mesh position={[0,.01,-5]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[3.8,4.2,64]}/><meshBasicMaterial color={mode === "puller" ? "#6A00F4" : "#FFD6A5"}/></mesh>
    {Array.from({length:16},(_,i)=><group key={i} position={[(i%4-1.5)*4,0,Math.floor(i/4)*-3-4]}><mesh castShadow position={[0,.45,0]}><cylinderGeometry args={[.13,.17,.9,8]}/><meshStandardMaterial color="#76563d" roughness={1}/></mesh><mesh castShadow position={[0,1.1,0]}><sphereGeometry args={[.65,8,6]}/><meshStandardMaterial color={i%2 ? "#426443" : "#59784b"} roughness={1}/></mesh></group>)}
    <Dog active={active} mode={mode} cameraMode={cameraMode} breedId={breedId}/>
    <ContactShadows position={[0,-.02,0]} opacity={.4} scale={18} blur={2.5} far={4}/>
    <Environment preset="forest"/>
  </>;
}
export default function GameCanvas({ mode, active, cameraMode, quality, breedId }: { mode: Mode; active: boolean; cameraMode: "third-person" | "first-person"; quality: "auto" | "low" | "medium" | "high"; breedId: string }) {
  const lowPowerDevice = typeof navigator !== "undefined" && (
    (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) ||
    (typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches)
  );
  const dpr: [number, number] = quality === "low" ? [0.7, 1] : quality === "medium" ? [1, 1.25] : quality === "high" ? [1, 2] : lowPowerDevice ? [0.7, 1] : [1, 1.5];
  return <Canvas shadows={quality !== "low"} camera={{ position: [5,4,9], fov: 48 }} dpr={dpr} gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}>
    <color attach="background" args={["#b9d1c3"]}/>
    <Suspense fallback={null}><World mode={mode} active={active} cameraMode={cameraMode} breedId={breedId}/></Suspense>
  </Canvas>;
}
