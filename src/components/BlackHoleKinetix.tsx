import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { TorusKnot, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

export default function BlackHoleKinetix() {
  const blackHoleRef = useRef<THREE.Group>(null);
  const accretionDiskRef = useRef<THREE.Group>(null);
  const kinetixRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particles for the accretion disk and surrounding space
  const particlePositions = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Swirling disk distribution
      const r = 2.2 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      // Flatten the y-axis for the disk, with some variance
      const y = (Math.random() - 0.5) * (2.0 / r); 
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Black Hole subtle pulse
    if (blackHoleRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.02;
      blackHoleRef.current.scale.set(scale, scale, scale);
    }

    // Accretion Disk fast rotation
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.y = t * 0.8;
      // Gentle wobble
      accretionDiskRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      accretionDiskRef.current.rotation.x = Math.cos(t * 0.3) * 0.15;
    }

    // Kinetix: Fast, chaotic, energetic rotation
    if (kinetixRef.current) {
      kinetixRef.current.rotation.x = t * 0.5;
      kinetixRef.current.rotation.y = t * 0.7;
      kinetixRef.current.rotation.z = t * 0.3;
    }

    // Particles swirling
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.4;
      // Tilt the particle disk to match the accretion disk roughly
      particlesRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      particlesRef.current.rotation.x = Math.cos(t * 0.3) * 0.15;
    }
  });

  return (
    <group>
      {/* BLACK HOLE CORE */}
      <group ref={blackHoleRef}>
        {/* The Void - Pure Black */}
        <Sphere args={[1.8, 64, 64]}>
          <meshBasicMaterial color="#000000" />
        </Sphere>
        {/* Event Horizon Glow (Photon Sphere) */}
        <Sphere args={[1.95, 64, 64]}>
          <meshBasicMaterial 
            color="#c026d3" 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide}
          />
        </Sphere>
        <Sphere args={[2.2, 64, 64]}>
          <meshBasicMaterial 
            color="#4f46e5" 
            transparent 
            opacity={0.1} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide}
          />
        </Sphere>
      </group>

      {/* ACCRETION DISK */}
      <group ref={accretionDiskRef}>
        {/* Inner hot ring */}
        <Torus args={[2.2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </Torus>
        {/* Main glowing disk */}
        <Torus args={[3.0, 0.6, 16, 100]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.05]}>
          <meshBasicMaterial color="#f472b6" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </Torus>
        {/* Outer fading disk */}
        <Torus args={[4.5, 1.2, 16, 100]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.02]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </Torus>
      </group>

      {/* KINETIX - The dynamic, fast-moving energy field */}
      <group ref={kinetixRef}>
        <TorusKnot args={[3.8, 0.03, 128, 16]}>
          <meshBasicMaterial color="#f472b6" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </TorusKnot>
        <TorusKnot args={[3.8, 0.03, 128, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#c026d3" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </TorusKnot>
      </group>

      {/* QUANTUM DATA FIELD - Swirling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.03} 
          color="#38bdf8" 
          transparent 
          opacity={0.8} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
