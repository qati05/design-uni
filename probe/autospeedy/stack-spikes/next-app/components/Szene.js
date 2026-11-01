"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function Blech() {
  const ref = useRef();
  useFrame((_, d) => { ref.current.rotation.y += d * 0.35; });
  return (
    <mesh ref={ref} rotation={[0.15, 0.4, 0]}>
      <boxGeometry args={[2.6, 1.5, 0.1]} />
      <meshPhysicalMaterial color="#243145" metalness={0.65} roughness={0.28} clearcoat={1} clearcoatRoughness={0.04} />
    </mesh>
  );
}
function Umgebung() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => { tex.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
}
export default function Szene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <Umgebung />
      <Blech />
    </Canvas>
  );
}
