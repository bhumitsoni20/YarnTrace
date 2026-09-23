import React from "react";
import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No data available yet",
  description = "Get started by recording your first transaction or adding inventory records.",
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 border border-brand-200 mb-4 shadow-sm">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-base font-bold text-slate-800">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm" variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
