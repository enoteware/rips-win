import { cn } from "@/lib/utils";

export interface BonusCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  primary?: boolean;
  className?: string;
}

export function BonusCard({
  title,
  description,
  cta,
  href,
  primary,
  className,
}: BonusCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-surface-dark border border-border-dark rounded-xl overflow-hidden",
        "hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      <div className="relative h-48 bg-cover bg-center overflow-hidden bg-gradient-to-br from-primary/20 to-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent opacity-90" aria-hidden />
      </div>
      <div className="p-6 relative -mt-12">
        {primary && (
          <span className="bg-primary text-primary-foreground font-black text-xs px-2 py-1 inline-block mb-3 rounded">
            BEST VALUE
          </span>
        )}
        <h3 className="text-2xl font-black mb-2 uppercase">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full text-center font-bold py-3 rounded-lg transition-all",
            primary
              ? "bg-primary text-primary-foreground glow-primary group-hover:glow-primary"
              : "bg-border-dark text-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
