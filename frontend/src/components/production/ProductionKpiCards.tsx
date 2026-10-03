import React from "react";
import { Factory, ArrowUpRight, Flame } from "lucide-react";
import StatCard from "../common/StatCard";
import { Skeleton } from "../ui/skeleton";
import { ProductionSummary } from "../../types/production";

interface ProductionKpiCardsProps {
  summary?: ProductionSummary;
  isLoading?: boolean;
}

export default function ProductionKpiCards({ summary, isLoading }: ProductionKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white p-5 border border-slate-200">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-8 w-36 mb-2" />
            <Skeleton className="h-3 w-44" />
          </div>
        ))}
      </div>
    );
  }

  const activeOrders = summary?.activeOrdersCount ?? 0;
  const activeTeams = summary?.activeTeamsCount ?? 0;
  const allocatedKg = summary?.totalAllocatedKg ?? 0;
  const allocatedBags = summary?.totalAllocatedBags ?? 0;
  const teamStockKg = summary?.currentTeamStockKg ?? 0;
  const teamStockBags = summary?.currentTeamStockBags ?? 0;
  const consumedKg = summary?.totalConsumedKg ?? 0;
  const wasteKg = summary?.totalWasteKg ?? 0;
  const outputKg = summary?.totalOutputKg ?? 0;
  const avgYield = summary?.averageYieldPercentage ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Active Work Orders"
        value={activeOrders}
        subtitle={`${activeTeams} active production ${activeTeams === 1 ? "team" : "teams"}`}
        icon={Factory}
        accentColor="brand"
        isEmpty={activeOrders <= 0}
      />
      <StatCard
        title="Yarn Allocated to Floor"
        value={`${allocatedKg.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })} KG`}
        subtitle={`${allocatedBags.toLocaleString()} bags allocated from issued stock`}
        icon={ArrowUpRight}
        accentColor="blue"
        isEmpty={allocatedKg <= 0}
      />
      <StatCard
        title="With Production Teams"
        value={`${teamStockKg.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })} KG`}
        subtitle={`${teamStockBags.toLocaleString()} bags currently held on floor`}
        icon={Factory}
        accentColor="amber"
        isEmpty={teamStockKg <= 0}
      />
      <StatCard
        title="Consumed & Output"
        value={`${consumedKg.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })} KG`}
        subtitle={`Output: ${outputKg.toLocaleString()} KG (${avgYield}% yield | ${wasteKg.toFixed(2)} KG waste)`}
        icon={Flame}
        accentColor="emerald"
        isEmpty={consumedKg <= 0}
      />
    </div>
  );
}
