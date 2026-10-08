export type ProductType =
  | 'FABRIC_ROLL'
  | 'FINISHED_YARN'
  | 'MANUFACTURED_BATCH'
  | 'GARMENT'
  | 'OTHER';

export type ProductStatus =
  | 'DRAFT'
  | 'PRODUCED'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ConsumedYarnLotInfo {
  lotId: string;
  lotNumber: string;
  yarnCount: string;
  supplierName: string;
  consumedKg: number;
  wasteKg: number;
  wasteCategory: string | null;
  consumptionDate: string;
  teamName: string;
}

export interface OutputBatchDelivery {
  id: string;
  deliveryNumber: string;
  dispatchedKg: number;
  dispatchDate: string;
  status: string;
  party?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface OutputBatchComputed {
  id: string;
  batchNumber: string;
  productId: string | null;
  productCode: string;
  productName: string;
  productType: string;
  outputQuantityKg: number;
  unit: string;
  status: ProductStatus | string;
  outputDate: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  recordedByName: string | null;
  productionOrderId: string;
  productionOrder: {
    id: string;
    orderNumber: string;
    status: string;
    targetQuantity: number;
    unit: string;
    purpose: string | null;
    priority: string;
    startDate: string | null;
    targetDate: string | null;
    completedDate: string | null;
  };
  productionTeam: {
    id: string;
    name: string;
    department: string;
    teamLead: string | null;
  } | null;
  party: {
    id: string;
    name: string;
    code: string;
    type: string;
    contactPerson?: string | null;
    phone?: string | null;
    email?: string | null;
    gstNumber?: string | null;
  } | null;
  consumedYarnKg: number;
  totalWasteKg: number;
  yarnLots: ConsumedYarnLotInfo[];
  yieldPercentage: number;
  yieldVarianceKg: number;
  deliveriesCount: number;
  dispatchedKg: number;
  availableKg: number;
}

export interface ProductsSummaryMetrics {
  totalBatches: number;
  totalOutputKg: number;
  readyBatchesCount: number;
  deliveredBatchesCount: number;
  cancelledBatchesCount: number;
  totalConsumedYarnKg: number;
  averageYieldPct: number;
}

export interface EligibleProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  productType: string;
  status: string;
  targetQuantity: number;
  unit: string;
  partyName: string;
  partyId: string | null;
  teamName: string;
  teamDepartment: string;
  existingOutputKg: number;
  consumedKg: number;
  remainingPlannedKg: number;
}

export interface RegisterOutputBatchInput {
  productionOrderId: string;
  productId?: string;
  productName: string;
  productCode?: string;
  productType?: string;
  batchNumber?: string;
  outputQuantityKg: number;
  unit?: string;
  outputDate?: string;
  status?: string;
  remarks?: string;
}

export interface UpdateOutputBatchInput {
  productName?: string;
  productCode?: string;
  productType?: string;
  outputQuantityKg?: number;
  unit?: string;
  outputDate?: string;
  status?: string;
  remarks?: string;
}

export interface CancelOutputBatchInput {
  reason?: string;
}

export interface ProductFilterParams {
  search?: string;
  productType?: string;
  status?: string;
  partyId?: string;
  productionTeamId?: string;
  productionOrderId?: string;
  startDate?: string;
  endDate?: string;
}
