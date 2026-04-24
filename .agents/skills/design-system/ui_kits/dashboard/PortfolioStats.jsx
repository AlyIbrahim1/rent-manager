// PortfolioStats.jsx — KPI stat cards

function LedgerPortfolioStats({ totalRevenue = 18200, collectionRate = 94, rentersCount = 8, occupancy = 100, totalDue = 3300, overdueCount = 2, onReceivePayment, canReceivePayment }) {
  const fmt = n => "$" + n.toLocaleString();

  const cardStyle = {
    background: "#fff", borderRadius: 6,
    padding: "20px 22px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
    animation: "ledger-reveal-up 0.4s both",
  };

  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
    // Header row
    React.createElement("div", {
      style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }
    },
      React.createElement("div", null,
        React.createElement("h1", {
          style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.3rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.1 }
        }, "Portfolio Overview"),
        React.createElement("p", {
          style: { margin: "6px 0 0", fontSize: 13, color: "#45464d" }
        }, "Status summary and current renter ledger across active units.")
      ),
      React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
        React.createElement("button", {
          style: {
            padding: "9px 16px", background: "#e6e8ea", color: "#191c1e",
            fontSize: 13, fontWeight: 500, border: "none", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit", transition: "background 200ms",
          },
          onMouseEnter: e => e.currentTarget.style.background = "#eceef0",
          onMouseLeave: e => e.currentTarget.style.background = "#e6e8ea",
        }, "Export Report"),
        React.createElement("button", {
          onClick: canReceivePayment ? onReceivePayment : undefined,
          disabled: !canReceivePayment,
          style: {
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 16px", background: "#002114", color: "#85f8c4",
            fontSize: 13, fontWeight: 600, border: "none", borderRadius: 4,
            cursor: canReceivePayment ? "pointer" : "not-allowed",
            opacity: canReceivePayment ? 1 : 0.5, fontFamily: "inherit",
            transition: "opacity 200ms",
          }
        },
          React.createElement(LucideIcon, { name: "wallet", size: 14, color: "#85f8c4" }),
          "Receive Payment"
        )
      )
    ),

    // KPI cards
    React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }
    },
      // Revenue
      React.createElement("article", { style: { ...cardStyle, animationDelay: "30ms" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 14 } },
          React.createElement("span", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" } }, "Total Revenue"),
          React.createElement(LucideIcon, { name: "arrow-up-right", size: 15, color: "#45464d" })
        ),
        React.createElement("p", {
          style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1, fontVariantNumeric: "tabular-nums" }
        }, fmt(totalRevenue)),
        React.createElement("p", { style: { margin: "10px 0 0", fontSize: 13, color: "#059669" } },
          collectionRate + "% collection rate this cycle")
      ),
      // Occupancy
      React.createElement("article", { style: { ...cardStyle, animationDelay: "80ms" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 14 } },
          React.createElement("span", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" } }, "Occupancy Rate"),
          React.createElement(LucideIcon, { name: "building-2", size: 15, color: "#45464d" })
        ),
        React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 8 } },
          React.createElement("p", {
            style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1 }
          }, rentersCount > 0 ? occupancy + "%" : "0%"),
          React.createElement("p", { style: { margin: "0 0 6px", fontSize: 13, color: "#45464d" } }, rentersCount + " units")
        ),
        React.createElement("div", {
          style: { marginTop: 14, height: 8, background: "#eceef0", borderRadius: 9999, overflow: "hidden" }
        },
          React.createElement("div", { style: { height: "100%", background: "#0f172a", borderRadius: 9999, width: rentersCount > 0 ? occupancy + "%" : "0%", transition: "width 600ms" } })
        )
      ),
      // Pending
      React.createElement("article", { style: { ...cardStyle, animationDelay: "130ms" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 14 } },
          React.createElement("span", { style: { fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" } }, "Pending Balance"),
          React.createElement(LucideIcon, { name: "alert-circle", size: 15, color: "#45464d" })
        ),
        React.createElement("p", {
          style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1, fontVariantNumeric: "tabular-nums" }
        }, fmt(totalDue)),
        React.createElement("p", { style: { margin: "10px 0 0", fontSize: 13, color: "#F43F5E" } },
          overdueCount + " overdue " + (overdueCount === 1 ? "renter" : "renters"))
      )
    )
  );
}

Object.assign(window, { LedgerPortfolioStats });
