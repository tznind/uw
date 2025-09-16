# Cards System

The cards system allows you to embed rich, interactive HTML forms into character sheets with custom styling, JavaScript functionality, and automatic persistence.

## How It Works

1. **Folder Structure**: Each card lives in its own folder under `data/cards/[cardname]/`
2. **Card Definition**: Each card has a `card.json` file defining its metadata and files
3. **Custom Files**: Cards can have their own HTML, CSS, and JavaScript files
4. **Role Assignment**: Roles specify which cards they have access to via the `_cards` array in `availability.json`
5. **Automatic Loading**: Cards and their assets are automatically loaded when a role is selected
6. **Persistence**: All inputs with `id` attributes are automatically persisted to the URL

## Creating Cards

### Folder Structure
Each card requires its own folder under `data/cards/`:

```
data/cards/mycard/
├── card.json     # Card definition and metadata
├── card.html     # HTML template
├── card.css      # Custom styling (optional)
└── card.js       # Custom JavaScript (optional)
```

### Card Definition (card.json)
```json
{
  "id": "mycard",
  "title": "My Custom Card",
  "path": "data/cards/mycard",
  "description": "A custom card for tracking something important",
  "version": "1.0.0",
  "author": "Your Name",
  "files": {
    "html": "card.html",
    "css": "card.css",
    "js": "card.js"
  }
}
```

### HTML Template (card.html)
```html
<div class="card mycard-card">
  <h3 class="card-title">My Custom Card</h3>
  
  <div class="card-section">
    <div class="form-field">
      <label for="mycard_field">Field Label:</label>
      <input type="text" id="mycard_field" name="mycard_field" placeholder="Enter value">
    </div>
  </div>
</div>
```

### Custom Styling (card.css)
```css
.mycard-card {
  border-left: 4px solid #059669;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.mycard-card .card-title {
  color: #059669;
}
```

### Custom JavaScript (card.js)
```javascript
(function() {
    'use strict';
    
    function initializeMyCard() {
        // Custom card logic here
        console.log('My card initialized!');
    }
    
    // Initialize when card loads
    setTimeout(initializeMyCard, 100);
})();
```

### Supported Input Types
- `<input type="text">`, `<input type="number">`, `<input type="email">` etc.
- `<input type="checkbox">`
- `<select>` dropdowns
- `<textarea>` for multi-line text
- Any HTML form element with an `id`

### Requirements
1. **Unique IDs**: All inputs that should be persisted **must have unique `id` attributes**
2. **Card Definition**: Every card must have a valid `card.json` file
3. **CSS Classes**: Use `.card` class for consistent base styling
4. **File Names**: Use the exact filenames specified in `card.json`

### Built-in CSS Classes
The system provides base CSS classes:
- `.card` - Main card container with border and padding
- `.card-title` - Card title heading styling
- `.card-section` - Logical sections within cards
- `.form-field` - Individual input field containers
- `.card-error` - Error state styling

## Assigning Cards to Roles

Edit `data/availability.json` and add a `_cards` array to any role:

```json
{
  "Navigator": {
    "_movesFile": "data/moves/navigator.json",
    "_cards": ["ship", "crew"],
    "moveId1": true,
    "moveId2": false
  }
}
```

## Examples

### Ship Card (`data/cards/ship/`)
- **Rich HTML**: Ship stats, components, and weapon systems
- **Custom CSS**: Blue theme with ship emoji, hover effects, and stat-specific styling
- **Custom JavaScript**: Auto-fill stats by ship class, hull damage warnings, component dependencies
- **Features**: Warp-capable ship validation, component requirements

### Crew Card (`data/cards/crew/`)  
- **Rich HTML**: Crew stats, experience levels, and status conditions
- **Custom CSS**: Red theme with person emoji, status-specific colors
- **Custom JavaScript**: Stat validation, experience logic, name generator, status conflicts
- **Features**: Random name generation, loyalty/corruption balancing, role-based suggestions

## Advanced Usage

### From Moves
Moves can grant cards when selected using the `grantsCard` property. For example, an "Acquire Robotic Companion" move can show the robotic companion card inline when the move is taken.

## File Structure
```
data/
  ├── cards/
  │   ├── ship/
  │   │   ├── card.json      # Ship card definition
  │   │   ├── card.html      # Ship HTML template
  │   │   ├── card.css       # Ship custom styles
  │   │   └── card.js        # Ship custom JavaScript
  │   ├── crew/
  │   │   ├── card.json      # Crew card definition
  │   │   ├── card.html      # Crew HTML template
  │   │   ├── card.css       # Crew custom styles
  │   │   └── card.js        # Crew custom JavaScript
  │   └── yourcard/       # Your custom card folder
  └── availability.json    # Defines which roles get which cards
```

## Benefits

1. **Zero Code Changes**: Adding new cards requires no core system modifications
2. **Complete Customization**: Each card can have its own HTML, CSS, and JavaScript
3. **Automatic Asset Loading**: CSS and JS files are automatically loaded and cached
4. **Automatic Persistence**: All inputs are automatically saved to the URL
5. **Rich Interactivity**: Cards can have complex custom logic and validation
6. **Professional Styling**: Custom themes with hover effects and visual feedback
7. **Role-Based Access**: Cards only appear for appropriate roles
8. **Modular Design**: Cards are self-contained and don't affect each other
9. **Version Control**: Each card tracks its own version and metadata
10. **Developer Friendly**: Clear separation of concerns and easy debugging

## Implementation Notes

- **Async Loading**: Cards, CSS, and JavaScript are loaded asynchronously and cached
- **Smart Caching**: Assets are only loaded once per session to improve performance
- **Error Handling**: Failed card loads show helpful error messages instead of breaking
- **DOM Integration**: Cards integrate seamlessly with existing form and persistence systems
- **Script Isolation**: Each card's JavaScript runs in its own scope to prevent conflicts
- **Style Scoping**: Card CSS is namespaced to avoid affecting other elements
- **Persistence Compatible**: All card inputs work with URL persistence and "Copy URL"
- **Clear Button**: The "Clear" button removes all card data along with other form data
- **Development Mode**: Use `window.Cards.clearCache()` to reload cards during development
