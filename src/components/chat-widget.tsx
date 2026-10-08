"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";

const BUSINESS_NAME = "Auto-Prime Car Trading";
const FACEBOOK_URL = "https://www.facebook.com/autoprimecartrading/";
const PHONE_DISPLAY = "0927 377 7182";
const EMAIL = "shirleyprimesdisplay@yahoo.com";
const ADDRESS =
  "Leo Alejandrino St, BF Resort, Las Piñas City, Philippines 1747";

// Palette: black #0A0A0A | panel #141414 | red #E31B23 | white #FFFFFF
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "I want to sell my car",
  "Financing options",
  "Book a test drive",
  "Where are you located?",
];

function getBotReply(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("sell") || text.includes("trade")) {
    return "Great! Head to our Sell / Trade page and submit your car's details. Our team will review it and get back to you with a valuation.";
  }

  if (text.includes("financ")) {
    return `We can go over financing options with you. Call us at ${PHONE_DISPLAY}, email ${EMAIL}, or send us a message on our Facebook page (${FACEBOOK_URL}) and our team will follow up.`;
  }

  if (text.includes("test drive") || text.includes("book")) {
    return 'Happy to help! Pick a car from our Showroom and tap "Book Test Drive" on its page, or share the model here and I\'ll pass it along.';
  }

  if (
    text.includes("where") ||
    text.includes("location") ||
    text.includes("address") ||
    text.includes("visit")
  ) {
    return `You can find us at ${ADDRESS}. Please call ${PHONE_DISPLAY} or message us on Facebook first so we can confirm our hours before you visit.`;
  }

  if (text.includes("hour") || text.includes("open")) {
    return `Please call us at ${PHONE_DISPLAY} or message us on our Facebook page (${FACEBOOK_URL}) to confirm our current hours before you visit.`;
  }

  if (
    text.includes("contact") ||
    text.includes("facebook") ||
    text.includes("email") ||
    text.includes("phone") ||
    text.includes("number") ||
    text.includes("message") ||
    text.includes("call")
  ) {
    return `You can reach us at:\n• Phone: ${PHONE_DISPLAY}\n• Email: ${EMAIL}\n• Facebook: ${FACEBOOK_URL}\nYou can also use the form on our Contact page.`;
  }

  return "Thanks for reaching out! A member of our team will follow up shortly. Anything specific I can help you with in the meantime?";
}

export default function ChatWidget() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: `Hi there! 👋 I'm the ${BUSINESS_NAME} assistant. Ask me about buying, selling, or trading a car.`,
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(
      () => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "bot",
            text: getBotReply(trimmed),
          },
        ]);

        setIsTyping(false);
      },
      700 + Math.random() * 500,
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  // Hide chatbot on all admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`${BUSINESS_NAME} chat`}
          className="flex h-[min(70vh,560px)] w-[min(92vw,360px)] flex-col overflow-hidden border-t-4 border-[#E31B23] bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#141414] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="chamfer flex h-9 w-9 shrink-0 items-center justify-center bg-[#E31B23] text-white">
                <Bot size={18} strokeWidth={2.25} />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-bold text-white">
                  {BUSINESS_NAME}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E31B23]" />
                  Online now
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-[#E31B23] hover:bg-[#8F1117] hover:text-white ${focusRing}`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#E31B23]/15 text-[#E31B23]">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] whitespace-pre-line break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#E31B23] text-white"
                      : "border-l-2 border-[#E31B23] bg-white/[0.06] text-white"
                  }`}
                >
                  {message.text}
                </div>

                {message.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10 text-white/70">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#E31B23]/15 text-[#E31B23]">
                  <Bot size={14} />
                </div>

                <div className="flex items-center gap-1 border-l-2 border-[#E31B23] bg-white/[0.06] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
                </div>
              </div>
            )}

            {/* Quick replies */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className={`border border-[#E31B23]/60 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#E31B23] ${focusRing}`}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/10 bg-[#141414] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              className={`flex-1 border border-white/15 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white placeholder:text-white/40 ${focusRing}`}
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className={`chamfer flex h-10 w-10 shrink-0 items-center justify-center bg-[#E31B23] text-white transition-colors duration-200 hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
            >
              <Send size={16} strokeWidth={2.25} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E31B23] text-white shadow-[0_10px_30px_rgba(227,27,35,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#B91C1C] ${focusRing}`}
      >
        {isOpen ? (
          <X size={24} strokeWidth={2.25} />
        ) : (
          <MessageCircle size={24} strokeWidth={2.25} />
        )}

        {hasUnread && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-[#0A0A0A]">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#E31B23]" />
          </span>
        )}
      </button>
    </div>
  );
}
