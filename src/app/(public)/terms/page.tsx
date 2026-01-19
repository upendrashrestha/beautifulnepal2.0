import PageLayout from "@/components/layouts/PageLayout";
import BlockContent from "@/components/ui/blockContent";
import { fetchCompanyTerms } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    return generateMetadataHelper({
        title: "Terms And Conditions",
        description: "",
        keywords: "terms and conditions, travel nepal"
    });
}


export default async function TermsPage() {
    const companyTerms = await fetchCompanyTerms();
    return (
        <PageLayout title="Terms And Condition">
            {companyTerms?.termsAndConditions && <BlockContent value={companyTerms?.termsAndConditions} />}
        </PageLayout >
    );
}
