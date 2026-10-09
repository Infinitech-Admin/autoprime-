"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Download, Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import UserMenu from "@/components/layout/user-menu";
import NotificationBell from "@/components/layout/notification-bell";
import { Wordmark } from "@/components/layout/wordmark";
import LanguageSwitcher, {
  GoogleTranslateLoader,
} from "@/components/layout/language-switcher";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Showroom", href: "/showroom" },
  { name: "Sold Cars", href: "/sold-cars" },
  { name: "Sell / Trade", href: "/sell-trade" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Auto-Prime Car Trading palette
// black #0A0A0A | deep red #8F1117 (hover #B91C1C) | red #E31B23 | white #FFFFFF
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]";

// Square icon buttons: red edge and deep red fill on hover (no glow)
const iconButton =
  "border border-[#FFFFFF]/20 bg-[#FFFFFF]/5 text-[#FFFFFF] transition-colors duration-200 hover:border-[#E31B23] hover:bg-[#8F1117]";

// Same look for the Login / account button rendered inside <UserMenu />
const loginStyle =
  "[&>a]:rounded-none [&>a]:border [&>a]:border-[#FFFFFF]/20 [&>a:hover]:border-[#E31B23] [&>a:hover]:bg-[#8F1117] [&>button]:rounded-none [&>button]:border [&>button]:border-[#FFFFFF]/20 [&>button:hover]:border-[#E31B23]";

// Minimal shape of the event we care about, not in the standard lib.dom types yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const { totalItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const canInstall = !isAppInstalled && installPrompt !== null;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // PWA install prompt handling
  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    const updateStandalone = () => {
      const isStandalone =
        standaloneQuery.matches ||
        // iOS Safari
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true;
      setIsAppInstalled(isStandalone);
    };

    updateStandalone();
    standaloneQuery.addEventListener("change", updateStandalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsAppInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      standaloneQuery.removeEventListener("change", updateStandalone);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Loads the Google Translate engine (hidden). Mount once. */}
      <GoogleTranslateLoader />

      {/* Always solid dark, with a red line underneath */}
      <header className="sticky top-0 z-50 border-b-2 border-[#E31B23] bg-[#0A0A0A]">
        <nav
          aria-label="Main"
          className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
        >
          <div className="flex h-[72px] items-center justify-between gap-4 sm:h-[76px] lg:h-20">
            {/* LOGO */}
            <Link
              href="/"
              aria-label="Auto-Prime Car Trading home"
              className={`group flex w-fit items-center justify-self-start ${focusRing}`}
            >
              <Wordmark
                showMark={false}
                className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl"
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden flex-1 items-center justify-center lg:flex">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap px-2.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-200 xl:px-3.5 xl:text-sm ${focusRing} ${active ? "text-[#E31B23] after:absolute after:inset-x-3 after:-bottom-[26px] after:h-[3px] after:bg-[#E31B23]" : "text-[#FFFFFF]/75 hover:text-[#E31B23]"}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SIDE: INSTALL + LANGUAGE + BELL + CART + ACCOUNT + MOBILE MENU */}
            <div className="flex shrink-0 items-center gap-2 lg:ml-0">
              {/* Install App */}
              {canInstall && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className={`chamfer hidden items-center gap-2 whitespace-nowrap bg-[#8F1117] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#B91C1C] sm:flex lg:hidden 2xl:flex ${focusRing}`}
                >
                  <Download size={16} strokeWidth={2.25} />
                  Install App
                </button>
              )}

              {/* Language (hidden below sm; mobile uses the drawer version) */}
              <LanguageSwitcher variant="header" focusRing={focusRing} />

              {/* Announcement notifications */}
              <NotificationBell
                className={`rounded-none ${iconButton} ${focusRing}`}
              />

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`View cart${totalItems > 0 ? `, ${totalItems} item${totalItems === 1 ? "" : "s"}` : ""}`}
                className={`relative flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12 ${iconButton} ${focusRing}`}
              >
                <ShoppingCart size={20} strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center bg-[#E31B23] px-1 text-[10px] font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Account: avatar + "My orders" (or Login when logged out) */}
              <div className={`flex items-center ${loginStyle}`}>
                <UserMenu />
              </div>

              {/* Mobile / Tablet Menu */}
              <button
                type="button"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen((open) => !open)}
                className={`flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12 lg:hidden ${iconButton} ${isMenuOpen ? "!border-[#E31B23] !bg-[#8F1117]" : ""} ${focusRing}`}
              >
                {isMenuOpen ? (
                  <X size={21} strokeWidth={2} />
                ) : (
                  <Menu size={21} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE / TABLET MENU */}
      <div
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMenuOpen(false)}
          className="absolute inset-0 cursor-default bg-black/70"
        />

        {/* Navigation Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md border-l-2 border-[#E31B23] bg-[#0A0A0A] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer Header */}
          <div className="flex h-[72px] items-center justify-between border-b border-[#FFFFFF]/10 px-5 sm:h-[76px] sm:px-6">
            <Link
              href="/"
              aria-label="Auto-Prime Car Trading home"
              onClick={() => setIsMenuOpen(false)}
              className={`group ${focusRing}`}
            >
              <Wordmark showMark={false} className="text-3xl" />
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className={`flex h-10 w-10 items-center justify-center ${iconButton} ${focusRing}`}
            >
              <X size={19} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex h-[calc(100%-72px)] flex-col overflow-y-auto px-5 py-7 sm:h-[calc(100%-76px)] sm:px-6">
            {/* Install App (mobile) */}
            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className={`chamfer mb-6 flex items-center justify-center gap-2 bg-[#8F1117] px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#B91C1C] ${focusRing}`}
              >
                <Download size={16} strokeWidth={2.25} />
                Install App
              </button>
            )}

            {/* Language (mobile) */}
            <LanguageSwitcher
              variant="drawer"
              focusRing={focusRing}
              className="mb-6"
            />

            {/* Navigation */}
            <nav>
              <ul>
                {navigation.map((item, index) => {
                  const active = isActive(item.href);

                  return (
                    <li
                      key={item.name}
                      style={{
                        transitionDelay: isMenuOpen
                          ? `${80 + index * 55}ms`
                          : "0ms",
                      }}
                      className={`transition-all duration-500 ease-out ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex min-h-[62px] items-center justify-between border-b border-[#FFFFFF]/10 px-3 text-xl font-semibold uppercase tracking-wide transition-colors duration-200 sm:min-h-[68px] sm:text-2xl ${focusRing} ${active ? "border-l-4 border-l-[#E31B23] bg-[#FFFFFF]/5 text-[#E31B23]" : "text-[#FFFFFF]/75 hover:bg-[#FFFFFF]/5 hover:text-[#E31B23]"}`}
                      >
                        {item.name}
                        <ArrowRight
                          size={19}
                          className={`transition-all duration-200 ${active ? "text-[#E31B23]" : "-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
