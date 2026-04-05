import { fetchCompany } from "@/sanity/lib/fetch";
import Link from "next/link";
import {
    RiMapPin2Line,
    RiMailLine,
    RiPhoneLine,
    RiArrowRightUpLine,
    RiFacebookBoxFill,
    RiInstagramLine,
    RiYoutubeFill,
    RiTiktokFill,
    RiPinterestFill,
    RiTwitterXLine,
    RiGlobalLine,
} from "react-icons/ri";

/* ── Social icon map ─────────────────────────────────────────────────────────
   Matches whatever name strings come from your Sanity socialLinks array.
   Falls back to a generic globe icon for unknown platforms.
────────────────────────────────────────────────────────────────────────────── */
function SocialIcon({ name }: { name: string }) {
    const n = name.toLowerCase();
    const cls = "w-4 h-4";
    if (n.includes("facebook")) return <RiFacebookBoxFill className={cls} />;
    if (n.includes("instagram")) return <RiInstagramLine className={cls} />;
    if (n.includes("youtube")) return <RiYoutubeFill className={cls} />;
    if (n.includes("tiktok")) return <RiTiktokFill className={cls} />;
    if (n.includes("pinterest")) return <RiPinterestFill className={cls} />;
    if (n.includes("twitter") || n.includes("x.com"))
        return <RiTwitterXLine className={cls} />;
    return <RiGlobalLine className={cls} />;
}

/* ── Column heading ─────────────────────────────────────────────────────────── */
function ColHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <p
                className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#bc1c2b]"
                style={{ fontFamily: "var(--font-dm)" }}
            >
                {children}
            </p>
            <span className="flex-1 h-px bg-[#e2ddd4]" />
        </div>
    );
}

/* ── Main footer ─────────────────────────────────────────────────────────────── */
export default async function Footer() {
    const company = await fetchCompany();

    return (
        <footer
            className="relative overflow-hidden"
            style={{ background: "#faf7f2" }}
        >
            {/* Top crimson hairline */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, #bc1c2b 25%, #bc1c2b 75%, transparent 100%)",
                }}
            />

            {/* Subtle dot-grid texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.8' fill='rgba(188,28,43,0.08)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Gold ambient glow — bottom right */}
            <div
                className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at bottom right, rgba(201,148,58,0.08) 0%, transparent 65%)",
                }}
            />

            {company && (
                <>
                    {/* ── Main grid ──────────────────────────────────────────────────── */}
                    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                            {/* ── Brand ──────────────────────────────────────────────────── */}
                            <div className="lg:col-span-1">
                                {/* Logo word-mark */}
                                <Link href="/" className="group inline-flex items-center gap-2.5 mb-5">

                                    <span
                                        className="text-[#1a1814] text-xl font-light"
                                        style={{ fontFamily: "var(--font-cormorant)" }}
                                    >
                                        Beautiful{" "}
                                        <em className="italic font-semibold text-[#bc1c2b] not-italic">Nepal</em>
                                    </span>
                                </Link>

                                <p
                                    className="text-sm text-[#6b6560] leading-relaxed mb-5 max-w-[220px]"
                                    style={{ fontFamily: "var(--font-dm)" }}
                                >
                                    Explore the beauty, culture, and adventure of Nepal.
                                </p>

                                {/* Contact details */}
                                <ul className="space-y-2.5">
                                    {company.address && (
                                        <li className="flex items-start gap-2">
                                            <RiMapPin2Line className="w-3.5 h-3.5 text-[#bc1c2b] mt-0.5 shrink-0" />
                                            <span
                                                className="text-xs text-[#8a8378] leading-relaxed"
                                                style={{ fontFamily: "var(--font-dm)" }}
                                            >
                                                {company.address}
                                            </span>
                                        </li>
                                    )}
                                    {company.email && (
                                        <li className="flex items-center gap-2">
                                            <RiMailLine className="w-3.5 h-3.5 text-[#bc1c2b] shrink-0" />
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-xs text-[#8a8378] hover:text-[#bc1c2b] transition-colors"
                                                style={{ fontFamily: "var(--font-dm)" }}
                                            >
                                                {company.email}
                                            </a>
                                        </li>
                                    )}
                                    {company.phone && (
                                        <li className="flex items-center gap-2">
                                            <RiPhoneLine className="w-3.5 h-3.5 text-[#bc1c2b] shrink-0" />
                                            <a
                                                href={`tel:${company.phone}`}
                                                className="text-xs text-[#8a8378] hover:text-[#bc1c2b] transition-colors"
                                                style={{ fontFamily: "var(--font-dm)" }}
                                            >
                                                {company.phone}
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* ── Explore ────────────────────────────────────────────────── */}
                            <div>
                                <ColHeading>Explore</ColHeading>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Destinations", href: "/destinations" },
                                        { label: "Blogs", href: "/blogs" },
                                        { label: "Guides", href: "/guides" },
                                    ].map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 text-sm text-[#6b6560]
                                   hover:text-[#1a1814] transition-colors duration-200"
                                                style={{ fontFamily: "var(--font-dm)" }}
                                            >
                                                <span
                                                    className="w-0 group-hover:w-3 h-px bg-[#bc1c2b] transition-all duration-250 shrink-0"
                                                />
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ── Company ────────────────────────────────────────────────── */}
                            <div>
                                <ColHeading>Company</ColHeading>
                                <ul className="space-y-3">
                                    {[
                                        { label: "About Us", href: "/about" },
                                        { label: "Contact", href: "/contact" },
                                        { label: "Terms & Conditions", href: "/terms" },
                                    ].map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 text-sm text-[#6b6560]
                                   hover:text-[#1a1814] transition-colors duration-200"
                                                style={{ fontFamily: "var(--font-dm)" }}
                                            >
                                                <span
                                                    className="w-0 group-hover:w-3 h-px bg-[#bc1c2b] transition-all duration-250 shrink-0"
                                                />
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ── Social ─────────────────────────────────────────────────── */}
                            <div>
                                <ColHeading>Follow Us</ColHeading>
                                {Array.isArray(company.socialLinks) && company.socialLinks.length > 0 && (
                                    <ul className="space-y-2.5">
                                        {company.socialLinks.map((link) => (
                                            <li key={link.name}>
                                                <a
                                                    href={link.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-3 text-sm text-[#6b6560]
                                     hover:text-[#1a1814] transition-colors duration-200"
                                                    style={{ fontFamily: "var(--font-dm)" }}
                                                >
                                                    <span
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                                       bg-[#e8e4dc] group-hover:bg-[#bc1c2b]/10
                                       text-[#8a8378] group-hover:text-[#bc1c2b]
                                       transition-all duration-200"
                                                    >
                                                        <SocialIcon name={link.name} />
                                                    </span>
                                                    {link.name}
                                                    <RiArrowRightUpLine
                                                        className="w-3 h-3 opacity-0 group-hover:opacity-60
                                       -translate-x-1 group-hover:translate-x-0
                                       transition-all duration-200 ml-auto"
                                                    />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom bar ────────────────────────────────────────────────── */}
                    <div
                        className="relative z-10 border-t"
                        style={{ borderColor: "#e2ddd4" }}
                    >
                        {/* Ornament line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="w-16 h-px bg-[#e2ddd4]" />
                            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                                <rect
                                    x="2" y="2" width="6" height="6"
                                    fill="none" stroke="#bc1c2b" strokeWidth="0.8"
                                    opacity="0.5"
                                    transform="rotate(45 5 5)"
                                />
                            </svg>
                            <span className="w-16 h-px bg-[#e2ddd4]" />
                        </div>

                        <div
                            className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row
                         items-center justify-between gap-2"
                        >
                            <span
                                className="text-[11px] text-[#a09890]"
                                style={{ fontFamily: "var(--font-dm)" }}
                            >
                                © {new Date().getFullYear()}{" "}
                                <span className="text-[#1a1814] font-medium">{company.name}</span>
                                . All rights reserved.
                            </span>
                            <span
                                className="text-[11px] text-[#a09890]"
                                style={{ fontFamily: "var(--font-dm)" }}
                            >
                                Built with passion by{" "}
                                <span className="text-[#bc1c2b]">BeautifulNepal</span>
                            </span>
                        </div>
                    </div>
                </>
            )}
        </footer>
    );
}