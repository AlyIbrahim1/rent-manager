// Sidebar.jsx — The Ledger Dashboard Sidebar
// Shared via window.LedgerSidebar

const sidebarNavItems = [
  { label: "Dashboard",   icon: "layout-dashboard", active: true  },
  { label: "Properties",  icon: "building-2",        active: false },
  { label: "Tenants",     icon: "users-2",           active: false },
  { label: "Payments",    icon: "hand-coins",         active: false },
  { label: "Reports",     icon: "bar-chart-3",        active: false },
  { label: "Settings",    icon: "settings",           active: false },
];

function LucideIcon({ name, size = 16, strokeWidth = 2, color }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = "";
      const svg = window.lucide.createElement(window.lucide.icons[toCamel(name)]);
      if (svg) {
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("stroke-width", strokeWidth);
        if (color) svg.setAttribute("stroke", color);
        ref.current.appendChild(svg);
      }
    }
  });
  return React.createElement("span", { ref, style: { display: "inline-flex", alignItems: "center" } });
}

function toCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, s => s.toUpperCase());
}

function LedgerSidebar({ onAddRenter }) {
  return React.createElement("aside", {
    style: {
      position: "fixed", inset: "0 auto 0 0", width: 272,
      background: "#f2f4f6", display: "flex", flexDirection: "column",
      padding: "28px 16px", zIndex: 20,
    }
  },
    // Logo
    React.createElement("div", { style: { padding: "0 8px", marginBottom: 28 } },
      React.createElement("img", { src: "../../assets/logo.svg", alt: "The Ledger", style: { height: 36, width: "auto" } }),
      React.createElement("p", {
        style: { marginTop: 6, fontSize: 10, fontWeight: 600, letterSpacing: "0.20em", textTransform: "uppercase", color: "#45464d" }
      }, "Property Management")
    ),
    // Nav
    React.createElement("nav", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 2 } },
      sidebarNavItems.map(item =>
        React.createElement("button", {
          key: item.label,
          disabled: !item.active,
          style: {
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 4, border: "none",
            background: item.active ? "#e6e8ea" : "transparent",
            color: item.active ? "#059669" : "#45464d",
            fontSize: 13, fontWeight: 600, cursor: item.active ? "pointer" : "default",
            transform: item.active ? "scale(1.01)" : "none",
            boxShadow: item.active ? "0 12px 40px rgba(25,28,30,0.06)" : "none",
            transition: "all 200ms", fontFamily: "inherit", textAlign: "left",
          }
        },
          React.createElement(LucideIcon, { name: item.icon, size: 16, color: item.active ? "#059669" : "#45464d" }),
          React.createElement("span", { style: { flex: 1 } }, item.label),
          !item.active && React.createElement("span", {
            style: { fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.70 }
          }, "Soon")
        )
      )
    ),
    // Add Renter button
    React.createElement("div", { style: { padding: "0 4px" } },
      React.createElement("button", {
        onClick: onAddRenter,
        style: {
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "11px 16px",
          background: "linear-gradient(135deg, #0f172a, #131b2e)",
          color: "#fff", fontSize: 13, fontWeight: 600,
          border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
          transition: "opacity 200ms",
        },
        onMouseEnter: e => e.currentTarget.style.opacity = "0.9",
        onMouseLeave: e => e.currentTarget.style.opacity = "1",
      },
        React.createElement(LucideIcon, { name: "plus", size: 14, color: "#fff" }),
        "Add Renter"
      )
    )
  );
}

Object.assign(window, { LedgerSidebar, LucideIcon, toCamel });
