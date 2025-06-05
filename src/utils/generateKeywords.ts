export async function generateKeywords({
  title,
  categories,
}: {
  title: string;
  categories?: string[];
}) {
  const baseKeywords = [
    "Nepal",
    "travel",
    "blog",
    "adventure",
    "guide",
    "event",
    "destination",
    "whats happening",
    "beautiful",
    "magnificent",
  ];
  const titleKeywords = title.split(" ").filter((word) => word.length > 3);
  const categoryKeywords =
    (categories && categories.flatMap((cat) => cat.split(" "))) || [];

  const allKeywords = [...baseKeywords, ...titleKeywords, ...categoryKeywords];
  return [...new Set(allKeywords.map((k) => k.toLowerCase()))];
}
