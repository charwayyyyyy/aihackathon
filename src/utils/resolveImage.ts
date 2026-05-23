const BASE_URL = "https://api-hackathon.codedematrixtech.com";

export function resolveImage(url?: string | null) {
  if (!url) return null;

  // already full URL
  if (url.startsWith("http")) return url;

  return `${BASE_URL}${url}`;
}