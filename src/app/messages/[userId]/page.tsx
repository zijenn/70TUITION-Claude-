"use client";

import { use, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSession } from "next-auth/react";
import type { MessageDto } from "@/types";

export default function ThreadPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { data: session } = useSession();

  const [counterpartName, setCounterpartName] = useState("");
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function load() {
    fetch(`/api/messages/${userId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setCounterpartName(data.counterpart?.name ?? "Conversation");
        setMessages(data.messages ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: userId, body: draft.trim() }),
      });
      if (res.ok) {
        setDraft("");
        load();
      }
    } finally {
      setSending(false);
    }
  }

  const myId = session?.user?.id;

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Conversation</span>
        <h2>{loading ? "…" : counterpartName}</h2>
      </div>
      <div className="thread">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.senderId === myId ? "mine" : "theirs"}`}>
            {m.body}
            <span className="when">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="thread-composer" onSubmit={handleSend}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" />
        <button className="btn-primary" type="submit" disabled={sending || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
