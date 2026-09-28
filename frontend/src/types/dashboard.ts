export interface DashboardLiveLot {
  id: string;
  lotNumber: string;
  count: string;
  party: {
    id: string;
    name: string;
    code: string;
  } | null;
  currentWeightKg: number;
  currentBags: number;
  status: string;
  lastMovementDate: string;
  lastMovementType: string;
}

export interface DashboardRecentMovement {
  id: string;
  transactionNumber: string;
  type: string;
  transactionDate: string;
  yarnCount: string;
  partyName: string | null;
  lotNumber: string;
  kilos: number;
  bags: number;
  createdByName: string;
  createdByEmail: string | null;
}

export interface DashboardOverview {
  totalStockKg: number;
  totalStockBags: number;
  receivedKg: number;
  receivedBags: number;
  receivedLotsCount: number;
  issuedKg: number;
  issuedBags: number;
  productionTeamKg: number;
  consumedKg: number;
  pendingPurchaseOrders: number;
  pendingRequirementsCount: number;
  finalOutputKg: number;
  activeLotsCount: number;
  totalPartiesCount: number;
  liveLots: DashboardLiveLot[];
  recentMovements: DashboardRecentMovement[];
}
