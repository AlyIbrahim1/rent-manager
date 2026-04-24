// Header.jsx — The Ledger Dashboard Header

function LedgerHeader({ searchQuery, onSearchChange, onAddRenter, onSignOut, userEmail = "pm@ledger.co" }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const initials = (userEmail.split("@")[0] || "PM").slice(0, 2).toUpperCase();

  return React.createElement("header", {
    style: {
      position: "sticky", top: 0, zIndex: 30,
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
      padding: "12px 24px",
    }
  },
    React.createElement("div", {
      style: {
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        background: "#f2f4f6", borderRadius: 6, padding: "10px 14px",
      }
    },
      // Search
      React.createElement("label", {
        style: {
          display: "flex", alignItems: "center", gap: 8, flex: 1,
          background: "#e0e3e5", borderRadius: 4, padding: "8px 12px",
          cursor: "text",
        }
      },
        React.createElement(LucideIcon, { name: "search", size: 15, color: "#45464d" }),
        React.createElement("input", {
          type: "text", value: searchQuery,
          onChange: e => onSearchChange(e.target.value),
          placeholder: "Search properties, tenants...",
          style: {
            background: "transparent", border: "none", outline: "none",
            fontSize: 13, color: "#191c1e", width: "100%", fontFamily: "inherit",
          }
        })
      ),
      // Actions
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        // Bell
        React.createElement("button", {
          style: {
            position: "relative", width: 38, height: 38, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#e6e8ea", border: "none", borderRadius: 4, cursor: "pointer",
            color: "#45464d",
          }
        },
          React.createElement(LucideIcon, { name: "bell", size: 16, color: "#45464d" }),
          React.createElement("span", {
            style: {
              position: "absolute", top: 9, right: 8,
              width: 6, height: 6, borderRadius: "50%", background: "#34d399",
            }
          })
        ),
        // Divider
        React.createElement("span", { style: { width: 1, height: 28, background: "rgba(198,198,205,0.45)" } }),
        // Add renter (desktop)
        React.createElement("button", {
          onClick: onAddRenter,
          style: {
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            background: "linear-gradient(135deg, #0f172a, #131b2e)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
            transition: "opacity 200ms",
          },
          onMouseEnter: e => e.currentTarget.style.opacity = "0.9",
          onMouseLeave: e => e.currentTarget.style.opacity = "1",
        },
          React.createElement(LucideIcon, { name: "plus", size: 13, color: "#fff" }),
          "Add Renter"
        ),
        // Avatar / profile menu
        React.createElement("div", { style: { position: "relative" } },
          React.createElement("button", {
            onClick: () => setMenuOpen(v => !v),
            style: {
              width: 38, height: 38, borderRadius: "50%", border: "none",
              background: "linear-gradient(160deg, #243049 0%, #131b2e 72%)",
              color: "#f8fbff", fontSize: "0.52rem", fontWeight: 700,
              letterSpacing: "0.12em", cursor: "pointer", fontFamily: "Manrope, sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 12px rgba(15,23,42,0.14)",
              transition: "transform 200ms",
            },
            onMouseEnter: e => e.currentTarget.style.transform = "translateY(-1px)",
            onMouseLeave: e => e.currentTarget.style.transform = "none",
          }, initials),
          menuOpen && React.createElement("div", {
            style: {
              position: "absolute", right: 0, top: "calc(100% + 10px)",
              width: 240, background: "#fff",
              borderRadius: 18, boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
              overflow: "hidden", zIndex: 50,
            }
          },
            React.createElement("div", { style: { background: "#f2f4f6", padding: "14px 16px" } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", {
                  style: {
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(160deg, #243049, #131b2e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f8fbff", fontSize: 13, fontWeight: 700, fontFamily: "Manrope, sans-serif",
                    letterSpacing: "0.12em",
                  }
                }, initials),
                React.createElement("div", null,
                  React.createElement("p", { style: { margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, color: "#191c1e" } }, "Portfolio Manager"),
                  React.createElement("p", { style: { margin: "2px 0 0", fontSize: 11, color: "#45464d" } }, userEmail),
                )
              )
            ),
            React.createElement("div", { style: { padding: "8px 10px" } },
              [["view-profile", "View Profile"], ["settings", "Account Settings"], ["circle-help", "Help & Support"]].map(([icon, label]) =>
                React.createElement("button", {
                  key: label,
                  style: {
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 10px", background: "transparent", border: "none",
                    borderRadius: 4, fontSize: 13, fontWeight: 600, color: "#191c1e",
                    cursor: "pointer", fontFamily: "inherit", transition: "background 150ms",
                  },
                  onMouseEnter: e => e.currentTarget.style.background = "rgba(213,227,252,0.4)",
                  onMouseLeave: e => e.currentTarget.style.background = "transparent",
                },
                  React.createElement("span", {
                    style: { width: 30, height: 30, borderRadius: "50%", background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }
                  }, React.createElement(LucideIcon, { name: icon, size: 14, color: "#191c1e" })),
                  label
                )
              )
            ),
            React.createElement("div", { style: { padding: "4px 10px 10px" } },
              React.createElement("button", {
                onClick: () => { setMenuOpen(false); onSignOut && onSignOut(); },
                style: {
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 10px", background: "transparent", border: "none",
                  borderRadius: 4, fontSize: 13, fontWeight: 600, color: "#d44f46",
                  cursor: "pointer", fontFamily: "inherit", transition: "background 150ms",
                },
                onMouseEnter: e => e.currentTarget.style.background = "#fff4f3",
                onMouseLeave: e => e.currentTarget.style.background = "transparent",
              },
                React.createElement("span", {
                  style: { width: 30, height: 30, borderRadius: "50%", background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }
                }, React.createElement(LucideIcon, { name: "log-out", size: 14, color: "#d44f46" })),
                "Sign Out"
              )
            )
          )
        )
      )
    )
  );
}

Object.assign(window, { LedgerHeader });
