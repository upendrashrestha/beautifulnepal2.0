import { fetchCompanyTerms } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const companyTerms = await fetchCompanyTerms();
    return generateMetadataHelper({
        title: "Terms And Conditions",
        description: companyTerms.termsAndConditions || ""
    });
}


export default async function TermsPage() {
    const companyTerms = await fetchCompanyTerms();
    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">Terms And Condition</h1>

            <PortableText value={companyTerms?.termsAndConditions} />

        </div >
    );
}
