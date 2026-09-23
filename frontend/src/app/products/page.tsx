"use client";

import React from "react";
import { Layers, Plus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function ProductsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Finished Output Products"
        subtitle="Catalog of finished fabric rolls, processed yarns, and manufactured batches ready for delivery."
        action={
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>Register Output Batch</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Finished Goods Inventory</CardTitle>
          <CardDescription>
            Output products manufactured from converted yarn batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No finished products registered yet"
            description="Finished products output from completed production orders will be listed here."
            icon={Layers}
            actionLabel="+ Register First Batch"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
