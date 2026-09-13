# Arcadeus

A free, static browser-game hub: search, category filters, thumbnail cards, and a click-to-play modal — built to run straight from GitHub Pages, no backend required.

**Live demo layout:** `index.html` + `style.css` + `script.js`, plus a `games/` folder with a few original mini-games (Snake, Tic-Tac-Toe, Memory Match, Meteor Dodge) that run 100% locally.

## Why not Retro Bowl / Subway Surfers / etc.?

Those are commercial games owned by other studios. Embedding an unauthorized copy of someone else's paid game is a copyright problem — for the game's owner and for you as the person publishing the repo. This project only links to:

1. Games that are free and openly embeddable (2048, Cookie Clicker, the Chrome Dino game, Minesweeper, the Google Pac-Man doodle), and
2. Original games written from scratch for this project.

If you want more games, look for ones with an official "embed" option (many itch.io games support this) or write your own — see below.

## Adding a game

Open `script.js` and add an entry to the `GAMES` array:

```js
{
  id: "my-game",
  name: "My Game",
  cat: "arcade",       // arcade | puzzle | action | runner | strategy
  url: "https://example.com/my-game/",
  emoji: "🎮",
  from: "#7c5cff",      // thumbnail gradient start
  to: "#3d2b8f"         // thumbnail gradient end
}
```

The thumbnail is generated automatically from the emoji + colors — no image files needed. For a locally-built game, point `url` at a file inside `games/`.

## Local preview

Just open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
