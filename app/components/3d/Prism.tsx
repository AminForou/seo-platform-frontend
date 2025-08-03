'use client';

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'

interface PrismProps {
  onRayOver?: (event: unknown) => void
  onRayOut?: (event: unknown) => void
  onRayMove?: (event: unknown) => void
  [key: string]: unknown
}

function PrismComponent({ onRayOver, onRayOut, onRayMove, ...props }: PrismProps) {
  const { nodes } = useLoader(GLTFLoader, 'https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/xxpI-prism.glb') as any
  
  return (
    <group {...props}>
      {/* A low-res, invisible representation of the prism that gets hit by the raycaster */}
      <mesh 
        visible={false} 
        scale={1.9} 
        rotation={[Math.PI / 2, Math.PI, 0]}
        ref={(mesh) => {
          if (mesh) {
            (mesh as any).onRayOver = onRayOver;
            (mesh as any).onRayOut = onRayOut;
            (mesh as any).onRayMove = onRayMove;
          }
        }}
      >
        <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      </mesh>
      {/* The visible hi-res prism */}
      <mesh position={[0, 0, 0.6]} renderOrder={10} scale={2} dispose={null} geometry={nodes.Cone.geometry}>
        <meshPhysicalMaterial 
          color="#444444"
          metalness={0.1}
          roughness={0.05}
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          transmission={0.8} 
          thickness={1.2} 
          ior={1.5}
          toneMapped={false} 
        />
      </mesh>
    </group>
  )
}

PrismComponent.displayName = 'Prism'
export const Prism = PrismComponent 