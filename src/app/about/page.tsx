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
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">About Us</h1>

            <div className="text-gray-600 text-sm line-clamp-3">
                {companyAbout.description}
            </div>

        </div >
    );
}
