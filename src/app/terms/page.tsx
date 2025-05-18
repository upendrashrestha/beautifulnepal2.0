import { fetchCompanyTerms } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import { Metadata } from "next";
import { PortableText } from "next-sanity";

export async function generateMetadata(): Promise<Metadata> {

    return generateMetadataHelper({
        title: "Terms And Conditions",
        description: ""
    });
}


export default async function TermsPage() {
    const companyTerms = await fetchCompanyTerms();
    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">Terms And Condition</h1>
            {companyTerms?.termsAndConditions && <PortableText value={companyTerms?.termsAndConditions} />}

        </div >
    );
}
