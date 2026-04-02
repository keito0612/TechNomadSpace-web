"use client";

import { FC, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/input";

interface TextFieldProps {
    title?: string;
    type: HTMLInputTypeAttribute;
    className?: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    errorMessage?: string;
}


const TitleLavel = ({ title }: { title: string }) => {
    return (
        <div className="w-16 h-8 mb-2 sm:w-20 sm:h-10 md:w-24 md:h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm md:text-base shadow-sm">
            {title}
        </div>
    );
}

const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <span className="text-sm text-red-500 font-medium">※{errorMessage}</span>
    );
}

const TextField: FC<TextFieldProps> = ({
    title = "",
    className = "",
    placeholder = "",
    register,
    type,
    errorMessage
}) => {
    return (
        <div className={`flex flex-col justify-start ${className}`}>
            {title && (
                <TitleLavel title={title} />
            )}
            <Input
                {...register}
                type={type}
                className={`h-12 md:h-14 px-4 py-3 ml-4 border text-gray-900 rounded-xl transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errorMessage ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
                    }`}
                placeholder={placeholder}
            />
            <div className="pt-1.5 ml-4 min-h-[1.5rem]">
                {errorMessage && (
                    <ErrorMessage errorMessage={errorMessage} />
                )}
            </div>
        </div>
    );
};

export default TextField;
