import { fetchCompany } from "@/sanity/lib/fetch";
import Link from "next/link";

export default async function Footer() {
    const company = await fetchCompany();
    return (
        <footer className="mt-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
                <div>
                    <h4 className="font-semibold mb-2">BeautifulNepal</h4>
                    <p className="text-gray-600">Explore the beauty, culture, and adventure of Nepal.</p>
                    {company.address && <p>{company.address}</p>}
                    {company.email && <p>{company.email}</p>}
                    {company.phone && <p>{company.phone}</p>}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Explore</h4>
                    <ul className="space-y-1">
                        <li><Link href="/destinations" className="hover:underline">Destinations</Link></li>
                        <li><Link href="/blogs" className="hover:underline">Blogs</Link></li>
                        <li><Link href="/guides" className="hover:underline">Guides</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Company</h4>
                    <ul className="space-y-1">
                        <li><Link href="/about" className="hover:underline">About Us</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                        <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Follow Us</h4>

                    {company.socialLinks && (
                        <div className="flex flex-col justify-left space-y-1 text-sm">
                            {company.socialLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center text-gray-500 text-xs py-4">

                {company.name} &copy; {new Date().getFullYear()} All rights reserved.
            </div>
        </footer>
    );
}
