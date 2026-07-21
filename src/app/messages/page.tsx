"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConversationSummary } from "@/types";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ConversationSummary[]) => setConversations(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Inbox</span>
        <h2>Messages</h2>
        <p>Conversations with tutors, students and centers.</p>
      </div>
      <div className="conversation-list">
        {!loading && conversations.length === 0 && (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            No conversations yet — start one from a profile.
          </p>
        )}
        {conversations.map((c) => (
          <Link key={c.counterpartId} href={`/messages/${c.counterpartId}`} className="conversation-row">
            <div className="meta">
              <div className="name">
                {c.counterpartName}
                {c.unread ? " •" : ""}
              </div>
              <div className="preview">{c.lastMessage}</div>
            </div>
            <div className="when">{new Date(c.lastMessageAt).toLocaleDateString()}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
