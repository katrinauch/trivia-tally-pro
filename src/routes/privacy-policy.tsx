import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Pub Trivia Scorekeeper" },
      { name: "description", content: "Privacy policy for Pub Trivia Scorekeeper. We collect no personal data; all scores are stored locally on your device." },
      { property: "og:title", content: "Privacy Policy — Pub Trivia Scorekeeper" },
      { property: "og:description", content: "Privacy policy for Pub Trivia Scorekeeper. We collect no personal data; all scores are stored locally on your device." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trivia-tally-pro.lovable.app/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://trivia-tally-pro.lovable.app/privacy-policy" }],
  }),
});

function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        ← Back to scorekeeper
      </Link>
      <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: August 9, 2026</p>

      <div className="mt-8 space-y-6 text-foreground/90">
        <section>
          <h2 className="font-display text-xl text-foreground">Overview</h2>
          <p className="mt-2 leading-relaxed">
            Pub Trivia Scorekeeper is a scoring tool for pub trivia games. We are committed to
            protecting your privacy. This policy explains what information the app collects and
            how it is used.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Information We Collect</h2>
          <p className="mt-2 leading-relaxed">
            <strong>We do not collect any personal data.</strong> The app does not require an
            account, does not track your location, and does not transmit any scores or team
            information to any server.
          </p>
          <p className="mt-2 leading-relaxed">
            All data you enter — team names, round scores, and your double-points selections — is
            stored{" "}
            <strong>
              locally on your device (in your browser's local storage or on-device app storage).
            </strong>{" "}
            Nothing is sent to us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">How Your Data Is Used</h2>
          <p className="mt-2 leading-relaxed">
            Because we receive no data from you, we do not use, share, or sell any personal
            information. Your preferences (such as language and light/dark mode) are also stored
            locally and never leave your device.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Data Retention &amp; Deletion</h2>
          <p className="mt-2 leading-relaxed">
            Your scores remain on your device until you remove them. You can clear all scores at
            any time using the <em>Reset</em> button in the app, or by clearing the app's local
            data through your device settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Third-Party Services</h2>
          <p className="mt-2 leading-relaxed">
            The app does not integrate with any third-party analytics, advertising, or tracking
            services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Children's Privacy</h2>
          <p className="mt-2 leading-relaxed">
            Because we collect no data, this app is safe for users of all ages, including
            children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Contact</h2>
          <p className="mt-2 leading-relaxed">
            If you have any questions about this policy, you can contact the developer at the
            email address associated with your App Store account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Changes to This Policy</h2>
          <p className="mt-2 leading-relaxed">
            We may update this policy from time to time. Any changes will be reflected on this
            page with an updated effective date.
          </p>
        </section>
      </div>
    </main>
  );
}
