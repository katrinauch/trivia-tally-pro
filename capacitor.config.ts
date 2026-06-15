import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.pubtriviascorekeeper",
  appName: "Pub Trivia Scorekeeper",
  // Static SPA bundle output by `bun run build:spa`.
  // Run `npx cap sync` after each build to copy dist-spa/ into the native projects.
  webDir: "dist-spa",
};

export default config;
