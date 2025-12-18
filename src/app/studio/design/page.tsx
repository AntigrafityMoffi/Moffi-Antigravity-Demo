"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ProductMockService, Product } from "@/services/mock/ProductMockService";
import { InteractiveDesignCanvas } from "@/components/studio/InteractiveDesignCanvas";
import { Loader2 } from "lucide-react";

function StudioDesignContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const colorId = searchParams.get('colorId');
    const sizeId = searchParams.get('sizeId');

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            if (!productId) return;
            setLoading(true);
            const p = await ProductMockService.getProductById(productId);
            setProduct(p);
            setLoading(false);
        };
        loadProduct();
    }, [productId]);

    if (loading) {
        return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;
    }

    if (!product) return <div>Product Not Found</div>;

    // Determine the correct image based on color selection
    // Fallback to front image if no specific color override (mock logic)
    // In a real app, we would map colorId to a specific image variant
    const productImage = product.images.front;
    const selectedColor = product.colors.find(c => c.id === colorId)?.hex;

    return (
        <div className="h-screen w-full bg-[#09090b] overflow-hidden">
            <InteractiveDesignCanvas
                productImage={productImage}
                productName={product.name}
                onSave={(state) => console.log("Saving design...", state)}
            />
        </div>
    );
}

export default function StudioDesignPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>}>
            <StudioDesignContent />
        </Suspense>
    );
}
