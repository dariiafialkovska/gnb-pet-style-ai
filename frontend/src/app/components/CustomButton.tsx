
import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function CustomButton({ children, className, ...props }: ButtonProps) {
    return (
        <button
            type="submit"
            className={clsx(
                "cursor-pointer inline-flex items-center gap-2 rounded-full disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed",
                "w-full py-3 px-4 lg:py-4 lg:px-6 justify-center text-center",
                "focus:outline outline-1 outline-[var(--color-main)]",
                "relative bg-[var(--color-main)] text-white font-semibold text-sm",
                "[box-shadow:3px_3px_0px_0px_black] hover:shadow-none top-0 left-0 duration-100 hover:top-[3px] hover:left-[3px]",
                "tw-body-2-semibold",
                className
            )}

            {...props}
        >
            {children}
        </button>
    );
}
