export interface ActiveLotPill {
  id: string;
  lotNumber: string;
  yarnCount: string;
  currentWeightKg: number;
  currentBags: number;
  supplierName: string;
  status: string;
}

export interface ProductSearchResult {
  id: string;
  productCode: string;
  name: string;
  category?: string;
  totalQuantityKg: number;
  type?: 'PRODUCT' | 'WORK_ORDER';
}

export interface TraceSummary {
  sourceKg: number;
  openingKg: number;
  receivedKg: number;
  issuedKg: number;
  returnedKg: number;
  soldKg: number;
  retiredKg: number;
  allocatedKg: number;
  consumedKg: number;
  wasteKg: number;
  productionReturnedKg: number;
  currentMainStockKg: number;
  currentMainStockBags: number;
  currentTeamStockKg: number;
  totalOutputKg: number;
  reconciled: boolean;
  statusBadge: string;
}

export interface TimelineNode {
  id: string;
  type:
    | 'PARENT_LOT'
    | 'CHILD_LOT'
    | 'OPENING'
    | 'RECEIVED'
    | 'ISSUED'
    | 'RETURN'
    | 'RETURNED'
    | 'SOLD'
    | 'RETIRED'
    | 'CORRECTION'
    | 'ALLOCATED'
    | 'CONSUMED'
    | 'PRODUCTION_OUTPUT'
    | 'DELIVERED';
  title: string;
  description: string;
  date: string;
  quantityKg?: number | null;
  bags?: number | null;
  status?: string | null;
  partyName?: string | null;
  teamName?: string | null;
  department?: string | null;
  workOrderNumber?: string | null;
  workOrderId?: string | null;
  productName?: string | null;
  productCode?: string | null;
  poNumber?: string | null;
  purpose?: string | null;
  referenceNumber?: string | null;
  transactionNumber?: string | null;
  actor?: string | null;
  metadata?: Record<string, any>;
}

export interface ForwardTraceData {
  root: {
    type: 'LOT';
    id: string;
    lotNumber: string;
    yarnCount: string;
    yarn?: {
      id: string;
      code: string;
      name: string;
      type: string;
      composition: string;
      color?: string;
    };
    supplier?: {
      id: string;
      name: string;
      code: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
    };
    receivedDate: string;
    status: string;
    millLotNumber?: string;
    shadeCode?: string;
    remarks?: string;
    currentBags: number;
    currentWeightKg: number;
    initialWeightKg: number;
    initialBags: number;
  };
  summary: TraceSummary;
  parentLot?: {
    id: string;
    lotNumber: string;
    yarnCount?: string;
    supplierName?: string;
    receivedDate: string;
    initialWeightKg: number;
    currentWeightKg: number;
  } | null;
  childLots: Array<{
    id: string;
    lotNumber: string;
    yarnCount?: string;
    initialWeightKg: number;
    currentWeightKg: number;
    status: string;
    receivedDate: string;
  }>;
  sources: Array<{
    id: string;
    transactionNumber: string;
    type: string;
    date: string;
    kilos: number;
    bags: number;
    partyName: string;
    poNumber: string;
    purpose: string;
    notes?: string;
    createdByName: string;
  }>;
  movements: Array<{
    id: string;
    transactionNumber: string;
    type: string;
    status: string;
    date: string;
    kilos: number;
    bags: number;
    partyName: string;
    partyCode?: string;
    poNumber: string;
    purpose: string;
    referenceNumber: string;
    referenceTransaction?: {
      transactionNumber: string;
      type: string;
      kilos: number;
    } | null;
    correctionReason?: string;
    notes?: string;
    createdByName: string;
  }>;
  productionTeams: Array<{
    id: string;
    code: string;
    name: string;
    department: string;
    teamLead?: string;
    allocatedKg: number;
    consumedKg: number;
    wasteKg: number;
    returnedKg: number;
    remainingKg: number;
  }>;
  workOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    priority: string;
    purpose?: string;
    productName?: string;
    targetQuantity: number;
    unit: string;
    partyName: string;
    poNumber: string;
    teamName: string;
    startDate?: string;
    targetDate?: string;
    completedDate?: string;
    allocatedKg: number;
    consumedKg: number;
    wasteKg: number;
    returnedKg: number;
    outputs: Array<{
      id: string;
      productName: string;
      productCode?: string;
      outputQuantityKg: number;
      unit: string;
      outputDate: string;
      recordedByName: string;
    }>;
  }>;
  consumptions: Array<{
    id: string;
    productionOrderId: string;
    workOrderNumber: string;
    productionTeamName: string;
    consumedKg: number;
    wasteKg: number;
    wasteCategory: string;
    netProducedKg?: number | null;
    purpose?: string;
    consumptionDate: string;
    recordedByName: string;
    remarks?: string;
  }>;
  returns: Array<{
    id: string;
    productionOrderId: string;
    workOrderNumber: string;
    productionTeamName: string;
    returnedKg: number;
    returnedBags: number;
    returnDate: string;
    reason: string;
    inventoryTxNumber: string;
    recordedByName: string;
  }>;
  outputs: Array<{
    id: string;
    productName: string;
    productCode?: string;
    outputQuantityKg: number;
    unit: string;
    outputDate: string;
    workOrderNumber: string;
    workOrderId: string;
    recordedByName: string;
  }>;
  products: Array<{
    id: string;
    productCode: string;
    name: string;
    totalQuantityKg: number;
    availableKg: number;
    workOrderNumber: string;
  }>;
  deliveries: Array<{
    id: string;
    deliveryNumber: string;
    partyName: string;
    partyCode?: string;
    dispatchedKg: number;
    status: string;
    dispatchDate: string;
    vehicleNumber?: string;
    productName?: string;
    productCode?: string;
    workOrderNumber: string;
  }>;
  timeline: TimelineNode[];
}

export interface BackwardTraceData {
  root: {
    type: 'PRODUCT';
    id: string;
    productCode: string;
    name: string;
    category?: string;
    totalQuantityKg: number;
    availableKg: number;
    unit: string;
  };
  productionOrder?: {
    id: string;
    orderNumber: string;
    status: string;
    priority: string;
    purpose?: string;
    targetQuantity: number;
    unit: string;
    teamName: string;
    customerName: string;
    poNumber: string;
    startDate?: string;
    targetDate?: string;
    completedDate?: string;
  } | null;
  summary: {
    totalConsumedKg: number;
    totalWasteKg: number;
    totalOutputKg: number;
    totalDispatchedKg: number;
    consumedLotsCount: number;
    yieldPercentage: number;
    statusBadge: string;
  };
  consumedLots: Array<{
    lotId: string;
    lotNumber: string;
    yarnCount: string;
    yarnName: string;
    yarnType: string;
    supplierName: string;
    initialWeightKg: number;
    currentWeightKg: number;
    receivedDate: string;
    receiptTransactionNumber: string;
    parentLot?: {
      lotNumber: string;
      supplierName: string;
    } | null;
    totalConsumedKg: number;
    totalWasteKg: number;
    allocations: Array<{
      allocatedKg: number;
      allocatedDate: string;
      teamName: string;
    }>;
  }>;
  consumptions: Array<{
    id: string;
    lotNumber: string;
    yarnCount: string;
    consumedKg: number;
    wasteKg: number;
    wasteCategory: string;
    teamName: string;
    consumptionDate: string;
    recordedByName: string;
  }>;
  outputs: Array<{
    id: string;
    productName: string;
    productCode?: string;
    outputQuantityKg: number;
    unit: string;
    outputDate: string;
    recordedByName: string;
  }>;
  deliveries: Array<{
    id: string;
    deliveryNumber: string;
    partyName: string;
    partyCode?: string;
    dispatchedKg: number;
    status: string;
    dispatchDate: string;
    vehicleNumber?: string;
  }>;
  timeline: TimelineNode[];
}
