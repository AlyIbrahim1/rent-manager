import { Plus, LayoutDashboard, Building2, Users2, HandCoins, BarChart3, Settings } from "lucide-react";

type Props = {
  logoSrc: string;
  onAddRenter: () => void;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Properties", icon: Building2, active: false },
  { label: "Tenants", icon: Users2, active: false },
  { label: "Payments", icon: HandCoins, active: false },
  { label: "Reports", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const;

export function DashboardSidebar({ logoSrc, onAddRenter }: Props) {
  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:flex-col lg:bg-surface-container-low lg:px-4 lg:py-8">
      <div className="px-4">
        <img src={logoSrc} alt="The Ledger" className="h-10 w-auto" />
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-on-surface-muted">Property Management</p>
      </div>

      <nav className="mt-8 flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              disabled={!item.active}
              className={`group flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left transition-all duration-200 ${
                item.active
                  ? "bg-surface-container-high text-[#059669] shadow-layer scale-[1.01]"
                  : "text-on-surface-muted hover:bg-surface-container hover:text-on-surface hover:scale-[1.01]"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-sm font-semibold">{item.label}</span>
              {!item.active && <span className="ml-auto text-[10px] uppercase tracking-[0.18em] opacity-70">Soon</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 px-3">
        <button
          type="button"
          onClick={onAddRenter}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add Renter
        </button>
      </div>
    </aside>
  );
}
