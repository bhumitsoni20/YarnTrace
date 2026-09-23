"use client";

import React from "react";
import { ShoppingCart, Plus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function PurchaseOrdersPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Purchase Orders & Requirements"
        subtitle="Track customer purchase orders, yarn requirement fulfillment, and delivery scheduling."
        action={
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>New Purchase Order</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Register</CardTitle>
          <CardDescription>
            Orders awaiting production allocation and dispatch fulfillment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No purchase orders registered yet"
            description="Add purchase orders with yarn requirements to track end-to-end order execution."
            icon={ShoppingCart}
            actionLabel="+ Create Purchase Order"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
