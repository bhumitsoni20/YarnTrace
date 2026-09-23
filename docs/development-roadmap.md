# YarnTrace Development Roadmap & Pending Business Decisions

## 1. Project Phase Breakdown

```
Phase 0: Architecture & Foundation (Current Phase)
  ├── Dual Next.js 15 & NestJS scaffolding
  ├── PostgreSQL schema & Prisma ORM modeling
  ├── Redux Toolkit + TanStack Query + Axios interceptor foundation
  ├── JWT Authentication & RBAC / Permission Guard architecture
  └── Enterprise UI Layout with Stitch "Industrial Loom & Trace" design system

Phase 1: Master Data & Identity Management
  ├── User CRUD, Role assignment & Permission mapping
  ├── Master Yarn Catalog (Blend, Count, Composition, Supplier)
  └── Storage Locations & Production Team hierarchy

Phase 2: Core Inward & Stock Operations
  ├── Yarn Received & Opening Stock modules
  ├── Lot Registration & Barcode generation
  ├── Stock Balance ledger updates
  └── Issue to Production Team workflow

Phase 3: Production Floor & Consumption Tracking
  ├── Work Order / Production Order allocation
  ├── Floor consumption recording (net weight, waste tare, gross)
  ├── Remaining stock handoff
  └── Return / transfer to warehouse

Phase 4: Output, Commercial & Dyeing Workflows
  ├── Final Product registration
  ├── Party delivery dispatches & packing slips
  ├── Purchase Order fulfillment tracking
  └── Outward/Inward Dyeing Lot movement

Phase 5: End-to-End Traceability Engine & Analytics
  ├── Forward Traceability (Yarn Lot -> Production -> Finished Product -> Party)
  ├── Backward Traceability (Party / Product Lot -> Production Batches -> Yarn Lot)
  ├── Excel Inward/Outward Import & Export (SheetJS)
  ├── PDF Generation (Delivery Slips & Inspection Reports)
  └── Executive Analytics & KPI dashboards
```

---

## 2. Pending Business Clarifications & Technical Decisions

The following business rules are explicitly **deferred** until confirmed by stakeholders to avoid baking in false assumptions:

| Topic | Key Question / Undefined Behavior | Action / Implementation Strategy |
|---|---|---|
| **103% Issue Validation Rule** | What constitutes the 103% ceiling? Does it permit issuing up to 103% of PO requirement to allow for standard spinning/warping waste? Is an admin override required if exceeded? | Defer calculation engine; add PO requirement schema foundation. |
| **"Retired" Status Definition** | Does "Retired" mean expired, unusable dead stock, sold as scrap, or sent for recycling? What financial impact or inventory reconciliation does it trigger? | Document status enum; defer automated balance adjustments. |
| **Unused Yarn Return Flow** | How does unused yarn return from the production team back to the Stock Head? Does it generate a credit note or a direct return transaction? | Implement standard `RETURNED` transaction type without rigid return locks. |
| **Production Yield Calculations** | What are the exact tare, moisture regain, and standard waste factors for Greige vs. Combed vs. Poly-cotton blends? | Implement decimal fields for raw vs. net weight; defer automated yield formulas. |
| **Dyeing Wastage Tolerance** | What percentage loss is acceptable during outward dyeing processing? | Model `DyeingMovement` entities; await tolerance thresholds. |
