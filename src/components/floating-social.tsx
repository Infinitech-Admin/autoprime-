"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const FACEBOOK_URL = "https://www.facebook.com/autoprimecartrading/";

const PHONE_NUMBER = "+639273777182"; // 0927 377 7182
const EMAIL = "shirleyprimesdisplay@yahoo.com";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// lucide-react no longer ships brand/logo icons, so these are inline SVGs.
interface BrandIconProps {
  size?: number;
  className?: string;
}

function FacebookIcon({ size = 18, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.58v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function TikTokIcon({ size = 18, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export interface FloatingSocialProps {
  facebookHref?: string;
  tiktokHref?: string;
  phone?: string;
  email?: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
  bg: string;
}

export default function FloatingSocial({
  facebookHref = FACEBOOK_URL,

  phone = PHONE_NUMBER,
  email = EMAIL,
}: FloatingSocialProps) {
  const pathname = usePathname() ?? "";

  // Hide floating social buttons on all admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Palette: black #0A0A0A | panel #141414 | red #E31B23 | deep red #8F1117
  // Every button uses the site colors (no Facebook blue).
  const links: SocialLink[] = [
    {
      name: "Facebook",
      href: facebookHref,
      icon: FacebookIcon,
      bg: "bg-[#E31B23]",
    },
  ];

  if (phone) {
    links.push({
      name: "Call Us",
      href: `tel:${phone}`,
      icon: Phone,
      bg: "bg-[#8F1117]",
    });
  }

  if (email) {
    links.push({
      name: "Email Us",
      href: `mailto:${email}`,
      icon: Mail,
      bg: "bg-[#141414]",
    });
  }

  return (
    <div
      aria-label="Contact Auto-Prime Car Trading"
      className="fixed right-0 top-1/2 z-40 -translate-y-1/2"
    >
      {/* Black rail with a red edge. Buttons are square. */}
      <div className="flex flex-col items-center gap-px border-y border-l-4 border-y-white/10 border-l-[#E31B23] bg-[#0A0A0A]">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              aria-label={link.name}
              className={`group relative flex h-11 w-11 items-center justify-center text-white transition-[filter] duration-200 hover:brightness-125 sm:h-12 sm:w-12 ${link.bg} ${focusRing}`}
            >
              <Icon size={18} strokeWidth={2.25} className="sm:h-5 sm:w-5" />

              {/* Tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 translate-x-1 whitespace-nowrap bg-[#0A0A0A] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
