import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function RealisticBlackHole() {
  const diskRef = useRef<THREE.Points>(null);
  const masterGroupRef = useRef<THREE.Group>(null);

  // Particle texture for the dusty, fiery accretion disk
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
      gradient.addColorStop(0.5, 'rgba(200, 100, 50, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const { positions, colors, sizes, angles } = useMemo(() => {
    const count = 80000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const angles = new Float32Array(count);

    const colorInner = new THREE.Color("#ffffff"); // White hot near the event horizon
    const colorMid = new THREE.Color("#ffaa00");   // Bright fiery orange/yellow in the middle
    const colorOuter = new THREE.Color("#883300"); // Darker orange/brown dust on the edges

    for (let i = 0; i < count; i++) {
      // Accretion disk distribution (denser near the center)
      const r = 2.05 + Math.pow(Math.random(), 3.0) * 12;
      const theta = Math.random() * 2 * Math.PI;
      
      // Thickness of the disk (thinner near the center, slightly thicker at edges)
      const y = (Math.random() - 0.5) * (0.4 / (r - 1.2));

      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);

      angles[i] = theta;

      const mixedColor = new THREE.Color();
      if (r < 3.5) mixedColor.lerpColors(colorInner, colorMid, (r - 2.05) / 1.45);
      else mixedColor.lerpColors(colorMid, colorOuter, (r - 3.5) / 8.5);

      // Add some noise to the colors
      const brightness = 0.7 + Math.random() * 0.5;
      mixedColor.multiplyScalar(brightness);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 1.2 + 0.3;
    }
    return { positions, colors, sizes, angles };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: particleTexture }
  }), [particleTexture]);

  const vertexShader = `
    attribute float size;
    attribute float angle;
    attribute vec3 customColor;
    varying vec3 vColor;
    uniform float uTime;

    void main() {
      vColor = customColor;
      
      // Keplerian-like rotation: inner particles orbit faster
      float radius = length(position.xz);
      float speed = 1.5 / pow(radius, 1.5); 
      float currentAngle = angle - uTime * speed;
      
      vec3 newPos = vec3(
        radius * cos(currentAngle),
        position.y,
        radius * sin(currentAngle)
      );
      
      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      
      // Doppler Beaming
      vec3 velocity = vec3(-sin(currentAngle), 0.0, cos(currentAngle));
      vec3 viewVelocity = normalMatrix * velocity;
      vec3 toCamera = -normalize(mvPosition.xyz);
      float towardsCamera = dot(normalize(viewVelocity), toCamera);
      
      float dopplerFactor = 1.0 + towardsCamera * 1.8; 
      dopplerFactor = clamp(dopplerFactor, 0.1, 3.5);
      
      vColor *= dopplerFactor;

      gl_PointSize = size * (15.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    varying vec3 vColor;
    void main() {
      vec4 texColor = texture2D(uTexture, gl_PointCoord);
      gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
    }
  `;

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current) {
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    
    // Dynamic Camera Sway
    if (masterGroupRef.current) {
      masterGroupRef.current.rotation.x = 0.15 + Math.sin(t * 0.3) * 0.03 + (mouse.y * 0.05);
      masterGroupRef.current.rotation.y = -0.2 + Math.cos(t * 0.2) * 0.03 + (mouse.x * 0.05);
    }
  });

  return (
    <>
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} />
      </EffectComposer>

      <group ref={masterGroupRef} rotation={[0.15, -0.2, 0]}>
        {/* BACKGROUND DEEP SPACE GLOW */}
        <Sphere args={[20, 32, 32]} position={[0, 0, -5]}>
          <meshBasicMaterial color="#050200" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>

        {/* The Void (Event Horizon) */}
        <Sphere args={[2, 64, 64]}>
          <meshBasicMaterial color="#000000" />
        </Sphere>

        {/* Photon Ring / Gravitational Lensing Halo */}
        <group>
          <Sphere args={[2.08, 64, 64]}>
            <meshBasicMaterial color="#ffcc55" transparent opacity={0.25} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </Sphere>
          <Sphere args={[2.2, 64, 64]}>
            <meshBasicMaterial color="#ff6600" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </Sphere>
          <Sphere args={[2.4, 64, 64]}>
            <meshBasicMaterial color="#aa3300" transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </Sphere>
          {/* Lensing distortion representation (the bent light over the top) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.3, 0.5, 64, 100]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.6, 0.3, 64, 100]} />
            <meshBasicMaterial color="#ff5500" transparent opacity={0.04} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>

        {/* Accretion Disk */}
        <points ref={diskRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-customColor" count={colors.length / 3} array={colors} itemSize={3} />
            <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
            <bufferAttribute attach="attributes-angle" count={angles.length} array={angles} itemSize={1} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}
