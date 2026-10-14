"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ProblemView, StreakView } from "@/lib/types";
import StreakCelebration from "../streak/StreakCelebration";
import ProblemModal from "./ProblemModal";

interface ModalContextValue {
  openProblem: (problem: ProblemView) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Owns the single problem modal for the page, so the path and the review
 * queue can't open two at once: opening a problem replaces the current one.
 */
export function ProblemModalProvider({ children }: { children: React.ReactNode }) {
  const [problem, setProblem] = useState<ProblemView | null>(null);
  const openProblem = useCallback((p: ProblemView) => setProblem(p), []);
  const close = useCallback(() => setProblem(null), []);
  const [celebration, setCelebration] = useState<StreakView | null>(null);
  const closeCelebration = useCallback(() => setCelebration(null), []);

  return (
    <ModalContext.Provider value={{ openProblem }}>
      {children}
      {problem && (
        <ProblemModal
          key={problem.id}
          problem={problem}
          onClose={close}
          onStreakExtended={setCelebration}
        />
      )}
      {celebration && <StreakCelebration streak={celebration} onClose={closeCelebration} />}
    </ModalContext.Provider>
  );
}

export function useProblemModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useProblemModal must be used inside ProblemModalProvider");
  return ctx;
}
