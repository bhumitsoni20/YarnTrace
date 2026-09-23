"use client";

import React from "react";
import { ShieldCheck, Plus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function RolesPermissionsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Roles & Granular Permissions"
        subtitle="Configure role hierarchy (Stock Head, Production Lead, Quality QA) and assign granular action capabilities."
        action={
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>Create Custom Role</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Role Access Matrix</CardTitle>
          <CardDescription>
            System RBAC roles with associated capability permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="RBAC matrix configured"
            description="Default system roles (ADMIN, STOCK_HEAD, PRODUCTION_HEAD, QUALITY_HEAD, VIEWER) are initialized in backend."
            icon={ShieldCheck}
            actionLabel="View Permission Matrix"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
