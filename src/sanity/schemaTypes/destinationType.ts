import { defineArrayMember, defineField, defineType } from "sanity";

export const destinationType = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "name" },
    }),
    defineField({ name: "intro", type: "text", title: "Intro" }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Hero Image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "details",
      type: "blockContent",
      title: "Details",
    }),
    defineField({
      name: "affiliateLinks",
      title: "Affiliate Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "affiliateLink" }],
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
    }),
    // ========== NEW SEO FIELDS ==========
    defineField({
      name: "seo",
      title: "SEO & Metadata",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description:
            "Title for search engines (max 60 characters). Leave blank to use post title.",
          validation: (Rule) =>
            Rule.max(60).warning(
              "Meta title should be ≤ 60 characters for best SEO",
            ),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
          description: "Description for search results (max 160 characters).",
          validation: (Rule) =>
            Rule.max(160).warning(
              "Meta description should be ≤ 160 characters",
            ),
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "SEO keywords/tags for this post.",
          options: {
            layout: "tags",
          },
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
          description:
            "Override the canonical URL (e.g., for syndicated content).",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https"],
              allowRelative: false,
            }),
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          description:
            "Image shown when sharing on social media (1200x630px recommended).",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
            }),
          ],
        }),
        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          description: "Prevent search engines from indexing this post.",
          initialValue: false,
        }),
      ],
    }),
  ],
});
