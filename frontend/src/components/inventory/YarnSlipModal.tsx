"use client";

import React, { useState } from "react";
import {
  Printer,
  X,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers,
  FileCheck2,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Undo2,
  Trash2,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TransactionRecord, TransactionType } from "../../types/inventory";

interface YarnSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
}

export default function YarnSlipModal({
  isOpen,
  onClose,
  transaction,
}: YarnSlipModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const slipText = `YarnTrace Material Movement Voucher
Slip No: ${transaction.transactionNumber}
Type: ${transaction.type}
Date: ${new Date(transaction.transactionDate).toLocaleString("en-IN")}
Yarn Count: ${transaction.count || "—"}
Lot Number: ${transaction.lotNumber || "—"}
Commercial Partner: ${transaction.party?.name || "—"}
Bags: ${transaction.bags}
Net Weight: ${Number(transaction.kilos).toFixed(2)} KG
PO Number: ${transaction.poNumber || "N/A"}
Purpose: ${transaction.purpose || "N/A"}
Remarks: ${transaction.notes || "N/A"}`;

    try {
      await navigator.clipboard.writeText(slipText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const renderTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "OPENING":
        return <Boxes className="h-4 w-4" />;
      case "RECEIVED":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "ISSUED":
        return <ArrowUpRight className="h-4 w-4" />;
      case "RETURN":
        return <Undo2 className="h-4 w-4" />;
      case "RETIRED":
        return <Trash2 className="h-4 w-4" />;
      case "SOLD":
        return <ShoppingBag className="h-4 w-4" />;
      case "CORRECTION":
        return <Wrench className="h-4 w-4" />;
      default:
        return <FileCheck2 className="h-4 w-4" />;
    }
  };

  const getTypeTheme = (type: TransactionType) => {
    switch (type) {
      case "OPENING":
        return {
          badge: "bg-orange-100 text-orange-800 border-orange-200",
          header: "from-orange-600 to-amber-600",
        };
      case "RECEIVED":
        return {
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          header: "from-emerald-700 to-teal-700",
        };
      case "ISSUED":
        return {
          badge: "bg-sky-100 text-sky-800 border-sky-200",
          header: "from-sky-700 to-blue-700",
        };
      case "RETURN":
        return {
          badge: "bg-purple-100 text-purple-800 border-purple-200",
          header: "from-purple-700 to-indigo-700",
        };
      case "RETIRED":
        return {
          badge: "bg-rose-100 text-rose-800 border-rose-200",
          header: "from-rose-700 to-red-700",
        };
      case "SOLD":
        return {
          badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
          header: "from-indigo-700 to-violet-700",
        };
      default:
        return {
          badge: "bg-slate-100 text-slate-800 border-slate-200",
          header: "from-slate-800 to-slate-900",
        };
    }
  };

  const theme = getTypeTheme(transaction.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 flex flex-col max-h-[88vh] overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Scrollable Printable Section */}
        <div id="yarn-slip-printable" className="flex-1 overflow-y-auto bg-white text-slate-900">
          {/* Header Banner */}
          <div className={`bg-gradient-to-r ${theme.header} p-4 sm:p-5 text-white shrink-0`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-inner shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold tracking-tight text-white">
                      Yarn<span className="text-orange-300">Trace</span>
                    </h2>
                    <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Official Voucher
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-white/70" />
                    <span>Spinning Mill #4 • Material Movement Pass</span>
                  </p>
                </div>
              </div>

              {/* QR / Barcode Simulation */}
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15 text-[11px] font-mono text-white">
                  <QrCode className="h-3.5 w-3.5 text-white" />
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slip Content Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Voucher Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Voucher / Slip Number
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {transaction.transactionNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${theme.badge}`}
                  >
                    {renderTypeIcon(transaction.type)}
                    <span>{transaction.type}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 text-right">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Transaction Date & Time
                </p>
                <p className="text-xs font-semibold text-slate-700 flex items-center justify-end gap-1.5 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {new Date(transaction.transactionDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Split Details & KPI Weight Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Material & Partner Details */}
              <div className="md:col-span-7 space-y-2.5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Commercial Partner:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[180px] truncate">
                      {transaction.party?.name || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Yarn Count:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {transaction.count || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Lot Number:</span>
                    <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {transaction.lotNumber || "—"}
                    </span>
                  </div>

                  {transaction.poNumber && (
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                      <span className="text-slate-500 font-medium">PO Number:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {transaction.poNumber}
                      </span>
                    </div>
                  )}

                  {transaction.purpose && (
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-500 font-medium">Purpose / Section:</span>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {transaction.purpose}
                      </Badge>
                    </div>
                  )}

                  {transaction.referenceNumber && (
                    <div className="flex justify-between items-center py-0.5 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Ref / Challan No:</span>
                      <span className="font-mono text-slate-700">
                        {transaction.referenceNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Weight & Bags KPI Banner */}
              <div className="md:col-span-5 flex flex-col justify-between rounded-xl border border-brand-200 bg-orange-50/50 p-4 text-center shadow-sm">
                <div>
                  <p className="text-[10px] font-bold text-brand-800 uppercase tracking-wider">
                    Total Quantity
                  </p>
                  <div className="mt-2">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                      {Number(transaction.kilos).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <p className="text-[11px] font-bold text-brand-600 mt-0.5">NET KILOGRAMS (KG)</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-orange-200/70 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Standard Bags</span>
                    <span className="font-display text-base font-bold text-slate-900">
                      {transaction.bags.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-6 w-[1px] bg-orange-200" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Avg Kg/Bag</span>
                    <span className="font-mono text-xs font-semibold text-slate-700">
                      {transaction.bags > 0
                        ? (Number(transaction.kilos) / transaction.bags).toFixed(2)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks / Notes */}
            {transaction.notes && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs">
                <span className="font-semibold text-slate-700">Remarks / Purpose Notes: </span>
                <span className="text-slate-600">{transaction.notes}</span>
              </div>
            )}

            {/* Formal Authorized Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-center text-xs">
              <div>
                <div className="border-t border-dashed border-slate-400 pt-1.5">
                  <p className="font-semibold text-slate-800">
                    {transaction.createdBy || "Store Head / Authorized Officer"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Issued / Logged By</p>
                </div>
              </div>
              <div>
                <div className="border-t border-dashed border-slate-400 pt-1.5">
                  <p className="font-semibold text-slate-800">
                    {transaction.party?.contactPerson || "Receiving Floor Supervisor"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Received & Acknowledged By</p>
                </div>
              </div>
            </div>

            {/* Micro Footer Notice */}
            <div className="pt-1 text-center text-[10px] text-slate-400 border-t border-slate-100">
              System generated via YarnTrace Inventory & Traceability Platform • Plant 04
            </div>
          </div>
        </div>

        {/* Sticky Action Footer (Always 100% visible on screen) */}
        <div className="shrink-0 flex items-center justify-between p-3.5 bg-slate-50 border-t border-slate-200 print:hidden z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs text-slate-600 h-8"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              <X className="h-3.5 w-3.5 mr-1" />
              <span>Close</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 h-8 text-xs">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
