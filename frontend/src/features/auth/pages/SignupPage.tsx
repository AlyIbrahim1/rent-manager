import logoSvg from "@/shared/assets/logo.svg";

export function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "Inter, sans-serif",
        background:
          "radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%), radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%), linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px)",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
          padding: "56px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -48,
            right: -48,
            width: 192,
            height: 192,
            background: "radial-gradient(circle, #F2F2F2, transparent)",
            borderRadius: "50%",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: 28, position: "relative", zIndex: 1 }}>
          <img src={logoSvg} alt="The Ledger" style={{ height: 44, width: "auto", margin: "0 auto 10px", display: "block" }} />
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Rent Manager</span>
          <p style={{ margin: 0, color: "#666", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>
            Curated property management.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 22 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 8 }}>Status</p>
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "16px 18px",
                background: "#F5F5F5",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#45464d",
                lineHeight: 1.6,
              }}
            >
              Standalone sign-up is prepared, but the live app still uses the unified auth screen.
            </div>
          </div>

          <button
            type="button"
            disabled
            style={{
              width: "100%",
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "linear-gradient(135deg, #0f172a, #131b2e)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.03em",
              border: "none",
              borderRadius: 8,
              fontFamily: "inherit",
              opacity: 0.8,
              cursor: "not-allowed",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Route reserved for future activation
          </button>

          <p style={{ margin: "18px 0 0", textAlign: "center", fontSize: 13, color: "#666" }}>
            Future auth routes can reuse the same exact Ledger shell without changing the visual system.
          </p>
        </div>
      </div>
    </div>
  );
}
