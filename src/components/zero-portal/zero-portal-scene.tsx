"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ZeroPortalSceneProps = {
  active: boolean;
  assembleOnLoad: boolean;
  onReady: () => void;
};

type PortalCloudProps = {
  data: PortalData;
  assembleOnLoad: boolean;
  opacity: number;
  pointSize: number;
  scale?: [number, number, number];
};

type PortalData = {
  phases: Float32Array;
  positions: Float32Array;
  scatterPositions: Float32Array;
};

function createSeededRandom(seedValue: number) {
  let seed = seedValue >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function buildPortalData(count: number, seedValue: number): PortalData {
  const random = createSeededRandom(seedValue);
  const positions = new Float32Array(count * 3);
  const scatterPositions = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const turbulence = (random() - 0.5) * 0.1;
    const radiusX = 1.17 + (random() - 0.5) * 0.12;
    const radiusY = 1.86 + (random() - 0.5) * 0.15;

    positions[index * 3] = Math.cos(angle) * radiusX + turbulence;
    positions[index * 3 + 1] = Math.sin(angle) * radiusY + 0.28;
    positions[index * 3 + 2] = (random() - 0.5) * 0.34;

    const scatterAngle = angle + (random() - 0.5) * 1.7;
    const scatterRadius = 1.7 + random() * 2.3;
    scatterPositions[index * 3] =
      Math.cos(scatterAngle) * scatterRadius + (random() - 0.5) * 0.7;
    scatterPositions[index * 3 + 1] =
      Math.sin(scatterAngle) * scatterRadius * 0.8 +
      0.18 +
      (random() - 0.5) * 0.8;
    scatterPositions[index * 3 + 2] = (random() - 0.5) * 1.8;
    phases[index] = random();
  }

  return { phases, positions, scatterPositions };
}

function buildMistData(count: number): PortalData {
  const random = createSeededRandom(71);
  const positions = new Float32Array(count * 3);
  const scatterPositions = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * 4.6;
    positions[index * 3 + 1] = -1.45 + random() * 0.38;
    positions[index * 3 + 2] = (random() - 0.5) * 0.8;
    scatterPositions[index * 3] = positions[index * 3] * 1.35;
    scatterPositions[index * 3 + 1] =
      positions[index * 3 + 1] - 0.4 - random() * 0.5;
    scatterPositions[index * 3 + 2] = (random() - 0.5) * 1.5;
    phases[index] = random();
  }

  return { phases, positions, scatterPositions };
}

function PortalCloud({
  data,
  assembleOnLoad,
  opacity,
  pointSize,
  scale = [1, 1, 1],
}: PortalCloudProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uAssembly: { value: assembleOnLoad ? 0 : 1 },
      uDensity: { value: 1 },
      uOpacity: { value: opacity },
      uPointSize: { value: pointSize },
      uPointer: { value: 0 },
      uTime: { value: 0 },
    }),
    [assembleOnLoad, opacity, pointSize],
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const assembly = assembleOnLoad
      ? THREE.MathUtils.smoothstep(elapsed, 0.14, 1.16)
      : 1;
    material.uniforms.uAssembly.value = assembly;
    material.uniforms.uDensity.value =
      0.96 + Math.sin(elapsed * 0.46) * 0.035;
    material.uniforms.uPointer.value = state.pointer.x;
    material.uniforms.uTime.value = elapsed;
  });

  return (
    <points scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          args={[data.positions, 3]}
          attach="attributes-position"
        />
        <bufferAttribute
          args={[data.scatterPositions, 3]}
          attach="attributes-aScatter"
        />
        <bufferAttribute
          args={[data.phases, 1]}
          attach="attributes-aPhase"
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={`
          uniform float uDensity;
          uniform float uOpacity;
          varying float vPulse;

          void main() {
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            float particle = smoothstep(0.5, 0.08, distanceToCenter);
            float alpha = particle * uOpacity * uDensity * vPulse;
            gl_FragColor = vec4(vec3(0.98, 0.99, 1.0), alpha);
          }
        `}
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          attribute float aPhase;
          attribute vec3 aScatter;
          uniform float uAssembly;
          uniform float uPointSize;
          uniform float uPointer;
          uniform float uTime;
          varying float vPulse;

          void main() {
            float phase = aPhase * 6.28318530718;
            float easedAssembly = uAssembly * uAssembly * (3.0 - 2.0 * uAssembly);
            vec3 transformed = mix(aScatter, position, easedAssembly);
            vec2 radial = normalize(vec2(position.x, position.y - 0.28) + vec2(0.0001));
            float drift = sin(uTime * 0.44 + phase) * 0.018 * easedAssembly;
            transformed.xy += radial * drift;
            transformed.z += sin(uTime * 0.31 + phase * 1.7) * 0.026 * easedAssembly;
            transformed.x += uPointer * (0.022 + abs(transformed.z) * 0.018);

            vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;
            gl_PointSize = uPointSize * (310.0 / -viewPosition.z);
            vPulse = 0.86 + 0.14 * sin(uTime * 0.38 + phase);
          }
        `}
      />
    </points>
  );
}

function PortalAssembly({ assembleOnLoad }: Pick<ZeroPortalSceneProps, "assembleOnLoad">) {
  const groupRef = useRef<THREE.Group>(null);
  const portalData = useMemo(() => buildPortalData(2600, 29), []);
  const haloData = useMemo(() => buildPortalData(1100, 53), []);
  const mistData = useMemo(() => buildMistData(850), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const targetRotation = state.pointer.x * 0.038;
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      targetRotation,
      1.6,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      state.pointer.y * -0.012,
      1.6,
      delta,
    );
    const breath = 1 + Math.sin(elapsed * 0.42) * 0.006;
    group.scale.setScalar(breath);
  });

  return (
    <group position={[2.15, 0.08, 0]} ref={groupRef}>
      <PortalCloud
        assembleOnLoad={assembleOnLoad}
        data={portalData}
        opacity={0.82}
        pointSize={0.043}
      />
      <PortalCloud
        assembleOnLoad={assembleOnLoad}
        data={haloData}
        opacity={0.24}
        pointSize={0.062}
        scale={[1.08, 1.05, 1]}
      />
      <group position={[0, -2.34, 0]} scale={[1, -0.42, 1]}>
        <PortalCloud
          assembleOnLoad={assembleOnLoad}
          data={portalData}
          opacity={0.17}
          pointSize={0.047}
        />
      </group>
      <PortalCloud
        assembleOnLoad={assembleOnLoad}
        data={mistData}
        opacity={0.18}
        pointSize={0.054}
      />
    </group>
  );
}

export function ZeroPortalScene({
  active,
  assembleOnLoad,
  onReady,
}: ZeroPortalSceneProps) {
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
      <PortalAssembly assembleOnLoad={assembleOnLoad} />
    </Canvas>
  );
}
