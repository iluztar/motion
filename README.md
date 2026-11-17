# Iluztar Motion Reel

An interactive intro reel for **Iluztar**, a creative studio from Bandar Lampung, Indonesia (since 2023).
The reel is a web page: a ~71-second animation built entirely with HTML, CSS and [GSAP](https://gsap.com), with no video file.

🌐 **Live:** https://iluztar.github.io/motion/ · 🏠 Other projects: [iluztar.github.io](https://iluztar.github.io) · 📷 [@iluztar](https://instagram.com/iluztar) · 🔗 iluztar.com

> **About this project.** Built by an artist at Iluztar Studio as part of an undergraduate thesis in Informatics
> (IIB Darmajaya). An English explainer video was first made by hand in Alight Motion (voice-over by ElevenLabs).
> Its frames were then studied and rebuilt as GSAP code with help from Claude AI, and every round of changes was
> reviewed by the studio owner before it was merged (human-in-the-loop).
> This repository also keeps the assets, raw test data, test scripts and anonymised thesis appendices.

🎬 **Breakdown video** (how the Alight Motion original was built, vertical):
[YouTube Shorts](https://youtube.com/shorts/J43gorGcBds) · [Instagram](https://www.instagram.com/p/DfjVKTWik64/) · [Facebook Reel](https://www.facebook.com/reel/1141954055258448)

---

## Contents

- [Repository layout](#repository-layout)
- [Why code instead of an embedded video](#why-code-instead-of-an-embedded-video)
- [Features](#features)
- [Watching](#watching)
- [Scenes](#scenes)
- [Clickable elements](#clickable-elements)
- [Running locally](#running-locally)
- [How the animation is built](#how-the-animation-is-built)
- [Editing](#editing)
- [Server version and admin](#server-version-and-admin)
- [Development history](#development-history)
- [Test results](#test-results)
- [Re-running the tests](#re-running-the-tests)
- [Privacy of the appendix data](#privacy-of-the-appendix-data)
- [Roadmap](#roadmap)
- [Credits](#credits)

## Repository layout

```
motion/
├── index.html, config.js        # the reel (scenes, CSS, built-in images, GSAP timeline)
├── MOTION_PLAN.md               # first visual review and improvement plan
├── favicon.*, apple-touch-icon.png
├── aset/
│   ├── video/                   # 540p copy of the reference explainer video
│   ├── audio/                   # final voice-over (71 s, 40 s) and the mixed soundtracks the reel plays (Soundtrack_71s, Soundtrack_30s)
│   ├── gambar/                  # artwork, logo and icons used in the Alight Motion project
│   └── voiceover/               # script + every ElevenLabs voice test
└── skripsi/
    ├── lampiran/                # thesis appendices 2–5 (PDF + DOCX, anonymised)
    ├── data-pengukuran/         # raw JSON results + Lighthouse reports
    ├── skrip-pengujian/         # Playwright scripts used for the measurements
    └── riwayat-iterasi.md       # export of the 25 merged pull requests and all commits
```

Background music and sound effects are not included as separate files because their third-party licences (Pixabay,
MusicGPT, Alight Motion library) do not allow redistribution as loose files. They are only present inside finished
mixes (the explainer video and the two soundtracks the reel plays when no audio slot is uploaded). The original 2560×1440 export (~68 MB) is also
left out to keep the repository light; the 540p copy is enough for frame comparison.

## Why code instead of an embedded video

Browsers only autoplay embedded video (an MP4 file or a YouTube player) when it is muted, so a promo that relies on
narration loses its message until the visitor clicks the sound icon. The studio's earlier site had exactly this
problem, and some survey respondents mentioned it. A code-based reel avoids it:

- on the homepage it starts only after the visitor presses **Open website**, so picture and narration begin together from second 0;
- the narration is also on screen as animated text, so the message works without sound;
- the visual part transfers 588 KB (1,122 KB with the short soundtrack, 1,777 KB with the full one), smaller than the
  1080p and 1440p comparison videos; text and vector shapes stay sharp at any resolution (raster artwork uses 480 px / 1,400 px WebP);
- it adapts to the screen: a 1600×900 stage scaled by `fit()`, with a separate phone layout;
- the narration is real HTML text in the reel document, and the elements are clickable.

Trade-offs measured in the thesis: estimated Total Blocking Time is still above 200 ms on most profiles, and the narration
lives in the reel document loaded through an iframe, not in the homepage HTML (indexing was not tested).

## Features

- **Two ways to watch, one timeline:** *Scroll* mode (default, scrubbed by scroll with Lenis smoothing) and *Play* mode (full screen, player controls).
- **Two cuts:** *Full* (~71 s, 8 scenes) and *Cut* (~30 s), each with its own soundtrack slot.
- **Intro mode** (`?intro=1`) for the homepage opening animation.
- **Play scene** button, **light/dark theme** (`T`, remembered, View Transitions wipe).
- **Single file:** code, styles and built-in images live in `index.html`.

## Watching

| Action | How |
|---|---|
| Watch while scrolling | Open the page and scroll |
| Play as a video | **Play** in the bottom bar (pick *Full · 71s* or *Cut · 30s*) |
| Play from the current scene | **▶ Play scene**, top right |

Keys in Play mode: `Space` play/pause · `→`/`←` next/previous scene · `H` hide controls · `Esc` back to scroll mode · `T` theme.

### Intro mode (`?intro=1`)

Used as the opening animation of the Iluztar homepage. The page loads the reel in an iframe and the reel reports
`postMessage({ iluztarReel: 'siap' | 'selesai' })`. In the tested version (iluztar.com 0.14.5, reel `ab8bca2`, 10 Nov 2026)
the overlay showed once per session: a loader, then **Open website**, which starts the ~32-second cut together with its
soundtrack; **Sound**, **Watch full reel** and **Skip intro**/`Esc` were available, `prefers-reduced-motion` and `?intro=0`
skip it, and a 10-second safety closes the overlay if the reel cannot load. Since 12 Nov 2026 the gate appears only on the
first visit, the button is labelled **Close**, a **Pause/Play** control was added, and the reel is loaded from
iluztar.com/dev/motion instead of GitHub Pages.

## Scenes

| # | Scene | Starts | Content |
|---|---|---|---|
| 01 | Intro | 0:00 | "This is Iluztar" → artwork gallery → Bandar Lampung → artist network → "Since 2023" calendar |
| 02 | The problem | 0:11 | Chat bubble → deadline timer → unfinished sketches → "Plate.file" |
| 03 | We got you | 0:20 | "We got you." |
| 04 | Services | 0:21 | *Full-Commission* and *Pair of Hands* cards → Sketch / Line-art / Base Color |
| 05 | Same care | 0:30 | *Big Project* vs *Single Task* → Care, Precision, Attention to detail |
| 06 | You & we | 0:39 | Files merge into a "Refine" toggle → "I want a Website!" becomes a site |
| 07 | Ownership | 0:49 | Wavy arrow → "Your Ownership" |
| 08 | Let's talk | 0:58 | CTA chat → Instagram profile → iluztar.com → closing logo |

The *Cut* plays scenes 1–3 and then jumps to scene 8.

## Clickable elements

Artwork opens in a lightbox (the film pauses); "Bandar Lampung" opens Maps; service cards let you tick stages and
**Order** sends them via WhatsApp (or email / Instagram DM); profile, **Follow**, **Message** and **Contact** go to
Instagram or WhatsApp; the closing logo replays the film. Targets are set through `data-link` and the contact settings.

## Running locally

```bash
git clone https://github.com/iluztar/motion.git
cd motion
python3 -m http.server 8000      # or: npx serve .
```

Open http://localhost:8000 (add `?intro=1` for intro mode). GSAP, Lenis and DM Sans load from a CDN.
Without the server API (`api/motion.php`), the reel uses its built-in images, text and contacts.

## How the animation is built

- **One timeline, two drivers.** `build()` creates a single `gsap.timeline`; Play mode runs it on a clock (or `audio.currentTime`), Scroll mode scrubs it with ScrollTrigger at 280 px per second.
- **Fixed stage, dynamic scale.** Everything is positioned on a 1600×900 stage; `fit()` sets the CSS variable `--s`.
- **Motion language** (`E` tokens): quick entrances that stop cleanly (`power3.out`), `power2.inOut` moves, a slow camera drift and match cuts. No bounce.
- **On the beat.** Slow moves step on the reference soundtrack's beats (`BEATS`, from spectral-flux onsets) via `bE()`.
- **Helpers:** `scene()`, `show()`, `typeWords()`, `typeChars()`, `bg()`. Tweens use `immediateRender` so nothing flashes in its end state.

GSAP 3.12.5 · ScrollTrigger 3.12.5 · Lenis 1.1.13 · DM Sans.

## Editing

Edit text directly in the scene HTML (`.type` splits by word, `.tw` by letter). Timings are absolute seconds in
`S1()`–`S8()`; if a scene changes length, also update `SCENE_T`, `sceneStart.full`, the `.tag` labels and `end` in `build()`.
Debug from the console with `__reel.time()` and `__reel.seek(42.5)`.

## Server version and admin

On the Iluztar server the reel reads its data from MySQL through `api/motion.php` (public, read-only) and is edited in
**Iluztar Admin › Motion Reel**: contacts, profile card, media slots (portfolio pick or upload) and Instagram counts
(fetched server-side; the token never reaches the browser). Slot `AUDIO` is used by the Full cut and `AUDIO_CUT` by the
Cut; an empty slot plays silently. The earlier Supabase admin is no longer used.

## Development history

On 29 Sep 2026 the reel went through **25 pull requests** (34 commits), merged between 00:25 and 10:02 WIB, each after
review by the studio owner. That work happened in `iluztar/iluztar.github.io`, which was later recreated without history
to remove old data; since 8 Nov 2026 the reel has its own repository. The full list of PRs and commits was exported first
to [`skripsi/riwayat-iterasi.md`](skripsi/riwayat-iterasi.md).

| Round | PRs | Focus |
|---|---|---|
| 1 | first upload, #1 | Visual review of ~25 key frames ([MOTION_PLAN.md](MOTION_PLAN.md)); easing, rhythm, cut direction, logo |
| 2 | #2–#3 | Timeline rebuilt to follow the reference cut; beat-stepped moves; gradient; themes; phone legibility |
| 3 | #4–#8 | Interactive cards, real service lists, smoother motion, gaps between shots closed |
| 4 | #3, #4, #10, #11, #13, then server move | Admin with login and account limits; later moved to PHP + MySQL |
| 5 | #12–#25 | Per-scene polish: typed chat, folders, website mock, toggle, ownership arrow, network hop, scroll cue, Instagram card, image pre-decode, Cut soundtrack |
| 6 | intro commit (8 Nov) | `?intro=1` homepage opening animation |

The thesis groups the whole history into 12 iterations (9 up to the tested version, 3 after publication); see Table 4.9 and Appendix 10 of the thesis.

## Test results

**Main thesis tests: 10 Nov 2026**, iluztar.com 0.14.5 + reel commit `ab8bca2`, local server (XAMPP), Microsoft Edge 157
for performance, Chromium 153 and Edge 157 for functional tests. Raw data: [`skripsi/data-pengukuran/`](skripsi/data-pengukuran).

| Page (mean of 5, cold cache) | FCP | LCP | CLS* | TBT (estimate)** | Transfer |
|---|---|---|---|---|---|
| Reel, full (desktop / phone) | 0.80 / 1.36 s | 1.98 / 2.66 s | 0.003 / 0.002 | 493 / 797 ms | 1,886 / 1,891 KB |
| Reel, intro cut (desktop / phone) | 0.49 / 1.20 s | 0.49 / 1.20 s | 0.000 / 0.001 | 145 / 851 ms | 1,235 / 1,235 KB |
| Homepage with intro (desktop / phone) | 0.59 / 1.17 s | 1.88 / 1.17 s | 0.030 / 0.004 | 565 / 1,324 ms | 3,097 / 2,101 KB |
| Homepage without intro (desktop / phone) | 0.42 / 1.20 s | 1.55 / 1.26 s | 0.013 / 0.006 | 264 / 560 ms | 1,863 / 867 KB |

Phone profile: 390×844, CPU 4× slower, 4G-like network (150 ms, 9 / 1.5 Mbps). Desktop: 1440×810, no throttling.
\* Sum of all layout shifts without recent input (always ≥ standard session-window CLS).
\*\* Long tasks from navigation start until 3 s after load (or after the Open website button appears); not identical to Lighthouse TBT.

All 14 functional scenarios passed in Chromium and Edge with no CSP violations or console errors
([`data_uji_intro.json`](skripsi/data-pengukuran/data_uji_intro.json), [`data_uji_intro_edge.json`](skripsi/data-pengukuran/data_uji_intro_edge.json));
scenario 11 passes if the overlay closes by itself within 16 s of navigation. Lighthouse on the public reel: Accessibility,
Best Practices and SEO 100; the homepage scored Best Practices 96 because of one missing stylesheet, fixed in 0.14.7.
With JavaScript off, the reel HTML still carries 311 words, including all scene narration.

Earlier development measurements from 8 Nov 2026 are kept in
[`skripsi/data-pengukuran/awal-2026-11-08/`](skripsi/data-pengukuran/awal-2026-11-08) and are **not** used for the thesis conclusions.
Later versions (after 10 Nov) have not been re-measured with this procedure.

## Re-running the tests

Scripts in [`skripsi/skrip-pengujian/`](skripsi/skrip-pengujian) use Node.js and `playwright-core` 1.47:
`perf2.mjs` (Web Vitals and transfer per file type, 5 runs per profile, Microsoft Edge; `node perf2.mjs lokal` or `live`),
`uji-intro2.mjs` (the 14 intro scenarios; set the browser path for Chromium or Edge), and `banding_situs.mjs`
(SEO fields from raw HTML, old vs new homepage). Scripts used for the 8 Nov measurements are in `awal-2026-11-08/`.

```bash
npm i playwright-core@1.47
node skripsi/skrip-pengujian/perf2.mjs lokal
node skripsi/skrip-pengujian/uji-intro2.mjs
```

The URL and browser-path constants at the top of each script point to the author's machine; change them first.

## Privacy of the appendix data

Names, social-media handles and timestamps were removed from the files in `skripsi/lampiran/`. Respondents are coded
KK-01–KK-04 (clients) and RS-01–RS-21 (fellow artists), the studio owner is P-01, and the client school name is masked.

## Roadmap

- Move built-in images to separate AVIF/WebP files and load them lazily
- Add an `<h1>`, the right `lang`, and JSON-LD
- Audience test for the new explainer video
- 9:16 and 1:1 versions and an MP4 export

## Credits

© 2023–2026 **Iluztar**. All artwork, logos and visual identity belong to Iluztar.
Voice-over generated with [ElevenLabs](https://elevenlabs.io); explainer video made in Alight Motion.
No open-source licence is granted; reuse of the assets needs permission from Iluztar.

*Let's shine together through art.* ✦
