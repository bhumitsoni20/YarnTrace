"use client";

import React from "react";
import { BarChart3, FileSpreadsheet, Printer } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function ReportsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Reports & Audit Intelligence"
        subtitle="Generate yarn reconciliation reports, consumption analysis, party dispatch summaries, and inventory manifests."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Generate Excel Report</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation & Analytics</CardTitle>
          <CardDescription>
            Historical reports and yield analytics across production cycles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No report data generated yet"
            description="Reports will be generated automatically as stock transactions and production consumption logs accumulate."
            icon={BarChart3}
            actionLabel="View Standard Templates"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
