# Cards System - Quick Start

The cards system allows for collapsable 'subpages' within your character sheet.  These can contain
any html, css and javascript you want.

Use cards when you need to preciesely model an area of the character sheet that does not fit well into the
moves system or requires multiple/variable inputs.

Cards can either be top level (i.e. roles x,y.z get the card automatically) or [granted by a move](./Cookbook.md#moves-that-grant-cards) (e.g. when
you take this move you get a vehicle - detail it below)

All input elements in a card are automatically persisted to url.

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
  <h3 class="card-title">⚙️ My Card</h3>
  <div class="form-field">
    <label for="my_field">Field:</label>
    <input type="text" id="my_field" placeholder="Enter value">
  </div>
</div>
```

> [!TIP]
> **Emoji Convention**: Card titles typically start with a unicode emoji (🤖, 🚀, ⚙️, etc.) to make them visually distinctive. This is optional but recommended for consistency.

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

## Card Structure

### Required Structure

```html
<div class="card mycard-card">
  <h3 class="card-title">⚙️ Card Title</h3>
  <!-- Card content goes here -->
  <div class="form-field">
    <label for="my_field">Field:</label>
    <input type="text" id="my_field" placeholder="Enter value">
  </div>
</div>
```

**Requirements:**
- ✅ **REQUIRED**: Top-level `<div class="card ...">` wrapper
- ✅ **REQUIRED**: An `<h3>` element (typically as the first child)
- ⚙️ **RECOMMENDED**: `class="card-title"` on the h3
- ⚙️ **RECOMMENDED**: Unicode emoji at start of title

### Collapsible Cards

Role-based cards (in the main cards container) are automatically made collapsible:
- Cards start **collapsed** by default
- Click title or +/- button to toggle
- Collapse state is preserved during re-renders

Cards granted by moves are displayed inline without collapse functionality.

## Card JavaScript Pattern

For cards that need custom initialization logic:

```javascript
// Export your initialization function
window.CardInitializers = window.CardInitializers || {};
window.CardInitializers.mycard = function(container, suffix) {
    // container: DOM element containing this card instance
    // suffix: "1", "2", "3", etc. when using takeFromAllowsDuplicates, null otherwise

    console.log('My card initialized!', { container, suffix });

    // Basic approach: Manual ID handling
    const fieldId = suffix ? `my_field_${suffix}` : 'my_field';
    const field = document.getElementById(fieldId);

    // Better approach: Use CardHelpers for duplicate support
    const helpers = suffix ?
        window.CardHelpers.createScopedHelpers(container, suffix) :
        window.CardHelpers;

    // Now all helpers automatically handle suffixes!
    const myField = helpers.getElement('my_field');
    helpers.addEventListener('my_field', 'input', function() {
        console.log('Field changed!', this.value);
    });
};
```

### Supporting Duplicate Cards

**How to enable:** Set `takeFromAllowsDuplicates: true` on a `takeFrom` move. See [Cookbook.md](Cookbook.md#take-from-other-roles) for examples (Equipment selection, multiple gear, etc.).

When a move with `takeFromAllowsDuplicates: true` is taken multiple times, each card instance gets unique IDs:

**HTML IDs are auto-suffixed:**
- Instance 1: `my_field_1`, `my_select_1`
- Instance 2: `my_field_2`, `my_select_2`

**Use CardHelpers for automatic scoping:**
```javascript
window.CardInitializers.ship = function(container, suffix) {
    // Create scoped helpers that automatically handle IDs
    const helpers = suffix ?
        window.CardHelpers.createScopedHelpers(container, suffix) :
        window.CardHelpers; // Backwards compatible

    const { setupAutoFill, setupDependency } = helpers;

    // These work correctly for BOTH duplicates and originals!
    setupAutoFill('ship_class', classDefaults);
    setupDependency('ship_void_shields', 'change', (element, helpers) => {
        if (element.checked && !helpers.isChecked('ship_plasma_drive')) {
            // ...
        }
    });
};
```

**Key Points:**
- **Parameters**: All init functions now receive `(container, suffix)`
- **Backwards compatible**: Works with or without the new parameters
- **CardHelpers**: Automatically scopes all element lookups
- **Persistence**: Each instance saves independently to URL

- **Simple export pattern**: No complex registration or lifecycle management
- **System managed**: The card system calls your function when the card is rendered
- **Clean separation**: Cards don't need to know about the global system

## Text Formatting in Cards

Card content can use the [data-format-text](./Cookbook.md#using-data-format-text-attribute) attribute for **markdown-style formatting** with automatic move linking and glossary term highlighting.

## Next Steps

- **Styling**: Add `card.css` for custom themes
- **Logic**: Add `card.js` with exported initialization function
- **Examples**: Study `data/cards/ship/` and `data/cards/robotic-companion/`

Happy card building! 🚀
