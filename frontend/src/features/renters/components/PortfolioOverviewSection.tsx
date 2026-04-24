import { AlertCircle, ArrowUpRight, Building2, Wallet } from "lucide-react";

type Props = {
  totalMonthlyRevenue: number;
  totalDue: number;
  collectionRate: number;
  rentersCount: number;
  overdueCount: number;
  canReceivePayment: boolean;
  onReceivePayment: () => void;
};

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString()}`;
}

export function PortfolioOverviewSection({
  totalMonthlyRevenue,
  totalDue,
  collectionRate,
  rentersCount,
  overdueCount,
  canReceivePayment,
  onReceivePayment,
}: Props) {
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 6,
    padding: "20px 22px",
    boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
    animation: "ledger-reveal-up 0.4s both",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: "Manrope, sans-serif",
              fontSize: "2.3rem",
              fontWeight: 700,
              color: "#191c1e",
              lineHeight: 1.1,
            }}
          >
            Portfolio Overview
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d" }}>
            Status summary and current renter ledger across active units.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              padding: "9px 16px",
              background: "#e6e8ea",
              color: "#191c1e",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Export Report
          </button>
          <button
            type="button"
            onClick={canReceivePayment ? onReceivePayment : undefined}
            disabled={!canReceivePayment}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              background: "#002114",
              color: "#85f8c4",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: canReceivePayment ? "pointer" : "not-allowed",
              opacity: canReceivePayment ? 1 : 0.5,
              fontFamily: "inherit",
            }}
          >
            <Wallet size={14} color="#85f8c4" />
            Receive Payment
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
        <article style={{ ...cardStyle, animationDelay: "30ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" }}>
              Total Revenue
            </span>
            <ArrowUpRight size={15} color="#45464d" />
          </div>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1 }}>
            {formatCurrency(totalMonthlyRevenue)}
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "#059669" }}>{collectionRate}% collection rate this cycle</p>
        </article>

        <article style={{ ...cardStyle, animationDelay: "80ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" }}>
              Occupancy Rate
            </span>
            <Building2 size={15} color="#45464d" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1 }}>
              {rentersCount > 0 ? "100%" : "0%"}
            </p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#45464d" }}>{rentersCount} units</p>
          </div>
          <div style={{ marginTop: 14, height: 8, background: "#eceef0", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#0f172a", borderRadius: 9999, width: rentersCount > 0 ? "100%" : "0%" }} />
          </div>
        </article>

        <article style={{ ...cardStyle, animationDelay: "130ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#45464d" }}>
              Pending Balance
            </span>
            <AlertCircle size={15} color="#45464d" />
          </div>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "#191c1e", lineHeight: 1 }}>
            {formatCurrency(totalDue)}
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "#F43F5E" }}>
            {overdueCount} overdue {overdueCount === 1 ? "renter" : "renters"}
          </p>
        </article>
      </div>
    </div>
  );
}
