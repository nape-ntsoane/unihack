"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PlacedObject } from '../RoomBuilderGame';

type RoomDraggableProps = {
  item: PlacedObject;
  onUpdateDrag: (id: string, pos: [number, number, number], rotY: number) => void;
  onDrop: () => void;
};

export function RoomDraggable({ item, onUpdateDrag, onDrop }: RoomDraggableProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(true);
  
  const targetPos = useRef(new THREE.Vector3(...item.position));
  const targetRotY = useRef(item.rotationY);
  const velocity = useRef(new THREE.Vector3(0,0,0));

  useEffect(() => {
    // Drop animation starting from higher up
    const startObj = new THREE.Vector3(item.position[0], item.position[1] + 5, item.position[2]);
    if (meshRef.current) meshRef.current.position.copy(startObj);
  }, []);

  const bind = useDrag(({ active, event }) => {
    if (active && !isDragging) {
      setIsDragging(true);
      setJustDropped(false);
    }

    if (active) {
      if (event && (event as any).ray) {
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersect = new THREE.Vector3();
        (event as any).ray.intersectPlane(floorPlane, intersect);
        
        // Grid Snapping
        const snapSize = 1;
        const snapX = Math.round(intersect.x / snapSize) * snapSize;
        const snapZ = Math.round(intersect.z / snapSize) * snapSize;
        
        targetPos.current.set(snapX, 0, snapZ);
        onUpdateDrag(item.id, [snapX, 0, snapZ], targetRotY.current);
      }
    } else if (isDragging) {
      setIsDragging(false);
      setJustDropped(true);
      onDrop();
      setTimeout(() => setJustDropped(false), 800);
    }
  });

  const handleRotate = (e: any) => {
    e.stopPropagation();
    targetRotY.current += Math.PI / 2; // Rotate 90 degrees
    onUpdateDrag(item.id, [targetPos.current.x, targetPos.current.y, targetPos.current.z], targetRotY.current);
    onDrop(); // trigger sound
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      const current = meshRef.current.position;
      const target = targetPos.current.clone();
      
      // Interpolate Rotation smoothly
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY.current, 0.15);

      if (isDragging) {
        target.y = 1.0; 
        current.lerp(target, 0.2);
      } else {
        target.y = 0;
        // Bounce effect
        const diff = target.sub(current);
        const force = diff.multiplyScalar(0.2); 
        velocity.current.add(force);
        velocity.current.multiplyScalar(0.7); 
        current.add(velocity.current);
      }
    }
  });

  // Basic geometries acting as furniture placeholders until S3 assets are loaded
  const Geometry = item.type === 'plant' ? <cylinderGeometry args={[0.4, 0.3, 1]} /> 
    : item.type === 'lamp' ? <coneGeometry args={[0.3, 1.2]} />
    : item.type === 'rug' ? <boxGeometry args={[2, 0.1, 3]} /> 
    : <boxGeometry args={[0.8, 0.8, 0.8]} />;

  return (
    <group ref={meshRef} {...(bind() as any)}>
      <mesh castShadow receiveShadow>
        {Geometry}
        <meshStandardMaterial 
          color={item.color} 
          roughness={0.2}
          transparent
          opacity={isDragging ? 0.7 : 1}
        />
        
        {/* Rotation Handle */}
        {!isDragging && (
          <Html position={[0, 1.5, 0]} center>
            <button 
              onPointerDown={handleRotate}
              className="bg-white/80 p-2 rounded-full shadow-lg border border-gray-200 text-xs backdrop-blur-md pointer-events-auto hover:bg-white active:scale-90 transition-transform"
            >
              ⟳
            </button>
          </Html>
        )}

        {/* Particle poof & glow on drop */}
        {justDropped && !isDragging && (
          <Html center position={[0, -0.5, 0]}>
            <div className="w-20 h-20 rounded-full border-[3px] border-white/60 animate-ping shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          </Html>
        )}
      </mesh>
    </group>
  );
}
