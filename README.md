# Heartwise

A Duolingo-style health literacy app. Bite-sized lessons help patients and families understand
medication labels, paperwork words, and what to ask their care team. Built for Hack for Humanity: Detroit.

Heartwise teaches understanding. It does not give medical advice.

## Run it

```bash
npm install
npm run dev
```

## Planned model setup

Open-weight Gemma 4 does the personalizing: reading a photo of a label, building a lesson from it, and
writing "study this more" notes. Core facts come from pre-written lessons, not the model.

- Hosted: Gemma 4 through the Gemini API (set `GEMINI_API_KEY` in a private `.env`).
- Local: Gemma 4 E4B through Ollama for a fully on-device option.

## Content sources

Draft lessons are written for this demo and have not been clinician-reviewed. Planned sources: MedlinePlus
(National Library of Medicine) and openFDA drug labels.

## Privacy

Progress is stored only in your browser. Photos are not stored.

## License

MIT
