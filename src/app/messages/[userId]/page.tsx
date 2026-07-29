"use client";

import { use, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import type { MessageDto } from "@/types";

type Counterpart = {
  id: string;
  name: string;
  photoUrl: string | null;
  profileKind: "tutor" | "student" | "center" | null;
  profileId: string | null;
};

export default function ThreadPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { data: session } = useSession();
  const { openModal } = useUI();

  const [counterpart, setCounterpart] = useState<Counterpart | null>(null);
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
        setCounterpart(data.counterpart ?? null);
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

  const canOpenProfile = counterpart?.profileKind && counterpart?.profileId;

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Conversation</span>
        {loading ? (
          <h2>…</h2>
        ) : canOpenProfile ? (
          <button
            className="thread-counterpart"
            onClick={() => openModal({ type: "profile", kind: counterpart!.profileKind!, id: counterpart!.profileId! })}
          >
            <Avatar seed={counterpart!.name} photoUrl={counterpart!.photoUrl} size={40} />
            <h2>{counterpart!.name}</h2>
          </button>
        ) : (
          <div className="thread-counterpart">
            <Avatar seed={counterpart?.name ?? "?"} photoUrl={counterpart?.photoUrl ?? null} size={40} />
            <h2>{counterpart?.name ?? "Conversation"}</h2>
          </div>
        )}
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
