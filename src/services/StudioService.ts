export type StudioAssetType = 'hero' | 'listing' | 'video';

export interface GeneratedAsset {
    id: string;
    type: StudioAssetType;
    url: string;
    createdAt: Date;
}

export const StudioService = {
    // Simulate uploading/processing
    async uploadImage(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });
    },

    // Simulate Generation (n8n Mock)
    async generateAssets(baseImage: string, packs: StudioAssetType[]): Promise<GeneratedAsset[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results: GeneratedAsset[] = packs.map(type => ({
                    id: Math.random().toString(36).substring(7),
                    type,
                    url: baseImage,
                    createdAt: new Date()
                }));
                resolve(results);
            }, 1500); // 1.5 seconds delay (Faster for testing)
        });
    }
};
