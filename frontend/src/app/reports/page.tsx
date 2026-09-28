"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileSpreadsheet,
  Printer,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCw,
  Factory,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { apiClient } from "../../lib/axios";

export default function ReportsPage() {
  const { data: kpiData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["reports", "kpi-summary"],
    queryFn: async () => {
      const res = await apiClient.get("/reports/kpi-summary");
      return res.data.data;
    },
    staleTime: 30_000,
  });

  const handleExportExcel = async () => {
    try {
      const res = await apiClient.get("/inventory/export?format=xlsx", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `YarnTrace_Executive_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to export Excel report");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await apiClient.get("/inventory/export?format=csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `YarnTrace_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to export CSV report");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Reports & Audit Intelligence"
        subtitle="Generate yarn reconciliation reports, consumption analysis, party dispatch summaries, and inventory manifests."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5 h-9"
              title="Refresh Analytics"
            >
              <RotateCw className={`h-3.5 w-3.5 text-slate-500 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 h-9"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportExcel}
              className="gap-1.5 h-9"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Generate Excel Report</span>
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-brand-600 card-interactive stagger-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Authoritative Stock
              </p>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-7 w-20" /> : `${Number(kpiData?.totalStockKg || 0).toFixed(2)} KG`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Live physical stock</p>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <Boxes className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 card-interactive stagger-2">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Inward Received
              </p>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-7 w-20" /> : `${Number(kpiData?.receivedKg || 0).toFixed(2)} KG`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Excluding opening balance</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-600 card-interactive stagger-3">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Issued to Floor
              </p>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-7 w-20" /> : `${Number(kpiData?.issuedKg || 0).toFixed(2)} KG`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Production allocations</p>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600 card-interactive stagger-4">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Active Master Lots
              </p>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-7 w-12" /> : kpiData?.totalLotsCount || 0}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Tracked yarn batches</p>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Factory className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-interactive">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Full Inventory & Lot Ledger</span>
            </CardTitle>
            <CardDescription>
              Complete multi-tab workbook containing all stock balances and transaction movements.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="w-full gap-2 text-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Download Excel (.xlsx)</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              <span>Material Reconciliation Summary</span>
            </CardTitle>
            <CardDescription>
              Reconciles opening balance + inwards against outward issues, returns, and write-offs.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="w-full gap-2 text-xs"
            >
              <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
              <span>Export Reconciliation</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Compliance & Audit Trail</span>
            </CardTitle>
            <CardDescription>
              Immutable chronological record of every user action and ledger mutation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="w-full gap-2 text-xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Export CSV Audit Log</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
