"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Network,
  Search,
  Boxes,
  Factory,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { apiClient } from "../../lib/axios";

export default function TraceabilityPage() {
  const [traceType, setTraceType] = useState<"forward" | "backward">("forward");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  // Fetch Lots to give quick suggested lot pills
  const { data: lotsData = [] } = useQuery({
    queryKey: ["inventory", "lots", "quick"],
    queryFn: async () => {
      const res = await apiClient.get("/inventory/lots");
      return res.data.data;
    },
    staleTime: 60_000,
  });

  // Query for Traceability
  const {
    data: traceResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["traceability", traceType, activeQuery],
    queryFn: async () => {
      if (!activeQuery.trim()) return null;
      if (traceType === "forward") {
        const res = await apiClient.get(`/traceability/forward/${encodeURIComponent(activeQuery.trim())}`);
        return res.data.data;
      } else {
        const res = await apiClient.get(`/traceability/backward/${encodeURIComponent(activeQuery.trim())}`);
        return res.data.data;
      }
    },
    enabled: !!activeQuery.trim(),
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim());
    }
  };

  const handleSelectSampleLot = (lotNum: string) => {
    setSearchQuery(lotNum);
    setActiveQuery(lotNum);
  };

  return (
    <AppLayout>
      <PageHeader
        title="End-to-End Traceability Engine"
        subtitle="Perform bidirectional genealogical tracing: Forward (Yarn Lot → Floor Movement → Product) or Backward (Product → Yarn Lot)."
      />

      {/* Trace Query Search Box */}
      <Card className="mb-8 border-brand-200 shadow-sm card-interactive">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-100">
              <button
                type="button"
                onClick={() => {
                  setTraceType("forward");
                  setActiveQuery("");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  traceType === "forward"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Forward Trace (Lot → Party)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTraceType("backward");
                  setActiveQuery("");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  traceType === "backward"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Backward Trace (Product → Lot)
              </button>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={
                  traceType === "forward"
                    ? "Enter Lot Number (e.g. #YT-9482, LOT-2026-001)..."
                    : "Enter Finished Product Code or PO Number..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <Button type="submit" variant="primary" className="gap-2 shrink-0">
              <Network className="h-4 w-4" />
              <span>Trace Genealogy</span>
            </Button>
          </form>

          {/* Quick Clickable Suggestions */}
          {lotsData.length > 0 && traceType === "forward" && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Active Lots:</span>
              {lotsData.slice(0, 6).map((l: { id: string; lotNumber: string; count: string }) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleSelectSampleLot(l.lotNumber)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 transition-colors font-mono text-[11px]"
                >
                  {l.lotNumber} ({l.count})
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Notice */}
      {isError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              Could not find genealogical trace for &ldquo;{activeQuery}&rdquo;:{" "}
              {error instanceof Error ? error.message : "Record not found"}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs bg-white text-red-700 hover:bg-red-50 border-red-300"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Traceability Flow Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Traceability Trail</CardTitle>
              <CardDescription>
                Genealogical timeline mapping every stock movement, floor allocation, and dispatch
              </CardDescription>
            </div>
            <Badge variant="secondary">Bidirectional Engine</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 py-8">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !traceResult ? (
            <EmptyState
              title="No active trace lookup"
              description="Enter a Yarn Lot number or select an active lot from the suggestion pills above to visualize its end-to-end lifecycle."
              icon={Network}
            />
          ) : (
            <div className="space-y-6 pt-2">
              {/* Lot Overview KPI Header */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    <Boxes className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-slate-900 font-mono">
                        {traceResult.lotNumber}
                      </h3>
                      <Badge variant="brand">{traceResult.currentStatus || "ACTIVE"}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supplier: <span className="font-semibold text-slate-700">{traceResult.supplier?.name || "Spinning Mill"}</span> • Received: {new Date(traceResult.receivedDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Initial Net Weight</p>
                    <p className="font-display text-base font-bold text-slate-900">
                      {Number(traceResult.initialWeightKg || 0).toFixed(2)} KG
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Balance</p>
                    <p className="font-display text-base font-bold text-brand-600">
                      {Number(traceResult.currentWeightKg || 0).toFixed(2)} KG
                    </p>
                  </div>
                </div>
              </div>

              {/* Genealogical Timeline */}
              <div className="relative pl-6 border-l-2 border-brand-200 space-y-6 ml-4">
                {/* Step 1: Receiving / Inward */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-brand-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-brand-600" />
                        Stage 1: Yarn Received & Quarantined at Warehouse
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(traceResult.receivedDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Supplied by <span className="font-semibold">{traceResult.supplier?.name || "Spinning Mill"}</span> with net weight of {Number(traceResult.initialWeightKg || 0).toFixed(2)} KG.
                    </p>
                  </div>
                </div>

                {/* Step 2: Floor Movements */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Factory className="h-3.5 w-3.5 text-sky-600" />
                        Stage 2: Production Issues & Floor Handoffs
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {traceResult.allocations?.length || 0} Records
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Material allocated to warping, weaving, and knitting teams under authorized purchase orders.
                    </p>
                  </div>
                </div>

                {/* Step 3: Finished Goods / Delivery */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                    <Layers className="h-3 w-3" />
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        Stage 3: Finished Goods & Outward Dispatch
                      </span>
                      <Badge variant="outline" className="text-[10px]">End-to-End Verified</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Full bidirectional genealogy preserved across yarn transformations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
