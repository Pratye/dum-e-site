"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type WalkData = {
  fps: number; frames: number; cmd_mps: number;
  root_x: number[]; vx: number[]; contact: number[][];
  tracks: Record<string, number[][]>;
};

// Electronics and the parallel-ankle linkage carry the accent; everything else is structure.
const ACCENT = /battery|compute|ankle_(cranks|rods|cross)/i;
const GLB = "/models/dume_v3.glb";

function Robot({ data, frame }: { data: WalkData; frame: React.RefObject<number> }) {
  const { scene } = useGLTF(GLB);

  // One flat Float32Array per part: [px, py, pz, qx, qy, qz, qw] per frame, metres, Z-up. Held in a ref because these
  // three.js objects are mutated every frame, which is not something a memoised value may be.
  const parts = useRef<{ obj: THREE.Object3D; tr: Float32Array }[]>([]);
  useEffect(() => {
    const out: { obj: THREE.Object3D; tr: Float32Array }[] = [];
    scene.traverse((obj) => {
      const tr = data.tracks[obj.name];
      if (!tr || obj === scene) return;
      obj.matrixAutoUpdate = false;               // the matrix is written directly each frame
      out.push({ obj, tr: Float32Array.from(tr.flat()) });
    });
    parts.current = out;
  }, [scene, data]);

  useEffect(() => {
    const structure = new THREE.MeshStandardMaterial({ color: "#E4E8F0", roughness: 0.42, metalness: 0.32 });
    const accent = new THREE.MeshStandardMaterial({ color: "#4C7DFF", roughness: 0.35, metalness: 0.2, emissive: "#1d3fa8", emissiveIntensity: 0.35 });
    scene.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) { m.material = ACCENT.test(m.name) ? accent : structure; m.castShadow = true; }
    });
  }, [scene]);

  const tmp = useRef({ p: new THREE.Vector3(), q0: new THREE.Quaternion(), q1: new THREE.Quaternion(), s: new THREE.Vector3(0.001, 0.001, 0.001) });
  useFrame(() => {
    const f = Math.max(0, Math.min(frame.current ?? 0, data.frames - 1));
    const i = Math.min(Math.floor(f), data.frames - 2), a = f - i;
    const { p, q0, q1, s } = tmp.current;
    for (const { obj, tr } of parts.current) {
      const o = i * 7, n = o + 7;
      p.set(tr[o] + (tr[n] - tr[o]) * a, tr[o + 1] + (tr[n + 1] - tr[o + 1]) * a, tr[o + 2] + (tr[n + 2] - tr[o + 2]) * a);
      q0.set(tr[o + 3], tr[o + 4], tr[o + 5], tr[o + 6]);
      q1.set(tr[n + 3], tr[n + 4], tr[n + 5], tr[n + 6]);
      q0.slerp(q1, a);
      obj.matrix.compose(p, q0, s);           // v_world = R * (0.001 * v_design_mm) + p
      obj.updateMatrixWorld(true);           // matrixAutoUpdate is off, so push the new matrix to the world matrix now
    }
  });

  // CAD and the simulation are Z-up; three.js is Y-up. -90 deg about X sends +Z to +Y.
  return <group rotation={[-Math.PI / 2, 0, 0]}><primitive object={scene} /></group>;
}

/** The floor slides under the robot so it walks in place while the ground shows real distance covered. */
function Floor({ data, frame }: { data: WalkData; frame: React.RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const i = Math.round(Math.max(0, Math.min(frame.current ?? 0, data.frames - 1)));
    g.current.position.x = -((data.root_x[i] - data.root_x[0]) % 0.5);
  });
  return (
    <group ref={g}>
      <Grid
        infiniteGrid
        cellSize={0.1}
        sectionSize={0.5}
        cellColor="#1E2F63"
        sectionColor="#35539F"
        cellThickness={0.6}
        sectionThickness={1}
        fadeDistance={11}
        fadeStrength={1.6}
        followCamera={false}
      />
    </group>
  );
}


/** Aim the camera left of the robot on wide screens so it stands to the right of the headline. */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const shift = aspect > 1.25 ? Math.min(0.75, (aspect - 1.25) * 0.55 + 0.35) : 0;   // metres, sideways
    const base = new THREE.Vector3(0, 0.6, 0);
    camera.position.set(2.25, 1.05, 2.35);
    const fwd = base.clone().sub(camera.position).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    camera.lookAt(base.sub(right.multiplyScalar(shift)));
  }, [camera, size]);
  return null;
}

export default function WalkCanvas({ data, frame }: { data: WalkData; frame: React.RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [2.25, 1.05, 2.35], fov: 30, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <hemisphereLight args={["#cfdcff", "#0a1530", 0.9]} />
      <directionalLight position={[3, 5, 2]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#7da2ff" />
      <Suspense fallback={null}>
        <Robot data={data} frame={frame} />
      </Suspense>
      <Floor data={data} frame={frame} />
      <CameraRig />
    </Canvas>
  );
}

useGLTF.preload(GLB);
