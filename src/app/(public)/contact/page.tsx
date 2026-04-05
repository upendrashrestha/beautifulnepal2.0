import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import ContactForm from "./ContactForm";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: "Contact",
        description: "",
        keywords: "contact us, address, location, office",
    });
}

export default function ContactPage() {
    return (
        <PageLayout title="Contact Us" className="text-center">

            <p className="text-md pb-10 text-gray-600 dark:text-gray-300">
                We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
            </p>

            <AnimatedSection>
                <ContactForm />
            </AnimatedSection>
        </PageLayout>
    );
}
