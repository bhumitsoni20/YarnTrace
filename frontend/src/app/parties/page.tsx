"use client";

import React from "react";
import { Users2, Plus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function PartiesPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Parties, Suppliers & Dyeing Mills"
        subtitle="Manage supplier master directory, customers, external dyeing mills, and logistics partners."
        action={
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Party</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Directory of Commercial Partners</CardTitle>
          <CardDescription>
            Suppliers, customers, dyeing units, and job workers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No commercial parties registered yet"
            description="Add suppliers to record incoming yarn shipments, or customers for dispatches."
            icon={Users2}
            actionLabel="+ Add Supplier / Customer"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
