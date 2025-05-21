import PageLayout from "@/layouts/PageLayout";
import { fetchCompanyAbout } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const companyAbout = await fetchCompanyAbout();
    return generateMetadataHelper({
        title: "About Us",
        description: companyAbout.shortDescription || ""
    });
}


export default async function AboutPage() {
    const companyAbout = await fetchCompanyAbout();
    return (
        <PageLayout title="About Us">

            <div className="text-gray-600 text-sm line-clamp-3">
                {companyAbout.description}
            </div>

        </PageLayout >
    );
}
