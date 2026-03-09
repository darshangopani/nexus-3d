import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, TorusKnot, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function TessellateKinetixCyber() {
  const tessellateRef = useRef<THREE.Group>(null);
  const kinetixRef = useRef<THREE.Group>(null);
  const cyberRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate random particles for the quantum data field
  const particlePositions = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical distribution between radius 3.5 and 6.5
      const r = 3.5 + Math.random() * 3;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Tessellate: Slow, steady rotation, breathing geometry
    if (tessellateRef.current) {
      tessellateRef.current.rotation.x = t * 0.1;
      tessellateRef.current.rotation.y = t * 0.15;
      const scale = 1 + Math.sin(t * 2) * 0.03;
      tessellateRef.current.scale.set(scale, scale, scale);
    }

    // Kinetix: Fast, chaotic, energetic rotation
    if (kinetixRef.current) {
      kinetixRef.current.rotation.x = t * 0.6;
      kinetixRef.current.rotation.y = t * 0.8;
      kinetixRef.current.rotation.z = t * 0.4;
    }

    // Cyber Nexus: Futuristic holographic shield rotation
    if (cyberRef.current) {
      cyberRef.current.rotation.y = t * 0.05;
      cyberRef.current.rotation.z = t * 0.02;
    }

    // Particles: Orbiting data cloud
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.08;
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
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

      {/* CYBER NEXUS - The futuristic addition */}
      <group ref={cyberRef}>
        {/* Holographic Data Shield */}
        <Sphere args={[5.5, 32, 32]}>
          <meshPhysicalMaterial 
            color="#818cf8" 
            emissive="#312e81"
            emissiveIntensity={0.5}
            wireframe 
            transparent 
            opacity={0.15} 
            roughness={0}
            metalness={1}
          />
        </Sphere>
        {/* Inner Quantum Grid */}
        <Icosahedron args={[4.5, 1]}>
          <meshStandardMaterial 
            color="#6366f1" 
            wireframe 
            emissive="#4f46e5" 
            emissiveIntensity={0.8} 
            transparent 
            opacity={0.25} 
          />
        </Icosahedron>
      </group>

      {/* QUANTUM DATA FIELD - Floating particles */}
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
          size={0.04} 
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
