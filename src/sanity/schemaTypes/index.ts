import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import destinationType from "./destinationType";
import affiliateLinkType from "./affiliateLinkType";
import { contactType } from "./contactType";
import { companyType } from "./companyType";
import { socialLinkType } from "./socialLinkType";
import { guideType } from "./guideType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    destinationType,
    affiliateLinkType,
    contactType,
    companyType,
    socialLinkType,
    guideType,
  ],
};
