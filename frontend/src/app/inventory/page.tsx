"use client";

import React from "react";
import { Boxes, Plus, Filter, Download } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function InventoryPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Yarn Stock & Lot Inventory"
        subtitle="Manage warehouse stock balances in KG, yarn counts, and physical location allocations."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter Lots</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Opening Stock</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Stock Balances</CardTitle>
          <CardDescription>
            Live real-time quantity in KG tracked across storage locations and lots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No inventory records available yet"
            description="Start by adding Opening Stock or recording inward yarn shipments from suppliers."
            icon={Boxes}
            actionLabel="+ Add Initial Opening Stock"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
