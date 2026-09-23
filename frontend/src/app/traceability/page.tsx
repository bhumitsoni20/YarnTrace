"use client";

import React, { useState } from "react";
import { Network, Search } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function TraceabilityPage() {
  const [traceType, setTraceType] = useState<"forward" | "backward">("forward");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout>
      <PageHeader
        title="End-to-End Traceability Engine"
        subtitle="Perform bidirectional genealogical tracing: Forward (Yarn Lot → Delivery) or Backward (Product / Delivery → Yarn Lot)."
      />

      {/* Trace Query Search Box */}
      <Card className="mb-8 border-brand-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-100">
              <button
                onClick={() => setTraceType("forward")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  traceType === "forward"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Forward Trace (Lot → Party)
              </button>
              <button
                onClick={() => setTraceType("backward")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  traceType === "backward"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Backward Trace (Party → Lot)
              </button>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={
                  traceType === "forward"
                    ? "Enter Lot Number (e.g. #YT-9482, LOT-2026-001)..."
                    : "Enter Finished Product Code, Delivery Challan or LR No..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <Button variant="primary" className="gap-2 shrink-0">
              <Network className="h-4 w-4" />
              <span>Trace Genealogy</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <EmptyState
            title="No active trace lookup"
            description="Enter a Yarn Lot number or Finished Product code above to generate an interactive genealogical lifecycle map."
            icon={Network}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
