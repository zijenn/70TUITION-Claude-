"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { QuickMatchCriteria, TargetType } from "@/types";

export type ModalState =
  | { type: "none" }
  | { type: "login"; next?: string }
  | { type: "quickmatch" }
  | { type: "post"; kind: "tutor" };

type LikeState = { liked: boolean; count: number };

type UIContextValue = {
  modal: ModalState;
  openModal: (m: ModalState) => void;
  closeModal: () => void;

  toastMessage: string;
  toastShow: boolean;
  showToast: (msg: string) => void;

  quickMatchCriteria: QuickMatchCriteria | null;
  setQuickMatchCriteria: (c: QuickMatchCriteria | null) => void;

  requireAuth: (action: () => void) => void;

  likesLoaded: boolean;
  getLikeState: (targetType: TargetType, targetId: string, baseCount: number) => LikeState;
  toggleLike: (targetType: TargetType, targetId: string, baseCount: number) => Promise<void>;
  shortlistCount: number;
  isShortlisted: (tutorId: string) => boolean;
  setShortlisted: (tutorId: string, saved: boolean) => Promise<void>;
  shortlistVersion: number;

  basketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

function keyOf(t: TargetType, id: string) {
  return `${t}:${id}`;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const openModal = useCallback((m: ModalState) => setModal(m), []);
  const closeModal = useCallback(() => setModal({ type: "none" }), []);

  const [toastMessage, setToastMessage] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2600);
  }, []);

  const [quickMatchCriteria, setQuickMatchCriteria] = useState<QuickMatchCriteria | null>(null);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (status !== "authenticated") {
        setModal({ type: "login" });
        return;
      }
      action();
    },
    [status]
  );

  const [initialLikedKeys, setInitialLikedKeys] = useState<Set<string>>(new Set());
  const [likeOverrides, setLikeOverrides] = useState<Record<string, LikeState>>({});
  const [likesLoaded, setLikesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLikesLoaded(false);
    setLikeOverrides({});
    if (status === "authenticated") {
      fetch("/api/likes/mine")
        .then((r) => (r.ok ? r.json() : { likedKeys: [] }))
        .then((data) => {
          if (cancelled) return;
          setInitialLikedKeys(new Set<string>(data.likedKeys ?? []));
          setLikesLoaded(true);
        })
        .catch(() => {
          if (!cancelled) setLikesLoaded(true);
        });
    } else {
      setInitialLikedKeys(new Set());
      setLikesLoaded(true);
    }
    return () => {
      cancelled = true;
    };
  }, [status]);

  const getLikeState = useCallback(
    (targetType: TargetType, targetId: string, baseCount: number): LikeState => {
      const key = keyOf(targetType, targetId);
      if (likeOverrides[key]) return likeOverrides[key];
      return { liked: initialLikedKeys.has(key), count: baseCount };
    },
    [likeOverrides, initialLikedKeys]
  );

  const toggleLike = useCallback(
    async (targetType: TargetType, targetId: string, baseCount: number) => {
      if (status !== "authenticated") {
        setModal({ type: "login" });
        return;
      }
      const key = keyOf(targetType, targetId);
      const current = getLikeState(targetType, targetId, baseCount);
      const optimistic: LikeState = { liked: !current.liked, count: current.count + (current.liked ? -1 : 1) };
      setLikeOverrides((prev) => ({ ...prev, [key]: optimistic }));
      try {
        const res = await fetch("/api/likes/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetType, targetId }),
        });
        if (!res.ok) throw new Error("toggle failed");
        const data = await res.json();
        setLikeOverrides((prev) => ({ ...prev, [key]: { liked: data.liked, count: data.count } }));
      } catch {
        setLikeOverrides((prev) => ({ ...prev, [key]: current }));
        showToast("Something went wrong — try again.");
      }
    },
    [status, getLikeState, showToast]
  );

  // Shortlist (the bucket) is separate from likes (the heart).
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());
  const [shortlistVersion, setShortlistVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (status === "authenticated") {
      fetch("/api/shortlist/mine")
        .then((r) => (r.ok ? r.json() : { tutorIds: [] }))
        .then((data) => {
          if (!cancelled) setShortlistIds(new Set<string>(data.tutorIds ?? []));
        })
        .catch(() => {});
    } else {
      setShortlistIds(new Set());
    }
    return () => {
      cancelled = true;
    };
  }, [status]);

  const isShortlisted = useCallback((tutorId: string) => shortlistIds.has(tutorId), [shortlistIds]);

  const setShortlisted = useCallback(
    async (tutorId: string, saved: boolean) => {
      if (status !== "authenticated") {
        setModal({ type: "login" });
        return;
      }
      const apply = (on: boolean) =>
        setShortlistIds((prev) => {
          const next = new Set(prev);
          if (on) next.add(tutorId);
          else next.delete(tutorId);
          return next;
        });
      apply(saved);
      try {
        const res = await fetch("/api/shortlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tutorId, saved }),
        });
        if (!res.ok) throw new Error("shortlist failed");
        setShortlistVersion((v) => v + 1);
      } catch {
        apply(!saved);
        showToast("Something went wrong — try again.");
      }
    },
    [status, showToast]
  );

  const shortlistCount = shortlistIds.size;

  const [basketOpen, setBasketOpen] = useState(false);
  const openBasket = useCallback(() => setBasketOpen(true), []);
  const closeBasket = useCallback(() => setBasketOpen(false), []);

  return (
    <UIContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
        toastMessage,
        toastShow,
        showToast,
        quickMatchCriteria,
        setQuickMatchCriteria,
        requireAuth,
        likesLoaded,
        getLikeState,
        toggleLike,
        shortlistCount,
        isShortlisted,
        setShortlisted,
        shortlistVersion,
        basketOpen,
        openBasket,
        closeBasket,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
