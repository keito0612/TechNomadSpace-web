"use client";

import { FC, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/input";

interface TextFieldProps {
    id: string;
    title?: string;
    type: HTMLInputTypeAttribute;
    className?: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    errorMessage?: string;
}


const TitleLavel = ({ htmlFor, title }: { htmlFor: string | undefined, title: string }) => {
    return (
        <label htmlFor={htmlFor} className="w-full mb-2 text-white text-sm sm:text-sm md:text-base" >
            {title}
        </label >
    );
}

const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <span className="text-sm text-red-500 font-medium">※{errorMessage}</span>
    );
}

const TextField: FC<TextFieldProps> = ({
    id,
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
                <TitleLavel htmlFor={id} title={title} />
            )}
            <Input
                id={id}
                {...register}
                type={type}
                className={`h-12 md:h-14 border  rounded-xl transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent bg-gray-800 text-white ${errorMessage ? 'border-red-400' : 'border-gray-600'}`}
                placeholder={placeholder}
            />
            {errorMessage && (
                <div className="pt-1.5 min-h-[1.5rem]">
                    <ErrorMessage errorMessage={errorMessage} />
                </div>
            )}
        </div>
    );
};

export default TextField;
