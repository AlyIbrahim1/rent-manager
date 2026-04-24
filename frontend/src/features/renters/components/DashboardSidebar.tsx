import { BarChart3, Building2, HandCoins, LayoutDashboard, Plus, Settings, Users2 } from "lucide-react";

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
    <aside
      className="hidden lg:flex"
      style={{
        position: "fixed",
        inset: "0 auto 0 0",
        width: 272,
        background: "#f2f4f6",
        flexDirection: "column",
        padding: "28px 16px",
        zIndex: 20,
      }}
    >
      <div style={{ padding: "0 8px", marginBottom: 28 }}>
        <img src={logoSrc} alt="The Ledger" style={{ height: 36, width: "auto" }} />
        <p
          style={{
            marginTop: 6,
            marginBottom: 0,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "#45464d",
          }}
        >
          Property Management
        </p>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              disabled={!item.active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 4,
                border: "none",
                background: item.active ? "#e6e8ea" : "transparent",
                color: item.active ? "#059669" : "#45464d",
                fontSize: 13,
                fontWeight: 600,
                cursor: item.active ? "pointer" : "default",
                transform: item.active ? "scale(1.01)" : "none",
                boxShadow: item.active ? "0 12px 40px rgba(25,28,30,0.06)" : "none",
                transition: "all 200ms",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <Icon size={16} color={item.active ? "#059669" : "#45464d"} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {!item.active ? (
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
                  Soon
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "0 4px" }}>
        <button
          type="button"
          onClick={onAddRenter}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "11px 16px",
            background: "linear-gradient(135deg, #0f172a, #131b2e)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "opacity 200ms",
          }}
        >
          <Plus size={14} color="#fff" />
          Add Renter
        </button>
      </div>
    </aside>
  );
}
