"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Photo, User } from "@/types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import ProfileImage from "../Profile/ProfileImage";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectImageIndex: number | null;
    title: string;
    images: Photo[];
}

// ローディングスピナー
const LoadingSpinner = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );
};

// 閉じるボタンコンポーネント
const CloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
            <X className="w-6 h-6" />
        </Button>
    );
};

// ユーザー情報コンポーネント
const UserInformation = ({ user, postedAt }: { user: User; postedAt?: string }) => {
    return (
        <div className="flex items-center gap-2">
            <ProfileImage sizes={32} imageUrl={user.image_path} />
            <div className="flex flex-col">
                <span className="font-bold text-card-foreground text-sm">{user.name}</span>
                {postedAt && <span className="text-xs text-muted-foreground">{postedAt}</span>}
            </div>
        </div>
    );
};

// サムネイル画像アイテム
const ThumbnailItem = ({
    img,
    index,
    isSelected,
    onSelect,
}: {
    img: Photo;
    index: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className={cn(
                "relative shrink-0 w-full aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-colors",
                isSelected ? "border-blue-700" : "border-transparent hover:border-muted-foreground"
            )}
            onClick={() => onSelect(index)}
        >
            {isLoading && <LoadingSpinner />}
            <Image
                src={img.photoUrl}
                alt={`thumb-${index}`}
                fill
                className="object-cover"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

// PC用サムネイルリストコンポーネント
const DesktopThumbnails = ({
    images,
    selectedIndex,
    onSelect,
}: {
    images: Photo[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}) => {
    return (
        <div className="hidden lg:flex w-40 flex-col border-r border-border p-3 gap-3 overflow-y-auto bg-card">
            {images.map((img, i) => (
                <ThumbnailItem
                    key={i}
                    img={img}
                    index={i}
                    isSelected={selectedIndex === i}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

// ズームコントロールボタン
const ZoomControls = ({
    onZoomIn,
    onZoomOut,
    onReset,
    scale,
}: {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    scale: number;
}) => {
    return (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-1 z-10">
            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                disabled={scale <= 0.5}
                className="h-8 w-8 text-card-foreground hover:bg-accent"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-card-foreground text-sm min-w-12 text-center">
                {Math.round(scale * 100)}%
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                disabled={scale >= 3}
                className="h-8 w-8 text-card-foreground hover:bg-accent"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                className="h-8 w-8 text-card-foreground hover:bg-accent"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
    );
};

// メイン画像コンポーネント（ローディング状態とズーム機能を持つ）
const MainImage = ({ photoUrl }: { photoUrl: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setScale((prev) => Math.min(prev + 0.1, 3));
        } else {
            setScale((prev) => Math.max(prev - 0.1, 0.5));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="relative w-full h-full max-w-4xl max-h-[60vh]">
            {isLoading && <LoadingSpinner />}
            <div
                className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <Image
                    src={photoUrl}
                    alt="メイン画像"
                    fill
                    className="object-contain transition-transform duration-100"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    }}
                    onLoad={() => setIsLoading(false)}
                    draggable={false}
                />
            </div>
            <ZoomControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
                scale={scale}
            />
        </div>
    );
};

// PC用メイン画像エリアコンポーネント
const DesktopMainArea = ({
    image,
    title,
    onClose,
}: {
    image: Photo;
    title: string;
    onClose: () => void;
}) => {
    return (
        <div className="hidden lg:flex flex-1 flex-col bg-card">
            {/* タイトルヘッダー */}
            <div className="px-4 py-3 border-b border-border">
                <h2 className="font-bold text-card-foreground text-lg">{title}</h2>
            </div>

            {/* ユーザー情報と閉じるボタン */}
            <div className="bg-background flex items-center justify-between px-4 py-3">
                <UserInformation
                    user={image.review.user}
                    postedAt={image.review.posted_at_human}
                />
                <CloseButton onClose={onClose} />
            </div>

            {/* メイン画像 */}
            <div className="flex-1 flex items-center justify-center bg-background p-4">
                <MainImage key={image.photoUrl} photoUrl={image.photoUrl} />
            </div>
        </div>
    );
};

// モバイル用スライドアイテム
const MobileSlideItem = ({
    img,
    index,
    onClose
}: {
    img: Photo;
    index: number;
    onClose: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="shrink-0 w-full h-full snap-center flex flex-col min-h-0">
            {/* ユーザー情報 */}
            <div className="bg-background shrink-0 px-4 py-2 flex flex-row justify-between">
                <UserInformation
                    user={img.review.user}
                    postedAt={img.review.posted_at_human}
                />
                <CloseButton onClose={onClose} />
            </div>

            {/* 画像 */}
            <div className="flex-1 relative bg-background min-h-0 overflow-hidden">
                {isLoading && <LoadingSpinner />}
                <Image
                    src={img.photoUrl}
                    alt={`image-${index}`}
                    fill
                    className="object-contain"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};

// モバイル用スライダーコンポーネント
const MobileImageSlider = ({
    images,
    title,
    onClose,
}: {
    images: Photo[];
    title: string;
    onClose: () => void;
}) => {
    return (
        <div className="flex-1 flex flex-col lg:hidden bg-card min-h-0 overflow-hidden">
            {/* スワイプ可能な画像エリア */}
            <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory min-h-0">
                {images.map((img, i) => (
                    <MobileSlideItem onClose={onClose} key={i} img={img} index={i} />
                ))}
            </div>
        </div>
    );
};

// メインのモーダルコンポーネント
export default function ImageModal({
    isOpen,
    onClose,
    title,
    selectImageIndex,
    images,
}: ImageModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(selectImageIndex ?? 0);

    const selectedImage = images[selectedImageIndex];

    if (!images.length) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="w-full h-full lg:w-[90vw] lg:h-[85vh] max-w-none sm:max-w-none lg:max-w-none p-0 bg-card rounded-none lg:rounded-xl overflow-hidden flex flex-row"
            >
                <DialogTitle className="sr-only">{title}</DialogTitle>

                {/* モバイル用スライダー */}
                <MobileImageSlider
                    images={images}
                    title={title}
                    onClose={onClose}
                />

                {/* PC用サムネイル */}
                <DesktopThumbnails
                    images={images}
                    selectedIndex={selectedImageIndex}
                    onSelect={setSelectedImageIndex}
                />

                {/* PC用メイン画像エリア */}
                {selectedImage && (
                    <DesktopMainArea
                        image={selectedImage}
                        title={title}
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
