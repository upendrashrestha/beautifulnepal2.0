import PageLayout from "@/components/layouts/PageLayout";
import { fetchCompanyAbout } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { Metadata } from "next";

import { motion } from "framer-motion";

export async function generateMetadata(): Promise<Metadata> {
    const companyAbout = await fetchCompanyAbout();
    return generateMetadataHelper({
        title: "About Us",
        description: companyAbout.shortDescription || "",
    });
}

export default async function AboutPage() {
    const companyAbout = await fetchCompanyAbout();

    return (
        <PageLayout title="">
            <motion.div
                variants={{
                    hidden: {
                        opacity: 0,
                        x: -20,
                    },

                    visible: {
                        opacity: 1,
                        x: 0,
                    },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="animate_left relative mx-auto hidden md:block md:w-full h-auto"
            >
                <section className="text-center py-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        About Us
                    </h1>
                    <div className="flex justify-center">
                        <p className="max-w-2xl text-base text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6">
                            {companyAbout.description}
                        </p>
                    </div>
                </section>
            </motion.div>
        </PageLayout>
    );
}
