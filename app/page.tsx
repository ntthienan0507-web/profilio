import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { Education } from "@/components/sections/education";
import { Hobbies } from "@/components/sections/hobbies";
import { Contact } from "@/components/sections/contact";
import { getContent } from "@/lib/content";

export default async function Home() {
  const content = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.siteConfig.name,
    jobTitle: "Senior Full-Stack Engineer",
    url: content.siteConfig.url,
    sameAs: [content.siteConfig.links.github, content.siteConfig.links.linkedin],
    knowsAbout: [
      "Go",
      "Ruby",
      "TypeScript",
      "Kubernetes",
      "PostgreSQL",
      "Cloud Infrastructure",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero siteConfig={content.siteConfig} />
      <About aboutText={content.aboutText} stats={content.stats} />
      <Skills skills={content.skills} />
      <Experience experiences={content.experiences} />
      <Achievements achievements={content.achievements} />
      <Education education={content.education} />
      <Hobbies hobbies={content.hobbies} />
      <Contact siteConfig={content.siteConfig} />
    </>
  );
}
