import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
    id: string;
    title?: string;
    className?: string;
    rows?: number;
    placeholder?: string;
    register: UseFormRegisterReturn;
    errorMessage?: string;
}

const TextAreaLabel = ({ htmlFor, label }: { htmlFor: string, label: string }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-gray-300 mb-1"
        >
            {label}
        </label>
    );
}


const TextArea = ({ id, title, className, rows = 4, placeholder, register, errorMessage }: TextAreaProps) => {
    return (
        <div className={`flex flex-col justify-start ${className}`}>
            {title && (
                <TextAreaLabel htmlFor={id} label={title} />
            )}
            <textarea
                id={id}
                {...register}
                rows={rows}
                className={`w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500. ${errorMessage ? 'border-red-400' : 'border-gray-600'}`}
                placeholder={placeholder}
            />
            {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
        </div>

    );
}

export default TextArea;
