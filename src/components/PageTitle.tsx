import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function PageTitle({ children }: Props) {
    return (
        <div className="space-y-2 pb-1 md:space-y-5">
            <h1 className="text-xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10 md:text-3xl md:leading-14 dark:text-gray-100">
                {children}
            </h1>
        </div>
    )
}