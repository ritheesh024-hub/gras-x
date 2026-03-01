import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-5 mb-6 border-b border-border/50",
        className,
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon in gradient square */}
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-brand shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-display font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
