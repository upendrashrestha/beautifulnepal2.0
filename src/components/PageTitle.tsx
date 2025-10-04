import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    className?: string;
}

export default function PageTitle({ children, className }: Props) {
    return (
        <div className={`relative flex items-center justify-center m-10 ${className}`}>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center leading-tight">
                {children}
            </h1>
        </div>
    )
}