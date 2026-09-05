import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Beer, Mail, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

const SUPPORT_EMAIL = "katrinauch@gmail.com";

const feedbackSchema = z.object({
  name: z.string().trim().max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters")
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .nonempty("Please write a message")
    .max(2000, "Message must be under 2000 characters"),
});

export const Route = createFileRoute("/")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support — Pub Trivia Scorekeeper" },
      {
        name: "description",
        content:
          "Get help with Pub Trivia Scorekeeper. Send feedback, report a problem, or ask a question — we read every message.",
      },
      { property: "og:title", content: "Support — Pub Trivia Scorekeeper" },
      {
        property: "og:description",
        content:
          "Get help with Pub Trivia Scorekeeper. Send feedback, report a problem, or ask a question — we read every message.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pubtriviascorekeeper.lovable.app/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://pubtriviascorekeeper.lovable.app/" },
    ],
  }),
});

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [composed, setComposed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = feedbackSchema.safeParse({ name, email, message });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check your input");
      return;
    }
    setError(null);

    const subject = encodeURIComponent(
      `Pub Trivia Scorekeeper feedback${name ? ` from ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n—\nName: ${name || "(not provided)"}\nReply to: ${
        email || "(not provided)"
      }`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setComposed(true);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-center text-center">
        <img
          src={logo}
          alt="Pub Trivia Scorekeeper logo"
          width={1024}
          height={1024}
          className="h-24 w-24 sm:h-28 sm:w-28"
        />
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-foreground">
          <Beer className="h-3.5 w-3.5" />
          Quiz Night
        </div>
        <h1 className="mt-3 text-5xl text-foreground sm:text-6xl">
          Thanks for using{" "}
          <span className="text-primary">Pub Trivia Scorekeeper</span>
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          Found a bug, have an idea, or just want to say cheers? Send us a
          message below — we read every one.
        </p>
      </header>

      <Card className="border-border bg-card p-6 shadow-sm sm:p-8">
        {composed ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="font-display text-3xl">Your email app should be open</h2>
            <p className="max-w-md text-muted-foreground">
              We opened a pre-addressed email to {SUPPORT_EMAIL} with your
              message — just hit send. If nothing opened, you can email us
              directly at{" "}
              <a
                className="font-semibold text-primary underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
            <Button variant="outline" onClick={() => setComposed(false)}>
              Write another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
            <div className="grid gap-2">
              <Label htmlFor="support-name">Name (optional)</Label>
              <Input
                id="support-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or team name"
                maxLength={100}
                className="bg-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-email">Email (optional — for a reply)</Label>
              <Input
                id="support-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
                className="bg-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-message">Message</Label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={2000}
                rows={6}
                required
                className="flex min-h-[120px] w-full rounded-md border border-input bg-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <Send className="mr-1 h-4 w-4" /> Send feedback
            </Button>
          </form>
        )}
      </Card>

      <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Prefer email?{" "}
          <a
            className="font-semibold text-primary underline"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p>
          <Link to="/privacy-policy" className="underline hover:text-foreground">
            Privacy policy
          </Link>
        </p>
      </div>
    </main>
  );
}
