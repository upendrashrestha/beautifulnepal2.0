import { fetchCompany } from "@/sanity/lib/fetch";
import Link from "next/link";

export default async function Footer() {
    const company = await fetchCompany();

    return (
        <footer className="bg-gray-100 dark:bg-gray-900">
            {company && <> <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-700 dark:text-gray-300">
                {/* Brand Info */}
                <div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Beautiful Nepal</h4>

                    <p className="mb-2">Explore the beauty, culture, and adventure of Nepal.</p>
                    {company.address && <p className="mb-1">{company.address}</p>}
                    {company.email && <p className="mb-1">{company.email}</p>}
                    {company.phone && <p>{company.phone}</p>}
                </div>

                {/* Explore Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Explore</h4>
                    <ul className="space-y-2">
                        <li><Link href="/destinations" className="hover:underline">Destinations</Link></li>
                        <li><Link href="/blogs" className="hover:underline">Blogs</Link></li>
                        <li><Link href="/guides" className="hover:underline">Guides</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Company</h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="hover:underline">About Us</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                        <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Follow Us</h4>
                    {Array.isArray(company.socialLinks) && company.socialLinks.length > 0 && (
                        <ul className="space-y-2">
                            {company.socialLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

                <div className="border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 py-4">
                    &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
                    <div className="pt-2">Built with passion by BeautifulNepal · v1.1</div>
                </div>
            </>
            }
        </footer>
    );
}
