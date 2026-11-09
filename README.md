# Happy Birthday 🎂

A personal, one-page birthday website. Pink & white, mobile-first, no build step — plain HTML/CSS/JS.

## Run it

Just open `index.html` in a browser — or serve the folder for a nicer experience:

```
npx serve .
# or
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Personalize it (3 quick edits)

Everything you need to change lives in two places:

### 1. `script.js` — top of the file

- **Spotify playlist** — set `SPOTIFY_PLAYLIST_ID` to the ID at the end of your
  playlist link (`open.spotify.com/playlist/`**`THIS_PART`**). Leave it empty
  and a soft placeholder shows instead.
- **Background song** — "Hey There Delilah" plays from
  `public/audio/hey-there-delilah.mp3` via the floating ♪ pill
  (bottom-right). It starts when she taps "Open Your Surprise"
  and keeps playing while she scrolls. To swap the song, replace
  the MP3 and update `AUDIO_SRC` in `script.js` if the filename changes.

### 2. `images/` folder

- `images/letter.jpg` — the handwritten letter photo she sent you.
  (Any common format works; just keep the filename.)

## Sections

Welcome screen → Birthday message → *Beyond Undefined* (our story) →
*A Letter I Still Keep* → Music → Little surprise → Finale.

## Deploy

Drag the folder onto [Netlify Drop](https://app.netlify.com/drop),
[Vercel](https://vercel.com), or push it to a free GitHub Pages repo.
She'll get a link she can open anywhere — phone included.
