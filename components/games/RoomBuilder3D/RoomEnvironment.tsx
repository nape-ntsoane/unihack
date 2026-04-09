"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Cloud, Clouds, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function RoomEnvironment({ themeChosen }: { themeChosen: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lightColor = themeChosen === 'cozy' ? '#ffecd2' : themeChosen === 'focus' ? '#e0f7fa' : '#f0f0f0';

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle cloud rotation / drifting
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color={lightColor} />
      <directionalLight position={[5, 10, -5]} intensity={1.5} castShadow />
      
      <group ref={groupRef}>
        <Clouds material={THREE.MeshBasicMaterial} limit={400} range={20} position={[0, 10, -10]}>
          <Cloud bounds={[10, 2, 5]} color="#ffffff" seed={1} opacity={0.6} volume={5} />
        </Clouds>
      </group>

      <ContactShadows 
        position={[0, -0.49, 0]} 
        opacity={0.6} 
        scale={20} 
        blur={2.5} 
        far={10} 
      />
      
      {/* Visual grid for dropping */}
      <gridHelper args={[20, 20, '#a0a0a0', '#a0a0a0']} position={[0, -0.5, 0]} material-opacity={0.2} material-transparent />
    </>
  );
}
