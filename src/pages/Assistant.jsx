import { useEffect, useRef, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { USER } from "../config";

const SUGGESTIONS = [
  "What should I try next?",
  "Why did I like Blue Dream?",
  "What are my favorite terpenes?",
  "What have I disliked?",
  "Show me things similar to my favorites",
];

export default function Assistant() {
  const { aiRespond, journal } = useZadex();
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi ${USER.name} — I've reviewed your journal. Ask me what to try next, why you liked a product, or what your favorite terpenes are.` },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: aiRespond(q, journal) }]);
      setThinking(false);
    }, 500);
  };

  return (
    <div className="space-y-4 fade-in">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Zadex AI</h1>
        <p className="text-sm text-muted-foreground mt-1">Answers from your journal — references your real history.</p>
      </div>

      <div className="flex flex-col h-[calc(100dvh-14rem)] lg:h-[calc(100vh-12rem)]">
        <div ref={scroller} className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 shrink-0 rounded-xl accent-grad flex items-center justify-center text-primary-foreground mr-2.5 mt-0.5"><Sparkles size={15} /></div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-accent text-accent-foreground rounded-br-sm" : "card-elevated text-foreground/90 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl accent-grad flex items-center justify-center text-primary-foreground"><Sparkles size={15} /></div>
              <div className="card-elevated rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
        </div>

        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 py-3">
            {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="chip text-xs">{s}</button>)}
          </div>
        )}

        <div className="pt-3 pb-2 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Zadex about your history…"
              className="flex-1 rounded-2xl bg-card border border-border px-4 py-3 text-sm outline-none focus:border-accent-foreground/40 transition-colors"
            />
            <button onClick={() => send()} className="h-11 w-11 shrink-0 rounded-2xl accent-grad flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity" aria-label="Send">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
