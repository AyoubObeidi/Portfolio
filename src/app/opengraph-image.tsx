import { ogCard, ogSize } from "@/lib/og";
import { profile } from "@/lib/profile";
import { siteDescription } from "@/lib/site";

export const alt = `${profile.name}, ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: profile.role,
    title: profile.name,
    subtitle: siteDescription,
  });
}
