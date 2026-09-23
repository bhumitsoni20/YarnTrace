import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  requiredPermission?: string;
  section?: "MAIN" | "COMMERCIAL" | "GOVERNANCE";
}
