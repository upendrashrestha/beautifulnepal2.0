"use server";

import { clearCache } from "@/sanity/lib/cache";

export async function clearSanityCache(formData: FormData) {
  const key = formData.get("key")?.toString();
  clearCache(key || undefined);
}
