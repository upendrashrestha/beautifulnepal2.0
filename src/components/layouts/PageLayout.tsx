'use client'

import PageTitle from '@/components/PageTitle';
import BackButton from '../ui/backButton';


type PageLayoutProps = {
    title: React.ReactNode;
    children: React.ReactNode;
};

export default function PageLayout({
    title,
    children
}: PageLayoutProps) {

    return (
        <div>
            <div className="flex items-center">
                <BackButton className="mr-4" />
                <PageTitle>{title}</PageTitle>
            </div>

            <div className="mt-10 bg-slate-50 rounded p-4 dark:bg-gray-900 dark:text-white">
                {children}
            </div>

        </div>
    )
}