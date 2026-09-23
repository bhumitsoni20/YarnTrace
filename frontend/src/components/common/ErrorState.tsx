import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while communicating with the YarnTrace backend server.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3 border border-red-200">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h4 className="font-display text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-1 max-w-md text-xs text-slate-600">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Request</span>
          </Button>
        </div>
      )}
    </div>
  );
}
