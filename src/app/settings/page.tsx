"use client";

import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";

type HealthState =
  | { status: "loading" }
  | { status: "ok" }
  | { status: "error"; errors: string[] };

type ConfigState = {
  llmProvider: string;
  sttProvider: string;
  ttsProvider: string;
  ollamaBaseUrl: string;
  lmstudioBaseUrl: string;
};

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [config, setConfig] = useState<ConfigState | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [healthRes, configRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/config"),
        ]);

        if (healthRes.ok) {
          setHealth({ status: "ok" });
        } else {
          const body = await healthRes.json();
          setHealth({ status: "error", errors: body.errors ?? [] });
        }

        if (configRes.ok) {
          const body = await configRes.json();
          setConfig(body);
        }
      } catch (error) {
        setHealth({
          status: "error",
          errors: ["Unable to reach the health endpoint."],
        });
      }
    };

    load();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Provider Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure providers via environment variables. This page validates
            your setup and shows the active selections.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Health status</h2>
          {health.status === "loading" && (
            <p className="mt-3 text-sm text-muted-foreground">Checking…</p>
          )}
          {health.status === "ok" && (
            <p className="mt-3 text-sm text-emerald-600">
              All providers are configured correctly.
            </p>
          )}
          {health.status === "error" && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-600">
                One or more providers are misconfigured:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-500">
                {health.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Active providers</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">LLM</dt>
                <dd className="font-medium">
                  {config?.llmProvider ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">STT</dt>
                <dd className="font-medium">
                  {config?.sttProvider ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">TTS</dt>
                <dd className="font-medium">
                  {config?.ttsProvider ?? "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Local endpoints</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Ollama</dt>
                <dd className="font-medium">
                  {config?.ollamaBaseUrl ?? "http://localhost:11434"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">LM Studio</dt>
                <dd className="font-medium">
                  {config?.lmstudioBaseUrl ?? "http://localhost:1234"}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
