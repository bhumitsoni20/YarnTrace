"use client";

import React from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMobileMenuOpen } from "../../store/slices/uiSlice";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Desktop & Collapsible Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
