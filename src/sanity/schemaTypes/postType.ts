import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
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
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    }),
    defineField({
      name: "destination",
      type: "reference",
      to: { type: "destination" },
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "excerpt",
      type: "text",
      validation: (Rule) =>
        Rule.max(160).warning("Excerpt should be less than 160 characters"),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "aiGenerated",
      title: "AI Generated",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "topicSource",
      title: "Topic Source",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
      },
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
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
