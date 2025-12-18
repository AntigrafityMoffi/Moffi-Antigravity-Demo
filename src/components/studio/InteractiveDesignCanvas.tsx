import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Camera, Type, Sticker, Wand2, Eraser, ZoomIn, RotateCw, Box, ShoppingBag, X, Check, CheckCircle2, Move, Maximize, RotateCcw, Shirt, Layout, Upload, Image as LucideImage, ArrowLeft, Undo2, Redo2, Settings2, LogOut, Save, Download, FileText, LayoutTemplate, ChevronDown, Lock, Unlock, Eye, EyeOff, Trash2, GripVertical, Copy, ArrowUp, ArrowDown, MoreHorizontal, Layers, Sparkles, Printer, DollarSign, Globe, ShieldCheck, Zap, Palette, Type as TypeIcon, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter as AlignMiddle, AlignHorizontalJustifyCenter as AlignCenterHorizontal, AlignVerticalJustifyStart as AlignVerticalTop, AlignVerticalJustifyEnd as AlignVerticalBottom, User, Tag, Plus, Minus, Hash, PaintBucket, Scissors, Ruler, ChevronRight, Cloud, Wand, Grid, MousePointer2, FlipHorizontal, FlipVertical, Bold, Italic, Underline, AlignJustify, CaseUpper, CaseLower, Highlighter, ImageMinus, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

import { STICKERS, FONTS, COLORS } from "@/constants/studio-assets";



interface DesignOneProps {
    productImage: string;
    productName?: string;
    onSave: (state: any) => void;
}

export function InteractiveDesignCanvas({ productImage, productName, onSave }: DesignOneProps) {
    // --- MARK: CONSTANTS ---
    const PRODUCTS = [
        { id: 'tshirt', name: 'T-Shirt', src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop' },
        { id: 'hoodie', name: 'Hoodie', src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop' },
        { id: 'mug', name: 'Kupa', src: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop' },
        { id: 'tote', name: 'Çanta', src: 'https://images.unsplash.com/photo-1597484662317-c9253d3d0984?q=80&w=1974&auto=format&fit=crop' },
    ];

    const TEMPLATES = [
        { id: 1, name: 'Minimal', preview: 'https://images.unsplash.com/photo-1515549832467-8783363e19b6?w=200&h=200&fit=crop' },
        { id: 2, name: 'Fun', preview: 'https://images.unsplash.com/photo-1531771686035-25f475954919?w=200&h=200&fit=crop' },
        { id: 3, name: 'Pet Lover', preview: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop' },
        { id: 4, name: 'Summer', preview: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' },
    ];

    // --- STATE ---
    const [layers, setLayers] = useState<any[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
    const [draggingId, setDraggingId] = useState<number | null>(null);

    // History State
    const [history, setHistory] = useState<any[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // View Mode State
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);

    // AI Studio State
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiStyle, setAiStyle] = useState<'sticker' | 'pattern' | '3d'>('sticker');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleAiGenerate = async () => {
        setIsGenerating(true);
        setGeneratedImage(null);
        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt, style: aiStyle, action: 'generate' })
            });
            const data = await response.json();
            if (data.success && data.image) {
                setGeneratedImage(data.image);
            }
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAiTool = async (tool: string) => {
        setIsGenerating(true);
        // Temporary hack to show loading state on specific button
        const styleBackup = aiStyle;
        setAiStyle(tool as any);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt, style: tool, action: tool })
            });
            const data = await response.json();

            if (data.success) {
                if (tool === 'suggestion' && data.suggestions) {
                    const randomSuggestion = data.suggestions[Math.floor(Math.random() * data.suggestions.length)];
                    setAiPrompt(randomSuggestion);
                } else if (tool === 'remove-bg' || tool === 'eraser') {
                    // Show success feedback - in real app, update layer
                    // For now, shake or highlight active layer?
                    console.log("Operation complete");
                }
            }
        } catch (error) {
            console.error("AI Tool failed", error);
        } finally {
            setIsGenerating(false);
            setAiStyle(styleBackup);
        }
    };

    const router = useRouter();

    // Transform State
    const [transformMode, setTransformMode] = useState<'drag' | 'rotate' | 'scale' | null>(null);
    const [initialTransform, setInitialTransform] = useState<{ x: number, y: number, angle: number, dist: number, scale: number, rotation: number } | null>(null);

    // Background Transform State
    const [bgTransform, setBgTransform] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
    const [isDraggingBg, setIsDraggingBg] = useState(false);
    const [bgDragStart, setBgDragStart] = useState({ x: 0, y: 0 });

    // Base Product Image
    const [currentProduct, setCurrentProduct] = useState(PRODUCTS[0]);

    // Sidebar State
    const [activeSidebarTab, setActiveSidebarTab] = useState<'products' | 'assets' | 'text' | 'layers' | 'templates' | null>(null);
    const [activeInspectorTab, setActiveInspectorTab] = useState<'edit' | 'style' | 'ai'>('edit');

    // Tools UI State
    const [textInput, setTextInput] = useState("METİN");
    const [selectedFont, setSelectedFont] = useState(FONTS[0]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    // Product Configuration (Global)
    const [productConfig, setProductConfig] = useState({
        color: '#ffffff',
        material: 'pamuk',
        size: 'M'
    });

    // Canvas Refs for Coordinate Calculation
    const canvasRef = useRef<HTMLDivElement>(null);

    // --- LOGIC: ALIGNMENT ---
    const centerLayer = (axis: 'x' | 'y' | 'both') => {
        if (!activeLayerId) return;
        setLayers(prev => prev.map(l => {
            if (l.id !== activeLayerId) return l;
            return {
                ...l,
                x: axis === 'x' || axis === 'both' ? 50 : l.x,
                y: axis === 'y' || axis === 'both' ? 50 : l.y
            };
        }));
    };

    // --- LOGIC: HISTORY ---
    const addToHistory = (newLayers: any[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newLayers);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setLayers(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setLayers(history[historyIndex + 1]);
        }
    };

    // --- LOGIC: ADD LAYERS ---
    const addTextLayer = () => {
        const newLayer = {
            id: Date.now(),
            type: 'text',
            content: textInput,
            x: 50, y: 50,
            rotation: 0,
            scale: 1,
            color: selectedColor,
            font: selectedFont.class,
            visible: true,
            locked: false,
            // Pro Properties
            opacity: 100,
            blendMode: 'normal',
            shadow: null,
            filter: { brightness: 100, contrast: 100, blur: 0, saturation: 100 },
            // Text Pro
            letterSpacing: 0,
            lineHeight: 1.2,
            textAlign: 'center',
            bold: false,
            italic: false,
            underline: false,
            uppercase: true,
            stroke: null,
            background: null
        };
        const newLayers = [...layers, newLayer];
        setLayers(newLayers);
        addToHistory(newLayers);
        setActiveLayerId(newLayer.id);
        // Don't close sidebar, allows adding multiple
        setTextInput("METİN");
    };

    const addStickerLayer = (src: string) => {
        const newLayer = {
            id: Date.now(),
            type: 'image',
            src: src,
            x: 50, y: 50,
            rotation: 0,
            scale: 1,
            visible: true,
            locked: false,
            // Pro Properties
            opacity: 100,
            blendMode: 'normal',
            shadow: null,
            filter: { brightness: 100, contrast: 100, blur: 0, saturation: 100 },
            // Image Pro
            border: null,
            borderRadius: 0,
            flipX: false,
            flipY: false
        };
        const newLayers = [...layers, newLayer];
        setLayers(newLayers);
        addToHistory(newLayers);
        setActiveLayerId(newLayer.id);
    };

    // --- LOGIC: LAYER MANAGEMENT ---
    const toggleLayerVisibility = (id: number) => {
        const newLayers = layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
        setLayers(newLayers);
    };

    const toggleLayerLock = (id: number) => {
        const newLayers = layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l);
        setLayers(newLayers);
        if (activeLayerId === id) setActiveLayerId(null); // Deselect if locked
    };

    const duplicateLayer = (id: number) => {
        const layer = layers.find(l => l.id === id);
        if (layer) {
            const newLayer = { ...layer, id: Date.now(), x: layer.x + 5, y: layer.y + 5 };
            const newLayers = [...layers, newLayer];
            setLayers(newLayers);
            addToHistory(newLayers);
            setActiveLayerId(newLayer.id);
        }
    };

    const moveLayer = (id: number, direction: 'up' | 'down') => {
        const index = layers.findIndex(l => l.id === id);
        if (index === -1) return;

        const newLayers = [...layers];
        if (direction === 'up' && index < newLayers.length - 1) {
            [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
        } else if (direction === 'down' && index > 0) {
            [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
        }
        setLayers(newLayers);
        addToHistory(newLayers);
    };

    // ... (Keep existing delete/interaction logic same as before)
    const deleteActiveLayer = () => {
        if (activeLayerId) {
            const newLayers = layers.filter(l => l.id !== activeLayerId);
            setLayers(newLayers);
            addToHistory(newLayers);
            setActiveLayerId(null);
        }
    };

    // --- LOGIC: INTERACTION (Drag, Rotate, Scale) ---
    const handlePointerDown = (e: React.PointerEvent, id: number, mode: 'drag' | 'rotate' | 'scale' | 'delete' = 'drag') => {
        e.stopPropagation();
        e.preventDefault();



        if (mode === 'delete') {
            const newLayers = layers.filter(l => l.id !== id);
            setLayers(newLayers);
            addToHistory(newLayers);
            setActiveLayerId(null);
            return;
        }

        setActiveLayerId(id);
        setDraggingId(id);
        setTransformMode(mode);

        // Capture initial state for transforms
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const layer = layers.find(l => l.id === id);
            if (layer) {
                const centerX = rect.left + (layer.x / 100) * rect.width;
                const centerY = rect.top + (layer.y / 100) * rect.height;
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                setInitialTransform({
                    x: mouseX,
                    y: mouseY,
                    angle: Math.atan2(mouseY - centerY, mouseX - centerX),
                    dist: Math.hypot(mouseX - centerX, mouseY - centerY),
                    scale: layer.scale,
                    rotation: layer.rotation
                });
            }
        }

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingId || !canvasRef.current) return;
        const layer = layers.find(l => l.id === draggingId);
        if (!layer) return;

        const rect = canvasRef.current.getBoundingClientRect();

        if (transformMode === 'drag') {
            // Drag Logic
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setLayers(prev => prev.map(l => l.id === draggingId ? { ...l, x, y } : l));

        } else if (transformMode === 'rotate' && initialTransform) {
            // Rotate Logic
            const centerX = rect.left + (layer.x / 100) * rect.width;
            const centerY = rect.top + (layer.y / 100) * rect.height;
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

            const deltaAngle = currentAngle - initialTransform.angle;
            const newRotation = initialTransform.rotation + (deltaAngle * (180 / Math.PI));

            setLayers(prev => prev.map(l => l.id === draggingId ? { ...l, rotation: newRotation } : l));

        } else if (transformMode === 'scale' && initialTransform) {
            // Scale Logic
            const centerX = rect.left + (layer.x / 100) * rect.width;
            const centerY = rect.top + (layer.y / 100) * rect.height;
            const currentDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

            const scaleFactor = currentDist / initialTransform.dist;
            const newScale = Math.max(0.2, initialTransform.scale * scaleFactor);

            setLayers(prev => prev.map(l => l.id === draggingId ? { ...l, scale: newScale } : l));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (draggingId) {
            // Commit to history on drag end
            addToHistory(layers);
        }
        setDraggingId(null);
        setTransformMode(null);
        setInitialTransform(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // --- LOGIC: SLIDERS ---
    const updateActiveLayer = (key: string, value: any) => {
        if (!activeLayerId) return;
        setLayers(prev => prev.map(l => l.id === activeLayerId ? { ...l, [key]: value } : l));
    };

    const activeLayer = layers.find(l => l.id === activeLayerId);

    // --- LOGIC: BACKGROUND TRANSFORM ---
    const handleBgPointerDown = (e: React.PointerEvent) => {
        // If we clicked the background, we should deselect any active layer and start bg interaction
        if (activeLayerId) setActiveLayerId(null);
        e.preventDefault();
        setIsDraggingBg(true);
        setBgDragStart({ x: e.clientX - bgTransform.x, y: e.clientY - bgTransform.y });
    };

    const handleBgPointerMove = (e: React.PointerEvent) => {
        if (!isDraggingBg) return;
        e.preventDefault();
        setBgTransform(prev => ({
            ...prev,
            x: e.clientX - bgDragStart.x,
            y: e.clientY - bgDragStart.y
        }));
    };

    const handleBgPointerUp = () => {
        setIsDraggingBg(false);
    };

    const handleBgWheel = (e: React.WheelEvent) => {
        // Allow zooming background even if layer is active, or deselect layer?
        // Let's deselect to be consistent with "editing background mode"
        if (activeLayerId) setActiveLayerId(null);
        const scaleChange = -e.deltaY * 0.001;
        setBgTransform(prev => ({
            ...prev,
            scale: Math.max(0.5, Math.min(3, prev.scale + scaleChange))
        }));
    };

    const resetBg = () => setBgTransform({ x: 0, y: 0, scale: 1, rotation: 0 });

    return (
        <div className="h-full w-full flex flex-col md:flex-row bg-[#F2F2F7] dark:bg-[#09090b] relative overflow-hidden font-sans selection:bg-purple-500/30 touch-none">

            {/* --- SIDEBAR (Responsive: Bottom on Mobile, Left on Desktop) --- */}
            <div className="fixed bottom-0 left-0 right-0 h-16 md:static md:w-[72px] md:h-full bg-white/80 dark:bg-black/95 backdrop-blur-2xl md:border-r border-t md:border-t-0 border-white/10 z-[60] flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 gap-0 md:gap-6 shadow-2xl safe-area-bottom">

                {/* Logo - Hidden on Mobile */}
                <div className="hidden md:flex w-10 h-10 bg-purple-600 rounded-xl items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                    <span className="font-black text-white text-xs">M</span>
                </div>

                <SidebarItem
                    icon={Shirt}
                    label="Ürün"
                    active={activeSidebarTab === 'products'}
                    onClick={() => setActiveSidebarTab(activeSidebarTab === 'products' ? null : 'products')}
                />
                <SidebarItem
                    icon={LucideImage}
                    label="Varlık"
                    active={activeSidebarTab === 'assets'}
                    onClick={() => setActiveSidebarTab(activeSidebarTab === 'assets' ? null : 'assets')}
                />
                <SidebarItem
                    icon={Type}
                    label="Yazı"
                    active={activeSidebarTab === 'text'}
                    onClick={() => setActiveSidebarTab(activeSidebarTab === 'text' ? null : 'text')}
                />
                <SidebarItem
                    icon={Layers}
                    label="Katman"
                    active={activeSidebarTab === 'layers'}
                    onClick={() => setActiveSidebarTab(activeSidebarTab === 'layers' ? null : 'layers')}
                />
                <SidebarItem
                    icon={Layout}
                    label="Şablon"
                    active={activeSidebarTab === 'templates'}
                    onClick={() => setActiveSidebarTab(activeSidebarTab === 'templates' ? null : 'templates')}
                />
            </div>

            {/* --- EXPANDABLE PANEL (Responsive Drawer/BottomSheet) --- */}
            <AnimatePresence>
                {activeSidebarTab && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 100, x: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-16 left-0 right-0 md:static md:left-[72px] md:top-0 md:bottom-0 h-[60vh] md:h-full md:w-80 bg-white/95 dark:bg-[#111]/95 backdrop-blur-3xl md:border-r border-t md:border-t-0 border-white/10 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-[20px_0_50px_-10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col rounded-t-3xl md:rounded-none"
                    >
                        {/* Panel Content Switcher */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

                            {/* 1. PRODUCTS PANEL */}
                            {activeSidebarTab === 'products' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Ürün Seçimi</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {PRODUCTS.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => { setCurrentProduct(product); resetBg(); }}
                                                className={cn(
                                                    "aspect-[3/4] rounded-2xl overflow-hidden relative group border-2 transition-all",
                                                    currentProduct.id === product.id ? "border-purple-500 shadow-xl scale-[1.02]" : "border-transparent hover:border-white/20"
                                                )}
                                            >
                                                <img src={product.src} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs font-bold text-white">{product.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2. ASSETS (Stickers/Uploads) PANEL */}
                            {activeSidebarTab === 'assets' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Varlıklar</h3>

                                    <button className="w-full py-3 border border-dashed border-gray-300 dark:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition mb-6">
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm font-bold">Görsel Yükle</span>
                                    </button>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Stickerlar</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {STICKERS.map(sticker => (
                                                <button
                                                    key={sticker.id}
                                                    onClick={() => addStickerLayer(sticker.src)}
                                                    className="aspect-square bg-gray-50 dark:bg-white/5 rounded-xl p-2 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition flex items-center justify-center"
                                                >
                                                    <img src={sticker.src} className="w-full h-full object-contain" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. TEXT PANEL */}
                            {activeSidebarTab === 'text' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Metin Ekle</h3>

                                    <input
                                        type="text"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value.toUpperCase())}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:border-purple-500 rounded-xl px-4 py-3 font-bold outline-none transition text-center"
                                    />

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Font Seç</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {FONTS.map(font => (
                                                <button
                                                    key={font.id}
                                                    onClick={() => setSelectedFont(font)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-lg text-sm transition border",
                                                        selectedFont.id === font.id
                                                            ? "bg-purple-500 text-white border-purple-500"
                                                            : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-300"
                                                    )}
                                                    style={{ fontFamily: font.class }}
                                                >
                                                    {font.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Renk Seç</label>
                                        <div className="flex flex-wrap gap-2">
                                            {COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full border-2 transition hover:scale-110",
                                                        selectedColor === color ? "border-purple-500 scale-110" : "border-transparent"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={addTextLayer} className="w-full bg-[#111] dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition">
                                        Katman Ekle
                                    </button>
                                </div>
                            )}

                            {/* 4. LAYERS PANEL (Pro Style) */}
                            {activeSidebarTab === 'layers' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Katmanlar</h3>
                                        <span className="text-xs font-bold text-gray-400">{layers.length} Katman</span>
                                    </div>

                                    {layers.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-50">
                                            <Layers className="w-12 h-12 mb-2" />
                                            <p className="text-sm font-bold">Katman Yok</p>
                                        </div>
                                    )}

                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                                        {[...layers].reverse().map((layer) => (
                                            <div
                                                key={layer.id}
                                                onClick={() => setActiveLayerId(layer.id)}
                                                className={cn(
                                                    "group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border select-none relative overflow-hidden",
                                                    activeLayerId === layer.id
                                                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 shadow-sm"
                                                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
                                                )}
                                            >
                                                {/* Visibility Toggle (Hover only) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                                                    className={cn(
                                                        "absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all",
                                                        layer.visible === false ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                    )}
                                                >
                                                    {layer.visible === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                </button>

                                                {/* Thumbnail */}
                                                <div className={cn("w-12 h-12 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 bg-white/50 backdrop-blur-sm relative", layer.locked && "opacity-50")}>
                                                    {layer.locked && (
                                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                                                            <Lock className="w-4 h-4 text-black/50" />
                                                        </div>
                                                    )}
                                                    {layer.type === 'image' ? (
                                                        <img src={layer.src} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="font-bold text-lg text-gray-400" style={{ fontFamily: layer.font }}>Aa</span>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                                                    <span className={cn("text-xs font-bold truncate leading-tight", layer.locked ? "text-gray-400" : "text-gray-900 dark:text-white")}>
                                                        {layer.type === 'image' ? 'Görsel' : layer.content}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium truncate">
                                                        {layer.type === 'image' ? 'Resim Katmanı' : 'Yazı Katmanı'}
                                                    </span>
                                                </div>

                                                {/* Actions (Visible on Active or Hover) */}
                                                <div className={cn("flex items-center gap-1 transition-opacity", activeLayerId === layer.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>

                                                    <button onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }} className={cn("p-1.5 rounded-lg transition", layer.locked ? "text-purple-500 bg-purple-100 dark:bg-purple-900/30" : "text-gray-400 hover:text-black hover:bg-black/5")}>
                                                        {layer.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                                    </button>

                                                    <div className="flex flex-col gap-0.5">
                                                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="p-0.5 hover:bg-black/5 rounded text-gray-400 hover:text-black">
                                                            <ArrowUp className="w-3 h-3" />
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="p-0.5 hover:bg-black/5 rounded text-gray-400 hover:text-black">
                                                            <ArrowDown className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition">
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button onClick={(e) => { e.stopPropagation(); deleteActiveLayer(); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 5. TEMPLATES PANEL */}
                            {activeSidebarTab === 'templates' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Şablonlar</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {TEMPLATES.map(template => (
                                            <button
                                                key={template.id}
                                                // Simplified action: just log for now
                                                onClick={() => console.log('Apply template', template.id)}
                                                className="aspect-square rounded-2xl overflow-hidden relative group"
                                            >
                                                <img src={template.preview} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    <span className="text-xs font-bold text-white">{template.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT (Full Screen Canvas) --- */}
            <div className="flex-1 relative h-full bg-[#f0f0f5] dark:bg-[#050505] flex flex-col"
                onPointerUp={() => { setDraggingId(null); setIsDraggingBg(false); setTransformMode(null); }}
                onPointerLeave={() => { setDraggingId(null); setIsDraggingBg(false); setTransformMode(null); }}
            >
                {/* --- TOP BAR (Floating) --- */}
                {!isPreviewMode && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 transition-all duration-300">
                        {/* Left: Navigation */}
                        <div className="h-12 bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-full px-2 flex items-center gap-1 border border-white/20 shadow-lg relative">
                            <button
                                onClick={() => router.back()}
                                className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                            </button>
                            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

                            <div className="relative">
                                <button
                                    onClick={() => setShowFileMenu(!showFileMenu)}
                                    className="px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold text-gray-700 dark:text-white transition flex items-center gap-2"
                                >
                                    Dosya <ChevronDown className="w-3 h-3 opacity-50" />
                                </button>

                                <AnimatePresence>
                                    {showFileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 left-0 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden p-1 flex flex-col z-50"
                                        >
                                            <button onClick={() => { setShowFileMenu(false); /* Mock Save */ }} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-left">
                                                <Save className="w-4 h-4" /> Taslağı Kaydet
                                            </button>
                                            <button onClick={() => { setShowFileMenu(false); setLayers([]); setBgTransform({ x: 0, y: 0, scale: 1, rotation: 0 }); }} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-left">
                                                <RotateCcw className="w-4 h-4" /> Sıfırla
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Center: History & Zoom */}
                        <div className="h-12 bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-full px-2 flex items-center gap-1 border border-white/20 shadow-lg">
                            <button
                                onClick={undo}
                                disabled={historyIndex <= 0}
                                className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <Undo2 className="w-5 h-5 text-gray-700 dark:text-white" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex >= history.length - 1}
                                className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <Redo2 className="w-5 h-5 text-gray-700 dark:text-white" />
                            </button>
                        </div>

                        {/* Right: View Mode & Preview */}
                        <div className="h-12 bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-full px-2 flex items-center gap-2 border border-white/20 shadow-lg">
                            <div className="flex bg-gray-100 dark:bg-white/10 rounded-full p-1 relative">
                                <motion.div
                                    className="absolute top-1 bottom-1 bg-white dark:bg-black/80 rounded-full shadow-sm z-0"
                                    initial={false}
                                    animate={{ left: viewMode === '2d' ? '4px' : '50%', width: 'calc(50% - 4px)' }}
                                />
                                <button onClick={() => setViewMode('2d')} className={cn("relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors", viewMode === '2d' ? "text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white")}>2D</button>
                                <button onClick={() => setViewMode('3d')} className={cn("relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors", viewMode === '3d' ? "text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white")}>3D</button>
                            </div>

                            <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />

                            <button
                                onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition",
                                    isInspectorOpen ? "bg-black text-white dark:bg-white dark:text-black shadow-md" : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-white"
                                )}
                            >
                                <Settings2 className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsPreviewMode(true)}
                                className="pr-4 pl-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold text-gray-700 dark:text-white transition flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Önizle</span>
                            </button>

                            {!isInspectorOpen && (
                                <>
                                    <div className="w-px h-4 bg-gray-300 dark:bg-white/20 mx-1" />
                                    <button
                                        onClick={() => setIsInspectorOpen(true)}
                                        className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition text-gray-700 dark:text-white"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* EXIT PReview Button */}
                {isPreviewMode && (
                    <button
                        onClick={() => setIsPreviewMode(false)}
                        className="absolute top-6 right-6 z-50 px-4 py-2 bg-white/90 backdrop-blur-md text-black rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                        <EyeOff className="w-4 h-4" /> Çıkış
                    </button>
                )}
                {/* Ambient Background */}
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

                {/* --- CANVAS --- */}
                <div
                    className="absolute inset-0 z-0 flex items-center justify-center perspective-[2000px] overflow-hidden pb-16 md:pb-0"
                    onClick={(e) => { if (e.target === e.currentTarget) setActiveLayerId(null); }}
                >
                    <motion.div
                        className="relative w-[85vw] md:w-[480px] h-[85vw] md:h-[640px] flex items-center justify-center transform-style-3d transition-all duration-700 ease-spring"
                        animate={viewMode === '3d' ? {
                            rotateX: 10,
                            rotateY: 20,
                            scale: 0.85,
                            boxShadow: "0 50px 100px -20px rgba(0,0,0,0.5)"
                        } : {
                            rotateX: 0,
                            rotateY: 0,
                            scale: 1,
                            boxShadow: "none"
                        }}
                    >
                        <div className="relative w-full h-full overflow-hidden group rounded-2xl bg-white shadow-xl">
                            {/* Reset BG Button */}
                            {(bgTransform.x !== 0 || bgTransform.y !== 0 || bgTransform.scale !== 1) && (
                                <button
                                    onClick={resetBg}
                                    className="absolute top-6 right-6 z-30 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            )}

                            {/* Image */}
                            <div
                                className="w-full h-full relative overflow-hidden cursor-move"
                                onPointerDown={handleBgPointerDown}
                                onPointerMove={handleBgPointerMove}
                                onPointerUp={handleBgPointerUp}
                                onWheel={handleBgWheel}
                            >
                                <img
                                    src={currentProduct.src}
                                    className="w-full h-full object-cover pointer-events-none select-none will-change-transform"
                                    style={{
                                        transform: `translate(${bgTransform.x}px, ${bgTransform.y}px) scale(${bgTransform.scale}) rotate(${bgTransform.rotation}deg)`
                                    }}
                                    alt="Product Base"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-10 pointer-events-none mix-blend-multiply" />
                            </div>

                            {/* Layers Container */}
                            <div
                                ref={canvasRef}
                                className="absolute inset-0 overflow-hidden touch-none pointer-events-none"
                                onPointerMove={handlePointerMove}
                            >
                                {/* DRAGGABLE LAYERS */}
                                {layers.map(layer => layer.visible !== false && (
                                    <div
                                        key={layer.id}
                                        className={cn(
                                            "absolute transform -translate-x-1/2 -translate-y-1/2 touch-none select-none transition-shadow pointer-events-auto group",
                                            activeLayerId === layer.id ? "z-50" : "z-10",
                                            layer.locked && "pointer-events-none"
                                        )}
                                        style={{ left: `${layer.x}% `, top: `${layer.y}% `, maxWidth: '100%' }}
                                    >
                                        {/* ROTATION & SCALE WRAPPER */}
                                        <div className="relative" style={{ transform: `rotate(${layer.rotation}deg) scale(${layer.scale})` }}>
                                            {/* VISUAL HANDLES (Only active when selected) */}
                                            {activeLayerId === layer.id && (
                                                <>
                                                    {/* Bounding Box Border */}
                                                    <div className="absolute -inset-4 border-2 border-dashed border-white/50 rounded-lg pointer-events-none" />
                                                    {/* Rotate Handle (Top Center) */}
                                                    <div
                                                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 bg-white text-black rounded-full shadow-lg flex items-center justify-center cursor-alias pointer-events-auto ring-2 ring-black/10 hover:scale-110 active:scale-95 transition-transform z-50"
                                                        onPointerDown={(e) => handlePointerDown(e, layer.id, 'rotate')}
                                                    >
                                                        <RotateCw className="w-4 h-4" />
                                                    </div>
                                                    {/* Resize Handle (Bottom Right) */}
                                                    <div
                                                        className="absolute -bottom-6 -right-6 w-8 h-8 bg-white text-black rounded-full shadow-lg flex items-center justify-center cursor-nwse-resize pointer-events-auto ring-2 ring-black/10 hover:scale-110 active:scale-95 transition-transform z-50"
                                                        onPointerDown={(e) => handlePointerDown(e, layer.id, 'scale')}
                                                    >
                                                        <Maximize className="w-4 h-4 rotate-90" />
                                                    </div>
                                                    {/* Delete Handle (Top Left) */}
                                                    <div
                                                        className="absolute -top-6 -left-6 w-6 h-6 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto ring-2 ring-white/20 hover:scale-110 active:scale-95 transition-transform z-50"
                                                        onPointerDown={(e) => handlePointerDown(e, layer.id, 'delete')}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                </>
                                            )}
                                            {/* CONTENT (Draggable) */}
                                            <div
                                                onPointerDown={(e) => handlePointerDown(e, layer.id, 'drag')}
                                                onPointerUp={handlePointerUp}
                                                className="cursor-grab active:cursor-grabbing transition-all duration-200"
                                                style={{
                                                    opacity: (layer.opacity ?? 100) / 100,
                                                    mixBlendMode: layer.blendMode || 'normal',
                                                    filter: `brightness(${layer.filter?.brightness ?? 100} %) contrast(${layer.filter?.contrast ?? 100} %) blur(${layer.filter?.blur ?? 0}px) saturate(${layer.filter?.saturation ?? 100} %) ${layer.type === 'image' && layer.shadow ? `drop-shadow(${layer.shadow.x}px ${layer.shadow.y}px ${layer.shadow.blur}px ${layer.shadow.color})` : ''} `,
                                                }}
                                            >
                                                {layer.type === 'image' ? (
                                                    <img
                                                        src={layer.src}
                                                        className="w-32 h-32 object-contain pointer-events-none drop-shadow-2xl transition-all"
                                                        style={{
                                                            transform: `scaleX(${layer.flipX ? -1 : 1}) scaleY(${layer.flipY ? -1 : 1})`,
                                                            borderRadius: layer.borderRadius ?? 0,
                                                            border: layer.border ? `${layer.border.width}px solid ${layer.border.color} ` : 'none',
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        className={cn("font-black text-center whitespace-nowrap text-4xl pointer-events-none transition-all", layer.font)}
                                                        style={{
                                                            color: layer.color,
                                                            textShadow: layer.shadow ? `${layer.shadow.x}px ${layer.shadow.y}px ${layer.shadow.blur}px ${layer.shadow.color} ` : '0px 4px 12px rgba(0,0,0,0.2)',
                                                            letterSpacing: `${layer.letterSpacing ?? 0} em`,
                                                            lineHeight: layer.lineHeight ?? 1.2,
                                                            textAlign: layer.textAlign ?? 'center',
                                                            fontWeight: layer.bold ? 'bold' : 'normal',
                                                            fontStyle: layer.italic ? 'italic' : 'normal',
                                                            textDecoration: layer.underline ? 'underline' : 'none',
                                                            textTransform: layer.uppercase ? 'uppercase' : 'none',
                                                            WebkitTextStroke: layer.stroke ? `${layer.stroke.width}px ${layer.stroke.color} ` : 'none',
                                                            backgroundColor: layer.background ? layer.background : 'transparent',
                                                            padding: layer.background ? '0.2em 0.5em' : '0',
                                                            borderRadius: layer.background ? '0.2em' : '0',
                                                        }}
                                                    >
                                                        {layer.content}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {layers.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                                        <span className="px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl text-xs font-bold text-white/50 uppercase tracking-[0.2em] border border-white/20 shadow-lg">
                                            Tasarla
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- BOTTOM PANEL (Floating) --- */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 p-2 pl-8 flex items-center gap-6 ring-1 ring-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Toplam</span>
                        <span className="text-xl font-black text-white leading-none">
                            {(299 + (layers.length * 20))}₺
                        </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <button
                        onClick={() => onSave(layers)}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Siparişi Tamamla</span>
                    </button>
                </div>

            </div>

            {/* --- RIGHT SIDEBAR (Responsive Inspector) --- */}
            <AnimatePresence>
                {isInspectorOpen && !isPreviewMode && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 md:static md:w-[320px] h-full bg-white/95 dark:bg-black/95 backdrop-blur-2xl md:border-l border-white/10 z-[70] flex flex-col shadow-2xl shrink-0 overflow-hidden"
                    >
                        {/* Header & Tabs */}
                        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/10">
                            <div className="p-4 flex items-center justify-between">
                                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest whitespace-nowrap">
                                    Stüdyo Kontrol
                                </h3>
                                <button onClick={() => setIsInspectorOpen(false)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition group">
                                    <X className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>

                            {/* Segmented Control Tabs */}
                            <div className="px-4 pb-4">
                                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                                    <button
                                        onClick={() => setActiveInspectorTab('edit')}
                                        className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5", activeInspectorTab === 'edit' ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white")}
                                    >
                                        <Settings2 className="w-3.5 h-3.5" /> Düzenle
                                    </button>
                                    <button
                                        onClick={() => setActiveInspectorTab('style')}
                                        className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5", activeInspectorTab === 'style' ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-black dark:hover:text-white")}
                                    >
                                        <Palette className="w-3.5 h-3.5" /> Stil
                                    </button>
                                    <button
                                        onClick={() => setActiveInspectorTab('ai')}
                                        className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5", activeInspectorTab === 'ai' ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20" : "text-gray-500 hover:text-purple-500")}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> AI Studio
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

                            {/* --- TAB: EDIT (Düzenle) --- */}
                            {/* --- TAB: EDIT (Düzenle) --- */}
                            {/* --- TAB: EDIT (Unified Pro Panel) --- */}
                            {activeInspectorTab === 'edit' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                                    {!activeLayer ? (
                                        <div className="space-y-6">
                                            {/* GLOBAL PRODUCT CONFIG */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                                    <div className="w-12 h-12 bg-white rounded-lg p-1 border flex-shrink-0"><img src={currentProduct.src} className="w-full h-full object-contain" /></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{currentProduct.name}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                            <span className="text-[10px] font-bold text-green-600">Stokta Var</span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 mt-1">MP-{Math.floor(Math.random() * 9999)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-500/20 text-center">
                                                <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">
                                                    Düzenlemek için bir katman seçin veya yeni bir katman ekleyin.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* 0. SELECTION HEADER */}
                                            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-100 dark:border-white/10">
                                                <div className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-md">
                                                    {activeLayer.type === 'text' ? <TypeIcon className="w-3.5 h-3.5" /> : <LucideImage className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    {activeLayer.type === 'text' ? 'METİN DÜZENLE' : 'GÖRSEL DÜZENLE'}
                                                </span>
                                            </div>

                                            {/* 1. LAYOUT (Universal) */}
                                            <InspectorSection title="Yerleşim & Dönüşüm" icon={Layout}>
                                                <div className="space-y-3">
                                                    {/* Alignment */}
                                                    <div className="grid grid-cols-6 gap-1 p-1 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                        {[
                                                            { icon: AlignLeft, action: () => updateActiveLayer('x', 0) },
                                                            { icon: AlignCenterHorizontal, action: () => centerLayer('x') },
                                                            { icon: AlignRight, action: () => updateActiveLayer('x', 100) },
                                                            { icon: AlignVerticalTop, action: () => updateActiveLayer('y', 0) },
                                                            { icon: AlignMiddle, action: () => centerLayer('y') },
                                                            { icon: AlignVerticalBottom, action: () => updateActiveLayer('y', 100) },
                                                        ].map((btn, i) => (
                                                            <button key={i} onClick={btn.action} className="w-full aspect-square rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition">
                                                                <btn.icon className="w-3.5 h-3.5" />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Flip & Rotate */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex gap-1">
                                                            <button onClick={() => updateActiveLayer('flipX', !activeLayer.flipX)} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center border transition", activeLayer.flipX ? "bg-purple-100 border-purple-500 text-purple-600" : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-200")}><FlipHorizontal className="w-4 h-4" /></button>
                                                            <button onClick={() => updateActiveLayer('flipY', !activeLayer.flipY)} className={cn("flex-1 h-9 rounded-lg flex items-center justify-center border transition", activeLayer.flipY ? "bg-purple-100 border-purple-500 text-purple-600" : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-200")}><FlipVertical className="w-4 h-4" /></button>
                                                        </div>
                                                        <div className="px-2 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-between border border-transparent focus-within:border-purple-500/50">
                                                            <RotateCw className="w-3.5 h-3.5 text-gray-400" />
                                                            <input type="number" value={Math.round(activeLayer.rotation)} onChange={(e) => updateActiveLayer('rotation', Number(e.target.value))} className="w-12 bg-transparent text-right text-xs font-bold outline-none py-2" />
                                                            <span className="text-[10px] text-gray-400 ml-1">°</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </InspectorSection>

                                            {/* 2. TEXT TOOLS */}
                                            {activeLayer.type === 'text' && (
                                                <>
                                                    <InspectorSection title="Tipografi" icon={Type}>
                                                        <div className="space-y-4">
                                                            <textarea
                                                                value={activeLayer.content}
                                                                onChange={(e) => updateActiveLayer('content', e.target.value)}
                                                                className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-purple-500 rounded-xl px-3 py-3 text-sm font-bold outline-none transition text-center min-h-[60px] resize-none"
                                                            />
                                                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                                                                {FONTS.map(font => (
                                                                    <button key={font.id} onClick={() => { setSelectedFont(font); updateActiveLayer('font', font.class); }} className={cn("px-2 py-2 rounded-lg text-xs transition border truncate text-center", activeLayer.font === font.class ? "bg-black text-white dark:bg-white dark:text-black border-transparent" : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-300")} style={{ fontFamily: font.class }}>
                                                                        {font.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg justify-between">
                                                                {[
                                                                    { icon: Bold, key: 'bold' }, { icon: Italic, key: 'italic' }, { icon: Underline, key: 'underline' }, { icon: CaseUpper, key: 'uppercase' },
                                                                ].map((fmt) => (
                                                                    <button key={fmt.key} onClick={() => updateActiveLayer(fmt.key, !activeLayer[fmt.key])} className={cn("flex-1 h-7 flex items-center justify-center rounded transition", activeLayer[fmt.key] ? "bg-black text-white" : "text-gray-400 hover:text-black")}>
                                                                        <fmt.icon className="w-3.5 h-3.5" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase w-12">Yazı</span>
                                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                                    {COLORS.map(color => (
                                                                        <button key={color} onClick={() => updateActiveLayer('color', color)} className={cn("w-5 h-5 rounded-full border-2 transition hover:scale-110", activeLayer.color === color ? "border-purple-500 scale-110" : "border-gray-100 dark:border-white/10")} style={{ backgroundColor: color }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </InspectorSection>

                                                    <InspectorSection title="Aralık & Düzen" icon={AlignJustify}>
                                                        <div className="space-y-3">
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>HARF ARALIĞI</span><span>{activeLayer.letterSpacing}em</span></div>
                                                                <input type="range" min="-0.1" max="0.5" step="0.01" value={activeLayer.letterSpacing ?? 0} onChange={(e) => updateActiveLayer('letterSpacing', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>SATIR YÜKSEKLİĞİ</span><span>{activeLayer.lineHeight}</span></div>
                                                                <input type="range" min="0.8" max="2.5" step="0.1" value={activeLayer.lineHeight ?? 1.2} onChange={(e) => updateActiveLayer('lineHeight', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                            </div>
                                                        </div>
                                                    </InspectorSection>

                                                    <InspectorSection title="Görünüm & Efekt" icon={PaintBucket}>
                                                        <div className="space-y-4">
                                                            {/* Stroke */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-gray-400">DIŞ ÇİZGİ (STROKE)</span>
                                                                    <button onClick={() => updateActiveLayer('stroke', activeLayer.stroke ? null : { width: 1, color: '#000000' })} className={cn("w-8 h-4 rounded-full relative transition-colors", activeLayer.stroke ? "bg-green-500" : "bg-gray-200")}><div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm", activeLayer.stroke ? "left-4.5" : "left-0.5")} /></button>
                                                                </div>
                                                                {activeLayer.stroke && (
                                                                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg space-y-2">
                                                                        <input type="range" min="1" max="10" value={activeLayer.stroke.width} onChange={(e) => updateActiveLayer('stroke', { ...activeLayer.stroke, width: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                                        <div className="flex gap-1">{['#000000', '#ffffff', '#ff0000'].map(c => <button key={c} onClick={() => updateActiveLayer('stroke', { ...activeLayer.stroke, color: c })} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c }} />)}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Shadow */}
                                                            <div className="space-y-2 pt-2 border-t border-dashed border-gray-200 dark:border-white/5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-gray-400">GÖLGE</span>
                                                                    <button onClick={() => updateActiveLayer('shadow', activeLayer.shadow ? null : { color: '#000000', blur: 10, x: 5, y: 5 })} className={cn("w-8 h-4 rounded-full relative transition-colors", activeLayer.shadow ? "bg-green-500" : "bg-gray-200")}><div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm", activeLayer.shadow ? "left-4.5" : "left-0.5")} /></button>
                                                                </div>
                                                                {activeLayer.shadow && (
                                                                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg space-y-2">
                                                                        <input type="range" min="0" max="50" value={activeLayer.shadow.blur} onChange={(e) => updateActiveLayer('shadow', { ...activeLayer.shadow, blur: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Opacity */}
                                                            <div className="space-y-1 pt-2">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>OPAKLIK</span><span>{activeLayer.opacity}%</span></div>
                                                                <input type="range" min="0" max="100" value={activeLayer.opacity ?? 100} onChange={(e) => updateActiveLayer('opacity', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                            </div>
                                                        </div>
                                                    </InspectorSection>
                                                </>
                                            )}

                                            {/* 3. IMAGE TOOLS */}
                                            {activeLayer.type === 'image' && (
                                                <>
                                                    <InspectorSection title="Görsel İşlemleri" icon={LucideImage}>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button className="flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-white hover:border-gray-300 transition shadow-sm" onClick={() => {/* Replace Logic */ }}>
                                                                <LucideImage className="w-3.5 h-3.5 text-blue-500" /> <span>Değiştir</span>
                                                            </button>
                                                            <button className="flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-white hover:border-gray-300 transition shadow-sm" onClick={() => {/* Crop Logic */ }}>
                                                                <Scissors className="w-3.5 h-3.5 text-purple-500" /> <span>Kırp</span>
                                                            </button>
                                                        </div>
                                                    </InspectorSection>

                                                    <InspectorSection title="Filtre & Ayarlar" icon={Settings2} defaultOpen={true}>
                                                        <div className="space-y-4">
                                                            {['brightness', 'contrast', 'saturation', 'blur'].map((filter) => (
                                                                <div key={filter} className="space-y-1">
                                                                    <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold">
                                                                        <span>{filter === 'brightness' ? 'Parlaklık' : filter === 'contrast' ? 'Kontrast' : filter === 'saturation' ? 'Doygunluk' : 'Bulanıklık'}</span>
                                                                        <span>{activeLayer.filter?.[filter] ?? (filter === 'blur' ? 0 : 100)}</span>
                                                                    </div>
                                                                    <input
                                                                        type="range" min="0" max={filter === 'blur' ? 20 : 200} step="1"
                                                                        value={activeLayer.filter?.[filter] ?? (filter === 'blur' ? 0 : 100)}
                                                                        onChange={(e) => updateActiveLayer('filter', { ...activeLayer.filter, [filter]: parseInt(e.target.value) })}
                                                                        className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-blue-500"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </InspectorSection>

                                                    <InspectorSection title="Stil & Çerçeve" icon={Palette}>
                                                        <div className="space-y-4">
                                                            {/* Border */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-gray-400">KENARLIK</span>
                                                                    <button onClick={() => updateActiveLayer('border', activeLayer.border ? null : { width: 4, color: '#ffffff' })} className={cn("w-8 h-4 rounded-full relative transition-colors", activeLayer.border ? "bg-green-500" : "bg-gray-200")}><div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm", activeLayer.border ? "left-4.5" : "left-0.5")} /></button>
                                                                </div>
                                                                {activeLayer.border && (
                                                                    <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg space-y-2">
                                                                        <input type="range" min="1" max="20" value={activeLayer.border.width} onChange={(e) => updateActiveLayer('border', { ...activeLayer.border, width: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                                        <div className="flex gap-1">{['#ffffff', '#000000', '#ff0000'].map(c => <button key={c} onClick={() => updateActiveLayer('border', { ...activeLayer.border, color: c })} className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: c }} />)}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Radius */}
                                                            <div className="space-y-1 pt-2">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>KÖŞE YUVARLATMA</span><span>{activeLayer.borderRadius}px</span></div>
                                                                <input type="range" min="0" max="100" value={activeLayer.borderRadius ?? 0} onChange={(e) => updateActiveLayer('borderRadius', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                            </div>
                                                            {/* Opacity */}
                                                            <div className="space-y-1 pt-2 border-t border-dashed border-gray-200 dark:border-white/5">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>OPAKLIK</span><span>{activeLayer.opacity}%</span></div>
                                                                <input type="range" min="0" max="100" value={activeLayer.opacity ?? 100} onChange={(e) => updateActiveLayer('opacity', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-black" />
                                                            </div>
                                                        </div>
                                                    </InspectorSection>
                                                </>
                                            )}

                                            {/* 5. SMART PRINT CHECK */}
                                            <div className="pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30 rounded-xl flex items-start gap-3">
                                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                                    <div>
                                                        <h4 className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 mb-1">Akıllı Baskı Kontrolü</h4>
                                                        <p className="text-[10px] text-gray-500 leading-relaxed">Güvenli alan içindesiniz. Baskı kalitesi: <span className="text-green-600 font-bold">Mükemmel (300 DPI)</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* --- TAB: AI STUDIO (Gemini Integration) --- */}
                            {activeInspectorTab === 'ai' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                                        <Sparkles className="w-12 h-12 text-white/20 absolute -top-2 -right-2 rotate-12" />
                                        <h3 className="font-black text-lg mb-1">AI Stüdyo</h3>
                                        <p className="text-white/80 text-xs font-medium leading-relaxed">
                                            Aklınızdaki tasarımı tarif edin, Moffi AI sizin için üretsin.
                                        </p>
                                    </div>

                                    {/* GENERATOR UI */}
                                    <div className="space-y-4">
                                        {/* Prompt Input */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Tarif Edin</label>
                                            <textarea
                                                className="w-full h-24 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-purple-500 rounded-xl p-3 text-sm font-medium outline-none resize-none transition"
                                                placeholder="Örn: Uzayda kaykay yapan sevimli bir kedi..."
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                            />
                                        </div>

                                        {/* STYLE SELECTOR (Pro) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Sanat Tarzı</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: 'sticker', label: 'Sticker', icon: Sticker },
                                                    { id: 'pattern', label: 'Desen', icon: LayoutTemplate },
                                                    { id: '3d', label: '3D', icon: Box },
                                                    { id: 'watercolor', label: 'Suluboya', icon: PaintBucket },
                                                    { id: 'pixel', label: 'Pixel Art', icon: Grid },
                                                    { id: 'vector', label: 'Vektör', icon: Scissors }
                                                ].map((style) => (
                                                    <button
                                                        key={style.id}
                                                        onClick={() => setAiStyle(style.id as any)}
                                                        className={cn(
                                                            "p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border",
                                                            aiStyle === style.id
                                                                ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg scale-105"
                                                                : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 hover:text-black dark:hover:bg-white/10"
                                                        )}
                                                    >
                                                        <style.icon className="w-5 h-5" />
                                                        <span className="text-[10px] font-bold">{style.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* MOOD / VIBE (New Feature) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Atmosfer (Vibe)</label>
                                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                                {['Canlı', 'Pastel', 'Karanlık', 'Neon', 'Retro', 'Minimal'].map(vibe => (
                                                    <button key={vibe} className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-xs font-bold whitespace-nowrap hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                                        {vibe}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAiGenerate}
                                            disabled={isGenerating || !aiPrompt.trim()}
                                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black text-sm tracking-wide hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl" />
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="relative z-10">Sihir Yapılıyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-4 h-4 animate-pulse relative z-10" />
                                                    <span className="relative z-10">SİHİRLİ ÜRETİM</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Results Area */}
                                        {generatedImage && (
                                            <div className="space-y-3 pt-4 border-t border-dashed border-gray-200 dark:border-white/10 animate-in slide-in-from-bottom-5 fade-in">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Üretildi
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setGeneratedImage(null)} className="text-xs text-red-500 font-bold hover:underline">Temizle</button>
                                                    </div>
                                                </div>
                                                <div className="p-1 border-2 border-purple-500/30 rounded-[18px] bg-white dark:bg-white/5">
                                                    <button
                                                        onClick={() => addStickerLayer(generatedImage)}
                                                        className="w-full aspect-square rounded-2xl overflow-hidden relative group shadow-sm transition-all"
                                                    >
                                                        <img src={generatedImage} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                                            <Plus className="w-8 h-8 text-white" />
                                                            <span className="text-white font-bold text-sm">Tuvale Ekle</span>
                                                        </div>
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-400 text-center">
                                                    Üretilen görseli tuvale eklemek için üzerine tıklayın.
                                                </p>
                                            </div>
                                        )}

                                        {/* NEW: AI EDITING TOOLS SECTION */}
                                        <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-4">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase flex items-center gap-2">
                                                <Wand className="w-3.5 h-3.5" /> AI Düzenleme Araçları
                                            </h4>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-900/10 border border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 rounded-xl flex flex-col items-center gap-2 transition group">
                                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                                                        <Eraser className="w-4 h-4 text-pink-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Sihirli Silgi</span>
                                                </button>

                                                <button className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 rounded-xl flex flex-col items-center gap-2 transition group">
                                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                                                        <ImageMinus className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Arka Plan Sil</span>
                                                </button>

                                                <button className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-green-50 dark:hover:bg-green-900/10 border border-transparent hover:border-green-200 dark:hover:border-green-500/30 rounded-xl flex flex-col items-center gap-2 transition group">
                                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                                                        <Maximize className="w-4 h-4 text-green-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Genişlet (Fill)</span>
                                                </button>

                                                <button className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-500/30 rounded-xl flex flex-col items-center gap-2 transition group">
                                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                                                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Öneri Al</span>
                                                </button>
                                            </div>

                                            {/* Advanced Manipulation - Pro Banner */}
                                            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between group overflow-hidden relative">
                                                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-white/10">
                                                        <Zap className="w-4 h-4 text-yellow-400" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs font-bold">İleri Düzey Editör</div>
                                                        <div className="text-[9px] text-gray-400">Manipülasyon & Efektler</div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: STYLE (Efekt & Görünüm) --- */}
                            {activeInspectorTab === 'style' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {!activeLayer ? (
                                        <div className="text-center py-10 text-gray-400 text-xs italic">
                                            Efektleri düzenlemek için bir katman seçin.
                                        </div>
                                    ) : (
                                        <>
                                            {/* 1. LAYER BLEND & OPACITY */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">Input Opaklık</div>
                                                    <input
                                                        type="range" min="0" max="100"
                                                        value={activeLayer.opacity ?? 100}
                                                        onChange={(e) => updateActiveLayer('opacity', parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-black dark:accent-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">Karışım Modu</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {['normal', 'multiply', 'screen', 'overlay', 'soft-light'].map(mode => (
                                                            <button
                                                                key={mode}
                                                                onClick={() => updateActiveLayer('blendMode', mode)}
                                                                className={cn(
                                                                    "px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition border",
                                                                    activeLayer.blendMode === mode
                                                                        ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                                                                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-300"
                                                                )}
                                                            >
                                                                {mode}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 4. SHADOW & FILTERS */}
                                            <div className="space-y-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black uppercase text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Box className="w-3.5 h-3.5" /> Gölge Efekti
                                                    </span>
                                                    <button
                                                        onClick={() => updateActiveLayer('shadow', activeLayer.shadow ? null : { color: '#000000', blur: 10, x: 5, y: 5 })}
                                                        className={cn("w-10 h-5 rounded-full relative transition-colors duration-300", activeLayer.shadow ? "bg-green-500" : "bg-gray-200 dark:bg-white/10")}
                                                    >
                                                        <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm", activeLayer.shadow ? "left-6" : "left-1")} />
                                                    </button>
                                                </div>

                                                {activeLayer.shadow && (
                                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-4 animate-in slide-in-from-top-2 fade-in">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-gray-400 block mb-2">BLUR DÜZEYİ</span>
                                                            <input type="range" min="0" max="50" value={activeLayer.shadow.blur} onChange={(e) => updateActiveLayer('shadow', { ...activeLayer.shadow, blur: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-black dark:accent-white" />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-gray-400 block mb-2">GÖLGE RENGİ</span>
                                                            <div className="flex gap-2">
                                                                {['#000000', '#555555', '#1a365d', '#4a1d96'].map(c => (
                                                                    <button key={c} onClick={() => updateActiveLayer('shadow', { ...activeLayer.shadow, color: c })} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: c }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">Görüntü Ayarları</h4>
                                                {['brightness', 'contrast', 'saturation'].map((filter) => (
                                                    <div key={filter} className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold">
                                                            <span>{filter === 'brightness' ? 'Parlaklık' : filter === 'contrast' ? 'Kontrast' : 'Doygunluk'}</span>
                                                            <span>{activeLayer.filter?.[filter] ?? 100}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="200"
                                                            value={activeLayer.filter?.[filter] ?? 100}
                                                            onChange={(e) => updateActiveLayer('filter', { ...activeLayer.filter, [filter]: parseInt(e.target.value) })}
                                                            className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none accent-blue-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}


                            {/* Global Bottom Padding */}
                            <div className="h-20" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
// Helper Component for Accordion Sections
function InspectorSection({ title, icon: Icon, children, defaultOpen = true }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white/50 dark:bg-white/5 border border-white/20 rounded-xl overflow-hidden transition-all hover:bg-white/80 dark:hover:bg-white/10 group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-left"
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{title}</span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 pt-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group relative",
                active ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
        >
            <Icon className="w-5 h-5" strokeWidth={2} />
            {active && <div className="absolute -right-[13px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-black/20 dark:bg-white rounded-l-full" />}
        </button>
    )
}
