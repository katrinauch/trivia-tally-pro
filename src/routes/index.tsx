import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trophy, Plus, Trash2, Beer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: TriviaScorer,
  head: () => ({
    meta: [
      { title: "Pub Trivia Scorer — 6 Rounds, Live Standings" },
      { name: "description", content: "Score pub trivia in real time. Track teams across 6 rounds, let each team pick a double-points round, and auto-sort the leaderboard." },
    ],
  }),
});

const ROUNDS = 6;

type Team = {
  id: string;
  name: string;
  scores: (number | null)[];
  doubleRound: number | null;
};

const STORAGE_KEY = "pub-trivia-state-v2";

function newTeam(name = ""): Team {
  return {
    id: crypto.randomUUID(),
    name,
    scores: Array(ROUNDS).fill(null),
    doubleRound: null,
  };
}

function loadState(): Team[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

function TriviaScorer() {
  const [teams, setTeams] = useState<Team[]>([
    newTeam("Team 1"),
    newTeam("Team 2"),
  ]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (s?.length) setTeams(s);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }, [teams, hydrated]);

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of teams) {
      const total = t.scores.reduce<number>((sum, s, i) => {
        if (s == null) return sum;
        const mult = t.doubleRound === i ? 2 : 1;
        return sum + s * mult;
      }, 0);
      map.set(t.id, total);
    }
    return map;
  }, [teams]);

  const ranked = useMemo(
    () => [...teams].sort((a, b) => (totals.get(b.id) ?? 0) - (totals.get(a.id) ?? 0)),
    [teams, totals],
  );

  const updateName = (id: string, name: string) =>
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));

  const updateScore = (id: string, idx: number, raw: string) => {
    const val = raw === "" ? null : Number(raw);
    setTeams((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t;
        const scores = [...t.scores];
        scores[idx] = val == null || Number.isNaN(val) ? null : val;
        return { ...t, scores };
      }),
    );
  };

  const setDoubleRound = (id: string, idx: number) =>
    setTeams((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, doubleRound: t.doubleRound === idx ? null : idx } : t,
      ),
    );

  const addTeam = () =>
    setTeams((ts) => [...ts, newTeam(`Team ${ts.length + 1}`)]);

  const removeTeam = (id: string) =>
    setTeams((ts) => (ts.length > 1 ? ts.filter((t) => t.id !== id) : ts));

  const resetAll = () => setTeams([newTeam("Team 1"), newTeam("Team 2")]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-foreground">
            <Beer className="h-3.5 w-3.5" />
            Quiz Night
          </div>
          <h1 className="text-5xl text-foreground sm:text-6xl">
            Pub Trivia <span className="text-primary">Scorer</span>
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Six rounds. Each team picks one round to double. Leaderboard sorts itself.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll}>Reset</Button>
          <Button onClick={addTeam}>
            <Plus className="mr-1 h-4 w-4" /> Add team
          </Button>
        </div>
      </header>

      {/* Team scoring cards */}
      <div className="grid gap-4">
        {teams.map((t) => {
          const rank = ranked.findIndex((r) => r.id === t.id);
          const total = totals.get(t.id) ?? 0;
          const medal =
            rank === 0
              ? "text-gold"
              : rank === 1
              ? "text-silver"
              : rank === 2
              ? "text-bronze"
              : "text-muted-foreground";
          return (
            <Card key={t.id} className="border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={"font-display text-3xl tabular-nums " + medal}>
                    #{rank + 1}
                  </span>
                  <Input
                    value={t.name}
                    onChange={(e) => updateName(t.id, e.target.value)}
                    placeholder="Team name"
                    className="h-11 min-w-[200px] bg-input text-lg font-semibold"
                  />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Total
                  </span>
                  <span className="font-display text-5xl tabular-nums text-foreground">
                    {total}
                  </span>
                  <button
                    onClick={() => removeTeam(t.id)}
                    className="ml-2 rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove team"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {t.scores.map((s, i) => {
                  const isDouble = t.doubleRound === i;
                  const locked = t.doubleRound !== null && !isDouble;
                  return (
                    <div key={i} className="flex flex-col">
                      <label
                        className={
                          "mb-1.5 text-center font-display text-xs uppercase tracking-widest " +
                          (isDouble ? "text-primary" : "text-muted-foreground")
                        }
                      >
                        Round {i + 1}
                      </label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s ?? ""}
                        onChange={(e) => updateScore(t.id, i, e.target.value)}
                        placeholder="–"
                        className={
                          "h-12 text-center text-lg font-semibold tabular-nums transition " +
                          (isDouble
                            ? "border-primary bg-primary/5 text-primary"
                            : "bg-input")
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setDoubleRound(t.id, i)}
                        className={
                          "mt-1.5 inline-flex h-7 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition " +
                          (isDouble
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground")
                        }
                        aria-pressed={isDouble}
                      >
                        ×2
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-display text-3xl">Leaderboard</h2>
        </div>
        <ol className="grid gap-2">
          {ranked.map((t, i) => {
            const total = totals.get(t.id) ?? 0;
            const top = i === 0 && total > 0;
            return (
              <li
                key={t.id}
                className={
                  "flex items-center justify-between rounded-lg border px-5 py-4 transition " +
                  (top
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card")
                }
              >
                <div className="flex items-center gap-4">
                  <span
                    className={
                      "font-display text-3xl tabular-nums " +
                      (i === 0
                        ? "text-gold"
                        : i === 1
                        ? "text-silver"
                        : i === 2
                        ? "text-bronze"
                        : "text-muted-foreground")
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {t.name || <span className="text-muted-foreground">Unnamed team</span>}
                  </span>
                </div>
                <span className="font-display text-4xl tabular-nums">{total}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Scores save locally in your browser.
      </footer>
    </main>
  );
}
