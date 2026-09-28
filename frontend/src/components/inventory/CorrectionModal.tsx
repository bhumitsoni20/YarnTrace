import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TransactionRecord } from "../../types/inventory";

const correctionSchema = z.object({
  referenceTransactionId: z.string().min(1, "Reference transaction is required"),
  reason: z.string().min(5, "Mandatory reason for correction is required (min 5 characters)"),
  correctedBags: z.coerce.number().optional(),
  correctedKilos: z.coerce.number().optional(),
  remarks: z.string().optional(),
});

type CorrectionFormValues = z.infer<typeof correctionSchema>;

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CorrectionFormValues) => Promise<void>;
  transaction: TransactionRecord | null;
  isLoading: boolean;
}

export default function CorrectionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  isLoading,
}: CorrectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorrectionFormValues>({
    resolver: zodResolver(correctionSchema),
    values: {
      referenceTransactionId: transaction?.id || "",
      reason: "",
      correctedBags: transaction?.bags || undefined,
      correctedKilos: transaction?.kilos || undefined,
      remarks: "",
    },
  });

  const handleFormSubmit = async (values: CorrectionFormValues) => {
    await onSubmit(values);
    reset();
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 shrink-0">
              <ShieldAlert className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
                Reverse & Correct Transaction
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Reverses transaction <strong className="text-slate-800 font-mono">{transaction.transactionNumber}</strong> ({transaction.type}). Stock transactions are never hard-deleted; an audit-logged reversal ledger entry will be recorded.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
          {/* Original Transaction Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Tx Number:</span>
              <span className="font-mono font-bold text-slate-900">{transaction.transactionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type & Date:</span>
              <span className="font-semibold text-slate-800">
                {transaction.type} | {new Date(transaction.transactionDate).toISOString().split("T")[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lot / Count:</span>
              <span className="font-semibold text-slate-800">{transaction.lotNumber} ({transaction.count})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Original Quantity:</span>
              <span className="font-bold font-mono text-brand-700">{transaction.kilos} KG ({transaction.bags} bags)</span>
            </div>
          </div>

          <div>
            <Label htmlFor="corr-reason" className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Mandatory Correction / Reversal Reason <span className="text-red-500">*</span>
            </Label>
            <Input
              id="corr-reason"
              placeholder="e.g. Weighbridge calibration error - offset created per audit verification"
              {...register("reason")}
              className="h-10 text-xs bg-slate-50/60 focus:bg-white"
            />
            {errors.reason && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-800 mb-2">
              Replacement Corrected Quantity (Optional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="corr-bags" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Corrected Bags
                </Label>
                <Input
                  id="corr-bags"
                  type="number"
                  step="1"
                  {...register("correctedBags")}
                  className="h-10 text-xs font-mono bg-slate-50/60 focus:bg-white font-medium"
                />
              </div>

              <div>
                <Label htmlFor="corr-kilos" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Corrected Weight (KG)
                </Label>
                <Input
                  id="corr-kilos"
                  type="number"
                  step="0.0001"
                  {...register("correctedKilos")}
                  className="h-10 text-xs font-mono font-semibold text-brand-700 bg-slate-50/60 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading} className="h-10 px-5 text-xs font-semibold">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading} className="h-10 px-5 text-xs font-semibold gap-1.5 shadow-sm bg-brand-600 hover:bg-brand-700">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Execute Reversal & Correction</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
