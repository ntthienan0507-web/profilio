import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  caption: string;
  title: string;
  className?: string;
}

export function SectionHeading({ caption, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", className)}>
      <p className="mb-2 font-mono text-sm uppercase tracking-[0.1em] text-accent">
        {caption}
      </p>
      <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight">
        {title}
      </h2>
    </div>
  );
}
