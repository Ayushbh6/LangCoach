import { AppShell } from "@/components/app-shell";

export default function Home() {
  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Phase 0</p>
          <h3 className="mt-2 text-xl font-semibold">Project setup</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Providers, Docker, and UI scaffolding are being wired up.
          </p>
          <a
            className="mt-4 inline-flex text-sm font-medium text-primary"
            href="/settings"
          >
            Open settings →
          </a>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Next up</p>
          <h3 className="mt-2 text-xl font-semibold">BYOK configuration</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Choose your LLM, STT, and TTS providers and verify connectivity.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Quick check</p>
          <h3 className="mt-2 text-xl font-semibold">Health endpoint</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Visit /api/health to validate provider configuration.
          </p>
          <a
            className="mt-4 inline-flex text-sm font-medium text-primary"
            href="/api/health"
          >
            View health →
          </a>
        </div>
      </section>
      <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Today&apos;s focus</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll finish Phase 0 by adding Docker docs and a starter settings page.
        </p>
      </section>
    </AppShell>
  );
}
