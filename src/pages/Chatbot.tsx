import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestions = [
  "How often should I vaccinate my puppy?",
  "Best diet for a Maine Coon cat?",
  "How to train a parrot to talk?",
  "Signs of illness in Betta fish?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Failed to connect" }));
        setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I encountered an error: ${err.error || "Please try again."}` }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please check your connection and try again." }]);
    }
    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 animate-reveal-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Koda AI</h1>
              <p className="text-xs text-muted-foreground">Your pet care assistant</p>
            </div>
            <div className="ml-2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium text-primary">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full animate-reveal-up">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">How can I help?</h2>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Ask me anything about pet care, health, training, or nutrition.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-4 py-2 rounded-xl bg-card border border-border/40 text-sm text-foreground hover:bg-muted transition-colors duration-200 active:scale-[0.98]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 animate-reveal-up",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass-card-elevated rounded-bl-md"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3 animate-reveal-up">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass-card-elevated rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-8 pb-6 pt-2 animate-reveal-up">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-3 p-2 rounded-2xl glass-card-elevated"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pet care..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 active:scale-[0.95]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
