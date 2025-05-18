import { defineField, defineType } from "sanity";

export const affiliateLinkType = defineType({
  name: "affiliateLink",
  title: "Affiliate Link",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "url", type: "url", title: "Affiliate URL" }),
    defineField({ name: "vendor", type: "string", title: "Vendor Name" }),
    defineField({ name: "relatedTo", type: "string", title: "Related To" }),
    // {
    //   name: "relatedTo",
    //   title: "Related Destination",
    //   type: "reference",
    //   to: [{ type: "destination" }],
    // },
  ],
});
