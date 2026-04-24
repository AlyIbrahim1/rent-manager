// RenterDetails.jsx — Right panel detail view

function LedgerRenterDetails({ renter, onMarkPaid, onClose }) {
  if (!renter) {
    return React.createElement("div", { style: { background: "#f2f4f6", borderRadius: 6, padding: 20 } },
      React.createElement("div", { style: { background: "#fff", borderRadius: 4, padding: "40px 24px", textAlign: "center" } },
        React.createElement("p", { style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#191c1e" } }, "No renter selected"),
        React.createElement("p", { style: { margin: "6px 0 0", fontSize: 13, color: "#45464d" } }, "Select a card from the ledger to inspect payment and due status.")
      )
    );
  }

  const isOverdue = (renter.rentDue || 0) > 0;

  const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between" };
  const iconRowStyle = { display: "flex", alignItems: "center", gap: 8, color: "#45464d" };

  return React.createElement("section", { style: { background: "#f2f4f6", borderRadius: 6, padding: 20 } },
    React.createElement("div", { style: { background: "#fff", borderRadius: 4, padding: "18px 20px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)" } },
      // Header
      React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 } },
        React.createElement("div", null,
          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 } },
            React.createElement("span", {
              style: { display: "inline-flex", alignItems: "center", background: "#e6e8ea", padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#191c1e" }
            }, "Apt #" + renter.appartmentNumber),
            isOverdue && React.createElement("span", {
              style: { display: "inline-flex", alignItems: "center", gap: 5, background: "#ffe9ec", padding: "4px 10px", borderRadius: 9999, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9f1239" }
            },
              React.createElement(LucideIcon, { name: "alert-triangle", size: 11, color: "#9f1239" }), "Overdue"
            )
          ),
          React.createElement("h2", { style: { margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.2 } }, renter.name)
        ),
        React.createElement("button", {
          onClick: onClose,
          style: { flexShrink: 0, width: 32, height: 32, background: "#e6e8ea", border: "none", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#45464d", transition: "background 200ms" },
          onMouseEnter: e => e.currentTarget.style.background = "#eceef0",
          onMouseLeave: e => e.currentTarget.style.background = "#e6e8ea",
        }, React.createElement(LucideIcon, { name: "x", size: 16, color: "#45464d" }))
      ),

      // Data rows
      React.createElement("div", { style: { background: "#f2f4f6", borderRadius: 4, padding: "12px 14px", marginBottom: 16 } },
        React.createElement("div", { style: rowStyle },
          React.createElement("div", { style: iconRowStyle },
            React.createElement(LucideIcon, { name: "dollar-sign", size: 13, color: "#45464d" }),
            React.createElement("span", { style: { fontSize: 13 } }, "Monthly rent")
          ),
          React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: "#191c1e" } }, "$" + renter.rentAmount.toLocaleString())
        ),
        isOverdue && React.createElement("div", { style: { ...rowStyle, marginTop: 10 } },
          React.createElement("div", { style: { ...iconRowStyle, color: "#be123c" } },
            React.createElement(LucideIcon, { name: "alert-triangle", size: 13, color: "#be123c" }),
            React.createElement("span", { style: { fontSize: 13, color: "#be123c" } }, "Balance due")
          ),
          React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: "#be123c" } }, "$" + (renter.rentDue || 0).toLocaleString())
        ),
        React.createElement("div", { style: { ...rowStyle, marginTop: 10 } },
          React.createElement("div", { style: iconRowStyle },
            React.createElement(LucideIcon, { name: "calendar", size: 13, color: "#45464d" }),
            React.createElement("span", { style: { fontSize: 13 } }, "Last paid")
          ),
          React.createElement("span", { style: { fontSize: 13, color: "#191c1e" } }, renter.lastMonthPayed || "—")
        )
      ),

      // CTA
      React.createElement("button", {
        onClick: onMarkPaid,
        style: {
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "10px", background: "#002114", color: "#85f8c4",
          fontSize: 13, fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer",
          fontFamily: "inherit", transition: "opacity 200ms", marginBottom: 18,
        },
        onMouseEnter: e => e.currentTarget.style.opacity = "0.9",
        onMouseLeave: e => e.currentTarget.style.opacity = "1",
      },
        React.createElement(LucideIcon, { name: "dollar-sign", size: 14, color: "#85f8c4" }),
        "Receive Payment"
      ),

      // Payment history
      React.createElement("div", null,
        React.createElement("h3", { style: { margin: "0 0 10px", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" } }, "Payment History"),
        (renter.history || []).length === 0
          ? React.createElement("p", { style: { fontSize: 13, color: "#45464d", margin: 0 } }, "No payments recorded yet.")
          : React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
              (renter.history || []).map((p, i) =>
                React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f7f9fb", padding: "8px 12px", borderRadius: 4 } },
                  React.createElement("span", { style: { fontSize: 12, color: "#45464d" } }, p.month),
                  React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: "#191c1e" } }, "$" + p.amount.toLocaleString())
                )
              )
            )
      )
    )
  );
}

Object.assign(window, { LedgerRenterDetails });
