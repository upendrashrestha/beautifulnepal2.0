'use client'

import PageTitle from '@/components/PageTitle';
import BackButton from '../ui/backButton';
import HomeButton from '../ui/homeButton';


type PageLayoutProps = {
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

export default function PageLayout({
    title,
    children,
    className
}: PageLayoutProps) {

    return (
        <div className={className}>
            <div className="m-5 flex flex-row justify-between z-50 ">
                <HomeButton />
                <BackButton />
            </div>
            {title && <PageTitle className="w-full flex items-center justify-center mb-6">{title}</PageTitle>}
            <main className="mx-auto dark:bg-gray-900 dark:text-white">
                {children}
            </main>
        </div>

    )
}