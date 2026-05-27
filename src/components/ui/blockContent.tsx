import React from 'react';
import { PortableText, PortableTextBlock, PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { markdownToPortableText } from '@/lib/markdownToPortableText';

// -----------------------------------------------------------------------------
// Types (no `any`, no `undefined` literal)
// -----------------------------------------------------------------------------
type BlockContentValue = PortableTextBlock[] | string;
type BlockContentProps = { value: BlockContentValue };

type Span = { _type: 'span'; text: string; marks?: string[] };
type BlockWithChildren = PortableTextBlock & { children?: Span[] };

function hasChildren(block: PortableTextBlock): block is BlockWithChildren {
    return Array.isArray((block as BlockWithChildren).children);
}

function getPlainText(block: PortableTextBlock): string {
    if (!hasChildren(block)) return '';
    return block.children.map(child => child.text).join('');
}

// -----------------------------------------------------------------------------
// Helper: render a definition‑style item (bold term + colon + description)
// -----------------------------------------------------------------------------
function renderDefinitionItem(term: string, colon: string, description: string, asListItem: boolean): React.ReactElement {
    const content = (
        <>
            <strong className="font-bold text-gray-900">{term}</strong>
            {colon && <span>{colon}</span>}
            {description && <span> {description}</span>}
        </>
    );
    if (asListItem) {
        return <li className="my-2 list-none">{content}</li>;
    }
    return <div className="my-2">{content}</div>;
}

// -----------------------------------------------------------------------------
// Normalizer: handles raw Markdown strings (pre‑process anchors)
// -----------------------------------------------------------------------------
function normalize(value: BlockContentValue): PortableTextBlock[] {
    if (!value) return [];
    if (typeof value === 'string') {
        let processed = value;
        // Convert anchored headings (any level, including ####)
        processed = processed.replace(
            /^(#{1,6})\s+(.*?)\s+\{#([\w-]+)\}$/gm,
            (_, hashes: string, title: string, id: string) => `${hashes} ${title} <!-- anchor:${id} -->`
        );
        return markdownToPortableText(processed);
    }
    return value;
}

// -----------------------------------------------------------------------------
// Heading renderer (extracts anchor id for any heading level)
// -----------------------------------------------------------------------------
function renderHeading(
    block: PortableTextBlock,
    Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    className: string
): React.ReactElement {
    let anchorId: string | null = null;
    let cleanedText = '';

    if (hasChildren(block)) {
        const cleanedSpans = block.children.map(span => {
            if (span.text.includes('<!-- anchor:')) {
                const match = span.text.match(/<!-- anchor:([\w-]+) -->/);
                if (match) anchorId = match[1];
                const newText = span.text.replace(/<!-- anchor:[\w-]+ -->/, '');
                return { ...span, text: newText };
            }
            return span;
        });
        cleanedText = cleanedSpans.map(s => s.text).join('');
    } else {
        cleanedText = block.children?.[0]?.text ?? '';
    }

    return React.createElement(Tag, { id: anchorId, className }, cleanedText);
}

// -----------------------------------------------------------------------------
// Portable Text components
// -----------------------------------------------------------------------------
const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            return (
                <div className="my-4">
                    <Image
                        src={urlFor(value).width(800).url()}
                        alt={value.alt || 'Image'}
                        width={800}
                        height={600}
                        className="rounded-xl shadow-md w-full h-auto object-cover"
                    />
                </div>
            );
        },
    },

    block: {
        // Normal paragraphs: detect patterns "- **Term:**" or "1. **Term:**"
        normal: ({ value, children }) => {
            const text = getPlainText(value);
            // Match bullet or numbered list with bold term + optional colon
            const match = text.match(/^(?:-|\d+\.)\s+\*\*(.*?)\*\*(:*)(.*)$/);
            if (match) {
                const term = match[1].replace(/:$/, '');
                const colon = match[2] || (match[1].endsWith(':') ? ':' : '');
                const description = match[3].trimStart();
                return renderDefinitionItem(term, colon, description, false);
            }
            const boldRegex = /\*\*(.*?)\*\*/g;
            if (boldRegex.test(text)) {
                boldRegex.lastIndex = 0; // reset after test
                const parts: React.ReactNode[] = [];
                let lastIndex = 0;
                let match: RegExpExecArray | null;
                while ((match = boldRegex.exec(text)) !== null) {
                    // text before bold
                    if (match.index > lastIndex) {
                        parts.push(text.slice(lastIndex, match.index));
                    }
                    // bold text
                    parts.push(<strong key={match.index} className="font-bold text-gray-900">{match[1]}</strong>);
                    lastIndex = match.index + match[0].length;
                }
                // remaining text after last bold
                if (lastIndex < text.length) {
                    parts.push(text.slice(lastIndex));
                }
                // wrap in paragraph with same styling
                return <p className="mb-4 text-base text-gray-800">{parts}</p>;
            }

            const headingMatch = text.match(/^(#{1,6})\s+(.*?)(?:\s+\{#([\w-]+)\})?$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const title = headingMatch[2];
                const anchor = headingMatch[3];
                let headingText = title;
                if (anchor) headingText += ` <!-- anchor:${anchor} -->`;
                const spans = [{ _type: 'span', text: headingText, marks: [] }];
                const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                const headingClass =
                    level === 1 ? 'text-4xl font-bold mt-6 mb-4' :
                        level === 2 ? 'text-3xl font-semibold mt-6 mb-4' :
                            level === 3 ? 'text-2xl font-semibold mt-5 mb-3' :
                                level === 4 ? 'text-xl font-medium mt-4 mb-2' :
                                    level === 5 ? 'text-lg font-medium mt-4 mb-2' :
                                        'text-base font-medium mt-3 mb-2';
                return renderHeading({ _type: 'block', style: `h${level}`, children: spans }, tag, headingClass);
            }
            return <p className="mb-4 text-base text-gray-800">{children}</p>;
        },

        h1: ({ value }) => renderHeading(value, 'h1', 'text-4xl font-bold mt-6 mb-4'),
        h2: ({ value }) => renderHeading(value, 'h2', 'text-3xl font-semibold mt-6 mb-4'),
        h3: ({ value }) => renderHeading(value, 'h3', 'text-2xl font-semibold mt-5 mb-3'),
        h4: ({ value }) => renderHeading(value, 'h4', 'text-xl font-medium mt-4 mb-2'),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-4">
                {children}
            </blockquote>
        ),
    },

    marks: {
        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        link: ({ value, children }) => {
            const href = value?.href || (typeof value === 'string' ? value : '');
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
        bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
    },

    listItem: {
        bullet: ({ value, children }) => {
            const text = getPlainText(value);
            const match = text.match(/^\*\*(.*?)\*\*(:*)(.*)$/);
            if (match) {
                const term = match[1].replace(/:$/, '');
                const colon = match[2] || (match[1].endsWith(':') ? ':' : '');
                const description = match[3].trimStart();
                return renderDefinitionItem(term, colon, description, true);
            }
            return <li className="list-disc pl-2">{children}</li>;
        },
        number: ({ value, children }) => {
            const text = getPlainText(value);
            // For ordered list items, detect **Term:** or **Term**:
            const match = text.match(/^\*\*(.*?)\*\*(:*)(.*)$/);
            if (match) {
                const term = match[1].replace(/:$/, '');
                const colon = match[2] || (match[1].endsWith(':') ? ':' : '');
                const description = match[3].trimStart();
                return renderDefinitionItem(term, colon, description, true);
            }
            return <li className="list-decimal pl-2">{children}</li>;
        },
    },
};


// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------
export default function BlockContent({ value }: BlockContentProps) {
    const normalized = normalize(value);
    return <PortableText value={normalized} components={components} />;
}