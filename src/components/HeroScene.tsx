import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function AnimatedSphere({ position, color, speed, distort, scale }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={2}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function PawShape() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, 0, 0]} scale={0.6}>
        {/* Main pad */}
        <Sphere args={[0.8, 32, 32]} position={[0, -0.2, 0]} scale={[1, 0.7, 0.8]}>
          <MeshDistortMaterial color="hsl(145, 25%, 50%)" roughness={0.3} metalness={0.7} distort={0.15} speed={2} />
        </Sphere>
        {/* Toes */}
        {[[-0.45, 0.5, 0], [0, 0.7, 0], [0.45, 0.5, 0]].map((pos, i) => (
          <Sphere key={i} args={[0.3, 32, 32]} position={pos as [number, number, number]}>
            <MeshDistortMaterial color="hsl(145, 20%, 42%)" roughness={0.3} metalness={0.7} distort={0.1} speed={1.5} />
          </Sphere>
        ))}
      </group>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-[300px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-3, -3, 2]} intensity={0.5} color="#8ab886" />
          <pointLight position={[3, 3, 2]} intensity={0.3} color="#c49160" />

          <PawShape />

          <AnimatedSphere position={[-2.5, 1.2, -1]} color="#8ab886" speed={1.2} distort={0.3} scale={0.4} />
          <AnimatedSphere position={[2.8, -0.8, -2]} color="#c49160" speed={0.8} distort={0.25} scale={0.35} />
          <AnimatedSphere position={[-1.5, -1.5, -1.5]} color="#7ba9c4" speed={1} distort={0.2} scale={0.3} />

          <Stars radius={80} depth={40} count={200} factor={3} fade speed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
