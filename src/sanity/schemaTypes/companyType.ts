import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const companyType = defineType({
  name: "company",
  title: "Company Information",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),
    defineField({
      name: "phone",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "email",
    }),
    defineField({
      name: "address",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "logo",
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
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required().error("Description is required"),
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "socialLink" } }),
      ],
    }),
    defineField({
      name: "termsAndConditions",
      type: "blockContent",
    }),
    defineField({
      name: "shortDescription",
      type: "text",
      validation: (Rule) =>
        Rule.max(160).warning("Excerpt should be less than 160 characters"),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
