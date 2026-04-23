import { Plus, LogOut, Search, Bell } from "lucide-react";

type Props = {
  logoSrc: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddRenter: () => void;
  onSignOut: () => void;
};

export function DashboardHeader({ logoSrc, searchQuery, onSearchChange, onAddRenter, onSignOut }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-3 rounded-md bg-surface-container-low px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img src={logoSrc} alt="The Ledger" className="h-7 w-auto lg:hidden" />
          <label className="hidden min-w-0 flex-1 items-center gap-2 rounded-sm bg-surface-container-highest px-3 py-2 text-sm text-on-surface-muted md:flex">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="Search"
              placeholder="Search properties, tenants..."
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface-muted transition-colors hover:bg-surface-container"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>
          <button
            type="button"
            onClick={onAddRenter}
            className="hidden items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container sm:inline-flex lg:hidden"
          >
            <Plus size={14} />
            Add Renter
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface transition-colors hover:bg-surface-container lg:hidden"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
