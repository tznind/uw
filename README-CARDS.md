# Cards System - Quick Start

> **For complete documentation, see [CARDS.md](CARDS.md)**

Quick guide to get started with the card system.

## Try the Examples

1. Open `cs.html` in a browser
2. Select "Lord Commander" → see the **Ship Card** with auto-fill and validation
3. Select "Mech Adept" → see the **Robotic Companion Card** with interactive features

## Create a Simple Card

1. **Create folder**: `data/cards/mycard/`

2. **Add definition** (`card.json`):
```json
{
  "id": "mycard",
  "title": "My Card",
  "path": "data/cards/mycard",
  "version": "1.0.0",
  "files": { "html": "card.html" }
}
```

3. **Add template** (`card.html`):
```html
<div class="card mycard-card">
  <h3 class="card-title">My Card</h3>
  <div class="form-field">
    <label for="my_field">Field:</label>
    <input type="text" id="my_field" placeholder="Enter value">
  </div>
</div>
```

4. **Assign to role** in `data/availability.json`:
```json
"Navigator": {
  "_movesFile": "data/moves/navigator.json",
  "_cards": ["mycard"]
}
```

5. **Test**: Refresh page, select Navigator!

## Next Steps

- **Styling**: Add `card.css` for custom themes
- **Logic**: Add `card.js` for validation and interactivity  
- **Examples**: Study `data/cards/ship/` and `data/cards/robotic-companion/`
- **Full docs**: See [CARDS.md](CARDS.md) for complete reference

Happy card building! 🚀
