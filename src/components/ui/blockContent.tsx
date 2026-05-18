import { urlFor } from "@/sanity/lib/image";
import {
    PortableText,
    PortableTextBlock,
    PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";
import { markdownToPortableText } from "@/lib/markdownToPortableText";

/* -------------------------
   TYPES
-------------------------- */

type BlockContentValue = PortableTextBlock[] | string;

type BlockContentProps = {
    value: BlockContentValue;
};

/* -------------------------
   NORMALIZER
-------------------------- */

function normalize(value: BlockContentValue): PortableTextBlock[] {
    if (!value) return [];

    // markdown string → convert properly
    if (typeof value === "string") {
        return markdownToPortableText(value);
    }

    // already PortableText
    return value;
}

/* -------------------------
   PORTABLETEXT COMPONENTS
-------------------------- */

const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;

            return (
                <div className="my-4">
                    <Image
                        src={urlFor(value).width(800).url()}
                        alt={value.alt || "Image"}
                        width={800}
                        height={600}
                        className="rounded-xl shadow-md w-full h-auto object-cover"
                    />
                </div>
            );
        },
    },

    block: {
        normal: ({ children }) => (
            <p className="mb-4 text-base text-gray-800">{children}</p>
        ),
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-6 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-5 mb-3">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-medium mt-4 mb-2">{children}</h4>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-4">
                {children}
            </blockquote>
        ),
    },

    marks: {
        strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,

        link: ({ value, children }) => {
            const href =
                value?.href ||
                (typeof value === "string" ? value : "");

            if (!href) return <>{children}</>;

            return (
                <a
                    href={href}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            );
        },
    },

    list: {
        bullet: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>
        ),
        number: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
    },
};

/* -------------------------
   COMPONENT
-------------------------- */

export default function BlockContent({ value }: BlockContentProps) {
    const normalized = normalize(value);

    return (
        <PortableText value={normalized} components={components} />
    );
}