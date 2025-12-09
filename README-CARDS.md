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
window.CardInitializers.mycard = function(container, suffix) {
    // container: DOM element containing this card instance
    // suffix: "1", "2", "3" for duplicates (via takeFromAllowsDuplicates), null for originals

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

Card content can use **markdown-style formatting** with automatic move linking and glossary term highlighting.

### Using `data-format-text` Attribute

Add the `data-format-text` attribute to any element to enable automatic formatting:

```html
<div class="card mycard-card">
  <h3>Card Title</h3>
  <p data-format-text="Roll **Augury** to see the future. You gain **+1 forward**."></p>
  <div data-format-text>Use **Rally the Cohort** to inspire your crew.</div>
</div>
```

### Supported Formatting

- **`**move name**`** → Clickable move reference (blue underline, navigates to move)
- **Glossary terms** → Auto-detected, hoverable tooltips (dotted underline)
- **`*italic*`** → Emphasized text
- **`- bullet lists`** → Converted to HTML lists
- **Line breaks** → Preserved as `<br>` tags

## Next Steps

- **Styling**: Add `card.css` for custom themes
- **Logic**: Add `card.js` with exported initialization function
- **Examples**: Study `data/cards/ship/` and `data/cards/robotic-companion/`
- **Full docs**: See [CARDS.md](CARDS.md) for complete reference

Happy card building! 🚀
