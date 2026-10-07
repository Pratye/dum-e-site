"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

const DRACO = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

// Parts that carry the electronics or the parallel-ankle linkage are drawn in the brand orange, so the
// structure reads as white metal and the engineering reads as the accent.
const ACCENT = /battery|compute|ankle_(cranks|rods|cross)/i;

function RobotModel({
  src,
  orbitRef,
}: {
  src: string;
  orbitRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { scene } = useGLTF(src, DRACO);
  const spinRef  = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);

  // White metallic for structure, orange for the electronics and ankle linkage
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const accent = ACCENT.test(mesh.name) || ACCENT.test(mesh.parent?.name ?? "");
        mesh.material = new THREE.MeshStandardMaterial({
          color: accent ? "#ff6600" : "#f5f0e8",
          emissive: accent ? "#ff3300" : "#2a1000",
          emissiveIntensity: accent ? 0.18 : 0.1,
          roughness: accent ? 0.38 : 0.26,
          metalness: accent ? 0.45 : 0.74,
        });
        mesh.castShadow = true;
      }
    });
  }, [scene]);

  // After mount: scale to fit, center at origin, auto-position camera
  useEffect(() => {
    const outer = outerRef.current;
    const orbit = orbitRef.current;
    if (!outer || !orbit) return;

    // 1. Raw bounds before any scale
    outer.updateWorldMatrix(true, true);
    const raw = new THREE.Box3().setFromObject(outer);
    const rawSize = new THREE.Vector3();
    raw.getSize(rawSize);
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
    if (maxDim === 0) return;

    // 2. Scale spin group so model fits a 100-unit cube
    if (spinRef.current) spinRef.current.scale.setScalar(100 / maxDim);

    // 3. Re-measure after scale
    outer.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(outer);
    const center = new THREE.Vector3();
    const size   = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // 4. Center the group at world origin
    outer.position.sub(center);

    // 5. Auto-fit camera: push back far enough to see the full model
    //    distance = (half-height / tan(halfFov)) * padding
    const halfH   = size.y / 2;
    const halfFov = (36 * Math.PI) / 180 / 2;     // matches canvas fov=36
    const dist    = (halfH / Math.tan(halfFov)) * 1.55;
    orbit.object.position.set(0, 0, dist * 0.9);
    orbit.target.set(0, 0, 0);                      // the group was centred on the origin above, so look at the middle of it
    orbit.minDistance = dist * 0.4;
    orbit.maxDistance = dist * 3;
    orbit.update();
  }, [scene, orbitRef]);

  // Slow Z-axis spin
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.z += delta * 0.22;
  });

  return (
    // CAD Z-up → Three.js Y-up: rotate -90° about X, which sends +Z (up) to +Y. (+90° would stand the robot on its head.)
    <group ref={outerRef} rotation={[-Math.PI / 2, 0, 0]}>
      {/* spinRef holds scale + rotation around vertical axis */}
      <group ref={spinRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="loader-ring" />
      <p
        className="text-[0.72rem] uppercase tracking-[0.18em]"
        style={{ color: "rgba(255,102,0,0.6)" }}
      >
        Loading prototype…
      </p>
    </div>
  );
}

export default function RobotViewer({ src = "/models/dume_v3.glb" }: { src?: string }) {
  const orbitRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="relative w-full" style={{ height: "min(74vh, 680px)" }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, -30, 340], fov: 36, near: 0.1, far: 5000 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          shadows
        >
          <directionalLight position={[100, 160, 120]} intensity={2.2} color="#fff8f0" castShadow />
          <directionalLight position={[-80, 40, 60]}   intensity={0.7} color="#ffe8d6" />
          <pointLight position={[0, 80, -150]}  intensity={1.6} color="#ff6600" />
          <pointLight position={[0, -80, 60]}   intensity={0.3} color="#ffddaa" />
          <ambientLight intensity={0.4} />

          <Environment preset="warehouse" />

          <RobotModel src={src} orbitRef={orbitRef} />

          <OrbitControls
            ref={orbitRef}
            enableZoom
            enablePan
            screenSpacePanning
            mouseButtons={{
              LEFT:   0,   // ROTATE
              MIDDLE: 1,   // DOLLY
              RIGHT:  2,   // PAN
            }}
            autoRotate={false}
          />
        </Canvas>
      </Suspense>

      <p
        className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[0.62rem] uppercase tracking-[0.16em] whitespace-nowrap"
        style={{ color: "rgba(255,102,0,0.4)" }}
      >
        Left drag to rotate · Right drag to pan · Scroll to zoom
      </p>
    </div>
  );
}
