import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stage } from '@react-three/drei'
import { Suspense, useMemo } from 'react'

function ChibiBody() {
  // simple chibi-like figure using basic geometries
  return (
    <group>
      {/* head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#fff5f7" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.18, 1.15, 0.37]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.18, 1.15, 0.37]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.2} />
      </mesh>
      {/* hair cap */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.47, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.6, 8, 16]} />
        <meshStandardMaterial color="#ffd1e1" />
      </mesh>
      {/* arms */}
      <mesh position={[-0.4, 0.6, 0]} rotation={[0,0,0.3]}>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <meshStandardMaterial color="#ffd1e1" />
      </mesh>
      <mesh position={[0.4, 0.6, 0]} rotation={[0,0,-0.3]}>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <meshStandardMaterial color="#ffd1e1" />
      </mesh>
      {/* legs */}
      <mesh position={[-0.12, 0.0, 0]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        <meshStandardMaterial color="#ffc8db" />
      </mesh>
      <mesh position={[0.12, 0.0, 0]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        <meshStandardMaterial color="#ffc8db" />
      </mesh>
    </group>
  )
}

export default function Ami3D() {
  const dpr = useMemo(() => (typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 1), [])
  return (
    <div style={{ width: 80, height: 80 }}>
      <Canvas dpr={dpr} camera={{ position: [1.2, 1.2, 2.2], fov: 40 }}>
        <Suspense fallback={null}>
          <Stage environment={null} intensity={0.5} adjustCamera={false}>
            <Float speed={2} floatIntensity={1}>
              <ChibiBody />
            </Float>
          </Stage>
        </Suspense>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={0.7} castShadow />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  )
}

