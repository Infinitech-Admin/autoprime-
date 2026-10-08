// Path: app/orders/page.tsx

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, Clock, ExternalLink, RefreshCw, X } from "lucide-react";

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
import { useAuth } from "@/context/auth-context";
import { apiRequest, isAbortError } from "@/lib/api";

type OrderStatus =
  | "pending_verification"
  | "confirmed"
  | "rejected"
  | "cancelled";

type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  downpayment: number;
  balance: number;
  payment_method: "gcash" | "maya" | "bank";
  payment_reference: string | null;
  payment_proof_url: string | null;
  created_at: string;
  items: {
    id: number;
    vehicle_id: number | null;
    name: string;
    unit_price: number;
    quantity: number;
  }[];
};

const LOGIN_HREF = "/login";

const formatPrice = (v: number) =>
  `₱${v.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PAYMENT_LABELS: Record<Order["payment_method"], string> = {
  gcash: "GCash",
  maya: "Maya",
  bank: "Bank transfer",
};

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; message: string }
> = {
  pending_verification: {
    label: "Verifying payment",
    badge: "border-[#E31B23] text-[#E31B23]",
    message:
      "We received your order and are checking your payment screenshot. We'll contact you once it's verified.",
  },
  confirmed: {
    label: "Confirmed",
    badge: "border-white bg-white text-black",
    message:
      "Your payment is verified. A sales advisor will contact you about the next steps.",
  },
  rejected: {
    label: "Payment issue",
    badge: "border-[#FF4D55] text-[#FF4D55]",
    message:
      "We couldn't verify your payment. Please contact us and send a clearer screenshot.",
  },
  cancelled: {
    label: "Cancelled",
    badge: "border-white/25 text-white/60",
    message: "This order was cancelled.",
  },
};

type StepState = "done" | "current" | "failed" | "todo";
const STEP_LABELS = ["Order placed", "Payment check", "Order confirmed"];

const stepStates = (s: OrderStatus): StepState[] =>
  s === "confirmed"
    ? ["done", "done", "done"]
    : s === "rejected"
      ? ["done", "failed", "todo"]
      : ["done", "current", "todo"];

function Tracker({ status }: { status: OrderStatus }) {
  const states = stepStates(status);
  return (
    <ol className="grid grid-cols-3 gap-2">
      {STEP_LABELS.map((label, i) => {
        const st = states[i];
        const lineOn = i > 0 && states[i - 1] === "done" && st !== "todo";
        const circle =
          st === "done"
            ? "border-[#E31B23] bg-[#E31B23] text-white"
            : st === "current"
              ? "border-[#E31B23] text-[#E31B23]"
              : st === "failed"
                ? "border-[#FF4D55] text-[#FF4D55]"
                : "border-white/20 text-white/40";
        return (
          <li key={label} className="relative flex flex-col items-center">
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute right-1/2 top-4 h-px w-full ${lineOn ? "bg-[#E31B23]" : "bg-white/10"}`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-[#1E1E1E] ${circle}`}
            >
              {st === "done" && <Check size={15} />}
              {st === "current" && <Clock size={15} />}
              {st === "failed" && <X size={15} />}
              {st === "todo" && <span className="text-xs">{i + 1}</span>}
            </span>
            <span
              className={`mt-2 text-center text-xs leading-4 ${st === "todo" ? "text-white/40" : "text-white/80"}`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{k}</span>
      <span className={strong ? "text-[#E31B23]" : ""}>{v}</span>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = STATUS_META[order.status] ?? STATUS_META.pending_verification;
  return (
    <article className={`${card} p-5 sm:p-7`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-white/50">
            Placed on {formatDate(order.created_at)}
          </p>
          <h2
            className={`${display} mt-1 text-xl font-light uppercase tracking-[0.12em]`}
          >
            {order.order_number}
          </h2>
        </div>
        <span
          className={`border px-3 py-1.5 text-xs tracking-[0.12em] ${meta.badge}`}
        >
          {meta.label}
        </span>
      </div>

      {order.status !== "cancelled" && (
        <div className="mt-6">
          <Tracker status={order.status} />
        </div>
      )}

      <p className="mt-5 border-l border-[#E31B23] pl-4 text-sm leading-6 text-white/70">
        {meta.message}
      </p>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              {item.vehicle_id ? (
                <Link
                  href={`/showroom/car/${item.vehicle_id}`}
                  className={`block truncate uppercase tracking-[0.06em] transition-colors hover:text-[#E31B23] ${focus}`}
                >
                  {item.name}
                </Link>
              ) : (
                <span className="block truncate uppercase tracking-[0.06em]">
                  {item.name}
                </span>
              )}
              <span className="text-xs text-white/50">Qty {item.quantity}</span>
            </div>
            <span className="shrink-0">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm">
        <Row k="Total price" v={formatPrice(order.subtotal)} />
        <Row k="Downpayment (20%)" v={formatPrice(order.downpayment)} strong />
        <Row k="Remaining balance" v={formatPrice(order.balance)} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/60">
        <span>
          Paid via{" "}
          <span className="text-white">
            {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
          </span>
          {order.payment_reference && <>, ref {order.payment_reference}</>}
        </span>
        {order.payment_proof_url && (
          <a
            href={order.payment_proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-[#E31B23] transition-colors hover:text-white ${focus}`}
          >
            View screenshot
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

const Skeleton = () => (
  <div className="space-y-5">
    {[0, 1].map((i) => (
      <div key={i} className="h-72 animate-pulse bg-[#1E1E1E]" />
    ))}
  </div>
);

function Empty({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <StateBox>
      <p
        className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
      >
        {title}
      </p>
      <p className="mt-2 text-sm text-white/55">{text}</p>
      <Link href={href} className={`${btnRed} mt-6`}>
        {cta}
      </Link>
    </StateBox>
  );
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setError("");
    try {
      const res = await apiRequest<{ data: Order[] }>("/orders", { signal });
      setOrders(res.data ?? []);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(
        err instanceof Error ? err.message : "Couldn't load your orders.",
      );
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setOrders(null);
      return;
    }
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [authLoading, user, load]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  };

  let content: React.ReactNode;
  if (authLoading || (user && orders === null && !error)) {
    content = <Skeleton />;
  } else if (!user) {
    content = (
      <Empty
        title="Log in to see your orders"
        text="Track the status of your reservations and payments."
        href={LOGIN_HREF}
        cta="Log in"
      />
    );
  } else if (error && orders === null) {
    content = (
      <StateBox>
        <p
          className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
        >
          Couldn&apos;t load orders
        </p>
        <p className="mt-2 text-sm text-white/60">{error}</p>
        <button
          type="button"
          onClick={handleRefresh}
          className={`${btnRed} mt-6`}
        >
          Try again
        </button>
      </StateBox>
    );
  } else if (orders && orders.length === 0) {
    content = (
      <Empty
        title="No orders yet"
        text="When you reserve a car, you can track it here."
        href="/showroom"
        cta="Browse showroom"
      />
    );
  } else {
    content = (
      <div className="space-y-5">
        {orders?.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero title="My orders">
          Follow your reservations from payment to confirmation.
          {user && orders !== null && (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`${btnLine} mt-6 !px-5 !py-2.5 disabled:opacity-60`}
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          )}
        </PageHero>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          {content}
        </section>
      </main>
      <Footer />
    </>
  );
}
