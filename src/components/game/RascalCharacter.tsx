"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

// --- TYPES ---
export type AnimState = "IDLE" | "RUN" | "JUMP" | "SLIDE" | "HIT" | "FALL" | "WAVE";

export type RascalProps = {
    state: AnimState;              // from game logic
    laneOffset: number;            // -1, 0, 1
    speed: number;                 // current speed
    grounded: boolean;             // is on ground
    emotion?: 'happy' | 'scared' | 'cool' | 'wink'; // Extra visual flair
    onReady?: () => void;
};

// --- COLORS ---
const COLORS = {
    furBase: '#ECA860',  // Golden/Biscuit
    furDark: '#D98E45',  // Slight contrast for ears
    clothes: '#FB923C',  // Orange Hoodie
    nose: '#1E1E1E',
    tongue: '#F43F5E',
    text: '#FFFFFF'
};

// --- COMPONENT ---
export function RascalCharacter({ state, laneOffset, speed, grounded, emotion, onReady }: RascalProps) {
    const group = useRef<THREE.Group>(null!);

    // Refs for Procedural Parts (Rig)
    const spine = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const jaw = useRef<THREE.Group>(null);
    const earL = useRef<THREE.Group>(null);
    const earR = useRef<THREE.Group>(null);
    const legL = useRef<THREE.Group>(null);
    const legR = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    const tail = useRef<THREE.Group>(null);
    const hood = useRef<THREE.Group>(null); // Replaces Bandana
    const eyelidL = useRef<THREE.Group>(null);
    const eyelidR = useRef<THREE.Group>(null);

    // Blink State
    const blinkTimer = useRef(0);
    const nextBlink = useRef(2 + Math.random() * 3);

    // Notify ready
    useEffect(() => {
        onReady?.();
    }, [onReady]);

    // --- ANIMATION LOOP ---
    useFrame((stateThree, dt) => {
        if (!group.current) return;
        const time = stateThree.clock.elapsedTime;
        const runFreq = speed * 1.5; // Sync with speed

        // 1. STATE MACHINE (Blend Logic via Math)
        let bounce = 0;

        if (state === 'JUMP') {
            // JUMP POSE
            spine.current?.position.lerp(new THREE.Vector3(0, 0.2, 0), 0.2);
            spine.current?.rotation.set(-0.5, 0, 0); // Look up 
            spine.current?.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);

            armL.current?.rotation.set(2.5, 0, 0.5); // Arms up!
            armR.current?.rotation.set(2.5, 0, -0.5);

            legL.current?.rotation.set(1.5, 0, 0); // Tuck legs
            legR.current?.rotation.set(1.5, 0, 0);
        }
        else if (state === 'SLIDE') {
            // Flatten
            spine.current?.position.lerp(new THREE.Vector3(0, -0.4, 0), 0.2);
            spine.current?.rotation.set(0.4, 0, 0);
            spine.current?.scale.lerp(new THREE.Vector3(1.1, 0.8, 1.1), 0.2);

            armL.current?.rotation.set(0, 0, 1.5); armR.current?.rotation.set(0, 0, -1.5);
            legL.current?.rotation.set(-1.5, 0.5, 0); legR.current?.rotation.set(-1.5, -0.5, 0);
        }
        else if (state === 'RUN') {
            bounce = Math.abs(Math.sin(time * runFreq)) * 0.15;
            spine.current?.position.set(0, bounce, 0);

            // Dynamic Spine Lean (Forward with speed)
            const forwardLean = 0.1 + (speed / 45) * 0.3;
            spine.current?.rotation.set(forwardLean, 0, Math.sin(time * runFreq * 0.5) * 0.05);

            // Limbs Cycle
            const lPhase = Math.sin(time * runFreq);
            const rPhase = Math.sin(time * runFreq + Math.PI);

            // Arms (Pumping)
            armL.current?.rotation.set(lPhase * 0.9, 0, 0.1);
            armR.current?.rotation.set(rPhase * 0.9, 0, -0.1);

            // Legs (Running)
            legL.current?.rotation.set(rPhase * 1.1, 0, 0);
            legR.current?.rotation.set(lPhase * 1.1, 0, 0);
        }
        else {
            // IDLE
            const breathe = Math.sin(time * 2) * 0.02;
            spine.current?.position.set(0, breathe, 0);
            spine.current?.rotation.set(0, Math.sin(time * 0.5) * 0.1, 0);
            armL.current?.rotation.set(0, 0, 0.1); armR.current?.rotation.set(0, 0, -0.1);
            legL.current?.rotation.set(0, 0, 0); legR.current?.rotation.set(0, 0, 0);
        }

        // 2. ADVANCED CONTROL
        // Lane Lean (Banking)
        const bank = THREE.MathUtils.clamp(-laneOffset * 0.25, -0.3, 0.3);
        group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, bank, 8, dt);

        // Head/Spine Look into turn
        if (head.current) {
            const lookTurn = -laneOffset * 0.3;
            if (state === 'IDLE') {
                head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, Math.sin(time) * 0.2, 0.05);
            } else {
                head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, lookTurn, 8, dt);
            }
        }

        // 3. SECONDARY PHYSICS (Ears/Tail/Hood)
        if (earL.current && earR.current) {
            const runDrag = state === 'RUN' ? -0.5 : 0;
            const jumpDrag = state === 'JUMP' || state === 'FALL' ? -0.8 : 0;

            // Flappy Ears
            const flap = Math.cos(time * 20) * 0.2;
            earL.current.rotation.x = THREE.MathUtils.lerp(earL.current.rotation.x, runDrag + jumpDrag, 0.1);
            earL.current.rotation.z = 0.2 + flap;

            earR.current.rotation.x = THREE.MathUtils.lerp(earR.current.rotation.x, runDrag + jumpDrag, 0.1);
            earR.current.rotation.z = -0.2 - flap;
        }

        if (tail.current) {
            tail.current.rotation.y = Math.cos(time * 20) * (state === 'RUN' ? 0.8 : 0.2);
            tail.current.rotation.x = -0.5 + (Math.sin(time * 10) * 0.1);
        }

        // Hood Physics (Bounce slightly)
        if (hood.current) {
            hood.current.rotation.x = THREE.MathUtils.lerp(hood.current.rotation.x, bounce * 2, 0.1);
        }

        // 4. MICRO EXPRESSIONS (Blink)
        blinkTimer.current += dt;
        if (blinkTimer.current > nextBlink.current) {
            if (eyelidL.current) eyelidL.current.scale.y = 0.1;
            if (eyelidR.current) eyelidR.current.scale.y = 0.1;
            if (blinkTimer.current > nextBlink.current + 0.15) {
                if (eyelidL.current) eyelidL.current.scale.y = 1;
                if (eyelidR.current) eyelidR.current.scale.y = 1;
                blinkTimer.current = 0;
                nextBlink.current = 2 + Math.random() * 3;
                if (emotion === 'wink' && eyelidR.current) {
                    eyelidR.current.scale.y = 0.1;
                    setTimeout(() => { if (eyelidR.current) eyelidR.current.scale.y = 1 }, 300);
                }
            }
        }
    });

    return (
        <group ref={group}>
            {/* SPINE CHAIN */}
            <group ref={spine}>
                {/* --- HOODIE BODY --- */}
                {/* Main Torso (Hoodie color) */}
                <mesh position={[0, 0.55, 0]} castShadow>
                    <boxGeometry args={[0.5, 0.6, 0.4]} />
                    <meshStandardMaterial color={COLORS.clothes} />
                </mesh>

                {/* Hoodie Pocket/Detail */}
                <mesh position={[0, 0.45, 0.21]}>
                    <boxGeometry args={[0.3, 0.2, 0.05]} />
                    <meshStandardMaterial color={COLORS.clothes} />
                </mesh>

                {/* LOGO TEXT */}
                <group position={[0, 0.6, 0.22]}>
                    <Text
                        color="white"
                        fontSize={0.12}
                        fontWeight="bold"
                        anchorX="center"
                        anchorY="middle"
                    >
                        MOFFI
                    </Text>
                </group>

                {/* BOTTOM (Pants/Fur?) - Lets say just fur legs sticking out bottom */}
                <mesh position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[0.2, 0.22, 0.2]} />
                    <meshStandardMaterial color={COLORS.furBase} />
                </mesh>

                {/* --- HOOD (Neck) --- */}
                <group ref={hood} position={[0, 0.85, -0.05]} rotation={[0.4, 0, 0]}>
                    {/* The Hood down */}
                    <mesh>
                        <torusGeometry args={[0.25, 0.12, 8, 16]} />
                        <meshStandardMaterial color={COLORS.clothes} />
                    </mesh>
                </group>

                {/* --- HEAD --- */}
                <group ref={head} position={[0, 1.05, 0.05]}>
                    {/* Main Head Shape (Golden) */}
                    {/* Main Head Shape (Golden) */}
                    <group castShadow>
                        <RoundedBox args={[0.6, 0.55, 0.55]} radius={0.1}>
                            <meshStandardMaterial color={COLORS.furBase} />
                        </RoundedBox>
                    </group>

                    {/* Snout Area */}
                    <mesh position={[0, -0.08, 0.3]}>
                        <boxGeometry args={[0.32, 0.22, 0.15]} />
                        <meshStandardMaterial color={COLORS.furBase} />
                    </mesh>
                    <mesh position={[0, -0.05, 0.38]}>
                        <boxGeometry args={[0.14, 0.1, 0.05]} />
                        <meshStandardMaterial color={COLORS.nose} />
                    </mesh>

                    {/* EYES */}
                    <group position={[0, 0.08, 0.28]}>
                        <mesh position={[0.16, 0, 0]}><circleGeometry args={[0.07]} /><meshBasicMaterial color="black" /></mesh>
                        <mesh position={[-0.16, 0, 0]}><circleGeometry args={[0.07]} /><meshBasicMaterial color="black" /></mesh>
                        {/* Shine */}
                        <mesh position={[0.18, 0.03, 0.01]}><circleGeometry args={[0.02]} /><meshBasicMaterial color="white" /></mesh>
                        <mesh position={[-0.14, 0.03, 0.01]}><circleGeometry args={[0.02]} /><meshBasicMaterial color="white" /></mesh>

                        {/* EYELIDS */}
                        <group ref={eyelidL} position={[0.16, 0.06, 0.01]}><mesh><planeGeometry args={[0.15, 0.08]} /><meshStandardMaterial color={COLORS.furBase} /></mesh></group>
                        <group ref={eyelidR} position={[-0.16, 0.06, 0.01]}><mesh><planeGeometry args={[0.15, 0.08]} /><meshStandardMaterial color={COLORS.furBase} /></mesh></group>
                    </group>

                    {/* FLOPPY EARS (Golden Doodle Style) */}
                    <group ref={earL} position={[0.32, 0.1, 0]}>
                        <mesh position={[0.05, -0.25, 0]} rotation={[0, 0, 0.2]}>
                            <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
                            <meshStandardMaterial color={COLORS.furDark} />
                        </mesh>
                    </group>
                    <group ref={earR} position={[-0.32, 0.1, 0]}>
                        <mesh position={[-0.05, -0.25, 0]} rotation={[0, 0, -0.2]}>
                            <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
                            <meshStandardMaterial color={COLORS.furDark} />
                        </mesh>
                    </group>

                    {/* JAW */}
                    <group ref={jaw} position={[0, -0.2, 0.3]}>
                        {emotion === 'happy' && <mesh position={[0, -0.02, 0.05]} rotation={[0.4, 0, 0]}><boxGeometry args={[0.1, 0.02, 0.12]} /><meshStandardMaterial color={COLORS.tongue} /></mesh>}
                    </group>
                </group>

                {/* --- LIMBS --- */}
                {/* Arms (Sleeves + Paws) */}
                <group ref={armL} position={[0.28, 0.75, 0.1]}>
                    <mesh position={[0.05, -0.2, 0]} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.11, 0.45, 4, 8]} />
                        <meshStandardMaterial color={COLORS.clothes} /> {/* Sleeve */}
                    </mesh>
                    <mesh position={[0.08, -0.45, 0]}>
                        <sphereGeometry args={[0.11]} />
                        <meshStandardMaterial color={COLORS.furBase} /> {/* Paw */}
                    </mesh>
                </group>
                <group ref={armR} position={[-0.28, 0.75, 0.1]}>
                    <mesh position={[-0.05, -0.2, 0]} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.11, 0.45, 4, 8]} />
                        <meshStandardMaterial color={COLORS.clothes} /> {/* Sleeve */}
                    </mesh>
                    <mesh position={[-0.08, -0.45, 0]}>
                        <sphereGeometry args={[0.11]} />
                        <meshStandardMaterial color={COLORS.furBase} /> {/* Paw */}
                    </mesh>
                </group>

                {/* Legs (Fur) */}
                <group ref={legL} position={[0.18, 0.25, 0]}>
                    <mesh position={[0, -0.25, 0]}>
                        <capsuleGeometry args={[0.11, 0.5, 4, 8]} />
                        <meshStandardMaterial color={COLORS.furBase} />
                    </mesh>
                </group>
                <group ref={legR} position={[-0.18, 0.25, 0]}>
                    <mesh position={[0, -0.25, 0]}>
                        <capsuleGeometry args={[0.11, 0.5, 4, 8]} />
                        <meshStandardMaterial color={COLORS.furBase} />
                    </mesh>
                </group>

                {/* TAIL */}
                <group ref={tail} position={[0, 0.35, -0.25]}>
                    <mesh position={[0, 0.2, 0.1]} rotation={[0.8, 0, 0]}>
                        <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
                        <meshStandardMaterial color={COLORS.furBase} />
                    </mesh>
                </group>
            </group>

            {/* SHADOW */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.5, 16]} /><meshBasicMaterial color="black" opacity={0.3} transparent /></mesh>
        </group>
    );
}
