<<<<<<< HEAD
# MiniAGIQuizWeb
=======
# Mini AGI Quiz (Web, Vercel)

Beautiful, responsive quiz UI that asks 5 MCQs on AI ethics & Sentient projects.
Questions are fetched from a serverless function that calls the Dobby model on FireworksAI, with an offline fallback.

## Project Structure
- `index.html` – UI
- `styles.css` – styling (glass / gradient aesthetic)
- `script.js` – quiz logic (flow, scoring, suggestions)
- `api/question.js` – Vercel Serverless Function that:
  - Calls Fireworks Dobby 70B (`/inference/v1/completions`)
  - Parses MCQ
  - Falls back to built-in questions if key/API fails

## Run Locally (simple)
You can open `index.html` directly, but the quiz will use fallback questions (no API key).
To test the API route locally, use Vercel CLI or any Node server that can host the `api/` function.

## Deploy to Vercel (recommended)
1. Create a new GitHub repo and push this folder's contents.
2. In Vercel dashboard: New Project → Import your repo.
3. Root directory: the repo root (contains `index.html` and `api/`).
4. Environment Variables → Add:
   - `FIREWORKS_API_KEY = YOUR_REAL_KEY`
5. Deploy. Your app will be live at `https://<project>.vercel.app/`.

### Alternative: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# accept defaults; then set env var:
vercel env add FIREWORKS_API_KEY
vercel --prod
```

## Notes
- Works without a key using fallbacks.
- With a key, `/api/question` returns dynamic MCQs from Dobby.
- Keep your key secret; never expose it in client code.

## Customize
- Update colors and layout in `styles.css`.
- Adjust topics / suggestions in `script.js`.
- Add more robust prompt/validation in `api/question.js` if needed.
>>>>>>> 44efb61 (Initial commit: Mini AGI Quiz Web)
