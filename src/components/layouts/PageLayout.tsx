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
        <div className={className}>
            <PageTitle>{title}</PageTitle>
            <main className="mx-auto ">
                {children}
            </main>
        </div>
    )
}