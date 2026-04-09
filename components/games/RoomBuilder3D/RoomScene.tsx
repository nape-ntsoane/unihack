"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { RoomEnvironment } from './RoomEnvironment';
import { RoomDraggable } from './RoomDraggable';
import { PlacedObject } from '../RoomBuilderGame';

type RoomSceneProps = {
  items: PlacedObject[];
  themeChosen: string;
  onUpdateDrag: (id: string, pos: [number, number, number], rotY: number) => void;
  onDrop: () => void;
};

export function RoomScene({ items, themeChosen, onUpdateDrag, onDrop }: RoomSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas shadows>
        <Suspense fallback={null}>
          <OrthographicCamera 
            makeDefault 
            position={[10, 12, 10]} 
            zoom={45} 
            near={0.1} 
            far={100} 
          />
          <RoomEnvironment themeChosen={themeChosen} />
          
          {items.map((item) => (
            <RoomDraggable 
              key={item.id} 
              item={item} 
              onUpdateDrag={onUpdateDrag}
              onDrop={onDrop}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
