"use client";

import React from "react";
import { ArrowLeftRight, Plus, Download } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function TransactionsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Stock Movement Transactions"
        subtitle="Complete ledger of all yarn movements: Received, Opening, Issued, Returned, Retired, and Adjustments."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export Ledger</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Record Transaction</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Movement Ledger</CardTitle>
          <CardDescription>
            Chronological log of all inward and outward material movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No transactions recorded yet"
            description="All stock transactions created by the Stock Head or production teams will appear in this ledger."
            icon={ArrowLeftRight}
            actionLabel="+ Create Transaction"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
