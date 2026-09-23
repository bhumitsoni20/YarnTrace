"use client";

import React from "react";
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Factory,
  Flame,
  ShoppingCart,
  Layers,
  Plus,
  ArrowRightLeft,
  FileSpreadsheet,
  QrCode,
  Clock,
  ShieldCheck,
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function DashboardPage() {
  // Empty state KPI values per prompt instructions (no fake calculations)
  const kpiData = [
    {
      title: "Total Yarn Stock",
      value: "0.0000 KG",
      subtitle: "Aggregated warehouse balance",
      icon: Boxes,
      accentColor: "brand" as const,
      isEmpty: true,
    },
    {
      title: "Received (Inward)",
      value: "0.0000 KG",
      subtitle: "Total inward lots received",
      icon: ArrowDownLeft,
      accentColor: "emerald" as const,
      isEmpty: true,
    },
    {
      title: "Issued to Floor",
      value: "0.0000 KG",
      subtitle: "Issued by Stock Head",
      icon: ArrowUpRight,
      accentColor: "blue" as const,
      isEmpty: true,
    },
    {
      title: "With Production Teams",
      value: "0.0000 KG",
      subtitle: "Active floor inventory",
      icon: Factory,
      accentColor: "amber" as const,
      isEmpty: true,
    },
    {
      title: "Consumed in Production",
      value: "0.0000 KG",
      subtitle: "Total yarn converted",
      icon: Flame,
      accentColor: "slate" as const,
      isEmpty: true,
    },
    {
      title: "Pending Purchase Orders",
      value: "0 PO",
      subtitle: "Awaiting yarn fulfillment",
      icon: ShoppingCart,
      accentColor: "amber" as const,
      isEmpty: true,
    },
    {
      title: "Final Output Products",
      value: "0.0000 KG",
      subtitle: "Finished goods ready for dispatch",
      icon: Layers,
      accentColor: "brand" as const,
      isEmpty: true,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Inventory & Production Overview"
        subtitle="Real-time yarn lot balance, production floor allocations, and end-to-end traceability."
        action={
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Manifest</span>
            </Button>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ArrowRightLeft className="h-3.5 w-3.5 text-brand-600" />
              <span>Receive Inward</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>New Yarn Lot</span>
            </Button>
          </div>
        }
      />

      {/* 7 Core KPI Dimension Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
            accentColor={kpi.accentColor}
            isEmpty={kpi.isEmpty}
          />
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Lot Traceability & Production Batches Table */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Live Lot Traceability & Batches</CardTitle>
                <CardDescription>
                  Active spinning lots, floor allocations, and stage progression
                </CardDescription>
              </div>
              <Badge variant="brand" className="gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                Live Sync
              </Badge>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No active yarn lots in production yet"
                description="Once inward yarn lots are registered and issued to production teams, real-time stage progression and spool metrics will appear here."
                icon={Boxes}
                actionLabel="+ Register Inward Lot"
                onAction={() => {}}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Floor Actions & Audit Stream */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Production Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Floor Actions</CardTitle>
              <CardDescription>High-frequency operational shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="flex w-full items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-200 text-left transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Inward Lot Reception</p>
                    <p className="text-[10px] text-slate-400">Record gate inward Challan</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">Step 1</Badge>
              </button>

              <button className="flex w-full items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-200 text-left transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Issue to Production Team</p>
                    <p className="text-[10px] text-slate-400">Stock Head handoff slip</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">Step 2</Badge>
              </button>

              <button className="flex w-full items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-200 text-left transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Generate Lot Barcode</p>
                    <p className="text-[10px] text-slate-400">Print cone & bag identifiers</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">Print</Badge>
              </button>
            </CardContent>
          </Card>

          {/* Recent Traceability Activity & Audit Stream */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Traceability Audit Stream</CardTitle>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <CardDescription>Immutable record of inventory mutations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-6 text-center">
                <ShieldCheck className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Audit Ledger Active</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  All future lot movements, consumption, and dispatches will be automatically logged.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
