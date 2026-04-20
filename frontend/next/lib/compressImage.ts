const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;
const IMAGE_QUALITY = 0.8;

export interface CompressedImage {
    file: File;
    preview: string;
}

export const compressImage = (file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;

            if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
                const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'));
                        return;
                    }
                    const baseName = file.name.replace(/\.[^/.]+$/, '');
                    const newFileName = `${baseName}.jpg`;
                    const compressedFile = new File([blob], newFileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    const preview = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
                    resolve({ file: compressedFile, preview });
                },
                'image/jpeg',
                IMAGE_QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
        };
        img.src = objectUrl;
    });
};

export const compressImages = async (files: File[]): Promise<CompressedImage[]> => {
    const results = await Promise.allSettled(files.map(compressImage));

    return results
        .filter((result): result is PromiseFulfilledResult<CompressedImage> =>
            result.status === 'fulfilled'
        )
        .map(result => result.value);
};
