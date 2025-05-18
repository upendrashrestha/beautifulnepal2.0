// /sanity/lib/serverClient.ts
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, contactFormToken } from "../env";

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: contactFormToken, // must be set in .env
});
