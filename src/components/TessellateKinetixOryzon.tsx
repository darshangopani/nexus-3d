import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, TorusKnot, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function TessellateKinetixOryzon() {
  const tessellateRef = useRef<THREE.Group>(null);
  const kinetixRef = useRef<THREE.Group>(null);
  const oryzonRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Tessellate: Slow, steady rotation, breathing geometry
    if (tessellateRef.current) {
      tessellateRef.current.rotation.x = t * 0.1;
      tessellateRef.current.rotation.y = t * 0.15;
      // Subtle breathing effect
      const scale = 1 + Math.sin(t * 2) * 0.03;
      tessellateRef.current.scale.set(scale, scale, scale);
    }

    // Kinetix: Fast, chaotic, energetic rotation
    if (kinetixRef.current) {
      kinetixRef.current.rotation.x = t * 0.6;
      kinetixRef.current.rotation.y = t * 0.8;
      kinetixRef.current.rotation.z = t * 0.4;
    }

    // Oryzon: Massive, slow, majestic horizon tilt
    if (oryzonRef.current) {
      oryzonRef.current.rotation.z = t * 0.05;
      // Gentle oscillation of the horizon
      oryzonRef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group>
      {/* TESSELLATE - The structured, geometric core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={tessellateRef}>
          {/* Solid inner tessellation */}
          <Icosahedron args={[1.5, 2]}>
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </Icosahedron>
          {/* Glowing wireframe tessellation overlay */}
          <Icosahedron args={[1.51, 2]}>
            <meshStandardMaterial 
              color="#38bdf8" 
              wireframe 
              emissive="#38bdf8" 
              emissiveIntensity={0.8} 
              transparent 
              opacity={0.4} 
            />
          </Icosahedron>
        </group>
      </Float>

      {/* KINETIX - The dynamic, fast-moving energy field */}
      <group ref={kinetixRef}>
        <TorusKnot args={[2.4, 0.04, 128, 16]}>
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
        </TorusKnot>
        <TorusKnot args={[2.4, 0.04, 128, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={1.5} />
        </TorusKnot>
      </group>

      {/* ORYZON - The expansive, glowing horizon */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={oryzonRef}>
          {/* Main distorted horizon ring */}
          <Torus args={[5, 0.15, 32, 100]}>
            <MeshDistortMaterial 
              color="#1e1b4b" 
              emissive="#4338ca" 
              emissiveIntensity={0.8} 
              distort={0.2} 
              speed={2} 
              roughness={0.2} 
              metalness={0.8} 
            />
          </Torus>
          {/* Secondary sharp horizon ring */}
          <Torus args={[5.4, 0.02, 16, 100]}>
            <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={1} transparent opacity={0.6} />
          </Torus>
          {/* Tertiary faint horizon ring */}
          <Torus args={[5.8, 0.01, 16, 100]}>
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.3} />
          </Torus>
        </group>
      </Float>
    </group>
  );
}
