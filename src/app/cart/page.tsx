// Path: app/cart/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  btnLine,
  btnRed,
  card,
  display,
  focus,
  PageHero,
  StateBox,
} from "@/components/ui/prime";
import { useCart } from "@/context/cart-context";

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));
const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

const qtyBtn = `flex h-10 w-10 items-center justify-center transition-colors hover:text-[#E31B23] ${focus}`;

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    isHydrated,
  } = useCart();

  const total = useMemo(
    () => items.reduce((s, i) => s + getPriceValue(i.price) * i.quantity, 0),
    [items],
  );
  const downpayment = total * 0.2;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero
          back={{ href: "/showroom", label: "Continue browsing" }}
          title="Your cart"
        >
          {!isHydrated
            ? "Loading your cart..."
            : totalItems > 0
              ? `${totalItems} vehicle${totalItems === 1 ? "" : "s"} reserved for review`
              : "No vehicles added yet"}
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {!isHydrated ? (
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="h-36 animate-pulse bg-[#1E1E1E]" />
                ))}
              </div>
              <div className="h-60 animate-pulse bg-[#1E1E1E]" />
            </div>
          ) : items.length === 0 ? (
            <StateBox>
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-white/50">
                Pick a car from the showroom to reserve it.
              </p>
              <Link href="/showroom" className={`${btnRed} mt-6`}>
                Browse showroom
              </Link>
            </StateBox>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-4 ${card} p-4 transition-colors hover:border-white/30 sm:flex-row sm:items-center sm:p-5`}
                  >
                    <Link
                      href={`/showroom/car/${item.id}`}
                      className={`relative h-36 w-full shrink-0 overflow-hidden bg-[#161616] sm:h-28 sm:w-44 ${focus}`}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="176px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/40">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white/50">
                        {item.year}, {item.type}
                      </p>
                      <Link
                        href={`/showroom/car/${item.id}`}
                        className={`${display} mt-1 block text-lg font-light uppercase leading-snug tracking-[0.1em] transition-colors hover:text-[#E31B23]`}
                      >
                        {item.name}
                      </Link>
                      <span className="mt-1 block text-lg text-[#E31B23]">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
                      <div className="flex items-center border border-white/20">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className={qtyBtn}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className={qtyBtn}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className={`inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-[#E31B23] ${focus}`}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className={`text-sm text-white/40 transition-colors hover:text-[#E31B23] ${focus}`}
                >
                  Clear cart
                </button>
              </div>

              <aside className={`${card} p-6 sm:p-7 lg:sticky lg:top-28`}>
                <h2
                  className={`${display} text-lg font-light uppercase tracking-[0.14em]`}
                >
                  Order summary
                </h2>
                <dl className="mt-5 space-y-4 border-t border-white/10 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-white/60">
                      Total ({totalItems} item{totalItems === 1 ? "" : "s"})
                    </dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#E31B23] pt-4">
                    <dt>Pay today (20%)</dt>
                    <dd className="text-2xl text-[#E31B23]">
                      {formatPrice(downpayment)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-white/50">
                  The 20% downpayment secures your vehicle. A sales advisor
                  confirms final pricing.
                </p>
                <Link href="/checkout" className={`${btnRed} mt-6 w-full`}>
                  Proceed to checkout
                </Link>
                <Link href="/showroom" className={`${btnLine} mt-3 w-full`}>
                  Continue browsing
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
