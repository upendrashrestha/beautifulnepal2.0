import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { PortableTextBlock } from "@portabletext/react";
import type { Root, Content, Text } from "mdast";

/* -------------------------
   TYPE GUARDS
-------------------------- */

function isText(node: Content): node is Text {
    return node.type === "text";
}

/**
 * Safe check for nodes that can contain children
 * (no Parent type needed — avoids TS issues)
 */
function hasChildren(
    node: Content
): node is Extract<Content, { children: Content[] }> {
    return "children" in node;
}

/* -------------------------
   MAIN CONVERTER
-------------------------- */

export function markdownToPortableText(
    markdown: string
): PortableTextBlock[] {
    const tree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(markdown) as Root;

    const blocks: PortableTextBlock[] = [];

    /* -------------------------
       SPAN BUILDER
    -------------------------- */

    const toSpans = (node: Content): PortableTextBlock["children"] => {
        const spans: PortableTextBlock["children"] = [];

        const walk = (n: Content): void => {
            if (isText(n)) {
                spans.push({
                    _type: "span",
                    text: n.value,
                });
                return;
            }

            // bold
            if (n.type === "strong") {
                spans.push({
                    _type: "span",
                    text: extractText(n),
                    marks: ["strong"],
                });
                return;
            }

            // italic
            if (n.type === "emphasis") {
                spans.push({
                    _type: "span",
                    text: extractText(n),
                    marks: ["em"],
                });
                return;
            }

            // link
            if (n.type === "link") {
                const url =
                    typeof (n as { url?: unknown }).url === "string"
                        ? (n as { url: string }).url
                        : "";

                spans.push({
                    _type: "span",
                    text: extractText(n),
                    marks: [`link:${url}`],
                });
                return;
            }

            if (hasChildren(n)) {
                n.children.forEach(walk);
            }
        };

        walk(node);
        return spans;
    };

    /* -------------------------
       TEXT FLATTENER
    -------------------------- */

    const extractText = (node: Content): string => {
        let text = "";

        const walk = (n: Content): void => {
            if (isText(n)) {
                text += n.value;
                return;
            }

            if (hasChildren(n)) {
                n.children.forEach(walk);
            }
        };

        walk(node);
        return text;
    };

    /* -------------------------
       MAIN WALKER
    -------------------------- */

    const visit = (node: Content): void => {
        switch (node.type) {
            case "heading": {
                const style =
                    node.depth === 1
                        ? "h1"
                        : node.depth === 2
                        ? "h2"
                        : node.depth === 3
                        ? "h3"
                        : "normal";

                blocks.push({
                    _type: "block",
                    style,
                    children: toSpans(node),
                });

                break;
            }

            case "paragraph": {
                blocks.push({
                    _type: "block",
                    style: "normal",
                    children: toSpans(node),
                });

                break;
            }

            case "list": {
                const ordered =
                    (node as { ordered?: boolean }).ordered === true;

                if (hasChildren(node)) {
                    node.children.forEach((item) => {
                        if (!hasChildren(item)) return;

                        item.children.forEach((child) => {
                            blocks.push({
                                _type: "block",
                                style: "normal",
                                listItem: ordered ? "number" : "bullet",
                                children: toSpans(child),
                            } as PortableTextBlock);
                        });
                    });
                }

                break;
            }

            default: {
                if (hasChildren(node)) {
                    node.children.forEach(visit);
                }
            }
        }
    };

    tree.children.forEach(visit);

    return blocks;
}