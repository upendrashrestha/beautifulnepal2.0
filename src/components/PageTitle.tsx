import { ReactNode } from 'react'
import BackButton from './ui/backButton';

interface Props {
    children: ReactNode
    className?: string;
}

export default function PageTitle({ children, className }: Props) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <div className="absolute left-0">
                <BackButton />
            </div>
            <h1 className="text-xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10 md:text-3xl md:leading-14 dark:text-white text-center">
                {children}
            </h1>
        </div>

    )
}