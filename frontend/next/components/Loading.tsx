import { Loader2 } from "lucide-react";

interface LoadingProps {
    isSubmitting: boolean;
    message?: string;
}

const Loading = ({ isSubmitting, message }: LoadingProps) => {
    return (
        <>
            {isSubmitting && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        {message && (
                            <p className="text-white text-sm">{message}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Loading;