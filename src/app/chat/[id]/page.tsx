import Link from "next/link";
import { AppShell } from "@/components/app-shell";

type ChatSessionPageProps = {
  params: { id: string };
};

export default function ChatSessionPage({ params }: ChatSessionPageProps) {
  return (
    <AppShell>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Session
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Chat session</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Session ID: <span className="font-semibold">{params.id}</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          This will become the AI conversation workspace once chat is wired up.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/home"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Back to home
          </Link>
          <Link
            href="/onboarding/language"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Restart onboarding
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
