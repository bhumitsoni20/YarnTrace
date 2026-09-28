import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, RotateCcw } from "lucide-react";
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

const returnSchema = z.object({
  transactionDate: z.string().min(1, "Date is required"),
  referenceTransactionId: z.string().min(1, "Original issue transaction is required"),
  bags: z.coerce.number().int().min(0, "Bags cannot be negative"),
  kilos: z.coerce.number().positive("Return weight in KG must be greater than 0"),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface ReturnStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ReturnFormValues) => Promise<void>;
  issuedTransactions: TransactionRecord[];
  preselectedTransaction?: TransactionRecord | null;
  isLoading: boolean;
}

export default function ReturnStockModal({
  isOpen,
  onClose,
  onSubmit,
  issuedTransactions,
  preselectedTransaction,
  isLoading,
}: ReturnStockModalProps) {
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(
    preselectedTransaction || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      transactionDate: new Date().toISOString().split("T")[0],
      referenceTransactionId: preselectedTransaction?.id || "",
      bags: 0,
      kilos: 0,
      referenceNumber: "",
      remarks: "",
    },
  });

  const handleTxSelect = (txId: string) => {
    const found = issuedTransactions.find((t) => t.id === txId);
    setSelectedTx(found || null);
    setValue("referenceTransactionId", txId);
  };

  const handleFormSubmit = async (values: ReturnFormValues) => {
    await onSubmit(values);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 shrink-0">
              <RotateCcw className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
                Return Yarn to Stock
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Record returned unconsumed yarn from production floor back into Main Stock. References the original Issue transaction.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
          {/* Select Issue Transaction */}
          <div>
            <Label htmlFor="ret-tx" className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Select Original Issue Transaction <span className="text-red-500">*</span>
            </Label>
            <select
              id="ret-tx"
              value={selectedTx?.id || ""}
              onChange={(e) => handleTxSelect(e.target.value)}
              className="w-full text-xs h-10 px-3 rounded-lg border border-slate-300 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-slate-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
            >
              <option value="">-- Choose Issue Transaction --</option>
              {issuedTransactions
                .filter((t) => t.type === "ISSUED")
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.transactionNumber} | Lot: {t.lotNumber} | {t.count} | {t.kilos} KG ({t.bags} bags) | {new Date(t.transactionDate).toISOString().split("T")[0]}
                  </option>
                ))}
            </select>
            {errors.referenceTransactionId && (
              <p className="text-[11px] font-medium text-red-500 mt-1">
                {errors.referenceTransactionId.message}
              </p>
            )}
          </div>

          {selectedTx && (
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Original Issue:</span>
                <span className="font-mono font-bold text-slate-900">{selectedTx.transactionNumber}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Lot & Count:</span>
                <span className="font-semibold text-slate-800">{selectedTx.lotNumber} ({selectedTx.count})</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Original Issued Quantity:</span>
                <span className="font-bold font-mono text-blue-700">{selectedTx.kilos} KG ({selectedTx.bags} bags)</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ret-bags" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Bags Being Returned <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ret-bags"
                type="number"
                min="0"
                step="1"
                {...register("bags")}
                className="h-10 text-xs font-mono bg-slate-50/60 focus:bg-white font-medium"
              />
              {errors.bags && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.bags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ret-kilos" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Weight (KG) Returned <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ret-kilos"
                type="number"
                min="0.01"
                step="0.0001"
                {...register("kilos")}
                className="h-10 text-xs font-mono font-semibold text-blue-700 bg-slate-50/60 focus:bg-white"
              />
              {errors.kilos && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.kilos.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ret-date" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Return Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ret-date"
                type="date"
                {...register("transactionDate")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white"
              />
            </div>

            <div>
              <Label htmlFor="ret-slip" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Return Slip No (Optional)
              </Label>
              <Input
                id="ret-slip"
                placeholder="e.g. RS-102"
                {...register("referenceNumber")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ret-remarks" className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Remarks / Return Reason
            </Label>
            <Input
              id="ret-remarks"
              placeholder="e.g. Leftover cones returned after warping run completed"
              {...register("remarks")}
              className="h-10 text-xs bg-slate-50/60 focus:bg-white"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading} className="h-10 px-5 text-xs font-semibold">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading} className="h-10 px-5 text-xs font-semibold gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Return Yarn to Stock</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
