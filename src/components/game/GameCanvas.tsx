"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Mode = "world" | "school" | "puller";
function Grass() {
  const blades = useMemo(() => Array.from({ length: 550 }, (_, i) => ({ x: (Math.random() - .5) * 26, z: (Math.random() - .5) * 25, h: .12 + Math.random() * .28, r: Math.random() * Math.PI })), []);
  return <group>{blades.map((b, i) => <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.r, .12]}><coneGeometry args={[.035, b.h, 3]}/><meshStandardMaterial color={i % 4 === 0 ? "#73945a" : "#526f43"} roughness={1}/></mesh>)}</group>;
}
function Dog({ active }: { active: boolean }) {
  const root = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);
  useFrame((state, dt) => {
    if (!root.current) return;
    const k = keys.current; const forward = Number(k.w || k.arrowup) - Number(k.s || k.arrowdown); const turn = Number(k.a || k.arrowleft) - Number(k.d || k.arrowright);
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
    if (tail.current) tail.current.rotation.x = Math.sin(state.clock.elapsedTime * 5) * .28;
    state.camera.position.lerp(new THREE.Vector3(root.current.position.x + 5.8 * Math.sin(root.current.rotation.y + .5), 4.1, root.current.position.z + 7.5 * Math.cos(root.current.rotation.y + .5)), 1 - Math.exp(-dt * 2.5));
    state.camera.lookAt(root.current.position.x, 1, root.current.position.z);
  });
  return <group ref={root} position={[0,0,2]}>
    <mesh castShadow position={[0,.67,0]} scale={[.55,.62,.88]}><capsuleGeometry args={[.48,.52,6,10]}/><meshStandardMaterial color="#d5c8ad" roughness={.92}/></mesh>
    <mesh castShadow position={[0,.88,-.62]} scale={[.42,.43,.42]}><sphereGeometry args={[1,20,16]}/><meshStandardMaterial color="#e6d8bd" roughness={.9}/></mesh>
    <mesh castShadow position={[0,.93,-.96]} scale={[.29,.22,.28]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#47382d" roughness={.8}/></mesh>
    {[-1,1].map(side => <group key={side}><mesh castShadow position={[side*.23,1.18,-.72]} rotation={[0,0,side*-.25]}><coneGeometry args={[.12,.4,8]}/><meshStandardMaterial color="#514137" roughness={.9}/></mesh><mesh position={[side*.14,1,-.88]}><sphereGeometry args={[.045,10,8]}/><meshStandardMaterial color="#181d19" roughness={.25}/></mesh>{[-1,1].map(front => <mesh key={front} castShadow position={[side*.3,.28,front*.43]}><capsuleGeometry args={[.09,.3,4,6]}/><meshStandardMaterial color="#d4c5a8" roughness={1}/></mesh>)}</group>)}
    <group ref={tail} position={[0,.82,.76]}><mesh rotation={[.55,0,0]}><capsuleGeometry args={[.09,.5,4,7]}/><meshStandardMaterial color="#d5c8ad" roughness={.9}/></mesh></group>
    <mesh position={[0,.94,-1.22]}><sphereGeometry args={[.07,12,8]}/><meshStandardMaterial color="#201e1a"/></mesh>
  </group>;
}
function World({ mode, active }: { mode: Mode; active: boolean }) {
  return <>
    <Sky sunPosition={[80,25,40]} turbidity={7} rayleigh={1.8} />
    <ambientLight intensity={1.1}/><directionalLight castShadow position={[-5,10,4]} intensity={2.1} shadow-mapSize={[1024,1024]}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.05,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#526d48" roughness={1}/></mesh>
    <Grass/>
    <mesh position={[0,.01,-5]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[3.8,4.2,64]}/><meshBasicMaterial color={mode === "puller" ? "#d8b45c" : "#d7dfc4"}/></mesh>
    {Array.from({length:16},(_,i)=><group key={i} position={[(i%4-1.5)*4,0,Math.floor(i/4)*-3-4]}><mesh castShadow position={[0,.45,0]}><cylinderGeometry args={[.13,.17,.9,8]}/><meshStandardMaterial color="#76563d" roughness={1}/></mesh><mesh castShadow position={[0,1.1,0]}><sphereGeometry args={[.65,8,6]}/><meshStandardMaterial color={i%2 ? "#426443" : "#59784b"} roughness={1}/></mesh></group>)}
    <Dog active={active}/>
    <ContactShadows position={[0,-.02,0]} opacity={.4} scale={18} blur={2.5} far={4}/>
    <Environment preset="forest"/>
  </>;
}
export default function GameCanvas({ mode, active }: { mode: Mode; active: boolean }) {
  return <Canvas shadows camera={{ position: [5,4,9], fov: 48 }} dpr={[1,1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
    <color attach="background" args={["#b9d1c3"]}/>
    <Suspense fallback={null}><World mode={mode} active={active}/></Suspense>
  </Canvas>;
}
