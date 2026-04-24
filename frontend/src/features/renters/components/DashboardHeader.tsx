import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CircleHelp, LogOut, Search, Settings, UserRound } from "lucide-react";

type Props = {
  logoSrc: string;
  userEmail?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onSignOut: () => void;
};

function getProfileInitials(userEmail?: string) {
  const fallback = "PM";
  if (!userEmail) {
    return fallback;
  }
  const compact = (userEmail.split("@")[0] || fallback).replace(/[^a-zA-Z0-9]/g, "");
  return compact.slice(0, 2).toUpperCase() || fallback;
}

export function DashboardHeader({
  logoSrc,
  userEmail,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenProfile,
  onOpenSettings,
  onOpenSupport,
  onSignOut,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const initials = useMemo(() => getProfileInitials(userEmail), [userEmail]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: "View Profile", icon: UserRound, onSelect: onOpenProfile },
    { label: "Account Settings", icon: Settings, onSelect: onOpenSettings },
    { label: "Help & Support", icon: CircleHelp, onSelect: onOpenSupport },
  ] as const;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        padding: "12px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          background: "#f2f4f6",
          borderRadius: 6,
          padding: "10px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <img src={logoSrc} alt="The Ledger" className="lg:hidden" style={{ height: 28, width: "auto" }} />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              background: "#e0e3e5",
              borderRadius: 4,
              padding: "8px 12px",
              cursor: "text",
            }}
          >
            <Search size={15} color="#45464d" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search properties, tenants..."
              aria-label="Search"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#191c1e",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            style={{
              position: "relative",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e6e8ea",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              color: "#45464d",
            }}
          >
            <Bell size={16} color="#45464d" />
            <span
              style={{
                position: "absolute",
                top: 9,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34d399",
              }}
            />
          </button>

          <span style={{ width: 1, height: 28, background: "rgba(198,198,205,0.45)" }} />
          <div ref={profileMenuRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(160deg, #243049 0%, #131b2e 72%)",
                color: "#f8fbff",
                fontSize: "0.52rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 12px rgba(15,23,42,0.14)",
              }}
            >
              {initials}
            </button>

            {menuOpen ? (
              <div
                role="menu"
                aria-label="Profile options"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  width: 240,
                  background: "#fff",
                  borderRadius: 18,
                  boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
                  overflow: "hidden",
                  zIndex: 50,
                }}
              >
                <div style={{ background: "#f2f4f6", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(160deg, #243049, #131b2e)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f8fbff",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "Manrope, sans-serif",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, color: "#191c1e" }}>
                        Portfolio Manager
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#45464d" }}>{userEmail}</p>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "8px 10px" }}>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          item.onSelect();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "10px 10px",
                          background: "transparent",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#191c1e",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "#eceef0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={14} color="#191c1e" />
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ padding: "4px 10px 10px" }}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onSignOut();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 10px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#d44f46",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "#eceef0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <LogOut size={14} color="#d44f46" />
                    </span>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
