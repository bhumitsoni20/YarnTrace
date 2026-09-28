import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { TransactionType } from '@prisma/client';

export interface DashboardOverviewResponse {
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
  liveLots: Array<{
    id: string;
    lotNumber: string;
    count: string;
    party: { id: string; name: string; code: string } | null;
    currentWeightKg: number;
    currentBags: number;
    status: string;
    lastMovementDate: string;
    lastMovementType: string;
  }>;
  recentMovements: Array<{
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
  }>;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async getOverview(): Promise<DashboardOverviewResponse> {
    // Parallel PostgreSQL Aggregations for Total Stock, Received, Issued, POs, and Live Lots
    const [
      stockSummary,
      receivedAgg,
      issuedAgg,
      poRequirements,
      lots,
      recentTransactions,
    ] = await Promise.all([
      // Authoritative Total Stock from InventoryService (Single Source of Truth)
      this.inventoryService.getStockSummary(),

      // Total RECEIVED (excluding OPENING)
      this.prisma.transaction.aggregate({
        where: { type: TransactionType.RECEIVED },
        _sum: { kilos: true, bags: true },
        _count: { id: true },
      }),

      // Total ISSUED (excluding SOLD, RETIRED)
      this.prisma.transaction.aggregate({
        where: { type: TransactionType.ISSUED },
        _sum: { kilos: true, bags: true },
        _count: { id: true },
      }),

      // Purchase Orders / PO Requirements for actual pending counts
      this.prisma.pORequirement.findMany({
        select: {
          id: true,
          requiredKg: true,
          issuedKg: true,
          poNumber: true,
          purchaseOrderId: true,
          purchaseOrder: {
            select: {
              status: true,
              poNumber: true,
            },
          },
        },
      }),

      // Live Active Lots for Traceability table
      this.prisma.lot.findMany({
        take: 25,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          lotNumber: true,
          yarnCount: true,
          currentWeightKg: true,
          currentBags: true,
          status: true,
          receivedDate: true,
          supplier: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          transactions: {
            take: 1,
            orderBy: { transactionDate: 'desc' },
            select: {
              type: true,
              transactionDate: true,
              transactionNumber: true,
            },
          },
        },
      }),

      // Recent Audit Movements (sorted newest first)
      this.prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          transactionNumber: true,
          type: true,
          transactionDate: true,
          yarnCount: true,
          kilos: true,
          bags: true,
          party: {
            select: {
              name: true,
            },
          },
          lot: {
            select: {
              lotNumber: true,
              yarnCount: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate Pending POs
    let pendingRequirementsCount = 0;
    const pendingPoIds = new Set<string>();

    for (const req of poRequirements) {
      const reqKg = Number(req.requiredKg);
      const issKg = Number(req.issuedKg);
      if (issKg < reqKg) {
        // Requirement is PENDING or PARTIAL
        if (
          !req.purchaseOrder ||
          (req.purchaseOrder.status !== 'FULFILLED' &&
            req.purchaseOrder.status !== 'CANCELLED')
        ) {
          pendingRequirementsCount++;
          if (req.purchaseOrderId) {
            pendingPoIds.add(req.purchaseOrderId);
          } else if (req.poNumber) {
            pendingPoIds.add(req.poNumber);
          }
        }
      }
    }

    // Format Live Lots
    const liveLots = lots.map((lot) => {
      const lastTx = lot.transactions && lot.transactions.length > 0 ? lot.transactions[0] : null;
      return {
        id: lot.id,
        lotNumber: lot.lotNumber,
        count: lot.yarnCount || '1/10 KW',
        party: lot.supplier
          ? {
              id: lot.supplier.id,
              name: lot.supplier.name,
              code: lot.supplier.code,
            }
          : null,
        currentWeightKg: Number(lot.currentWeightKg.toFixed(4)),
        currentBags: lot.currentBags,
        status: lot.status,
        lastMovementDate: lastTx
          ? lastTx.transactionDate.toISOString()
          : lot.receivedDate.toISOString(),
        lastMovementType: lastTx ? lastTx.type : 'OPENING',
      };
    });

    // Format Recent Movements
    const recentMovements = recentTransactions.map((tx) => ({
      id: tx.id,
      transactionNumber: tx.transactionNumber,
      type: tx.type,
      transactionDate: tx.transactionDate.toISOString(),
      yarnCount: tx.yarnCount || tx.lot?.yarnCount || '—',
      partyName: tx.party?.name || null,
      lotNumber: tx.lot?.lotNumber || '—',
      kilos: Number(tx.kilos.toFixed(4)),
      bags: tx.bags,
      createdByName: tx.createdBy
        ? `${tx.createdBy.firstName} ${tx.createdBy.lastName}`.trim()
        : 'System',
      createdByEmail: tx.createdBy?.email || null,
    }));

    return {
      totalStockKg: stockSummary.totalWeightKg,
      totalStockBags: stockSummary.totalBags,
      receivedKg: Number((Number(receivedAgg._sum.kilos || 0)).toFixed(4)),
      receivedBags: receivedAgg._sum.bags || 0,
      receivedLotsCount: receivedAgg._count.id || 0,
      issuedKg: Number((Number(issuedAgg._sum.kilos || 0)).toFixed(4)),
      issuedBags: issuedAgg._sum.bags || 0,
      productionTeamKg: 0, // Future Scope
      consumedKg: 0, // Future Scope
      pendingPurchaseOrders: pendingPoIds.size,
      pendingRequirementsCount,
      finalOutputKg: 0, // Future Scope
      activeLotsCount: stockSummary.activeLotsCount,
      totalPartiesCount: stockSummary.totalParties,
      liveLots,
      recentMovements,
    };
  }
}
