export default {
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "name" } },
    { name: "intro", type: "text", title: "Intro" },
    {
      name: "heroImage",
      type: "image",
      title: "Hero Image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    },
    {
      name: "details",
      type: "array",
      title: "Details",
      of: [{ type: "block" }],
    },
    {
      name: "affiliateLinks",
      title: "Affiliate Links",
      type: "array",
      of: [{ type: "reference", to: [{ type: "affiliateLink" }] }],
    }
  ],
};
