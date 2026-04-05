'use client'

import PageTitle from '@/components/PageTitle';


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
        <div className={'relative py-5 min-h-screen ' + (className ? ' ' + className : '')}>
            <div className='container py-5 mx-auto px-4'>
                <PageTitle>{title}</PageTitle>
                <main className="mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}