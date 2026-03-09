import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Plasma() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const { viewport } = useThree();

  useFrame(({ clock, mouse }) => {
    if (sphereRef.current) {
      // Rotate slowly
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;

      // Move towards mouse smoothly
      const targetX = (mouse.x * viewport.width) / 8;
      const targetY = (mouse.y * viewport.height) / 8;
      
      sphereRef.current.position.x += (targetX - sphereRef.current.position.x) * 0.05;
      sphereRef.current.position.y += (targetY - sphereRef.current.position.y) * 0.05;
    }
    
    if (materialRef.current) {
      // Pulse distortion
      materialRef.current.distort = 0.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 128, 128]} scale={2.8}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#c026d3"
        emissive="#4f46e5"
        emissiveIntensity={0.8}
        attach="material"
        distort={0.6}
        speed={3}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}
