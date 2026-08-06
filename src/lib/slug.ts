export function extractSlug(url: string): string | null {
  const match = url.match(/\/(?:products|posts)\/([^/?#]+)/);
  return match ? match[1] : null;
}
