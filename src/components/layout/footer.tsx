// Path: components/layout/footer.tsx

import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";

// ---------------------------------------------------------------------------
// Business details (same as the Contact page)
// Anything left empty is hidden automatically instead of showing placeholders.
// ---------------------------------------------------------------------------
const BUSINESS_NAME = "Auto-Prime Car Trading";
const FACEBOOK_URL = "https://www.facebook.com/autoprimecartrading/";

const ADDRESS_LINE_1 = "Leo Alejandrino St, BF Resort,";
const ADDRESS_LINE_2 = "Las Piñas City, Philippines 1747";
const PHONE_DISPLAY = "0927 377 7182";
const PHONE_TEL = "+639273777182";
const EMAIL = "autoprimect@gmail.com";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS_NAME}, ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`,
)}`;

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

// Palette: black #000000 | dark #0A0A0A | panel #141414 | red #E31B23 | deep red #8F1117 | white #FFFFFF
const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]";
const ringWhite =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const footerLink = `text-white/70 transition-colors hover:text-[#E31B23] ${ring}`;
const headingClass = "text-lg font-black uppercase tracking-wider";
const socialLink = `flex size-11 items-center justify-center border-2 border-white/25 text-white transition-colors hover:border-[#E31B23] hover:bg-[#E31B23] ${ring}`;

const EXPLORE = [
  { label: "Showroom", href: "/showroom" },
  { label: "Sold cars", href: "/sold-cars" },
  { label: "Sell / Trade car", href: "/sell-trade" },
  { label: "Blog", href: "/blog" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* CALL TO ACTION */}
      {/* <div className="bg-[#8F1117]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="border-l-8 border-white pl-5">
            <h2 className="text-3xl font-black uppercase leading-none sm:text-4xl">
              Ready to see it in person?
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              Message us first so we can have the car ready for you.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {FACEBOOK_URL ? (
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`chamfer inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A] hover:text-white ${ringWhite}`}
              >
                <MessageCircle size={16} />
                Message us
              </a>
            ) : null}
            {PHONE_DISPLAY && PHONE_TEL ? (
              <a
                href={`tel:${PHONE_TEL}`}
                className={`chamfer inline-flex items-center justify-center gap-2 bg-[#0A0A0A] px-7 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-white hover:text-[#0A0A0A] ${ringWhite}`}
              >
                <Phone size={16} />
                {PHONE_DISPLAY}
              </a>
            ) : null}
          </div>
        </div>
      </div> */}

      <div aria-hidden="true" className="tread" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr] lg:py-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label={`${BUSINESS_NAME} home`}
              className={`group inline-block ${ring}`}
            >
              <Wordmark showMark={false} className="text-4xl" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Quality pre-owned cars, clear pricing and a better way to find
              your next drive.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {FACEBOOK_URL ? (
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${BUSINESS_NAME} on Facebook`}
                  className={socialLink}
                >
                  <FacebookIcon className="size-4" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className={headingClass}>Explore</h3>
            <span
              aria-hidden="true"
              className="mt-2 block h-[3px] w-8 bg-[#E31B23]"
            />
            <ul className="mt-6 space-y-3 text-sm">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visit us */}
          <div>
            <h3 className={headingClass}>Visit us</h3>
            <span
              aria-hidden="true"
              className="mt-2 block h-[3px] w-8 bg-[#E31B23]"
            />

            <div className="mt-6 space-y-4 text-sm">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-3 ${footerLink}`}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E31B23]" />
                <address className="not-italic">
                  {ADDRESS_LINE_1}
                  <br />
                  {ADDRESS_LINE_2}
                </address>
              </a>

              {PHONE_DISPLAY && PHONE_TEL ? (
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={`flex items-center gap-3 ${footerLink}`}
                >
                  <Phone className="size-4 shrink-0 text-[#E31B23]" />
                  {PHONE_DISPLAY}
                </a>
              ) : null}

              {EMAIL ? (
                <a
                  href={`mailto:${EMAIL}`}
                  className={`flex items-center gap-3 break-all ${footerLink}`}
                >
                  <Mail className="size-4 shrink-0 text-[#E31B23]" />
                  {EMAIL}
                </a>
              ) : null}

              <p className="border-l-4 border-[#E31B23] bg-[#141414] px-4 py-3 text-white/75">
                Message us on Facebook to confirm our hours before you visit.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights
              reserved.
            </p>
            <p>
              Powered by{" "}
              <Link
                href="https://www.infinitechphil.com/"
                className={`transition-colors hover:text-[#E31B23] ${ring}`}
              >
                Infinitech Advertising Corporation
              </Link>
            </p>
          </div>

          <div className="flex justify-center gap-5 sm:justify-end">
            <Link
              href="/privacy-policy"
              className={`transition-colors hover:text-[#E31B23] ${ring}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className={`transition-colors hover:text-[#E31B23] ${ring}`}
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
