'use client';

import { ResultType } from '@/types/types';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: ResultType;
    onConfirm?: () => void | Promise<void>;
    confirmLabel?: string;
    onCloneLabel?: string;
    cancelLabel?: string;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type,
    onConfirm,
    onCloneLabel = '閉じる',
    confirmLabel = 'はい',
    cancelLabel = 'キャンセル',
}: ModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'Success':
                return (
                    <div className="border-green-600 border-2 rounded-full flex items-center justify-center w-16 h-16">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                );
            case 'Error':
                return (
                    <div className="flex items-center justify-center w-16 h-16">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                );
            case 'Warning':
                return (
                    <div className="flex items-center justify-center">
                        <AlertCircle className="w-16 h-16 text-yellow-400" />
                    </div>
                );
            default:
                return null;
        }
    };

    const getButtonVariant = () => {
        switch (type) {
            case 'Success':
                return 'bg-blue-700 hover:bg-blue-400 text-white';
            case 'Error':
                return 'bg-red-500 hover:bg-red-400 text-white';
            case 'Warning':
                return 'bg-blue-700 hover:bg-blue-400 text-white';
            case 'Normal':
                return 'bg-blue-700 hover:bg-blue-400 text-white';
            default:
                return 'bg-blue-500 hover:bg-blue-400';
        }
    };

    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm();
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-[450px] text-center"
                showCloseButton={false}
            >
                <DialogHeader className="items-center">
                    <div className="flex justify-center items-center">{getIcon()}</div>
                    <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                        {title}
                    </DialogTitle>
                    {message && (
                        <DialogDescription className="text-sm sm:text-base text-white leading-relaxed">
                            {message}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <DialogFooter className="justify-center sm:justify-center gap-4 border-none bg-transparent">
                    {(type === 'Warning' || type === 'Normal') && onConfirm ? (
                        <>
                            <Button
                                className={`rounded-xl font-semibold px-6 py-3 ${getButtonVariant()}`}
                                onClick={handleConfirm}
                            >
                                {confirmLabel}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl font-semibold px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none"
                                onClick={onClose}
                            >
                                {cancelLabel}
                            </Button>
                        </>
                    ) : (
                        <Button
                            className={`rounded-xl font-semibold px-6 py-3 ${getButtonVariant()}`}
                            onClick={onClose}
                        >
                            {onCloneLabel}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
