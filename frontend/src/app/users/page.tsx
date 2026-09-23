"use client";

import React from "react";
import { UserCog, Plus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export default function UsersPage() {
  return (
    <AppLayout>
      <PageHeader
        title="User Accounts & Access Management"
        subtitle="Manage operators, stock heads, production managers, and system administrators."
        action={
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span>Add User Account</span>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Registered staff members and their active operational permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="User management active"
            description="Manage corporate user accounts, reset credentials, and assign functional roles."
            icon={UserCog}
            actionLabel="+ Invite Staff Member"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
