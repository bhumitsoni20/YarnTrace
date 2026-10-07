export type ProductionOrderStatus =
  | "DRAFT"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export type YarnAllocationStatus =
  | "ALLOCATED"
  | "PARTIALLY_ISSUED"
  | "FULLY_ISSUED"
  | "CANCELLED";

export interface ProductionTeam {
  id: string;
  code: string;
  name: string;
  department: string;
  teamLead: string | null;
  remarks: string | null;
  isActive: boolean;
  activeOrdersCount: number;
  totalAllocatedKg: number;
  totalConsumedKg: number;
  totalReturnedKg: number;
  currentStockKg: number;
  createdAt: string;
  updatedAt: string;
  inventoryBreakdown?: Array<{
    lotId: string;
    lotNumber: string;
    yarnCount: string;
    allocatedKg: number;
    consumedKg: number;
    wasteKg: number;
    returnedKg: number;
    availableBalanceKg: number;
  }>;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  status: ProductionOrderStatus;
  targetQuantity: number;
  unit: string;
  priority: string;
  purpose: string | null;
  productName: string | null;
  productType: string | null;
  poNumber: string | null;
  party: {
    id: string;
    name: string;
    code: string;
  } | null;
  productionTeam: {
    id: string;
    name: string;
    code: string;
    department: string;
  } | null;
  startDate: string | null;
  targetDate: string | null;
  completedDate: string | null;
  remarks: string | null;
  allocationsCount: number;
  totalAllocatedKg: number;
  totalConsumedKg: number;
  totalWasteKg: number;
  totalReturnedKg: number;
  remainingTeamBalanceKg: number;
  totalOutputKg: number;
  yieldPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemizedAllocation {
  id: string;
  lotId: string;
  lotNumber: string;
  yarnCount: string;
  supplierName: string;
  teamId: string;
  teamName: string;
  inventoryTransactionId: string | null;
  sourceTxNumber: string;
  bags: number;
  allocatedKg: number;
  consumedKg: number;
  wasteKg: number;
  returnedKg: number;
  balanceKg: number;
  allocatedDate: string;
  status: YarnAllocationStatus;
  remarks: string | null;
}

export interface ConsumptionRecord {
  id: string;
  productionOrderId: string;
  productionTeamId: string;
  lotId: string;
  yarnAllocationId: string | null;
  yarnCount: string | null;
  consumedKg: number;
  wasteKg: number;
  wasteCategory: string | null;
  bags: number;
  netProducedKg: number | null;
  purpose: string | null;
  consumptionDate: string;
  remarks: string | null;
  isCorrected: boolean;
  correctionReason: string | null;
  lot?: {
    id: string;
    lotNumber: string;
    yarnCount: string | null;
  };
  productionTeam?: {
    id: string;
    name: string;
  };
  recordedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ProductionReturn {
  id: string;
  productionOrderId: string;
  productionTeamId: string;
  lotId: string;
  yarnAllocationId: string | null;
  inventoryTransactionId: string | null;
  yarnCount: string | null;
  returnedKg: number;
  returnedBags: number;
  returnDate: string;
  reason: string | null;
  remarks: string | null;
  lot?: {
    id: string;
    lotNumber: string;
  };
  productionTeam?: {
    id: string;
    name: string;
  };
  inventoryTransaction?: {
    id: string;
    transactionNumber: string;
  } | null;
  recordedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ProductionOutput {
  id: string;
  productionOrderId: string;
  productName: string;
  productCode: string | null;
  outputQuantityKg: number;
  unit: string;
  outputDate: string;
  remarks: string | null;
  recordedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ProductionOrderDetail extends ProductionOrder {
  itemizedAllocations: ItemizedAllocation[];
  consumptionRecords: ConsumptionRecord[];
  returns: ProductionReturn[];
  outputs: ProductionOutput[];
  auditLogs: Array<{
    id: string;
    action: string;
    module: string;
    timestamp: string;
    newValue: any;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  }>;
}

export interface EligibleIssue {
  id: string;
  transactionNumber: string;
  transactionDate: string;
  lotId: string;
  lotNumber: string;
  yarnCount: string;
  partyId: string | null;
  partyName: string;
  poNumber: string | null;
  purpose: string;
  issuedBags: number;
  totalIssuedKg: number;
  totalAllocatedKg: number;
  unallocatedKg: number;
  allocationsCount: number;
}

export interface ProductionSummary {
  activeOrdersCount: number;
  activeTeamsCount: number;
  totalAllocatedKg: number;
  totalAllocatedBags: number;
  totalConsumedKg: number;
  totalWasteKg: number;
  totalConsumedBags: number;
  totalReturnedKg: number;
  totalReturnedBags: number;
  currentTeamStockKg: number;
  currentTeamStockBags: number;
  totalOutputKg: number;
  averageYieldPercentage: number;
}
