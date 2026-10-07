import React from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive";
  isLoading?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-6">
        <DialogHeader className="mb-0 pr-0">
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              {variant === "destructive" ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 border border-red-200 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-red-600" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 border border-brand-200 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-brand-600" strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <DialogTitle className="text-lg font-bold text-slate-900">{title}</DialogTitle>
              <DialogDescription className="text-sm text-slate-600 font-medium leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-8 pt-0 border-t-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-5 font-semibold text-slate-600"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto h-10 px-5 font-semibold"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
