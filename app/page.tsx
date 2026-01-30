import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { Education } from "@/components/sections/education";
import { Hobbies } from "@/components/sections/hobbies";
import { Contact } from "@/components/sections/contact";
import { siteConfig } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Senior Full-Stack Engineer",
  url: siteConfig.url,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  knowsAbout: [
    "Go",
    "Ruby",
    "TypeScript",
    "Kubernetes",
    "PostgreSQL",
    "Cloud Infrastructure",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Achievements />
      <Education />
      <Hobbies />
      <Contact />
    </>
  );
}
