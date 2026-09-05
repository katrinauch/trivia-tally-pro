import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trophy, Plus, Trash2, Beer, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/logo.png";

type Lang = "en" | "fr" | "ja" | "es";

const translations = {
  en: {
    metaTitle: "Pub Trivia Scorekeeper — 6 Rounds, Live Standings",
    metaDesc: "Score pub trivia in real time. Track teams across 6 rounds, let each team pick a double-points round, and auto-sort the leaderboard.",
    quizNight: "Quiz Night",
    titlePub: "Pub Trivia",
    titleScorer: "Scorekeeper",
    tagline: "Six rounds. Each team picks one round to double. Leaderboard sorts itself.",
    reset: "Reset",
    addTeam: "Add team",
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
    language: "Language",
    teamName: "Team name",
    total: "Total",
    removeTeam: "Remove team",
    round: "Round",
    x2Locked: "×2 already used this game — unlock the active round first",
    x2Unlock: "Click to unlock ×2",
    x2Use: "Use ×2 on this round",
    leaderboard: "Leaderboard",
    lowHigh: "Low → High",
    highLow: "High → Low",
    unnamed: "Unnamed team",
    footer: "Scores save locally in your browser.",
    searchPlaceholder: "Search teams…",
    defaultTeam: (n: number) => `Team ${n}`,
  },
  fr: {
    metaTitle: "Marqueur de Quiz de Pub — 6 manches, classement en direct",
    metaDesc: "Comptez les scores de quiz de pub en temps réel. Suivez les équipes sur 6 manches, choisissez une manche à points doublés, et triez automatiquement le classement.",
    quizNight: "Soirée Quiz",
    titlePub: "Marqueur de",
    titleScorer: "Quiz de Pub",
    tagline: "Six manches. Chaque équipe choisit une manche à doubler. Le classement se trie tout seul.",
    reset: "Réinitialiser",
    addTeam: "Ajouter une équipe",
    toDark: "Passer en mode sombre",
    toLight: "Passer en mode clair",
    language: "Langue",
    teamName: "Nom de l'équipe",
    total: "Total",
    removeTeam: "Supprimer l'équipe",
    round: "Manche",
    x2Locked: "×2 déjà utilisé — déverrouillez d'abord la manche active",
    x2Unlock: "Cliquez pour déverrouiller ×2",
    x2Use: "Utiliser ×2 sur cette manche",
    leaderboard: "Classement",
    lowHigh: "Bas → Haut",
    highLow: "Haut → Bas",
    unnamed: "Équipe sans nom",
    footer: "Les scores sont enregistrés localement dans votre navigateur.",
    searchPlaceholder: "Rechercher des équipes…",
    defaultTeam: (n: number) => `Équipe ${n}`,
  },
  ja: {
    metaTitle: "パブクイズ・スコアキーパー — 6ラウンド、ライブ順位",
    metaDesc: "パブクイズの得点をリアルタイムで記録。6ラウンドにわたってチームを追跡し、各チームがダブルポイントのラウンドを選択でき、リーダーボードが自動的に並びます。",
    quizNight: "クイズナイト",
    titlePub: "パブクイズ",
    titleScorer: "スコアキーパー",
    tagline: "6ラウンド。各チームが1ラウンドを2倍にできます。順位は自動で並びます。",
    reset: "リセット",
    addTeam: "チームを追加",
    toDark: "ダークモードに切り替え",
    toLight: "ライトモードに切り替え",
    language: "言語",
    teamName: "チーム名",
    total: "合計",
    removeTeam: "チームを削除",
    round: "ラウンド",
    x2Locked: "×2はすでに使用済み — 先にアクティブなラウンドを解除してください",
    x2Unlock: "クリックして×2を解除",
    x2Use: "このラウンドで×2を使用",
    leaderboard: "リーダーボード",
    lowHigh: "低 → 高",
    highLow: "高 → 低",
    unnamed: "名前なしチーム",
    footer: "スコアはブラウザにローカル保存されます。",
    searchPlaceholder: "チームを検索…",
    defaultTeam: (n: number) => `チーム ${n}`,
  },
  es: {
    metaTitle: "Marcador de Trivia de Bar — 6 rondas, clasificación en vivo",
    metaDesc: "Lleva la puntuación de trivia de bar en tiempo real. Sigue a los equipos en 6 rondas, deja que cada equipo elija una ronda de puntos dobles y ordena la clasificación automáticamente.",
    quizNight: "Noche de Trivia",
    titlePub: "Marcador de",
    titleScorer: "Trivia de Bar",
    tagline: "Seis rondas. Cada equipo elige una ronda para doblar. La clasificación se ordena sola.",
    reset: "Reiniciar",
    addTeam: "Añadir equipo",
    toDark: "Cambiar a modo oscuro",
    toLight: "Cambiar a modo claro",
    language: "Idioma",
    teamName: "Nombre del equipo",
    total: "Total",
    removeTeam: "Eliminar equipo",
    round: "Ronda",
    x2Locked: "×2 ya usado — desbloquea primero la ronda activa",
    x2Unlock: "Haz clic para desbloquear ×2",
    x2Use: "Usar ×2 en esta ronda",
    leaderboard: "Clasificación",
    lowHigh: "Bajo → Alto",
    highLow: "Alto → Bajo",
    unnamed: "Equipo sin nombre",
    footer: "Las puntuaciones se guardan localmente en tu navegador.",
    searchPlaceholder: "Buscar equipos…",
    defaultTeam: (n: number) => `Equipo ${n}`,
  },
} as const;

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  ja: "日本語",
  es: "Español",
};

export const Route = createFileRoute("/")({
  component: TriviaScorer,
  head: () => ({
    meta: [
      { title: "Pub Trivia Scorekeeper — 6 Rounds, Live Standings" },
      { name: "description", content: "Score pub trivia in real time. Track teams across 6 rounds, let each team pick a double-points round, and auto-sort the leaderboard." },
      { property: "og:title", content: "Pub Trivia Scorekeeper — 6 Rounds, Live Standings" },
      { property: "og:description", content: "Score pub trivia in real time. Track teams across 6 rounds, let each team pick a double-points round, and auto-sort the leaderboard." },
      { property: "og:url", content: "https://trivia-tally-pro.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://trivia-tally-pro.lovable.app/" }],
  }),
});

const ROUNDS = 6;

type Team = {
  id: string;
  name: string;
  nameEdited: boolean;
  scores: (number | null)[];
  doubleRound: number | null;
};

const STORAGE_KEY = "pub-trivia-state-v2";
const LANG_KEY = "pub-trivia-lang";

// Matches the auto-generated default names ("Team 1", "Équipe 3", "チーム 2", "Equipo 5", …)
const DEFAULT_NAME_RE = /^(Team|Équipe|チーム|Equipo)\s*\d+$/i;

function newTeam(name = "", nameEdited = false): Team {
  return {
    id: crypto.randomUUID(),
    name,
    nameEdited,
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
    if (Array.isArray(parsed)) {
      return parsed.map((tm) => ({
        ...tm,
        nameEdited:
          typeof tm.nameEdited === "boolean"
            ? tm.nameEdited
            : !DEFAULT_NAME_RE.test(String(tm.name ?? "").trim()),
      }));
    }
    return null;
  } catch {
    return null;
  }
}

function TriviaScorer() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  const [teams, setTeams] = useState<Team[]>(
    Array.from({ length: 6 }, (_, i) => newTeam(t.defaultTeam(i + 1))),
  );
  const [hydrated, setHydrated] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pub-trivia-theme") as "light" | "dark" | null;
      if (stored) setTheme(stored);
      const storedLang = localStorage.getItem(LANG_KEY) as Lang | null;
      if (storedLang && storedLang in translations) setLang(storedLang);
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try { localStorage.setItem("pub-trivia-theme", theme); } catch { /* no-op */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* no-op */ }
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

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
    for (const tm of teams) {
      const total = tm.scores.reduce<number>((sum, s, i) => {
        if (s == null) return sum;
        const mult = tm.doubleRound === i ? 2 : 1;
        return sum + s * mult;
      }, 0);
      map.set(tm.id, total);
    }
    return map;
  }, [teams]);

  const ranked = useMemo(
    () => [...teams].sort((a, b) => (totals.get(b.id) ?? 0) - (totals.get(a.id) ?? 0)),
    [teams, totals],
  );

  const displayedTeams = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...teams].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
    return q ? sorted.filter((tm) => tm.name.toLowerCase().includes(q)) : sorted;
  }, [teams, search]);


  const updateName = (id: string, name: string) =>
    setTeams((ts) =>
      ts.map((tm) => (tm.id === id ? { ...tm, name, nameEdited: true } : tm)),
    );

  const updateScore = (id: string, idx: number, raw: string) => {
    const val = raw === "" ? null : Number(raw);
    setTeams((ts) =>
      ts.map((tm) => {
        if (tm.id !== id) return tm;
        const scores = [...tm.scores];
        scores[idx] = val == null || Number.isNaN(val) ? null : val;
        return { ...tm, scores };
      }),
    );
  };

  const setDoubleRound = (id: string, idx: number) =>
    setTeams((ts) =>
      ts.map((tm) =>
        tm.id === id ? { ...tm, doubleRound: tm.doubleRound === idx ? null : idx } : tm,
      ),
    );

  const addTeam = () =>
    setTeams((ts) => [...ts, newTeam(t.defaultTeam(ts.length + 1))]);

  const removeTeam = (id: string) =>
    setTeams((ts) => (ts.length > 1 ? ts.filter((tm) => tm.id !== id) : ts));

  const resetAll = () =>
    setTeams(Array.from({ length: 6 }, (_, i) => newTeam(t.defaultTeam(i + 1))));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Pub Trivia Scorekeeper logo"
            width={1024}
            height={1024}
            className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
          />
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-foreground">
              <Beer className="h-3.5 w-3.5" />
              {t.quizNight}
            </div>
            <h1 className="text-5xl text-foreground sm:text-6xl">
              {t.titlePub} <span className="text-primary">{t.titleScorer}</span>
            </h1>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              {t.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-9 w-[160px] bg-input"
          />
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger className="h-9 w-[130px]" aria-label={t.language}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LANG_LABELS) as Lang[]).map((code) => (
                <SelectItem key={code} value={code}>{LANG_LABELS[code]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title={theme === "light" ? t.toDark : t.toLight}
            aria-label={theme === "light" ? t.toDark : t.toLight}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={resetAll}>{t.reset}</Button>
          <Button onClick={addTeam}>
            <Plus className="mr-1 h-4 w-4" /> {t.addTeam}
          </Button>
        </div>
      </header>

      {/* Team scoring cards */}
      <div className="grid gap-4">
        {displayedTeams.map((tm) => {
          const rank = ranked.findIndex((r) => r.id === tm.id);
          const total = totals.get(tm.id) ?? 0;
          const medal =
            rank === 0
              ? "text-gold"
              : rank === 1
              ? "text-silver"
              : rank === 2
              ? "text-bronze"
              : "text-muted-foreground";
          return (
            <Card key={tm.id} className="border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={"font-display text-3xl tabular-nums " + medal}>
                    #{rank + 1}
                  </span>
                  <Input
                    value={tm.nameEdited ? tm.name : ""}
                    onChange={(e) => updateName(tm.id, e.target.value)}
                    placeholder={tm.nameEdited ? t.teamName : tm.name}
                    aria-label={tm.nameEdited ? t.teamName : tm.name}
                    className="h-11 min-w-[200px] bg-input text-lg font-semibold"
                  />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.total}
                  </span>
                  <span className="font-display text-5xl tabular-nums text-foreground">
                    {total}
                  </span>
                  <button
                    onClick={() => removeTeam(tm.id)}
                    className="ml-2 rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t.removeTeam}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {tm.scores.map((s, i) => {
                  const isDouble = tm.doubleRound === i;
                  const locked = tm.doubleRound !== null && !isDouble;
                  return (
                    <div key={i} className="flex flex-col">
                      <label
                        className={
                          "mb-1.5 text-center font-display text-xs uppercase tracking-widest " +
                          (isDouble ? "text-primary" : "text-muted-foreground")
                        }
                      >
                        {t.round} {i + 1}
                      </label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s ?? ""}
                        onChange={(e) => updateScore(tm.id, i, e.target.value)}
                        placeholder="–"
                        aria-label={`${tm.name || t.unnamed} — ${t.round} ${i + 1}`}
                        className={
                          "h-12 text-center text-lg font-semibold tabular-nums transition " +
                          (isDouble
                            ? "border-primary bg-primary/5 text-primary"
                            : "bg-input")
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setDoubleRound(tm.id, i)}
                        disabled={locked}
                        title={locked ? t.x2Locked : isDouble ? t.x2Unlock : t.x2Use}
                        className={
                          "mt-1.5 inline-flex h-7 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition " +
                          (isDouble
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : locked
                            ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
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
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="font-display text-3xl">{t.leaderboard}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-toggle" className="text-xs uppercase tracking-widest text-muted-foreground">
              {ascending ? t.lowHigh : t.highLow}
            </Label>
            <Switch id="sort-toggle" checked={ascending} onCheckedChange={setAscending} />
          </div>
        </div>
        <ol className="grid gap-2">
          {(ascending ? [...ranked].reverse() : ranked).map((tm) => {
            const rankIndex = ranked.findIndex((r) => r.id === tm.id);
            const total = totals.get(tm.id) ?? 0;
            const top = rankIndex === 0 && total > 0;
            return (
              <li
                key={tm.id}
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
                      (rankIndex === 0
                        ? "text-gold"
                        : rankIndex === 1
                        ? "text-silver"
                        : rankIndex === 2
                        ? "text-bronze"
                        : "text-muted-foreground")
                    }
                  >
                    {rankIndex + 1}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {tm.name || <span className="text-muted-foreground">{t.unnamed}</span>}
                  </span>
                </div>
                <span className="font-display text-4xl tabular-nums">{total}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        <p>{t.footer}</p>
        <p className="mt-2">
          <Link to="/support" className="underline hover:text-foreground">
            Support
          </Link>
          {" · "}
          <Link to="/privacy-policy" className="underline hover:text-foreground">
            Privacy policy
          </Link>
        </p>
      </footer>
    </main>
  );
}
