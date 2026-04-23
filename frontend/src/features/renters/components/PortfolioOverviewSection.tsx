import { Wallet, ArrowUpRight, Building2, AlertCircle } from "lucide-react";

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
  return (
    <>
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-[2.25rem] font-bold leading-tight text-on-surface sm:text-[2.5rem]">Portfolio Overview</h1>
          <p className="mt-2 text-sm text-on-surface-muted">Status summary and current renter ledger across active units.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-sm bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
          >
            Export Report
          </button>
          <button
            type="button"
            onClick={onReceivePayment}
            disabled={!canReceivePayment}
            className="inline-flex items-center gap-2 rounded-sm bg-tertiary-container px-4 py-2 text-sm font-semibold text-tertiary-fixed transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wallet size={15} />
            Receive Payment
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <article className="animate-reveal-up col-span-2 rounded-md bg-surface-container-lowest p-5 shadow-layer md:col-span-1 md:p-6" style={{ animationDelay: "30ms" }}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Total Revenue</span>
            <ArrowUpRight size={16} className="text-on-surface-muted" />
          </div>
          <p className="font-heading text-[2.9rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{formatCurrency(totalMonthlyRevenue)}</p>
          <p className="mt-3 text-sm text-[#059669]">{collectionRate}% collection rate this cycle</p>
        </article>

        <article className="animate-reveal-up rounded-md bg-surface-container-lowest p-5 shadow-layer md:p-6" style={{ animationDelay: "80ms" }}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Occupancy Rate</span>
            <Building2 size={16} className="text-on-surface-muted" />
          </div>
          <div className="flex items-end gap-2">
            <p className="font-heading text-[2.7rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{rentersCount > 0 ? "100%" : "0%"}</p>
            <p className="pb-2 text-sm text-on-surface-muted">{rentersCount} units tracked</p>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-full bg-primary" style={{ width: rentersCount > 0 ? "100%" : "0%" }} />
          </div>
        </article>

        <article className="animate-reveal-up rounded-md bg-surface-container-lowest p-5 shadow-layer md:p-6" style={{ animationDelay: "130ms" }}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Pending Balance</span>
            <AlertCircle size={16} className="text-on-surface-muted" />
          </div>
          <p className="font-heading text-[2.7rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{formatCurrency(totalDue)}</p>
          <p className="mt-3 text-sm text-[#F43F5E]">{overdueCount} overdue {overdueCount === 1 ? "renter" : "renters"}</p>
        </article>
      </section>
    </>
  );
}
