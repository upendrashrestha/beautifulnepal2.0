import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    className?: string;
}

export default function PageTitle({ children, className }: Props) {
    return (
        <div className={`relative flex items-center justify-center m-10 ${className}`}>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-gray-900 dark:text-white text-center leading-tight">
                <span
                    className="text-[10px] tracking-[0.22em] uppercase text-[#bc1c2b]"
                    style={{ fontFamily: "var(--font-dm)", fontSize: "clamp(3rem,6vw,4.5rem)" }}
                >
                    {children}
                </span>
            </h1>
        </div>


    )
}