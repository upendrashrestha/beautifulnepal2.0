import PageLayout from "@/components/layouts/PageLayout";
import { fetchCompanyTerms } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
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
        <PageLayout title="Terms And Condition">
            {companyTerms?.termsAndConditions && <PortableText value={companyTerms?.termsAndConditions} />}
        </PageLayout >
    );
}
