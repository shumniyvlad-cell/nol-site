"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ZeroPortalSceneProps = {
  active: boolean;
  onReady: () => void;
};

type PortalCloudProps = {
  positions: Float32Array;
  opacity: number;
  pointSize: number;
  scale?: [number, number, number];
};

function createSeededRandom(seedValue: number) {
  let seed = seedValue >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function buildPortalPositions(count: number, seedValue: number) {
  const random = createSeededRandom(seedValue);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const turbulence = (random() - 0.5) * 0.1;
    const radiusX = 1.17 + (random() - 0.5) * 0.12;
    const radiusY = 1.86 + (random() - 0.5) * 0.15;

    positions[index * 3] = Math.cos(angle) * radiusX + turbulence;
    positions[index * 3 + 1] = Math.sin(angle) * radiusY + 0.28;
    positions[index * 3 + 2] = (random() - 0.5) * 0.34;
  }

  return positions;
}

function buildMistPositions(count: number) {
  const random = createSeededRandom(71);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * 4.6;
    positions[index * 3 + 1] = -1.45 + random() * 0.38;
    positions[index * 3 + 2] = (random() - 0.5) * 0.8;
  }

  return positions;
}

function PortalCloud({
  positions,
  opacity,
  pointSize,
  scale = [1, 1, 1],
}: PortalCloudProps) {
  return (
    <points scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
        />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color="#ffffff"
        depthWrite={false}
        opacity={opacity}
        size={pointSize}
        sizeAttenuation
        transparent
      />
    </points>
  );
}

function PortalAssembly() {
  const groupRef = useRef<THREE.Group>(null);
  const portalPositions = useMemo(
    () => buildPortalPositions(2600, 29),
    [],
  );
  const haloPositions = useMemo(() => buildPortalPositions(1100, 53), []);
  const mistPositions = useMemo(() => buildMistPositions(850), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const targetRotation = state.pointer.x * 0.055;
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      targetRotation,
      1.9,
      delta,
    );
    const breath = 1 + Math.sin(elapsed * 0.42) * 0.008;
    group.scale.setScalar(breath);
  });

  return (
    <group position={[2.15, 0.08, 0]} ref={groupRef}>
      <PortalCloud
        opacity={0.82}
        pointSize={0.022}
        positions={portalPositions}
      />
      <PortalCloud
        opacity={0.24}
        pointSize={0.034}
        positions={haloPositions}
        scale={[1.08, 1.05, 1]}
      />
      <group position={[0, -2.34, 0]} scale={[1, -0.42, 1]}>
        <PortalCloud
          opacity={0.17}
          pointSize={0.025}
          positions={portalPositions}
        />
      </group>
      <PortalCloud
        opacity={0.18}
        pointSize={0.028}
        positions={mistPositions}
      />
    </group>
  );
}

export function ZeroPortalScene({ active, onReady }: ZeroPortalSceneProps) {
  return (
    <Canvas
      camera={{ fov: 43, position: [0, 0.08, 7.6] }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        onReady();
      }}
    >
      <PortalAssembly />
    </Canvas>
  );
}
