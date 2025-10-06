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
  "cards": ["mycard"]
}
```

5. **Test**: Refresh page, select Navigator!

## Everyone System

The "Everyone" role provides universal cards and moves available to all characters:

```json
"Everyone": {
  "_movesFile": "data/moves/everyone.json",
  "cards": ["common"],
  "universal_move": true,
  "optional_move": false
}
```

- **Automatic inclusion**: Everyone moves/cards are automatically added to any selected role
- **Not user-selectable**: "Everyone" never appears in role dropdowns or takeFrom lists
- **Universal access**: Perfect for basic equipment, common knowledge, etc.

## Card Collapse Functionality

**All cards are collapsible by default**. For proper collapse behavior:

### Required Structure
```html
<div class="card mycard-card">
  <h3>Card Title</h3>  <!-- Will become collapsible title -->
  <!-- All content below title will be collapsible -->
  <div class="form-field">
    <!-- Card content -->
  </div>
</div>
```

### CSS Support
```css
.card.mycard-card .card-content.collapsed {
  display: none;  /* Hide content when collapsed */
}
```

### Key Points
- Cards start **collapsed** by default
- Click title or +/- button to toggle
- Collapse state is preserved during re-renders
- Use `class="card"` for auto-collapse functionality

## Card JavaScript Pattern

For cards that need custom initialization logic:

```javascript
// Export your initialization function
window.CardInitializers = window.CardInitializers || {};
window.CardInitializers.mycard = function() {
    // Your card initialization logic here
    console.log('My card initialized!');
};
```

- **Simple export pattern**: No complex registration or lifecycle management
- **System managed**: The card system calls your function when the card is rendered
- **Clean separation**: Cards don't need to know about the global system

## Next Steps

- **Styling**: Add `card.css` for custom themes
- **Logic**: Add `card.js` with exported initialization function
- **Examples**: Study `data/cards/ship/` and `data/cards/robotic-companion/`
- **Full docs**: See [CARDS.md](CARDS.md) for complete reference

Happy card building! 🚀
