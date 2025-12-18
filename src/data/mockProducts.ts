export const PRODUCT_DB = {
    id: 1,
    name: "Premium Cotton Hoodie",
    basePrice: 499,
    rating: 4.9,
    reviews: 1240,
    features: ["%100 Organik Pamuk", "Yıkanabilir Baskı", "Oversize Kesim", "Moffi Garantisi"],
    colors: [
        { id: 'white', name: 'Kar Beyazı', hex: '#FFFFFF', priceMod: 0, shadow: 'shadow-gray-200' },
        { id: 'black', name: 'Gece Siyahı', hex: '#1A1A1A', priceMod: 0, shadow: 'shadow-gray-900' },
        { id: 'heather', name: 'Gri Melanj', hex: '#A0A0A0', priceMod: 0, shadow: 'shadow-gray-400' },
        { id: 'cream', name: 'Bugday', hex: '#F5F5DC', priceMod: 20, shadow: 'shadow-yellow-100' },
        { id: 'navy', name: 'Okyanus', hex: '#1e3a8a', priceMod: 20, shadow: 'shadow-blue-900' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    printTypes: [
        { id: 'digital', name: 'Dijital Baskı', desc: 'Canlı renkler', price: 0 },
        { id: 'embroidery', name: 'Nakış İşleme', desc: 'Premium doku', price: 150 },
    ],
    images: {
        white: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
        black: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600",
        heather: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
        cream: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
        navy: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
    }
};
