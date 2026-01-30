import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ParticleBgLoader } from "@/components/ui/particle-bg-loader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getContent } from "@/lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const { siteConfig } = content;

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    keywords: [
      "Full-Stack Engineer",
      "Go",
      "Ruby",
      "TypeScript",
      "Kubernetes",
      "Cloud Infrastructure",
      "Portfolio",
    ],
    openGraph: {
      title: `${siteConfig.name} | ${siteConfig.title}`,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | ${siteConfig.title}`,
      description: siteConfig.description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: set theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'light') document.documentElement.className = 'light';
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ParticleBgLoader />
          <Navbar navLinks={content.navLinks} />
          <main className="relative z-10">{children}</main>
          <Footer siteConfig={content.siteConfig} />
        </ThemeProvider>
      </body>
    </html>
  );
}
