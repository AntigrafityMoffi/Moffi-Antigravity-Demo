"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Pause, Play, StopCircle, Camera, Music,
    Zap, Timer, Flame, CheckCircle2, ChevronLeft, X,
    SkipForward, SkipBack, Share2, Search, Mic, Home, LayoutGrid,
    AlertTriangle, Droplets, Bone, Plus,
    Skull, AlertOctagon, Footprints, MessageSquarePlus,
    Car, Syringe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PLACES, Place } from "@/data/mockPlaces";

// Helper for dist
function getDistKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

import { MOCK_MARKS } from "@/data/mockMarks";

const LiveMap = dynamic(() => import('@/components/walk/GoogleLiveMap'), { ssr: false, loading: () => <div className="bg-[#1A1A1A] w-full h-full flex items-center justify-center text-white font-bold">Harita Yükleniyor...</div> });

function TrackingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams?.get('mode');
    const [userPos, setUserPos] = useState<[number, number]>([41.0082, 28.9784]);
    const [path, setPath] = useState<[number, number][]>([]);
    const [distance, setDistance] = useState(0);
    const [calories, setCalories] = useState(0);
    const [duration, setDuration] = useState(0); // seconds
    const [isPaused, setIsPaused] = useState(false);
    const [showStopConfirm, setShowStopConfirm] = useState(false);
    const [visitedPlaceIds, setVisitedPlaceIds] = useState<string[]>([]);
    const [reward, setReward] = useState<Place | null>(null);

    // Marks State (Lifted Up)
    const [marks, setMarks] = useState(MOCK_MARKS);

    // STATE
    const [activeModal, setActiveModal] = useState<'camera' | 'music' | null>(null);
    const [activeSidebar, setActiveSidebar] = useState<'danger' | null>(null); // Sidebar Expanded State
    const [musicService, setMusicService] = useState<'spotify' | 'yt' | null>(null);
    const [musicQuery, setMusicQuery] = useState("");
    const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // CAMERA
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const watchIdRef = useRef<number | null>(null);


    // PRESET PLAYLISTS
    const PLAYLISTS = [
        { id: 'workout', label: 'Workout Power', service: 'spotify', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP' },
        { id: 'chill', label: 'Chill Walk', service: 'spotify', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3qCx5yEZkcJ' },
    ];

    // DANGER TYPES (Icon Only for Sidebar)
    const DANGER_TYPES = [
        { id: 'traffic', label: 'Trafik', icon: Car, color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
        { id: 'poison', label: 'Zehir/Gıda', icon: Skull, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
        { id: 'glass', label: 'Cam Kırığı', icon: AlertOctagon, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
        { id: 'dog', label: 'Hırçın Köpek', icon: Footprints, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    ];

    // --- MUSIC LOGIC ---
    const handleMusicSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!musicQuery) return;
        setMusicService('yt');
        setCurrentEmbedUrl(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(musicQuery)}+Music`);
    };

    const playPlaylist = (item: typeof PLAYLISTS[0]) => {
        setMusicService(item.service as any);
        setCurrentEmbedUrl(item.url);
    };

    // --- ACTION LOGIC ---
    const handleAction = (type: string, message: string) => {
        setActiveSidebar(null);
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // TIMER
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
                setCalories(prev => prev + 0.05); // Fake calorie burn
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    // GPS TRACKING
    useEffect(() => {
        if (!navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos: [number, number] = [latitude, longitude];
                setUserPos(newPos);

                if (!isPaused) {
                    setPath(prev => {
                        const newPath = [...prev, newPos];
                        if (prev.length > 0) {
                            const lastPos = prev[prev.length - 1];
                            setDistance(curr => curr + getDistKm(lastPos[0], lastPos[1], latitude, longitude));
                        }
                        return newPath;
                    });

                    PLACES.forEach(place => {
                        if (getDistKm(latitude, longitude, place.lat, place.lng) < 0.05 && !visitedPlaceIds.includes(place.id)) {
                            setVisitedPlaceIds(prev => [...prev, place.id]);
                            setReward(place);
                        }
                    });
                }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, distanceFilter: 5 }
        );

        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [isPaused, visitedPlaceIds]);

    // --- CAMERA LOGIC ---
    useEffect(() => {
        if (activeModal === 'camera' && !cameraStream) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    setCameraStream(stream);
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => console.error("Camera denied:", err));
        } else if (activeModal !== 'camera' && cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
            setCapturedPhoto(null);
        }
    }, [activeModal]);

    useEffect(() => {
        if (activeModal === 'camera' && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [activeModal, cameraStream]);

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const data = canvasRef.current.toDataURL('image/png');
                setCapturedPhoto(data);
            }
        }
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleFinish = () => {
        router.push('/walk');
    };

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col font-sans">

            {/* BACK BUTTON */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-[60] w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg active:scale-95"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* TOP STATS */}
            <div className="absolute top-0 left-0 right-0 z-[50] p-6 bg-gradient-to-b from-black/80 to-transparent pt-16 pointer-events-none">
                <div className="flex justify-between items-end text-white">
                    <div>
                        <div className="text-xs font-bold opacity-60 uppercase mb-1">Süre</div>
                        <div className="text-5xl font-black tracking-tighter tabular-nums leading-none">
                            {formatTime(duration)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold tabular-nums">{distance.toFixed(2)} <span className="text-sm font-normal opacity-60">km</span></div>
                        <div className="text-sm font-bold text-orange-400 flex items-center justify-end gap-1">
                            <Flame className="w-3 h-3 fill-current" /> {Math.floor(calories)} kcal
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE MAP */}
            <div className="flex-1 relative z-[0]">
                <LiveMap
                    userPos={userPos}
                    path={path}
                    isTracking={true}
                    visitedPlaceIds={visitedPlaceIds}
                    guardianMode={mode === 'guardian'}
                    places={PLACES}
                    marks={marks}
                />
            </div>

            {/* --- LEFT SIDEBAR (Glassmorphic) --- */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-[55] pl-4 pointer-events-auto flex items-center">

                {/* Main Action Column */}
                <div className="flex flex-col gap-5 bg-black/20 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">

                    {/* Quick Water */}
                    <button
                        onClick={() => handleAction('water', 'Su Molası Kaydedildi! 💧')}
                        className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-white/20 transition-all shadow-lg active:scale-95"
                    >
                        <Droplets className="w-5 h-5" />
                    </button>

                    {/* Quick Poop */}
                    <button
                        onClick={() => handleAction('poop', 'Tuvalet Kaydedildi! 💩')}
                        className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg active:scale-95"
                    >
                        <span className="text-sm leading-none">💩</span>
                    </button>
                </div>

            </div>

            {/* TOAST NOTIFICATION */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-32 left-0 right-0 z-[70] flex justify-center pointer-events-none">
                        <div className="bg-black/80 backdrop-blur text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 border border-white/10">
                            <CheckCircle2 className="w-5 h-5 text-green-500" /> {toastMessage}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BOTTOM CONTROLS */}
            <AnimatePresence>
                {!activeModal && (
                    <motion.div
                        initial={{ y: 0 }} exit={{ y: 200 }}
                        className="absolute bottom-0 left-0 right-0 z-[50] p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent"
                    >
                        <div className="flex items-center justify-between gap-8 max-w-sm mx-auto">
                            <button onClick={() => setActiveModal('camera')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <Camera className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                {!showStopConfirm ? (
                                    <button onClick={() => setIsPaused(!isPaused)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isPaused ? 'bg-green-500 text-white' : 'bg-white text-black'}`}>
                                        {isPaused ? <Play className="w-8 h-8 fill-current translate-x-1" /> : <Pause className="w-8 h-8 fill-current" />}
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowStopConfirm(false)} className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center"><ChevronLeft className="w-6 h-6" /></button>
                                        <button onClick={handleFinish} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse"><StopCircle className="w-8 h-8 fill-current" /></button>
                                    </div>
                                )}
                                {isPaused && !showStopConfirm && (
                                    <button onClick={() => setShowStopConfirm(true)} className="absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center">
                                        <StopCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <button onClick={() => setActiveModal('music')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative">
                                <Music className="w-5 h-5" />
                                {musicService && <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border border-black ${musicService === 'spotify' ? 'bg-[#1DB954]' : 'bg-[#FF0000]'}`} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {/* CAMERA */}
                {activeModal === 'camera' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black">
                        {capturedPhoto ? (
                            <div className="relative w-full h-full">
                                <img src={capturedPhoto} className="w-full h-full object-cover" />
                                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between bg-gradient-to-b from-black/50 to-transparent">
                                    <button onClick={() => setCapturedPhoto(null)} className="text-white font-bold drop-shadow-md">Vazgeç</button>
                                    <button onClick={() => { setActiveModal(null); }} className="text-white font-bold drop-shadow-md">Kaydet</button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                <canvas ref={canvasRef} className="hidden" />
                                <button onClick={() => setActiveModal(null)} className="absolute top-6 left-6 text-white bg-black/50 p-2 rounded-full"><X className="w-6 h-6" /></button>
                                <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
                                    <button onClick={takePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full active:scale-95 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* MUSIC */}
                {activeModal === 'music' && (
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-x-0 bottom-0 z-[60] bg-[#121212] rounded-t-[2rem] shadow-2xl h-[70vh] flex flex-col overflow-hidden">
                        <div className="p-4 bg-[#121212] z-20 border-b border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">Müzik İstasyonu</h2>
                                <button onClick={() => setActiveModal(null)} className="bg-white/10 p-2 rounded-full"><X className="w-5 h-5 text-white" /></button>
                            </div>
                            <form onSubmit={handleMusicSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text" placeholder="Şarkı, sanatçı veya tür ara..."
                                    className="w-full bg-[#2A2A2A] text-white rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#5B4D9D]"
                                    value={musicQuery} onChange={(e) => setMusicQuery(e.target.value)}
                                />
                            </form>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-black/50">
                            {currentEmbedUrl && (
                                <div className="w-full aspect-video bg-black sticky top-0 z-10 shadow-xl">
                                    <iframe src={currentEmbedUrl} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                    <div className="bg-[#121212] p-2 flex justify-between items-center">
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            {musicService === 'spotify' ? <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="w-4 h-4" /> : <Play className="w-4 h-4 text-red-500 fill-current" />}
                                            {musicService === 'spotify' ? 'Spotify Çalıyor' : 'YouTube Çalıyor'}
                                        </div>
                                        <button onClick={() => { setCurrentEmbedUrl(null); setMusicService(null); }} className="text-xs text-red-400 font-bold px-2">Kapat</button>
                                    </div>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm opacity-80"><LayoutGrid className="w-4 h-4" /> Sizin İçin Seçtiklerimiz</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {PLAYLISTS.map((list) => (
                                        <button key={list.id} onClick={() => playPlaylist(list)} className="bg-[#2A2A2A] p-3 rounded-xl flex flex-col gap-2 hover:bg-[#333] transition-colors group text-left relative overflow-hidden">
                                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${list.service === 'spotify' ? 'bg-[#1DB954]' : 'bg-[#FF0000]'}`} />
                                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Music className="w-5 h-5 text-white" /></div>
                                            <div>
                                                <div className="text-white font-bold text-sm">{list.label}</div>
                                                <div className="text-[10px] text-gray-400 opacity-70 uppercase tracking-wider">{list.service}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* REWARD */}
                {reward && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
                        <div className="bg-black/90 backdrop-blur-md text-white p-8 rounded-[2rem] text-center border border-white/10 pointer-events-auto shadow-[0_0_50px_rgba(147,51,234,0.5)]">
                            <div className="text-6xl mb-4 animate-bounce">🎉</div>
                            <h3 className="text-2xl font-black mb-1">{reward.name}</h3>
                            <div className="text-yellow-400 font-black text-4xl mb-4">+{reward.coinReward} PC</div>
                            <button onClick={() => setReward(null)} className="w-full bg-[#5B4D9D] px-6 py-3 rounded-xl font-bold hover:bg-[#4a3e80]">Devam Et</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white">Yükleniyor...</div>}>
            <TrackingContent />
        </Suspense>
    );
}
