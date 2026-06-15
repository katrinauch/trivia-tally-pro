import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.pubtriviascorekeeper",
  appName: "Pub Trivia Scorekeeper",
  webDir: "dist",
  server: {
    // Hot-reload from the Lovable sandbox during development.
    // Remove the `url` (and set `cleartext: false`) before producing a
    // production build that ships the bundled web assets inside the app.
    url: "https://465734c1-8c78-4c77-9d5d-b11a0b430008.lovable.app?forceHideBadge=true",
    cleartext: true,
  },
};

export default config;
