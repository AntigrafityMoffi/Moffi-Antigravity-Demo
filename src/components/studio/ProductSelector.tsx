
import { ChevronsRight } from "lucide-react";

const PRODUCTS = [
    { id: 1, name: "Premium Sweatshirt", price: "289,90 TL", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300", tag: "Çok Satan" },
    { id: 2, name: "Köpek Bandanası", price: "89,90 TL", img: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=300", tag: "Yeni" },
    { id: 3, name: "Seramik Mama Kabı", price: "149,90 TL", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300" },
    { id: 4, name: "Deri Yaka Tasması", price: "199,90 TL", img: "https://images.unsplash.com/photo-1605634032070-569d6c342795?q=80&w=300" },
];

export function ProductSelector({ onSelect }: { onSelect: (p: any) => void }) {
    return (
        <div className="h-full flex flex-col pt-24 px-6 pb-8 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Hangi ürünü tasarlıyoruz?</h2>
            <p className="text-sm text-gray-500 mb-8">Kişiselleştirmek istediğin baz ürünü seç.</p>

            <div className="flex-1 space-y-4 overflow-y-auto pb-20 scrollbar-hide">
                {PRODUCTS.map(product => (
                    <div key={product.id} onClick={() => onSelect(product)} className="bg-white dark:bg-gray-900 rounded-[2rem] p-4 flex gap-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-[#5B4D9D] transition-all group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
                            <img src={product.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {product.tag && (
                                <div className="absolute top-0 left-0 bg-[#5B4D9D] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                                    {product.tag}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{product.name}</h3>
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">Dayanıklı kumaş, yıkanabilir baskı ve premium doku.</p>
                            <div className="flex justify-between items-center">
                                <span className="text-[#5B4D9D] font-black">{product.price}</span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#5B4D9D] group-hover:text-white transition-colors">
                                    <ChevronsRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
