import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const socialLinkType = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required().error("Name is required"),
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
      name: "link",
      type: "text",
      validation: (Rule) => Rule.required().error("Link is required"),
    }),
  ],
});
