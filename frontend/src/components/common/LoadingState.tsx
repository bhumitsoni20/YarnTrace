import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadingState({
  rows = 5,
  title = "Loading data...",
}: {
  rows?: number;
  title?: string;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-700">{title}</p>
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-9 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
