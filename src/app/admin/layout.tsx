"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Bell,
  CalendarCheck,
  Car,
  CarFront,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Megaphone,
  Newspaper,
  Search,
  X,
} from "lucide-react";
import { fetchMe, logout, type AuthUser } from "@/lib/api";

/*
 * Color palette (from the Auto-Prime Car Trading logo)
 *   Page background : #060606  (near black)
 *   Surface         : #0A0A0A  (dark maroon: sidebar, search)
 *   Logo red        : #8F1117  (active nav, logo tile, avatar, borders)
 *   Logo gold       : #F5A800  (accents, highlights, focus, notification dot)
 *   Logo cream      : #FFF6DC  (brand name, avatar initials)
 */

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2)
      : parts[0][0] + parts[parts.length - 1][0];

  return initials.toUpperCase();
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Announcements",
    href: "/admin/announcement",
    icon: Megaphone,
  },
  {
    label: "Showroom",
    href: "/admin/showroom",
    icon: CarFront,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: Newspaper,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Sell-Trade",
    href: "/admin/sell-trade",
    icon: ArrowLeftRight,
  },
  {
    label: "Contact",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    label: "Test-Drive",
    href: "/admin/test-drive",
    icon: CalendarCheck,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [authState, setAuthState] = useState<"checking" | "authenticated">(
    "checking",
  );

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchMe({ signal: controller.signal })
      .then(({ user }) => {
        setUser(user);
        setAuthState("authenticated");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;

        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      });

    return () => {
      controller.abort();
    };

    // Re-check whenever the admin section is entered on a new path so a
    // session that expired mid-session still gets caught.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  }

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060606]">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 size={18} className="animate-spin text-[#F5A800]" />
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#060606]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#8F1117]/40 bg-gradient-to-b from-[#0A0A0A] to-[#0B0303] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#8F1117]/30 px-5">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F5A800]/70 bg-[#8F1117] text-[#FFF6DC] shadow-[0_0_18px_rgba(155,17,17,0.55)]">
              <Car size={20} />
            </span>

            <span className="flex min-w-0 flex-col leading-none">
              <span className="whitespace-nowrap text-[17px] font-black tracking-tight text-[#FFF6DC]">
                Prime Auto
              </span>
              <span className="mt-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5A800]">
                Display
              </span>
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
            Menu
          </p>

          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            if (item.soon) {
              return (
                <div
                  key={item.href}
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-600"
                  title="Coming soon"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>

                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-r from-[#8F1117]/45 to-[#8F1117]/5 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[#F5A800]" />
                )}
                <Icon
                  size={17}
                  className={active ? "text-[#F5A800]" : undefined}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#8F1117]/30 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-[#8F1117]/20 hover:text-white"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#8F1117]/30 bg-[#060606]/90 px-4 backdrop-blur sm:px-6">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-300 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search vehicles, orders..."
              className="w-full rounded-lg border border-[#8F1117]/40 bg-[#0A0A0A]/70 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#F5A800]"
            />
          </div>

          {/* Header actions */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {/* Notifications */}
            <button
              className="relative text-zinc-300 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={19} />

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F5A800]" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-tight text-white">
                  {user?.name ?? "..."}
                </p>

                <p className="text-[11px] capitalize leading-tight text-zinc-400">
                  {user?.role ?? ""}
                </p>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F5A800]/70 bg-[#8F1117] text-xs font-bold text-[#FFF6DC]"
                title={user?.email}
              >
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
