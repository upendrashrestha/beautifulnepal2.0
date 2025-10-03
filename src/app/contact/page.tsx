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
            <AnimatedSection>
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20 flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <ContactForm />

                    {/* <div className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15">
                        <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                            Our Locations
                        </h2>
                        <div className="5 mb-7">
                            <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                                Offices
                            </h3>
                            <p className="p-2">Nepal: Kathmandu</p>
                            <p>USA: Arlington, TX</p>
                        </div>
                    </div> */}
                </div>
            </AnimatedSection>
        </PageLayout>
    );
}
