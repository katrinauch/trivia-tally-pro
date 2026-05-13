import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trophy, Plus, Trash2, Beer, X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: TriviaScorer,
  head: () => ({
    meta: [
      { title: "Pub Trivia Scorer — 6 Rounds, Live Standings" },
      { name: "description", content: "Score pub trivia in real time. Track teams across 6 rounds, mark a double-points round, and auto-sort the leaderboard." },
    ],
  }),
});

const ROUNDS = 6;

type Team = {
  id: string;
  name: string;
  scores: (number | null)[];
};

const STORAGE_KEY = "pub-trivia-state-v1";

function loadState(): { teams: Team[]; doubleRound: number | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function newTeam(name = ""): Team {
  return {
    id: crypto.randomUUID(),
    name,
    scores: Array(ROUNDS).fill(null),
  };
}

function TriviaScorer() {
  const [teams, setTeams] = useState<Team[]>([
    newTeam("Team 1"),
    newTeam("Team 2"),
  ]);
  const [doubleRound, setDoubleRound] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (s?.teams?.length) {
      setTeams(s.teams);
      setDoubleRound(s.doubleRound ?? null);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams, doubleRound }));
  }, [teams, doubleRound, hydrated]);

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of teams) {
      const total = t.scores.reduce((sum, s, i) => {
        if (s == null) return sum;
        const mult = doubleRound === i ? 2 : 1;
        return sum + s * mult;
      }, 0);
      map.set(t.id, total);
    }
    return map;
  }, [teams, doubleRound]);

  const ranked = useMemo(() => {
    return [...teams].sort((a, b) => (totals.get(b.id) ?? 0) - (totals.get(a.id) ?? 0));
  }, [teams, totals]);

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

  const addTeam = () =>
    setTeams((ts) => [...ts, newTeam(`Team ${ts.length + 1}`)]);

  const removeTeam = (id: string) =>
    setTeams((ts) => (ts.length > 1 ? ts.filter((t) => t.id !== id) : ts));

  const resetAll = () => {
    setTeams([newTeam("Team 1"), newTeam("Team 2")]);
    setDoubleRound(null);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            <Beer className="h-3.5 w-3.5 text-primary" />
            Quiz Night
          </div>
          <h1 className="text-5xl text-foreground sm:text-6xl">
            Pub Trivia <span className="text-primary">Scorer</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Six rounds. Live leaderboard. Tap a round header to make it double points.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetAll}>Reset</Button>
          <Button onClick={addTeam}>
            <Plus className="mr-1 h-4 w-4" /> Add team
          </Button>
        </div>
      </header>

      {/* Double round selector */}
      <Card className="mb-6 border-border bg-card/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Double points round
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: ROUNDS }).map((_, i) => {
              const active = doubleRound === i;
              return (
                <button
                  key={i}
                  onClick={() => setDoubleRound(active ? null : i)}
                  className={
                    "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "border-border bg-secondary/40 text-foreground hover:bg-secondary")
                  }
                >
                  <X2 className="h-3.5 w-3.5" />
                  R{i + 1}
                </button>
              );
            })}
            {doubleRound !== null && (
              <button
                onClick={() => setDoubleRound(null)}
                className="inline-flex h-9 items-center rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Scoring grid */}
      <Card className="overflow-x-auto border-border bg-card/70 p-0">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 font-display text-xs uppercase tracking-widest text-muted-foreground">
                Team
              </th>
              {Array.from({ length: ROUNDS }).map((_, i) => (
                <th key={i} className="px-2 py-3 text-center">
                  <div
                    className={
                      "inline-flex flex-col items-center gap-0.5 font-display text-xs uppercase tracking-widest " +
                      (doubleRound === i ? "text-primary" : "text-muted-foreground")
                    }
                  >
                    <span>R{i + 1}</span>
                    {doubleRound === i && (
                      <span className="rounded-sm bg-primary/15 px-1 text-[10px] text-primary">
                        ×2
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-display text-xs uppercase tracking-widest text-muted-foreground">
                Total
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
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
                <tr key={t.id} className="border-t border-border">
                  <td className="sticky left-0 z-10 bg-card px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className={"font-display text-lg " + medal}>
                        #{rank + 1}
                      </span>
                      <Input
                        value={t.name}
                        onChange={(e) => updateName(t.id, e.target.value)}
                        placeholder="Team name"
                        className="h-9 min-w-[160px] bg-input/60"
                      />
                    </div>
                  </td>
                  {t.scores.map((s, i) => (
                    <td key={i} className="px-1.5 py-2">
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s ?? ""}
                        onChange={(e) => updateScore(t.id, i, e.target.value)}
                        placeholder="–"
                        className={
                          "h-10 w-16 text-center tabular-nums " +
                          (doubleRound === i
                            ? "border-primary/60 bg-primary/5"
                            : "bg-input/60")
                        }
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right">
                    <span className="font-display text-2xl tabular-nums text-foreground">
                      {total}
                    </span>
                  </td>
                  <td className="pr-3">
                    <button
                      onClick={() => removeTeam(t.id)}
                      className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Leaderboard */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl">Leaderboard</h2>
        </div>
        <ol className="grid gap-2">
          {ranked.map((t, i) => {
            const total = totals.get(t.id) ?? 0;
            const top = i === 0 && total > 0;
            return (
              <li
                key={t.id}
                className={
                  "flex items-center justify-between rounded-lg border px-4 py-3 transition " +
                  (top
                    ? "border-primary/60 bg-gradient-to-r from-primary/15 to-transparent"
                    : "border-border bg-card/60")
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "font-display text-2xl " +
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
                  <span className="text-base font-medium text-foreground">
                    {t.name || <span className="text-muted-foreground">Unnamed team</span>}
                  </span>
                </div>
                <span className="font-display text-3xl tabular-nums">{total}</span>
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
