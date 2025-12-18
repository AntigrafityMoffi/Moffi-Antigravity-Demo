"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useSwipeable } from 'react-swipeable';
import { Play, RotateCcw, Home, Trophy, Coins, Footprints, AlertTriangle, CheckCircle2, Trees, Building2, Stethoscope, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RascalCharacter, AnimState } from './RascalCharacter';
import { LevelGenerator, LevelObject, ObstacleType, ItemType } from './LevelGenerator';
import { RoadSegment, BarrierLow, BarrierHigh, Bush, TrafficCone, TreeSimple } from './WorldAssets';

// --- CONFIG ---
const LANE_WIDTH = 2.5;
const SPEED_INITIAL = 12;
const SPEED_MAX = 45;
const SPEED_INCREMENT = 0.8;
const JUMP_DURATION = 0.7;
const SLIDE_DURATION = 0.9;

// --- ASSETS & THEMES ---
const COLORS = {
    furBase: '#ffffff',
    furSpot: '#855E42',
    bandana: '#3b82f6',
    nose: '#1e293b',
    tongue: '#f43f5e',
    ground: '#e2e8f0',
    obstacle: '#ef4444',
    coin: '#f59e0b',
    magnet: '#db2777',
    rocket: '#ef4444',
    snail: '#10b981',
};

const THEMES = {
    park: { name: 'Park', sky: '#bfdbfe', ground: '#86efac', obstacle: '#b91c1c', fog: '#bfdbfe' },
    city: { name: 'Şehir', sky: '#1e293b', ground: '#334155', obstacle: '#f59e0b', fog: '#1e293b' },
    vet: { name: 'Klinik', sky: '#f0f9ff', ground: '#fff', obstacle: '#dc2626', fog: '#f0f9ff' },
};

// --- TYPES ---
type GameState = 'menu' | 'playing' | 'gameover';
type Lane = -1 | 0 | 1;
type Emotion = 'idle' | 'happy' | 'scared' | 'run' | 'cool' | 'hit' | 'wink' | 'proud';
type PowerUpType = 'magnet' | 'rocket' | 'snail';
type ThemeType = 'park' | 'city' | 'vet';

// --- UTILS ---
class CameraShakeManager {
    intensity = 0;
    decay = 5;
    trigger(amount: number) { this.intensity = amount; }
    update(dt: number) {
        this.intensity = THREE.MathUtils.lerp(this.intensity, 0, this.decay * dt);
        return this.intensity;
    }
}
const cameraShaker = new CameraShakeManager();

// --- MISSIONS ---
interface Mission {
    id: string;
    desc: string;
    target: number;
    current: number;
    completed: boolean;
    type: 'coin' | 'jump' | 'score';
}

const generateMissions = (): Mission[] => [
    { id: 'm1', desc: '15 Altın Topla', target: 15, current: 0, completed: false, type: 'coin' },
    { id: 'm2', desc: '5 Kez Zıpla', target: 5, current: 0, completed: false, type: 'jump' }
];

// --- RASCAL RIG (PHASE 4: ANIMATION & REACTIONS) ---
// --- RASCAL RIG REMOVED (Moved to RascalCharacter.tsx) ---

// 2. RUNNER PLAYER (Physics Container - with Reaction Triggers)
function RunnerPlayer({
    gameState,
    setGameState,
    activePowerUp,
    onScoreUpdate,
    onSpeedUpdate,
}: {
    gameState: GameState;
    setGameState: (s: GameState) => void;
    activePowerUp: PowerUpType | null;
    onCollect: () => void;
    onScoreUpdate: (dist: number) => void;
    onSpeedUpdate: (spd: number) => void;
}) {
    const playerRef = useRef<THREE.Group>(null);
    const [lane, setLane] = useState<Lane>(0);
    const [isJumping, setIsJumping] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [emotion, setEmotion] = useState<Emotion>('idle');
    const emotionTimer = useRef<NodeJS.Timeout | null>(null);

    // Physics
    const targetX = useRef(0);
    const velocityY = useRef(0);
    const positionY = useRef(0.0);
    const runDistance = useRef(0);
    const speed = useRef(SPEED_INITIAL);

    // REACTIVE EMOTION SYSTEM
    const triggerEmotion = (newEmotion: Emotion, duration = 1200) => {
        // Priority check: 'Hit' overrides everything. 'Happy' overrides 'Run'.
        if (emotion === 'hit') return;

        setEmotion(newEmotion);
        if (emotionTimer.current) clearTimeout(emotionTimer.current);

        if (newEmotion !== 'run' && newEmotion !== 'idle' && newEmotion !== 'cool') {
            emotionTimer.current = setTimeout(() => {
                setEmotion(gameState === 'playing' ? (activePowerUp ? 'cool' : 'run') : 'idle');
            }, duration);
        }
    };

    useEffect(() => {
        (window as any).triggerHappy = () => triggerEmotion('happy', 800);
        (window as any).triggerScared = () => triggerEmotion('scared', 1000);
        (window as any).currentLane = lane; // Expose for Gaze
    }, [gameState, activePowerUp, lane]);

    useEffect(() => {
        if (gameState === 'playing') triggerEmotion(activePowerUp ? 'cool' : 'run');
        else triggerEmotion('idle');

        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            switch (e.key) {
                case 'ArrowLeft': case 'a': setLane(l => Math.max(l - 1, -1) as Lane); break;
                case 'ArrowRight': case 'd': setLane(l => Math.min(l + 1, 1) as Lane); break;
                case 'ArrowUp': case 'w': if (!isJumping && !isSliding) jump(); break;
                case 'ArrowDown': case 's': if (!isSliding && !isJumping) slide(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, isJumping, isSliding, activePowerUp]);

    useEffect(() => {
        (window as any).startRun = () => {
            setGameState('playing');
            speed.current = SPEED_INITIAL;
            runDistance.current = 0;
            triggerEmotion('run');
        };
        (window as any).moveLeft = () => setLane(l => Math.max(l - 1, -1) as Lane);
        (window as any).moveRight = () => setLane(l => Math.min(l + 1, 1) as Lane);
        (window as any).jump = () => { if (!isJumping && !isSliding) jump(); };
        (window as any).slide = () => { if (!isSliding && !isJumping) slide(); };
    }, [gameState, isJumping, isSliding]);

    const jump = () => {
        setIsJumping(true);
        velocityY.current = 13;
        (window as any).triggerJumpMission?.();
        setTimeout(() => setIsJumping(false), JUMP_DURATION * 1000);
    };

    const slide = () => {
        setIsSliding(true);
        setTimeout(() => setIsSliding(false), SLIDE_DURATION * 1000);
    };

    useFrame((state, delta) => {
        if (gameState !== 'playing' || !playerRef.current) return;

        let actualSpeed = speed.current;
        if (activePowerUp === 'rocket') actualSpeed = SPEED_MAX * 1.5;
        if (activePowerUp === 'snail') actualSpeed = speed.current * 0.6;
        if (speed.current < SPEED_MAX) speed.current += SPEED_INCREMENT * delta;
        onSpeedUpdate(actualSpeed);

        runDistance.current += actualSpeed * delta;
        playerRef.current.position.z = -runDistance.current;
        onScoreUpdate(Math.floor(runDistance.current));

        targetX.current = lane * LANE_WIDTH;
        if (activePowerUp === 'rocket') {
            playerRef.current.position.y = 4;
            playerRef.current.position.x = 0;
        } else {
            playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, targetX.current, 12 * delta);

            if (isJumping) {
                positionY.current += velocityY.current * delta;
                velocityY.current -= 40 * delta;
                if (positionY.current < 0) positionY.current = 0;
            } else {
                positionY.current = THREE.MathUtils.lerp(positionY.current, 0, 20 * delta);
            }
            playerRef.current.position.y = positionY.current;
        }

        const shake = cameraShaker.update(delta);
        const desiredCamZ = playerRef.current.position.z + 8 + (actualSpeed * 0.1);
        const desiredCamY = activePowerUp === 'rocket' ? 8 : 5 + (actualSpeed * 0.05);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, desiredCamZ, 0.1);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, desiredCamY, 0.05) + (Math.random() - 0.5) * shake;
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, playerRef.current.position.x * 0.3, 0.1) + (Math.random() - 0.5) * shake;
        state.camera.lookAt(playerRef.current.position.x * 0.1, activePowerUp === 'rocket' ? 3 : 1, playerRef.current.position.z - 5);

        (window as any).playerPosition = playerRef.current.position;
        (window as any).isSliding = isSliding;
    });

    const getAnimState = (): AnimState => {
        if (gameState !== 'playing') return 'IDLE';
        if (isJumping) return 'JUMP';
        if (isSliding) return 'SLIDE';
        return 'RUN';
    };

    return (
        <group ref={playerRef}>
            <RascalCharacter
                state={getAnimState()}
                laneOffset={lane}
                speed={speed.current}
                grounded={!isJumping}
                emotion={emotion}
            />
            {activePowerUp === 'magnet' && (
                <mesh position={[0, 1.2, 0]}>
                    <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
                    <meshStandardMaterial color={COLORS.magnet} />
                </mesh>
            )}
        </group>
    );
}

// 3. TRACK (UPDATED: Chunk System)
const levelGen = new LevelGenerator(-20); // Static instance

function TrackManager({ onCrash, onCollect, onPowerUp, theme }: any) {
    const themeConfig = THEMES[theme as ThemeType] || THEMES.park;
    const [chunks, setChunks] = useState<LevelObject[]>([]);
    const [scenery, setScenery] = useState<any[]>([]); // Side trees
    const lastGenZ = useRef(-20);
    const playerZRef = useRef(0);

    // Initial Gen
    useEffect(() => {
        levelGen.reset(-20);
        let initialObjects: LevelObject[] = [];
        for (let i = 0; i < 5; i++) { // Pre-gen 5 chunks
            const chunk = levelGen.generateNextChunk();
            initialObjects = [...initialObjects, ...chunk.objects];
        }
        setChunks(initialObjects);

        // Gen Scenery
        const trees = [];
        for (let z = -10; z > -200; z -= 15) {
            trees.push({ id: `tl_${z}`, x: -8 - Math.random() * 5, z, type: 'TREE' });
            trees.push({ id: `tr_${z}`, x: 8 + Math.random() * 5, z, type: 'TREE' });
        }
        setScenery(trees);

    }, [theme]);

    // Infinite Gen Loop
    useFrame(() => {
        const playerPos = (window as any).playerPosition;
        if (!playerPos) return;
        playerZRef.current = playerPos.z;

        // Cleanup behind & Generate ahead
        if (playerPos.z < lastGenZ.current + 100) {
            // Simple Endless Logic for Demo
            // Check if last object is close
            const lastObj = chunks[chunks.length - 1];
            if (!lastObj || lastObj.z > playerPos.z - 150) { // Need more
                const chunk = levelGen.generateNextChunk();
                setChunks(prev => {
                    const keep = prev.filter(o => o.z < playerPos.z + 20); // Remove passed
                    return [...keep, ...chunk.objects];
                });
            }
        }
    });

    // Broadcast Nearest (Adapted for new structure)
    useFrame(() => {
        const playerPos = (window as any).playerPosition;
        if (!playerPos) return;
        let minDist = 999;
        chunks.forEach((obj) => {
            // Only checking obstacles for scare reaction
            if (obj.type.includes('BARRIER') || obj.type.includes('CONE')) {
                if (obj.z < playerPos.z + 5 && obj.z > playerPos.z - 10) {
                    const dist = Math.sqrt(Math.pow(obj.z - playerPos.z, 2) + Math.pow(((obj.x || 0) * LANE_WIDTH) - playerPos.x, 2));
                    if (dist < minDist) minDist = dist;
                }
            }
        });
        (window as any).nearestObstacleDist = minDist;
    });

    return (
        <group>
            {/* INFINITE ROAD MESH (Static for now, implies straight road) */}
            <RoadSegment length={500} zPos={-250} />

            {/* SCENERY */}
            {scenery.map(s => <TreeSimple key={s.id} position={[s.x, 0, s.z]} />)}

            {/* DYNAMIC OBJECTS */}
            {chunks.map((obj) => (
                <GameEntity
                    key={obj.uniqueId}
                    data={obj}
                    onCrash={onCrash}
                    onCollect={onCollect}
                    onPowerUp={onPowerUp}
                />
            ))}
        </group>
    );
}

// Unified Entity Component
function GameEntity({ data, onCrash, onCollect, onPowerUp }: any) {
    const [crashed, setCrashed] = useState(false);
    const [collected, setCollected] = useState(false);

    // Collision Logic (Shared)
    useFrame((state, delta) => {
        if (crashed || collected) return;
        const playerPos = (window as any).playerPosition;
        if (!playerPos) return;

        // Optimization: Dist check
        if (playerPos.z < data.z - 2 || playerPos.z > data.z + 2) return;

        const dz = Math.abs(playerPos.z - data.z);
        const dx = Math.abs(playerPos.x - ((data.x || 0) * LANE_WIDTH));

        // HITBOXES
        let hitDist = 0.8;
        if (data.type === 'COIN') hitDist = 1.0;

        if (dz < 1.0 && dx < hitDist) {
            // Check Height for Barriers
            const isSlide = (window as any).isSliding;
            const isJump = (window as any).playerPosition.y > 1.2;

            if (data.type === 'COIN') {
                setCollected(true); (window as any).triggerHappy?.(); onCollect();
            } else if (data.type === 'BARRIER_LOW') {
                if (!isJump && !(window as any).isInvincible) { setCrashed(true); onCrash(); }
            } else if (data.type === 'BARRIER_HIGH') {
                if (!isSlide && !(window as any).isInvincible) { setCrashed(true); onCrash(); }
            } else if (['BUSH', 'TRAFFIC_CONE'].includes(data.type)) {
                if (!(window as any).isInvincible) { setCrashed(true); onCrash(); }
            } else if (['MAGNET', 'ROCKET', 'SNAIL'].includes(data.type)) {
                setCollected(true); onPowerUp(data.type);
            }
        }
    });

    if (collected || (crashed && (window as any).isInvincible)) return null;

    const pos: [number, number, number] = [(data.x || 0) * LANE_WIDTH, data.y || 0, data.z];

    // RENDER MAPPING
    if (data.type === 'COIN') {
        return (
            <group position={pos}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
                    <meshStandardMaterial color={COLORS.coin} emissive="#f59e0b" emissiveIntensity={0.5} />
                </mesh>
            </group>
        );
    }
    if (data.type === 'BARRIER_LOW') return <BarrierLow position={pos} />;
    if (data.type === 'BARRIER_HIGH') return <BarrierHigh position={pos} />;
    if (data.type === 'BUSH') return <Bush position={pos} />;
    if (data.type === 'TRAFFIC_CONE') return <TrafficCone position={pos} />;
    // Powerups
    if (['MAGNET', 'ROCKET', 'SNAIL'].includes(data.type)) {
        const color = data.type === 'MAGNET' ? COLORS.magnet : data.type === 'ROCKET' ? COLORS.rocket : COLORS.snail;
        return (
            <group position={pos}>
                <mesh castShadow>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
                </mesh>
            </group>
        );
    }

    return null;
}

// 3. SPEED LINES (Same)
function SpeedLines({ speed }: { speed: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const lines = useMemo(() => new Array(30).fill(0).map(() => ({ x: (Math.random() - 0.5) * 20, y: Math.random() * 8, z: Math.random() * 30, len: Math.random() * 10 })), []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const playerPos = (window as any).playerPosition;
        if (playerPos) groupRef.current.position.z = playerPos.z;
        groupRef.current.children.forEach((child: any) => {
            child.position.z += speed * delta * 2;
            if (child.position.z > 10) {
                child.position.z = -30 - Math.random() * 20; child.position.x = (Math.random() - 0.5) * 20;
            }
        });
    });
    const opacity = Math.max(0, (speed - 15) / 25);
    if (opacity < 0.05) return null;
    return (
        <group ref={groupRef}>
            {lines.map((l, i) => (
                <mesh key={i} position={[l.x, l.y, -l.z]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, l.len, 8]} />
                    <meshBasicMaterial color="white" transparent opacity={opacity * 0.5} />
                </mesh>
            ))}
        </group>
    );
}

// MAIN COMPONENT
export default function MoffiRunGame({ onClose, onGameEnd }: { onClose: () => void, onGameEnd: (result: any) => void }) {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(SPEED_INITIAL);

    // STATES
    const [missions, setMissions] = useState<Mission[]>(generateMissions());
    const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null);
    const [powerUpTime, setPowerUpTime] = useState(0);
    const [activeTheme, setActiveTheme] = useState<ThemeType>('park');

    const handlePowerUp = (type: PowerUpType) => {
        setActivePowerUp(type);
        setPowerUpTime(100);
        if (type === 'magnet') (window as any).hasMagnet = true;
        if (type === 'rocket') (window as any).isInvincible = true;
        if (type === 'rocket') cameraShaker.trigger(0.5);

        let t = 100;
        const interval = setInterval(() => {
            t -= 2;
            setPowerUpTime(t);
            if (t <= 0) {
                clearInterval(interval);
                setActivePowerUp(null);
                (window as any).hasMagnet = false;
                (window as any).isInvincible = false;
            }
        }, 100);
    };

    const handleCollectCoin = () => {
        setCoins(c => c + 1);
        updateMissions('coin');
    };

    const updateMissions = (type: 'coin' | 'jump' | 'score') => {
        setMissions(prev => prev.map(m => {
            if (m.type === type && !m.completed) {
                const newVal = m.current + 1;
                return { ...m, current: Math.min(newVal, m.target), completed: newVal >= m.target };
            }
            return m;
        }));
    };

    useEffect(() => {
        (window as any).triggerJumpMission = () => updateMissions('jump');
    }, [missions]);

    const handlers = useSwipeable({
        onSwipedLeft: () => (window as any).moveLeft?.(),
        onSwipedRight: () => (window as any).moveRight?.(),
        onSwipedUp: () => (window as any).jump?.(),
        onSwipedDown: () => (window as any).slide?.(),
        trackMouse: true
    });

    const handleGameOver = () => {
        cameraShaker.trigger(1.0);
        setGameState('gameover');
        setActivePowerUp(null);

        if (onGameEnd) {
            onGameEnd({
                score,
                coins,
                missionsCompleted: missions.filter(m => m.completed).length,
                theme: activeTheme
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-[100]" {...handlers}>
            <Canvas shadows dpr={[1, 1.5]}>
                <PerspectiveCamera makeDefault position={[0, 6, 8]} fov={55} />
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 20, -5]} intensity={1.2} castShadow />

                {gameState === 'playing' ? (
                    <>
                        <RunnerPlayer
                            gameState={gameState}
                            setGameState={setGameState}
                            activePowerUp={activePowerUp}
                            onCollect={handleCollectCoin}
                            onScoreUpdate={setScore}
                            onSpeedUpdate={setCurrentSpeed}
                        />
                        <TrackManager
                            onCrash={handleGameOver}
                            onCollect={handleCollectCoin}
                            onPowerUp={handlePowerUp}
                            theme={activeTheme}
                        />
                        <SpeedLines speed={currentSpeed} />
                        <fog attach="fog" args={[THEMES[activeTheme].fog, 10, 80]} />
                        <Stars radius={100} count={5000} fade speed={currentSpeed / 5} />
                    </>
                ) : (
                    <OrbitControls autoRotate enableZoom={false} maxPolarAngle={Math.PI / 2} />
                )}

                {gameState === 'menu' && (
                    <group>
                        <RascalCharacter
                            state="IDLE"
                            speed={0}
                            emotion="happy"
                            laneOffset={0}
                            grounded={true}
                        />
                        <gridHelper args={[20, 20]} />
                        <Stars />
                    </group>
                )}
            </Canvas>

            {/* UI - MENU */}
            {gameState === 'menu' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Footprints className="w-24 h-24 text-yellow-400 mb-4 animate-bounce" />
                    <h1 className="text-6xl font-black text-white italic tracking-tighter mb-2 transform -skew-x-12">MOFFI RASCAL</h1>
                    <p className="text-xl text-white/80 mb-8 font-bold">FAZ 4: ANIMASYON & REAKSİYON</p>

                    {/* THEME SELECTOR */}
                    <div className="flex gap-4 mb-8">
                        {Object.entries(THEMES).map(([key, t]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTheme(key as ThemeType)}
                                className={`px-4 py-2 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${activeTheme === key ? 'bg-white text-black border-yellow-400 scale-110' : 'bg-black/40 text-gray-400 border-white/10'}`}
                            >
                                {key === 'park' ? <Trees className="w-5 h-5" /> : key === 'city' ? <Building2 className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                                <span className="text-xs font-bold uppercase">{t.name}</span>
                            </button>
                        ))}
                    </div>

                    <button onClick={() => { setMissions(generateMissions()); setGameState('playing'); }} className="px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-black text-2xl font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                        <Play className="fill-current w-8 h-8" /> KOŞ!
                    </button>
                    <button onClick={onClose} className="mt-6 text-white/50 font-bold hover:text-white">Çıkış</button>
                </div>
            )}

            {/* UI - HUD */}
            {gameState === 'playing' && (
                <div className="absolute top-0 left-0 w-full p-6 flex flex-col justify-between h-full pointer-events-none pb-20">
                    {/* TOP BAR */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-3">
                            <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                                <Coins className="text-yellow-400 fill-current w-8 h-8 drop-shadow-lg" />
                                <span className="text-3xl font-black text-white tracking-widest">{coins}</span>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                                <Trophy className="text-blue-400 w-6 h-6" />
                                <span className="text-2xl font-bold text-white tracking-wide">{score}m</span>
                            </div>
                        </div>

                        {/* MISSIONS CARD */}
                        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-48">
                            <h4 className="text-[10px] font-black text-white/50 uppercase mb-2">Görevler</h4>
                            <div className="space-y-2">
                                {missions.map(m => (
                                    <div key={m.id} className="text-white">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className={m.completed ? "text-green-400 line-through opacity-50" : "text-white"}>{m.desc}</span>
                                            {m.completed && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                                        </div>
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${(m.current / m.target) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* POWERUP INDICATOR (CENTER) */}
                    <AnimatePresence>
                        {activePowerUp && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                            >
                                <div className="text-6xl animate-bounce drop-shadow-2xl">
                                    {activePowerUp === 'magnet' ? '🧲' : activePowerUp === 'rocket' ? '🚀' : '🐌'}
                                </div>
                                <div className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-md">
                                    {activePowerUp === 'magnet' ? 'MAGNET!' : activePowerUp === 'rocket' ? 'BOOST!' : 'SNAIL!'}
                                </div>
                                <div className="w-32 h-2 bg-black/50 rounded-full mt-2 overflow-hidden border border-white/20">
                                    <motion.div className="h-full bg-white" style={{ width: `${powerUpTime}%` }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* REACTION ICON (Left Side) */}
                    {/* Visual feedback near the character could go here too */}
                </div>
            )}

            {/* UI - GAMEOVER */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 backdrop-blur-md z-50">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-full mb-6 relative">
                        <AlertTriangle className="w-16 h-16 text-red-600" />
                    </motion.div>
                    <h2 className="text-5xl font-black text-white mb-2">ÇARPTIN!</h2>

                    <div className="flex gap-4">
                        <button onClick={() => { setGameState('playing'); setScore(0); setCoins(0); setMissions(generateMissions()); }} className="px-8 py-4 bg-white text-red-900 font-black text-xl rounded-xl shadow-lg hover:bg-gray-100 flex items-center gap-2">
                            <RotateCcw className="w-6 h-6" /> TEKRAR
                        </button>
                        <button onClick={onClose} className="px-8 py-4 bg-black/40 text-white font-bold text-xl rounded-xl hover:bg-black/60 flex items-center gap-2">
                            <Home className="w-6 h-6" /> MENÜ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
