export default {
  name: "affiliateLink",
  title: "Affiliate Link",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "url", type: "url", title: "Affiliate URL" },
    { name: "vendor", type: "string", title: "Vendor Name" },
    {
      name: "relatedTo",
      title: "Related Destination",
      type: "reference",
      to: [{ type: "destination" }],
    },
  ],
};
