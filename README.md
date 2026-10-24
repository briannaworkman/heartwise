# Heartwise

A Duolingo-style health literacy app. Bite-sized lessons help patients and families understand
medication labels, care visits, and insurance costs. Built for Hack for Humanity: Detroit.

Heartwise teaches understanding. It does not give medical advice.

## What it does

- **Three courses, each with its own path:** Medications, Care visits (teach-back, checkups and screenings,
  getting ready for a visit), and Insurance costs (the four costs, networks and limits, bills and statements).
  Conditions and Sexual health show as locked until they can be reviewed by experts.
- **Scan your own label:** take a photo of a medication label or health paperwork. Gemma 4 reads it, lists the
  key terms in plain language, and builds a short lesson from them.
- **Study this more:** after a lesson, Gemma writes personalized notes for the concepts you missed, using only
  the lesson's own reference text as its source of facts.
- **Ask Hugo:** type a question and Gemma answers in plain language from the app's lesson notes. If the notes
  do not cover it, it says so and points to a pharmacist or care team. Questions that sound like an emergency
  skip the model and show a fixed message to call 911 or 988.
- **Hugo the mascot:** an animated pixel heart that reacts to right answers, mistakes and waiting.

## How Gemma 4 is used

Open-weight Gemma 4 does the personalizing. Pre-written lessons hold the core facts.

- **Hosted (default):** `gemma-4-31b-it` through the Gemini API, with automatic retries and a fallback to
  `gemma-4-26b-a4b-it` when the API returns errors.
- **Local option:** Gemma 4 E4B through Ollama (`MODEL_BACKEND=ollama`).
- A small Node server (`server/`) keeps the API key off the browser.

## Run it

```bash
npm install
cp .env.example .env     # then add GEMINI_API_KEY (the .env file is git-ignored)
npm run server           # API server on :8787
npm run dev              # app on :5173 (second terminal)
```

You can also keep the key outside the project in `~/.secrets/gemini.env`; the server reads that too.

## Honest notes

- **Lesson content is a draft.** It was written for this demo from common definitions and has not been
  clinician-reviewed or checked line by line against MedlinePlus, openFDA, AHRQ or Healthcare.gov. The
  "Reference" line on each lesson names where concepts should be verified, not a verified citation.
- **Some demo answers are saved Gemma 4 responses.** The built-in sample label and the suggested questions on
  the Ask screen are answered from recorded real Gemma 4 output (`server/demo/`), because the hosted API can take
  a minute or more per call. The app labels these on screen. Your own photos and typed questions are answered live.
- **Hosted Gemma can be slow.** A live scan or question may take one to two minutes when the API is busy.

## Privacy

- Learning progress is stored only in your browser.
- Photos are shrunk and re-encoded in the browser (which drops location metadata), sent to the model to be
  read, and not saved. Nothing derived from your photos is written to disk by the server.
- With the hosted option, photos and typed questions go to Google's Gemini API. Use the local option to keep
  them on your computer. Cover names, addresses and ID numbers before taking a photo.

## Planned data sources

MedlinePlus (NLM) and openFDA for medication wording, AHRQ for teach-back, Healthcare.gov and CMS glossaries for
insurance terms, and HRSA's health center data to help people find care near them.

## License

MIT
