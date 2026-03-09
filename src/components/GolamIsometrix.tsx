import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Float, Edges, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

export default function GolamIsometrix() {
  const golamRef = useRef<THREE.Group>(null);
  const isometrixRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Animate Golam (The central blocky entity)
    if (golamRef.current) {
      golamRef.current.position.y = Math.sin(t * 1.5) * 0.2;
      // Gentle breathing/rotation
      golamRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      golamRef.current.rotation.x = Math.sin(t * 0.4) * 0.1;
    }

    // Animate Isometrix (The surrounding geometric matrix)
    if (isometrixRef.current) {
      isometrixRef.current.rotation.y = t * 0.15;
      isometrixRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <group>
      {/* GOLAM - The Central Construct */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={golamRef} position={[0, 0, 0]}>
          {/* Core / Torso */}
          <Box args={[1.5, 2, 1.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            <Edges color="#38bdf8" />
          </Box>
          
          {/* Head / Processor */}
          <Box args={[0.8, 0.8, 0.8]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#1e1b4b" emissive="#c026d3" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
            <Edges color="#f472b6" />
          </Box>

          {/* Left Arm / Node */}
          <Box args={[0.6, 1.5, 0.6]} position={[-1.4, 0.2, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            <Edges color="#818cf8" />
          </Box>

          {/* Right Arm / Node */}
          <Box args={[0.6, 1.5, 0.6]} position={[1.4, 0.2, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            <Edges color="#818cf8" />
          </Box>
          
          {/* Floating Energy Core inside Torso */}
          <Icosahedron args={[0.4, 0]} position={[0, 0, 0.8]}>
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
          </Icosahedron>
        </group>
      </Float>

      {/* ISOMETRIX - The Geometric Field */}
      <group ref={isometrixRef}>
        {Array.from({ length: 40 }).map((_, i) => {
          const radius = 4 + Math.random() * 5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);
          
          const scale = Math.random() * 0.5 + 0.1;
          
          return (
            <Float key={i} speed={1.5} rotationIntensity={2} floatIntensity={2}>
              <Box args={[scale, scale, scale]} position={[x, y, z]}>
                <meshStandardMaterial 
                  color="#1e1b4b" 
                  emissive="#4338ca" 
                  emissiveIntensity={Math.random() > 0.8 ? 1 : 0.2} 
                  wireframe={Math.random() > 0.6} 
                  transparent
                  opacity={0.8}
                />
                <Edges color="#6366f1" />
              </Box>
            </Float>
          );
        })}
      </group>
    </group>
  );
}
