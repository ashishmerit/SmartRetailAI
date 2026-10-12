
import { useEffect, useState } from "react";
import { Bot, LoaderCircle, Send } from "lucide-react";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/customers/")
      .then((response) => {
        setCustomers(response.data);
        if (response.data.length) {
          setCustomerId(String(response.data[0].id));
        }
      })
      .catch((err) =>
        setError(err.response?.data?.detail || "Could not load customers.")
      );
  }, []);

  useEffect(() => {
    if (!customerId) {
      setMessages([]);
      return;
    }

    let active = true;
    setError("");

    api.get(`/chat/admin/${customerId}`)
      .then((response) => {
        if (active) {
          setMessages(response.data.flatMap((chat) => [
            { role: "user", text: chat.user_message },
            { role: "assistant", text: chat.bot_response },
          ]));
        }
      })
      .catch((err) => {
        if (active) {
          setMessages([]);
          setError(err.response?.data?.detail || "Could not load chat history.");
        }
      });

    return () => { active = false; };
  }, [customerId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = message.trim();

    if (!text || !customerId || loading) return;

    setLoading(true);
    setError("");
    setMessage("");
    setMessages((current) => [...current, { role: "user", text }]);

    try {
      const response = await api.post("/chat/admin", {
        customer_id: Number(customerId),
        user_message: text,
      });

      setMessages((current) => [
        ...current,
        { role: "assistant", text: response.data.bot_response },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "The assistant could not respond.");
      setMessages((current) => current.slice(0, -1));
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <Bot className="size-7" /> AI Assistant
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore customer-context assistance using the existing retail chatbot.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Context</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="chat-customer" className="mb-2 block text-sm font-medium">
            Select customer
          </label>
          <select
            id="chat-customer"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            className="w-full rounded-md border bg-background p-2 text-sm"
          >
            {customers.length === 0 && <option value="">No customers available</option>}
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} — #{customer.id}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">
            Messages use the selected customer's context and are saved to that customer's chat history.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex min-h-64 flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
                Select a customer and start a conversation.
              </div>
            )}
            {messages.map((item, index) => (
              <div
                key={`${index}-${item.role}`}
                className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-3 text-sm ${
                  item.role === "user"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted"
                }`}
              >
                <p className="mb-1 text-xs opacity-70">
                  {item.role === "user" ? "Admin" : "Assistant"}
                </p>
                {item.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Assistant is responding...
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>
          )}

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about customer visits, reviews, or shopping..."
              disabled={!customerId || loading}
            />
            <Button type="submit" disabled={!customerId || !message.trim() || loading}>
              <Send className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
