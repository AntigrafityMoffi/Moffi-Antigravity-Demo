import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- COLORS ---
const C_ASPHALT = '#334155';
const C_STRIPE = '#ffffff';
const C_SIDEWALK = '#94a3b8';
const C_GRASS = '#4ade80';
const C_BARRIER_RED = '#ef4444';
const C_BARRIER_WHITE = '#f8fafc';
const C_WOOD = '#78350f';
const C_LEAF = '#15803d';

// --- PRIMITIVES ---

export function RoadSegment({ length = 100, zPos = 0 }: { length: number, zPos: number }) {
    // Tiling texture logic could go here
    return (
        <group position={[0, 0, zPos]}>
            {/* Main Road - 3 Lanes = 7.5 wide approx */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, length]} />
                <meshStandardMaterial color={C_ASPHALT} roughness={0.9} />
            </mesh>

            {/* Lane Markers */}
            {[-2.5, 2.5].map((x, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x / 2, 0.01, 0]}>
                    <planeGeometry args={[0.2, length]} />
                    <meshStandardMaterial color={C_ASPHALT} />
                    {/* In real shader we'd do dashed lines. Simple solid line implies lane division */}
                </mesh>
            ))}

            {/* Center Dashed Line (Simulated by multiple small meshes or texture. For performance, Texture is best. For this demo, we skip or do 1 solid line) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0.02, 0]}>
                <planeGeometry args={[0.1, length]} />
                <meshStandardMaterial color={C_STRIPE} opacity={0.5} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.25, 0.02, 0]}>
                <planeGeometry args={[0.1, length]} />
                <meshStandardMaterial color={C_STRIPE} opacity={0.5} transparent />
            </mesh>

            {/* CURBS & SIDEWALK */}
            <mesh position={[-6, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[4, length]} />
                <meshStandardMaterial color={C_SIDEWALK} />
            </mesh>
            <mesh position={[6, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[4, length]} />
                <meshStandardMaterial color={C_SIDEWALK} />
            </mesh>

            {/* GRASS EXTENT */}
            <mesh position={[-15, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[14, length]} />
                <meshStandardMaterial color={C_GRASS} />
            </mesh>
            <mesh position={[15, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[14, length]} />
                <meshStandardMaterial color={C_GRASS} />
            </mesh>
        </group>
    );
}

export function BarrierLow({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Legs */}
            <mesh position={[-1, 0.4, 0]} castShadow><boxGeometry args={[0.2, 0.8, 0.2]} /><meshStandardMaterial color="gray" /></mesh>
            <mesh position={[1, 0.4, 0]} castShadow><boxGeometry args={[0.2, 0.8, 0.2]} /><meshStandardMaterial color="gray" /></mesh>
            {/* Bar */}
            <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[2.2, 0.3, 0.1]} />
                <meshStandardMaterial color={C_BARRIER_RED} />
            </mesh>
            <mesh position={[0.5, 0.7, 0.01]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color={C_BARRIER_WHITE} /></mesh>
            <mesh position={[-0.5, 0.7, 0.01]}><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color={C_BARRIER_WHITE} /></mesh>
        </group>
    );
}

export function BarrierHigh({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Solid Billboard Block - Must slide under? No, high barrier usually means Jump or Dodge, 
                Wait, user said HighBarricade = Slideable. Usually requires 'Arch' shape. 
                Let's make it a 'Road Work Sign' on legs with gap below. */}
            <mesh position={[-0.8, 1.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 3]} /><meshStandardMaterial color="gray" /></mesh>
            <mesh position={[0.8, 1.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 3]} /><meshStandardMaterial color="gray" /></mesh>

            {/* The Sign Box */}
            <mesh position={[0, 2, 0]} castShadow>
                <boxGeometry args={[2, 1.5, 0.2]} />
                <meshStandardMaterial color="#fcd34d" /> {/* Yellow Warning */}
            </mesh>
            <mesh position={[0, 2, 0.11]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1, 1, 0.01]} />
                <meshBasicMaterial color="black" />
            </mesh>
            {/* Clearance Check: Board starts at Y=1.25 (2 - 0.75). Player slide height is ~0.5. It works. */}
        </group>
    );
}

export function Bush({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.5, 0]} castShadow>
                <dodecahedronGeometry args={[0.6]} />
                <meshStandardMaterial color={C_LEAF} />
            </mesh>
            <mesh position={[0.4, 0.3, 0.3]} castShadow>
                <dodecahedronGeometry args={[0.4]} />
                <meshStandardMaterial color={C_LEAF} />
            </mesh>
            <mesh position={[-0.3, 0.4, -0.2]} castShadow>
                <dodecahedronGeometry args={[0.5]} />
                <meshStandardMaterial color={C_LEAF} />
            </mesh>
        </group>
    );
}

export function TrafficCone({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.2, 0.6, 16]} />
                <meshStandardMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.4, 0.1, 0.4]} />
                <meshStandardMaterial color="#f97316" />
            </mesh>
        </group>
    );
}

// Side Scenery
export function TreeSimple({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} scale={1.5 + Math.random()}>
            <mesh position={[0, 1, 0]} castShadow><cylinderGeometry args={[0.2, 0.3, 2, 6]} /><meshStandardMaterial color={C_WOOD} /></mesh>
            <mesh position={[0, 2.5, 0]} castShadow><dodecahedronGeometry args={[1.2]} /><meshStandardMaterial color={C_LEAF} /></mesh>
        </group>
    );
}
