/**
 * Seed script for development database
 * Run with: npx tsx src/lib/db/seed.ts
 */

import { db } from "./index";
import { users, plans, sessions, errorJournalEntries, vocabEntries, checkpoints } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const [demoUser] = await db
    .insert(users)
    .values({
      displayName: "Demo User",
      targetLanguage: "de",
      nativeLanguage: "en",
      selfAssessedLevel: "A2",
      currentLevel: "A2",
      goalDomain: "daily_life",
      targetDays: 30,
      minutesPerDay: 30,
      daysPerWeek: 5,
      preferredMode: "voice",
      onboardingComplete: true,
      baselineCaptured: true,
    })
    .returning();

  console.log(`✅ Created user: ${demoUser.id}`);

  // Create a demo plan
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);

  const [demoPlan] = await db
    .insert(plans)
    .values({
      userId: demoUser.id,
      language: "de",
      startLevel: "A2",
      targetLevel: "B1",
      startDate: today.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      totalDays: 30,
      currentCycleNumber: 1,
      currentCycleStartDate: today.toISOString().split("T")[0],
      focusErrors: JSON.stringify(["article_gender", "verb_conjugation"]),
      scaffoldingLevel: 3,
      reviewRatio: 0.3,
      status: "active",
    })
    .returning();

  console.log(`✅ Created plan: ${demoPlan.id}`);

  // Create a demo session
  const [demoSession] = await db
    .insert(sessions)
    .values({
      userId: demoUser.id,
      planId: demoPlan.id,
      sessionType: "regular",
      scenarioId: "ordering_coffee",
      scenarioVariant: "A2",
      mode: "voice",
      startedAt: today.toISOString(),
      completedAt: today.toISOString(),
      durationMinutes: 32,
      speakingTimeSeconds: 420,
      transcript: "Demo transcript of the session...",
      fluencyScore: 0.72,
      accuracyScore: 0.68,
      comprehensibilityScore: 4,
      taskSuccessScore: 4,
      replayScore: 0.71,
      correctionsCount: 3,
      redoAttempted: true,
      redoSuccessful: true,
      status: "completed",
    })
    .returning();

  console.log(`✅ Created session: ${demoSession.id}`);

  // Create demo error journal entries
  await db.insert(errorJournalEntries).values([
    {
      userId: demoUser.id,
      sessionId: demoSession.id,
      errorType: "article",
      subtype: "article_gender",
      exampleWrong: "der Milch",
      correctedVersion: "die Milch",
      ruleHint: "Milch is feminine in German, so it uses 'die'",
      context: "Ordering coffee",
      language: "de",
      recurrenceCount: 3,
      masteryScore: 0.3,
      drillTemplates: JSON.stringify([
        "Fill in: ___ Milch ist frisch.",
        "Choose: der/die/das Milch",
      ]),
      priorityWeight: 1.5,
    },
    {
      userId: demoUser.id,
      sessionId: demoSession.id,
      errorType: "grammar",
      subtype: "verb_conjugation",
      exampleWrong: "Ich möchte bestelle einen Kaffee",
      correctedVersion: "Ich möchte einen Kaffee bestellen",
      ruleHint: "With modal verbs (möchte), the main verb goes to the end in infinitive form",
      context: "Ordering coffee",
      language: "de",
      recurrenceCount: 2,
      masteryScore: 0.4,
      drillTemplates: JSON.stringify([
        "Reorder: möchte / ich / bestellen / Kaffee / einen",
        "Complete: Ich möchte ___ (buy a bread)",
      ]),
      priorityWeight: 1.3,
    },
  ]);

  console.log("✅ Created error journal entries");

  // Create demo vocab entries
  await db.insert(vocabEntries).values([
    {
      userId: demoUser.id,
      sessionId: demoSession.id,
      term: "die Milch",
      translation: "the milk",
      language: "de",
      usageStatus: "correct",
      exampleSentence: "Ich möchte die Milch, bitte.",
      scenarioId: "ordering_coffee",
      cefrLevel: "A1",
      correctUseCount: 2,
      partOfSpeech: "noun",
    },
    {
      userId: demoUser.id,
      sessionId: demoSession.id,
      term: "bestellen",
      translation: "to order",
      language: "de",
      usageStatus: "misused",
      exampleSentence: "Ich möchte einen Kaffee bestellen.",
      scenarioId: "ordering_coffee",
      cefrLevel: "A2",
      correctUseCount: 1,
      incorrectUseCount: 1,
      partOfSpeech: "verb",
      priorityReview: true,
    },
  ]);

  console.log("✅ Created vocab entries");

  // Create demo baseline checkpoint
  await db.insert(checkpoints).values({
    userId: demoUser.id,
    planId: demoPlan.id,
    sessionId: demoSession.id,
    checkpointType: "baseline",
    dayNumber: 1,
    speakingPromptId: "baseline_speaking_a2",
    writingPromptId: "baseline_writing_a2",
    speakingTranscript: "Demo baseline speaking transcript...",
    writingResponse: "Demo baseline writing response...",
    fluencyScore: 0.65,
    accuracyScore: 0.60,
    comprehensibilityScore: 3.5,
    taskSuccessScore: 3.5,
    replayScore: 0.62,
    improvements: JSON.stringify([]),
    focusAreas: JSON.stringify(["article_gender", "verb_position", "case_endings"]),
    completedAt: today.toISOString(),
  });

  console.log("✅ Created baseline checkpoint");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📊 Database location: ./data/langcoach.db`);
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
