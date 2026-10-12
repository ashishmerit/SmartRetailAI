
import { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Send } from "lucide-react";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CustomerAIChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;

    api.get("/chat/me")
      .then(({ data }) => {
        if (active) {
          setMessages(data.flatMap((chat) => [
            { id: `${chat.id}-user`, role: "user", text: chat.user_message },
            { id: `${chat.id}-assistant`, role: "assistant", text: chat.bot_response },
          ]));
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.detail || "Unable to load your chat history.");
        }
      })
      .finally(() => {
        if (active) setLoadingHistory(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();

    if (!text || sending) return;

    setDraft("");
    setError("");
    setSending(true);

    const temporaryId = `pending-${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: temporaryId, role: "user", text },
    ]);

    try {
      const { data } = await api.post("/chat/me", {
        user_message: text,
      });

      setMessages((current) => [
        ...current.filter((item) => item.id !== temporaryId),
        { id: `${data.id}-user`, role: "user", text: data.user_message },
        {
          id: `${data.id}-assistant`,
          role: "assistant",
          text: data.bot_response,
        },
      ]);
    } catch (err) {
      setMessages((current) => current.filter((item) => item.id !== temporaryId));
      setDraft(text);
      setError(err.response?.data?.detail || "Unable to send your message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="size-5" />
          AI Shopping Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask about your visits, reviews, or shopping experience.
        </p>
      </CardHeader>

      <CardContent>
        <div
          className="mb-4 flex max-h-[420px] min-h-48 flex-col gap-3 overflow-y-auto rounded-lg bg-muted/30 p-3"
          aria-live="polite"
        >
          {loadingHistory ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading your conversations...
            </p>
          ) : messages.length === 0 ? (
            <p className="m-auto text-center text-sm text-muted-foreground">
              Start a conversation with your personal retail assistant.
            </p>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                  item.role === "user"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted"
                }`}
              >
                {item.text}
              </div>
            ))
          )}

          {sending && (
            <p className="flex items-center gap-2 self-start text-xs text-muted-foreground">
              <LoaderCircle className="size-3 animate-spin" />
              Thinking...
            </p>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>
        )}

        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask your assistant..."
            aria-label="Message to AI assistant"
            disabled={loadingHistory || sending}
            maxLength={4000}
          />
          <Button
            type="submit"
            aria-label="Send message"
            disabled={loadingHistory || sending || !draft.trim()}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
