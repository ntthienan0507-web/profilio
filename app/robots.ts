import type { MetadataRoute } from "next";
import { defaultSiteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${defaultSiteConfig.url}/sitemap.xml`,
  };
}
