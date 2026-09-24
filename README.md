# VRI5000 Personal English Lab — v0.3

Android-first, installable PWA for personalized VRI5000 study.

## What changed in v0.3
- 709 **unique** exercises across 10 concept families.
- 40 speaking prompts, including a 16-prompt Oral Midterm bank.
- New exercise formats: sentence builder, contrast sets and visual timeline tasks.
- More production-heavy corpus: transformations, corrections and free-transfer self-checks expanded substantially.
- Distractor-specific feedback supported through `optionFeedback`.
- Course Path now offers **Prepare / Consolidate / Transfer test** packs for the next milestone.
- Dedicated **Oral Midterm Lab** with skill map, five-day route, targeted drills, speaking prompts and full rehearsal.
- Exact successful items are scheduled for much later review; concept review normally prefers a new item testing the same structure.
- Maintenance/mastery now requires free-transfer evidence rather than recognition alone.
- Speaking attempts store target-coverage self-audits.
- Exam simulators produce a target-coverage audit and can generate a post-simulator repair set.
- Session audits can be exported as JSON.
- v0.2 local progress is migrated automatically.

## Current corpus
- 709 exercises
- 301 multiple choice
- 128 error corrections
- 89 transformations
- 60 contrast sets
- 50 sentence builders
- 30 timeline tasks
- 51 free-production self-checks
- 40 speaking prompts

The corpus remains intentionally finite and auditable. The objective is novelty and transfer, not artificial scale.

## Core design principles
1. No exercise without a correction and explanation.
2. Structures repeat; exact successful items rarely do.
3. Novel near-transfer items are preferred for routine review.
4. Recognition is weaker evidence than guided or free production.
5. The VRI5000 course path and the personal weakness path run in parallel.
6. Recurring misconceptions matter more than isolated slips.
7. Course preparation has three phases: Prepare → Consolidate → Transfer.
8. The interface stays small even when the corpus grows.

## Run locally
Service workers require HTTP(S):
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.

## Android
Once hosted over HTTPS (for example GitHub Pages), open the site in Chrome and choose **Add to Home screen / Install app**.

## Validation
```bash
python scripts/validate_content.py
python scripts/build_manifest.py
```
The validator fails on duplicate IDs, exact duplicate exercises, missing answers/explanations, invalid concept links, broken choice tasks, builder tasks without tokens, and timeline tasks without timeline points.

## Privacy
Progress is stored locally in the browser. Speaking recordings are played from an in-memory browser blob and are not uploaded by this prototype.
