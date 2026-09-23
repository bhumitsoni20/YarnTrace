"use client";

import React from "react";
import { Factory, Plus, Users } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function ProductionPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Production & Floor Allocation"
        subtitle="Manage production work orders, team allocations, floor consumption records, and waste tracking."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Production Teams</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>New Work Order</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Active Work Orders</CardTitle>
          <CardDescription>
            Work orders in progress across Spinning, Warping, Weaving, and Knitting teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No active production orders"
            description="Create a production order to allocate issued yarn lots to specific floor teams."
            icon={Factory}
            actionLabel="+ Create Production Order"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
