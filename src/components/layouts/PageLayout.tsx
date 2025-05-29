'use client'

import PageTitle from '@/components/PageTitle';
import BackButton from '../ui/backButton';


type PageLayoutProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

export default function PageLayout({
    title,
    children,
    className
}: PageLayoutProps) {

    return (
        <div className={`${className}`}>
            <div className="flex items-center">
                <BackButton className="mr-4" />
                <PageTitle>{title}</PageTitle>
            </div>

            <main className="mx-auto p-6 dark:bg-gray-900 dark:text-white">
                {children}
            </main>

        </div>
    )
}