import PageTitle from "@/components/PageTitle";
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
        <div>
            <div className="text-center">
                <PageTitle>About Us</PageTitle>
            </div>

            <div className="mt-10 text-gray-600 text-sm line-clamp-3">
                {companyAbout.description}
            </div>

        </div >
    );
}
