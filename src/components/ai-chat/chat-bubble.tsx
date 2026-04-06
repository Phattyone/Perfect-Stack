"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  subscriptionStatus: string;
  userProfile?: {
    age_group: string;
    primary_goal: string;
    stack_selection: string;
    trt_hrt: boolean;
    pde5_inhibitor: string;
    nitrate_meds: boolean;
    blood_thinners: boolean;
  } | null;
}

const SUGGESTIONS = [
  "What does my Hormone Factor score mean?",
  "When should I take my supplements?",
  "How long until I see results?",
];

const GREETING = "Hey! I'm your Perfect Stack AI assistant. I can help you understand your supplement protocol, explain how the optimization scores work, answer questions about ingredients and timing, and guide you through the 8-week plan. What would you like to know?";

export default function ChatBubble({ subscriptionStatus, userProfile }: ChatBubbleProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isPaid = subscriptionStatus === "foundation" || subscriptionStatus === "complete";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleOpen() {
    setOpen(true);
    if (messages.length === 0 && isPaid) {
      setMessages([{ role: "assistant", content: GREETING, timestamp: new Date() }]);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          userProfile,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response ?? data.error ?? "Something went wrong.", timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again.", timestamp: new Date() },
      ]);
    }
    setLoading(false);
  }

  function formatTime(d: Date) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600 shadow-lg transition hover:bg-yellow-500"
        >
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
            <div>
              <span className="text-sm font-bold text-yellow-600">Perfect Stack AI</span>
              <p className="text-[10px] text-zinc-400">Ask me anything about your protocol</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isPaid ? (
            /* Paywall */
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <svg className="mb-3 h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-zinc-300">The Perfect Stack AI assistant is available on the Foundation Protocol and above.</p>
              <p className="mt-2 text-xs text-zinc-500">Upgrade to get personalized answers about your protocol, supplement timing, and the complete 8-week system.</p>
              <Link href="/pricing" className="mt-4 rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-500">
                View Plans
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div>
                      <div className={
                        msg.role === "user"
                          ? "rounded-2xl rounded-br-sm bg-yellow-600 px-4 py-2 text-sm text-zinc-950 max-w-xs ml-auto"
                          : "rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-2 text-sm text-zinc-100 max-w-xs"
                      }>
                        {msg.content}
                      </div>
                      <span className={`mt-0.5 block text-[10px] text-zinc-600 ${msg.role === "user" ? "text-right" : ""}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />

                {/* Suggestions */}
                {messages.length === 1 && !loading && (
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-yellow-600 hover:text-yellow-500"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-zinc-700 p-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your protocol..."
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
