# VRI5000 Personal English Lab — v0.4

Personal, Android-first PWA for VRI5000 Upper Intermediate English 1.

The repository is now the live development source for the app. The design is deliberately personal: it follows the VRI5000 course path while maintaining a second path for recurring weaknesses detected in the diagnostic work.

## Current build

The app currently includes:

- 10 concept families
- 401 unique exercise instances generated from finite, auditable templates
- 0 exact prompt + answer duplicates
- 20 free-transfer/self-check tasks
- 24 speaking challenges with microphone recording
- Oral Midterm Lab
- Academic Project Presentation Lab
- Unit 3 Story Lab
- Unit 4 / Written Exam Lab
- Prepare → Consolidate → Transfer packs for course milestones
- adaptive Today, Review due, Challenge me, Error Bank and mastery tracking
- local backup/import of progress
- offline PWA cache for Android

The goal is not to maximize item count. The target is enough novelty to prevent memorizing exercises while repeatedly retrieving the underlying structure.

## Core pedagogical rules

1. No exercise without correction and explanation.
2. The structure repeats before the exact successful item does.
3. Recognition is weaker evidence than guided production or free transfer.
4. A concept cannot reach maintenance/mastery through multiple choice alone.
5. Errors are grouped as recurring misconceptions rather than treated as isolated wrong answers.
6. The course curriculum and the personal weakness curriculum run simultaneously.
7. Correct-but-unsure answers are reviewed sooner.
8. Course preparation follows Prepare → Consolidate → Transfer.

## Main concept families

- Question forms
- Subject–verb agreement
- Narrative tenses
- used to / would / be used to / get used to
- Present perfect / present perfect progressive
- Conditionals and alternatives to if
- Future forms
- Verb patterns
- Dependent prepositions and collocations
- Passive voice and causative have/get

## Study modes

Today builds an adaptive session using the upcoming course milestone, due concepts, active errors and weak areas.

Learn provides concise rules and examples before practice.

Practice allows a manual choice of content and context.

Free transfer uses open prompts and model-based self-checking rather than answer recognition.

Course Path aligns study with the real semester calendar and provides Prepare, Consolidate and Transfer packs.

Speaking Studio records locally in the browser and uses target-language self-audits.

Progress separates controlled, guided and transfer evidence.

## Content integrity

GitHub Actions checks JavaScript syntax and runs scripts/validate_content.mjs. Validation fails for duplicate IDs, exact duplicate prompt+answer pairs, missing answers/models, missing explanations, invalid concept links, malformed MCQs, missing free-transfer coverage, or inconsistent schedule references.

## Run locally

Run: python -m http.server 8080

Then open http://localhost:8080.

## Android / PWA

Once GitHub Pages is enabled for the repository:

1. Open the published site in Chrome on Android.
2. Open Chrome's menu.
3. Choose Install app or Add to Home screen.
4. The service worker caches the core app for offline study.

## Privacy

Progress remains in browser local storage. Audio recordings are held as temporary browser blobs for playback and are not uploaded by this prototype.

## Next development block

- expand the unique corpus toward roughly 500–700 high-quality items, without exact repetition;
- strengthen Question Forms, Narrative Tenses, Conditionals and dependent prepositions;
- add an integrated Unit 3 / Short Story Lab;
- expand the Academic Project Presentation Lab with hedging, signposting, Q&A and reformulation;
- build the Unit 4 / Written Exam Lab;
- continue calibrating speaking self-audits as explicit transfer evidence;
- add richer session-history analytics while keeping the interface small.
