// RenterCard.jsx — Ledger row card

function LedgerRenterCard({ renter, isSelected, onSelect }) {
  const isOverdue = (renter.rentDue || 0) > 0;
  const [hovered, setHovered] = React.useState(false);

  return React.createElement("button", {
    type: "button",
    onClick: () => onSelect(renter),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      width: "100%", textAlign: "left", cursor: "pointer",
      background: isSelected ? "#fff" : hovered ? "#fff" : "#fff",
      borderRadius: 6, padding: "18px 20px", border: "none",
      fontFamily: "inherit",
      boxShadow: isSelected ? "0 12px 40px rgba(25,28,30,0.06)" : "0 12px 40px rgba(25,28,30,0.06)",
      outline: isSelected ? "1px solid rgba(198,198,205,0.15)" : "none",
      transform: hovered ? "scale(1.01)" : "scale(1)",
      transition: "transform 300ms, background 300ms",
    }
  },
    // Top row
    React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 } },
      React.createElement("span", {
        style: { display: "inline-flex", alignItems: "center", background: "#e6e8ea", padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#191c1e" }
      }, "Apt #" + renter.appartmentNumber),
      isOverdue && React.createElement("span", {
        style: { display: "inline-flex", alignItems: "center", gap: 5, background: "#ffe9ec", padding: "4px 10px", borderRadius: 9999, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f1239" }
      },
        React.createElement(LucideIcon, { name: "alert-triangle", size: 11, color: "#9f1239" }),
        "Overdue"
      )
    ),
    // Name
    React.createElement("p", {
      style: { margin: "0 0 14px", fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.2 }
    }, renter.name),
    // Data rows
    React.createElement("div", { style: { background: "#f2f4f6", borderRadius: 4, padding: "10px 12px" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("span", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" } }, "Monthly rent"),
        React.createElement("span", { style: { fontSize: 13, fontWeight: 500, color: "#191c1e" } }, "$" + renter.rentAmount.toLocaleString())
      ),
      isOverdue && React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 } },
        React.createElement("span", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#be123c" } }, "Balance due"),
        React.createElement("span", { style: { fontFamily: "Manrope, sans-serif", fontSize: 15, fontWeight: 700, color: "#be123c" } }, "$" + (renter.rentDue || 0).toLocaleString())
      )
    )
  );
}

// Ledger section wrapper with search + cards list
function LedgerSection({ renters, filteredRenters, selectedId, onSelect, onAddRenter, searchQuery, onSearchChange }) {
  const isEmpty = filteredRenters.length === 0;

  return React.createElement("div", { style: { background: "#f2f4f6", borderRadius: 6, padding: "20px" } },
    // Header
    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 } },
      React.createElement("div", null,
        React.createElement("h3", { style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#191c1e" } }, "Renters Ledger"),
        React.createElement("p", { style: { margin: "3px 0 0", fontSize: 12, color: "#45464d" } }, renters.length + " active units")
      ),
      React.createElement("span", { style: { background: "#e6e8ea", borderRadius: 9999, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#191c1e" } }, renters.length)
    ),
    // Search
    React.createElement("label", {
      style: { display: "flex", alignItems: "center", gap: 8, background: "#e0e3e5", borderRadius: 4, padding: "8px 12px", marginBottom: 14, cursor: "text" }
    },
      React.createElement(LucideIcon, { name: "search", size: 14, color: "#45464d" }),
      React.createElement("input", {
        type: "text", value: searchQuery,
        onChange: e => onSearchChange(e.target.value),
        placeholder: "Search renters...",
        style: { background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#191c1e", width: "100%", fontFamily: "inherit" }
      })
    ),
    // Cards
    isEmpty
      ? React.createElement("div", {
          style: { background: "#fff", borderRadius: 6, padding: "32px", textAlign: "center" }
        },
          React.createElement("p", { style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#191c1e" } }, "No renters found"),
          React.createElement("p", { style: { margin: "6px 0 0", fontSize: 13, color: "#45464d" } }, "Try a different search or add a new renter."),
          React.createElement("button", {
            onClick: onAddRenter,
            style: { marginTop: 14, padding: "8px 16px", background: "linear-gradient(135deg, #0f172a, #131b2e)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }
          }, "+ Add Renter")
        )
      : React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          filteredRenters.map(r =>
            React.createElement(LedgerRenterCard, { key: r.id, renter: r, isSelected: r.id === selectedId, onSelect })
          )
        )
  );
}

Object.assign(window, { LedgerRenterCard, LedgerSection });
