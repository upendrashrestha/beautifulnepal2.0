'use client'

import PageTitle from '@/components/PageTitle';


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
            <PageTitle>{title}</PageTitle>
            <div className="mt-10">
                {children}
            </div>

        </div>
    )
}