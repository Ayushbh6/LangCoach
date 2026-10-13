# Vocabulary provenance and coverage

Reference date: 13 October 2026. The app currently stores 810 vocabulary entries (523 A1, 184 A2, 103 B1 teaching-band entries) and 40 original case prompts. Stable IDs are used for scheduling; level labels do not certify proficiency or exhaustive exam coverage.

## Primary references

| Reference | Official source | Local reference SHA-256 |
| --- | --- | --- |
| Goethe A1 Start Deutsch 1 | https://www.goethe.de/pro/relaunch/prf/sr/A1_SD1_Wortliste_02.pdf | `45fb648bc0ac02338f7898cae065953e320ab72ed0c14e13e0deffe6f1c5d64e` |
| Goethe-Zertifikat A2 | https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_A2_Wortliste.pdf | `76cebc5fa7356fb1fb0f0bf964ad204e59a3e79753e7bad8cf3e4f0b38c352b7` |
| Goethe-Zertifikat B1 | https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_B1_Wortliste.pdf | `8860f7f0c916831b2365f66239a3ceba3be81ddba28e1224846ca8420807fe42` |
| IDS grammis: cases | https://grammis.ids-mannheim.de/progr@mm/6915 | Linked grammar reference |

Downloaded PDFs and extracted reference text remain in ignored `.sites-runtime/`. They are not published in the app or repository. English glosses, explanations and practice examples are our teaching material; this is not an official Goethe deck. The official PDFs remain available via links in the library and on card backs.

## Stored content

- `data/vocabulary.ts` retains the original stable vocabulary IDs and four legacy-only entries outside the study selection.
- `data/vocabulary-sources.ts` records existing IDs matched against the A1 headword column. Matching uses exact headword text after normalising the optional reflexive marker. This is a classification aid, not a complete extraction of the list.
- `data/a1-foundations.ts` adds 210 new entries selected while consulting the A1 reference, with original concise glosses and grammatical notes.
- A2/B1 labels retain existing teaching bands. A linked reference does not imply every sense or form on an app card appears verbatim in that source.
- `data/cases.ts` contains 40 original case exercises. `lib/learning/flashcards.ts` supplies definite-article noun paradigms, plural forms and present-tense verb paradigms, including explicit exceptions.

## Coverage boundary

Full official-list coverage is **not complete**. The current bank is a usable selection across levels, not all A1–B1 headwords, compound variants, senses or inflected forms. Future additions need source matching, original glosses, language review, stable IDs and duplicate checks before becoming study cards. Do not enrol the entire bank at once: new scheduled cards remain capped by the learner's daily setting.

Case tables are reference material on the back. Retrieval of a word's meaning does not prove case production. Case prompts and checked scenario tasks provide separate practice; self-ratings stay distinct from independently checked evidence.
