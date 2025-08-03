'use client';

import * as THREE from 'three'
import { forwardRef, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

// Create rounded box geometry
const w = 1
const h = 1
const r = 0.1
const depth = 1
const s = new THREE.Shape()
s.moveTo(-w / 2, -h / 2 + r)
s.lineTo(-w / 2, h / 2 - r)
s.absarc(-w / 2 + r, h / 2 - r, r, 1 * Math.PI, 0.5 * Math.PI, true)
s.lineTo(w / 2 - r, h / 2)
s.absarc(w / 2 - r, h / 2 - r, r, 0.5 * Math.PI, 0 * Math.PI, true)
s.lineTo(w / 2, -h / 2 + r)
s.absarc(w / 2 - r, -h / 2 + r, r, 2 * Math.PI, 1.5 * Math.PI, true)
s.lineTo(-w / 2 + r, -h / 2)
s.absarc(-w / 2 + r, -h / 2 + r, r, 1.5 * Math.PI, 1 * Math.PI, true)

export function lerp(object: any, prop: string, goal: number, speed = 0.1) {
  object[prop] = THREE.MathUtils.lerp(object[prop], goal, speed)
}

const color = new THREE.Color()
export function lerpC(value: any, goal: string, speed = 0.1) {
  value.lerp(color.set(goal), speed)
}

const vector = new THREE.Vector3()
export function lerpV3(value: any, goal: [number, number, number], speed = 0.1) {
  value.lerp(vector.set(...goal), speed)
}

export function calculateRefractionAngle(incidentAngle: number, glassIor = 2.5, airIor = 1.000293) {
  const theta = Math.asin((airIor * Math.sin(incidentAngle)) / glassIor) || 0
  return theta
}

const boxGeometry = new THREE.BoxGeometry()
const roundedBoxGeometry = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false })
roundedBoxGeometry.translate(0, 0, -depth / 2)
roundedBoxGeometry.computeVertexNormals()



const BoxComponent = forwardRef((props: any, ref: any) => {
  const [hovered, hover] = useState(false)
  const inner = useRef(null)
  useFrame(() => {
    if (inner.current) {
      lerpC((inner.current as any).material.emissive, hovered ? 'white' : '#454545', 0.1)
    }
  })
  return (
    <group scale={0.5} ref={ref} {...props}>
      <mesh 
        visible={false} 
        geometry={boxGeometry}
        ref={(mesh) => {
          if (mesh) {
            (mesh as any).onRayOver = () => hover(true);
            (mesh as any).onRayOut = () => hover(false);
          }
        }}
      />
      <mesh ref={inner} geometry={roundedBoxGeometry}>
        <meshStandardMaterial color="#333" toneMapped={false} emissiveIntensity={2} />
      </mesh>
    </group>
  )
})

BoxComponent.displayName = 'Box'
export const Box = BoxComponent 