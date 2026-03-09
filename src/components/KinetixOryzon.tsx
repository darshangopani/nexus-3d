import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function KinetixOryzon() {
  const kinetixRef = useRef<THREE.Group>(null);
  const oryzonRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Animate Kinetix (Inner dynamic core)
    if (kinetixRef.current) {
      kinetixRef.current.rotation.x = t * 0.2;
      kinetixRef.current.rotation.y = t * 0.3;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.2;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.3;
      ring2Ref.current.rotation.z = t * 0.4;
    }

    // Animate Oryzon (Outer horizon ring)
    if (oryzonRef.current) {
      oryzonRef.current.rotation.z = t * 0.1;
      // Gentle tilt oscillation
      oryzonRef.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Kinetix - The dynamic, kinetic energy core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <group ref={kinetixRef} position={[0, 0, 0]}>
          {/* Inner solid geometry */}
          <Icosahedron args={[1, 0]} scale={1}>
            <meshStandardMaterial color="#c026d3" roughness={0.2} metalness={0.8} />
          </Icosahedron>
          
          {/* Outer wireframe geometry */}
          <Icosahedron args={[1.2, 1]} scale={1}>
            <meshStandardMaterial color="#4f46e5" wireframe={true} emissive="#4f46e5" emissiveIntensity={0.8} />
          </Icosahedron>

          {/* Kinetic Rings */}
          <Torus ref={ring1Ref} args={[1.8, 0.02, 16, 100]}>
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
          </Torus>
          <Torus ref={ring2Ref} args={[1.8, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1.5} />
          </Torus>
        </group>
      </Float>

      {/* Oryzon - The expansive, glowing horizon */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Torus ref={oryzonRef} args={[3.8, 0.15, 32, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <MeshDistortMaterial 
            color="#1e1b4b" 
            emissive="#4338ca" 
            emissiveIntensity={0.6} 
            distort={0.15} 
            speed={2} 
            roughness={0.1} 
            metalness={0.9} 
          />
        </Torus>
        
        {/* Subtle secondary Oryzon ring */}
        <Torus args={[4.2, 0.01, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.5} opacity={0.5} transparent />
        </Torus>
      </Float>
    </group>
  );
}
