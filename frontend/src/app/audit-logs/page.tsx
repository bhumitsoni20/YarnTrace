"use client";

import React from "react";
import { FileClock, Filter, Download, Shield } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function AuditLogsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Audit Logs & System Governance"
        subtitle="Immutable security trail of every user action, entity modification, stock issue, and permission override."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Trail</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter Events</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>System Activity Ledger</CardTitle>
            <CardDescription>
              Chronological immutable log of state mutations with before/after value diffs
            </CardDescription>
          </div>
          <Badge variant="success" className="gap-1">
            <Shield className="h-3 w-3" />
            Tamper-Resistant
          </Badge>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Audit log engine initialized"
            description="All API actions, logins, stock movements, and lot updates will generate persistent audit records."
            icon={FileClock}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
