import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CircleHelp, LogOut, Plus, Search, Settings, UserRound } from "lucide-react";
import {
  MODAL_EXIT_DURATION_MS,
  floatingSurfaceLowestStyle,
  modalFlowClass,
  modalPopClass,
  modalShellClass,
} from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

type Props = {
  logoSrc: string;
  userEmail?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddRenter: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onSignOut: () => void;
};

type ProfileAvatarProps = {
  initials: string;
  size: "trigger" | "menu";
  animatedState?: "open" | "closed";
};

function getProfileInitials(userEmail?: string) {
  const fallback = "PM";

  if (!userEmail) {
    return fallback;
  }

  const localPart = userEmail.split("@")[0] ?? "";
  const segments = localPart
    .split(/[._\-\s]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    return `${segments[0][0] ?? ""}${segments[1][0] ?? ""}`.toUpperCase();
  }

  const compact = localPart.replace(/[^a-zA-Z0-9]/g, "");
  if (!compact) {
    return fallback;
  }

  return compact.slice(0, 2).toUpperCase();
}

function getProfileName(userEmail?: string) {
  if (!userEmail) {
    return "Portfolio Manager";
  }

  if (userEmail === "dev@local") {
    return "Dev Workspace";
  }

  const localPart = userEmail.split("@")[0] ?? "";
  const segments = localPart
    .split(/[._\-\s]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return "Portfolio Manager";
  }

  return segments
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function ProfileAvatar({ initials, size, animatedState }: ProfileAvatarProps) {
  const isMenu = size === "menu";
  const avatarSize = isMenu ? 56 : 32;
  const fontSize = isMenu ? "0.92rem" : "0.525rem";
  const indicatorSize = isMenu ? 14 : 8;
  const indicatorOffset = isMenu ? 4 : 2;
  const indicatorBorder = isMenu ? 3 : 2;
  const shadow = isMenu
    ? "0 10px 18px rgba(15,23,42,0.14)"
    : "0 6px 12px rgba(15,23,42,0.14)";

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full bg-primary font-heading font-bold tracking-[0.12em] text-[#f8fbff] ${animatedState ? modalPopClass : ""}`}
      data-state={animatedState}
      style={{
        width: `${avatarSize}px`,
        height: `${avatarSize}px`,
        fontSize,
        backgroundColor: "#131b2e",
        backgroundImage: "linear-gradient(160deg, #243049 0%, #131b2e 72%)",
        boxShadow: shadow,
      }}
    >
      <span className="relative z-[1]">{initials}</span>
      <span
        className="absolute rounded-full bg-[#34d399]"
        style={{
          right: `${indicatorOffset}px`,
          bottom: `${indicatorOffset}px`,
          width: `${indicatorSize}px`,
          height: `${indicatorSize}px`,
          border: `${indicatorBorder}px solid #131b2e`,
        }}
        aria-hidden="true"
      />
    </span>
  );
}

export function DashboardHeader({
  logoSrc,
  userEmail,
  searchQuery,
  onSearchChange,
  onAddRenter,
  onOpenNotifications,
  onOpenProfile,
  onOpenSettings,
  onOpenSupport,
  onSignOut,
}: Props) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { isMounted: isProfileMenuMounted, state: profileMenuState } = useAnimatedPresence(
    isProfileMenuOpen,
    MODAL_EXIT_DURATION_MS,
  );
  const profileInitials = useMemo(() => getProfileInitials(userEmail), [userEmail]);
  const profileName = useMemo(() => getProfileName(userEmail), [userEmail]);
  const profileRole = userEmail === "dev@local" ? "Local development session" : "Portfolio manager";
  const menuItems = [
    { label: "View Profile", icon: UserRound, onSelect: onOpenProfile },
    { label: "Account Settings", icon: Settings, onSelect: onOpenSettings },
    { label: "Help & Support", icon: CircleHelp, onSelect: onOpenSupport },
  ] as const;

  useEffect(() => {
    if (!isProfileMenuMounted) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (isProfileMenuOpen && !profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuMounted, isProfileMenuOpen]);

  const profileMenuIntroStyle = { backgroundColor: "#f2f4f6" } as const;
  const profileMenuSectionStyle = { backgroundColor: "#ffffff" } as const;
  const profileMenuIconStyle = { backgroundColor: "#eceef0" } as const;
  const signOutActionStyle = { backgroundColor: "#ffffff" } as const;

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
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface-muted transition-colors hover:bg-surface-container"
            aria-label="Open notifications"
            onClick={onOpenNotifications}
          >
            <Bell size={17} />
            <span className="absolute right-[0.5rem] top-[0.45rem] h-1.5 w-1.5 rounded-full bg-[#34d399]" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface-muted transition-colors hover:bg-surface-container sm:inline-flex"
            aria-label="Open help and support"
            onClick={onOpenSupport}
          >
            <CircleHelp size={17} />
          </button>
          <span className="hidden h-8 w-px bg-outline-variant/45 sm:block" aria-hidden="true" />
          <button
            type="button"
            onClick={onAddRenter}
            className="hidden items-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 sm:inline-flex lg:hidden"
          >
            <Plus size={14} />
            Add Renter
          </button>
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-surface-container-high p-1.5 text-on-surface transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985]"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
            >
              <ProfileAvatar initials={profileInitials} size="trigger" />
            </button>

            {isProfileMenuMounted && (
              <div
                role="menu"
                aria-label="Profile options"
                data-state={profileMenuState}
                className={`absolute right-0 top-[calc(100%+0.7rem)] w-[20.75rem] origin-top-right overflow-hidden rounded-[1.1rem] bg-surface-container-lowest shadow-modal ${modalShellClass} ${modalFlowClass} ${profileMenuState === "closed" ? "pointer-events-none" : ""}`}
                style={floatingSurfaceLowestStyle}
              >
                <div className="px-4 py-4" style={profileMenuIntroStyle}>
                  <div className="flex items-center gap-3">
                    <ProfileAvatar initials={profileInitials} size="menu" animatedState={profileMenuState} />
                    <div className="min-w-0">
                      <p className="truncate font-heading text-[1.2rem] font-bold leading-none text-on-surface">
                        {profileName}
                      </p>
                      <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-on-surface-muted">
                        {profileRole}
                      </p>
                      <p className="mt-2 truncate text-xs text-on-surface-muted">
                        {userEmail ?? "signed-in workspace"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-3" style={profileMenuSectionStyle}>
                  <div className="space-y-1.5">
                    {menuItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            item.onSelect();
                          }}
                          className="flex min-h-[48px] w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-on-surface transition-[background-color,transform,box-shadow] duration-200 hover:scale-[1.01] hover:bg-secondary-container/40 active:scale-[0.99]"
                        >
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface ${modalPopClass}`}
                            data-state={profileMenuState}
                            style={profileMenuIconStyle}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-3 pb-3 pt-1" style={signOutActionStyle}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-[background-color,transform,box-shadow] duration-200 hover:scale-[1.01] hover:bg-[#fff4f3] active:scale-[0.99]"
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[#d44f46] ${modalPopClass}`}
                      data-state={profileMenuState}
                      style={profileMenuIconStyle}
                    >
                      <LogOut size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#d44f46]">Sign Out</span>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
