# Cookbook

This comprehensive guide covers creating roles, moves, and cards for the Rogue Trader character system.

## Table of Contents
- [Customizing Stats](#customizing-stats)
- [Creating Roles](#creating-roles)
- [Basic Moves](#basic-moves)
- [Advanced Move Types](#advanced-move-types)
  - [Pick One Moves (Radio Buttons)](#pick-one-moves-radio-buttons)
  - [Pick Multiple Moves (Checkboxes)](#pick-multiple-moves-checkboxes)
  - [Take From Other Roles](#take-from-other-roles)
  - [Move Categories](#move-categories)
  - [Track Counter Moves](#track-counter-moves)
  - [Moves That Grant Cards](#moves-that-grant-cards)
- [Cards System](#cards-system)

---

## Customizing Stats

Each game system typically has its own set of character statistics. The example system uses five core stats, but you can customize these for your own game.

### Modifying Stats

Stats are defined in [stats.json](./data/stats.json). Each stat has an `id` (used internally) and a `title` (displayed to players):

```json
[
  {
    "id": "mettle",
    "title": "METTLE"
  },
  {
    "id": "physique", 
    "title": "PHYSIQUE"
  },
  {
    "id": "influence",
    "title": "INFLUENCE"
  },
  {
    "id": "expertise",
    "title": "EXPERTISE"
  },
  {
    "id": "conviction",
    "title": "CONVICTION"
  }
]
```

---

## Creating Roles

To add a new role with moves:

1. Create a JSON file in `data/moves/` (e.g., `data/moves/new-role.json`)
2. Add the role to `data/availability.json` with a `_movesFile` property:

```diff
...

  "Lord Commander": {
    "_movesFile": "data/moves/lord-commander.json",
    "cards": ["ship"],
    "l1a2b3": false
-  }
+  },
+ "New Role": {
+  "_movesFile": "data/moves/new-role.json",
+  "move1": true,
+  "move2": false
+}
}
```
_/data/availability.json_

Moves marked `true` are always enabled for the role and cannot be disabled.

You can start with an empty json file for the moves:

```json
[
]
```
_/data/moves/new-role.json_

---

## Basic Moves

Basic moves are actions that can have different outcomes based on dice rolls or player choices. They form the core of character abilities.

**When to use:** For any action that involves rolling dice, making choices, or has variable outcomes.

### Structure

<table>
<tr>
<td>
<pre>
{
  "id": "unique_id",
  "title": "Move Name (+Stat)",
  "description": "Optional detailed description",
  "outcomes": [
    {
      "range": "≥ 10",
      "text": "Full success description",
      "bullets": []
    },
    {
      "range": "7–9",
      "text": "Partial success, choose one:",
      "bullets": [
        "Option 1 consequence",
        "Option 2 consequence",
        "Option 3 consequence"
      ]
    },
    {
      "range": "≤ 6",
      "text": "Failure description:",
      "bullets": [
        "Bad outcome 1",
        "Bad outcome 2",
        "Bad outcome 3"
      ]
    }
  ]
}
</pre>
</td> <td> <img src="https://github.com/user-attachments/assets/ce52e203-b5b8-442f-8477-f5c6e189e5ac"> </td> </tr> </table>


**Note:** The example above shows a common three-outcome structure, but you can use any number of outcomes or ranges that make sense for your game. You could have just two outcomes (success/failure), or more complex breakdowns. The `range` field is displayed as-is to players, so write it in whatever way makes sense for your system.

---

## Advanced Move Types

Beyond basic roll-based moves, the system supports several specialized move types for different gameplay needs.

### Pick One Moves (Radio Buttons)

**When to use:** For moves where the character must choose exactly one option from a list.

#### Structure



<table>
<tr>
<td>
<pre>
{
  "id": "move_id",
  "title": "Move Name",
  "description": "When you take this move, choose one of the following",
  "pickOne": [
    "Option 1",
    "Option 2", 
    "Option 3"
  ]
}
</pre>
</td> <td> <img src="https://github.com/user-attachments/assets/b59a9714-a0ec-47ec-805f-178e06a9eca4"> </td> </tr> </table>

**Key Features:**
- `pickOne` creates radio buttons (only one selection allowed)
- Can combine with `multiple` to allow user to take the same move multiple times
- `multiplePick` creates separate columns for multiple independent choices

### Pick Multiple Moves (Checkboxes)

**When to use:** For moves that let characters select multiple benefits or properties.

#### Structure

<table>
<tr>
<td>
<pre>
{
  "id": "multipicksdsd",
  "title": "Move Name",
  "description": "Each time you take this move, pick 2:",
  "multiple": 2,
  "pick": [
    "First Option",
    "Second Option",
    "Third Option",
    "Fourth Option",
    "Fifth Option"
  ]
}
</pre>
</td> <td> <img alt="image" src="https://github.com/user-attachments/assets/0b4198d4-3f20-4af4-858c-d5b535724d07" /> </td> </tr> </table>

**Key Features:**
- `pick` creates checkboxes (multiple selections allowed)
- Can combine `pick` and `pickOne` in the same move
- Often combined with `multiple` for repeated taking

### Take From Other Roles

**When to use:** If a move allows you to pick a move from another role.

#### Structure

<table>
<tr>
<td>
<pre>
{
  "id": "takeFrom1",
  "title": "Cross-Training Move Name",
  "description": "Take a move from an unused role",
  "takeFrom": ["Lord Commander", "Mech Adept"]
}
</pre>
</td> <td> <img alt="image" src="https://github.com/user-attachments/assets/1747a931-4fd0-4d84-af96-30bc370f70b7" /> </td> </tr> </table>


**Key Features:**
- `takeFrom` lists roles this character can learn from
- Creates dropdown menus populated with moves from those roles
- Allows character versatility and cross-class abilities

### Move Categories

**When to use:** To organize moves into logical groups on the character sheet.

#### Structure

```
{
  "id": "move_id",
  "title": "Move Name",
  "category": "Equipment",
  // ... rest of move definition
}
```

**Key Features:**
- Moves without `category` appear under the default "Moves" section
- Categories appear as separate sections on the character sheet
- Common categories: `"Advancement"`, `"Equipment"`, `"Companion"`

### Track Counter Moves

**When to use:** For moves that grant temporary points that can be spent for various effects (like Inspire, Hold, Focus, etc.).

#### Structure

<table>
<tr>
<td>
<pre>
{
  "id": "track_move",
  "title": "Move Name (+Stat)",
  "track": {
    "name": "Resource",
    "max": 3,
    "shape": "circle"
  },
  "outcomes": [
    {
      "range": "≥ 10",
      "text": "Success. Gain 2 Resource. Spend Resource to:",
      "bullets": [
        "Spend 1: Effect option",
        "Spend 2: Better effect",
        "Spend 3: Powerful effect"
      ]
    },
    {
      "range": "7–9", 
      "text": "Partial success. Gain 1 Resource."
    },
    {
      "range": "≤ 6",
      "text": "Your attempt falls flat - choose",
      "bullets": ["Bad outcome 1", "Bad outcome 2"]
    }
  ]
}
</pre>
</td> <td> <img src="placeholder-track-counter-image.png"> </td> </tr> </table>

**Key Features:**
- `track` creates interactive counter shapes in move title
- `shape` options: "square" (default), "circle", "triangle", "hexagon"
- Click shapes to increment/decrement current value
- Spending options typically in bullets of successful outcomes
- Values persist in URL and reset when move unchecked

### Moves That Grant Cards

**When to use:** When a move should give the character a new card interface for tracking complex information.  For example 'gain a crew...'.

This allows you to create completely bespoke elements in the character sheet.

#### Structure

<table>
<tr>
<td>
<pre>
{
  "id": "cardmove1",
  "title": "Move Name",
  "grantsCard": "card-name",
  "outcomes": [
    {
      "range": "",
      "text": "Description of what you gain"
    }
  ]
}
</pre>
</td> <td> <img alt="image" src="https://github.com/user-attachments/assets/adadfbc1-6556-4930-9d1d-ce1664153f87" />
 </td> </tr> </table>

In order to work a card must have a corresponding card.json and card.html in the [cards](./data/cards) folder:

```json
{
  "id": "card-name",
  "title": "Example Card Title",
  "path": "data/cards/card-name",
  "description": "Simple example card",
  "version": "2.0.0",
  "author": "Thomas",
  "files": {
    "html": "card.html"
  }
}
```
_card.json_

And html for the card itself:

```html
<p>Example Card</p>
<label for="example-card-input">
Type some text<input type="text" id="example-card-input" />
</label>
```
_card.html_

As long as the inputs in the html have ids then they will be automatically persisted without any additional requirements.

File structure for a new card and move
```
/data
  /cards
    /new-card-name
      card.html
      card.json
 /moves
    /your-role.json (add move here) 
```

Cards can also be added directly to roles (i.e. if a move is not required and role always has it):

```diff
"New Role": {
  "_movesFile": "data/moves/new-role.json",
+  "cards": ["card-name"],
  "aaabvb": false,
```

**Key Features:**
- `grantsCard` references a card by its folder name
- The card must exist in `data/cards/[card-name]/`
- Cards appear inline when the move is selected

## Cards System

The cards system allows you to embed rich, interactive HTML forms into character sheets with custom styling, JavaScript functionality, and automatic persistence.

### How It Works

1. **Folder Structure**: Each card lives in its own folder under `data/cards/[cardname]/`
2. **Card Definition**: Each card has a `card.json` file defining its metadata and files
3. **Custom Files**: Cards can have their own HTML, CSS, and JavaScript files
4. **Role Assignment**: Roles specify which cards they have access to via the `_cards` array in `availability.json`
5. **Automatic Loading**: Cards and their assets are automatically loaded when a role is selected
6. **Persistence**: All inputs with `id` attributes are automatically persisted to the URL

### Creating Cards

#### Folder Structure
Each card requires its own folder under `data/cards/`:

```
data/cards/mycard/
├── card.json     # Card definition and metadata
├── card.html     # HTML template
├── card.css      # Custom styling (optional)
└── card.js       # Custom JavaScript (optional)
```

#### Card Definition (card.json)
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

#### HTML Template (card.html)
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

#### Custom Styling (card.css)
```css
.mycard-card {
  border-left: 4px solid #059669;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.mycard-card .card-title {
  color: #059669;
}
```

#### Custom JavaScript (card.js)
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

#### Supported Input Types
- `<input type="text">`, `<input type="number">`, `<input type="email">` etc.
- `<input type="checkbox">`
- `<select>` dropdowns
- `<textarea>` for multi-line text
- Any HTML form element with an `id`

#### Requirements
1. **Unique IDs**: All inputs that should be persisted **must have unique `id` attributes**
2. **Card Definition**: Every card must have a valid `card.json` file
3. **CSS Classes**: Use `.card` class for consistent base styling
4. **File Names**: Use the exact filenames specified in `card.json`

#### Built-in CSS Classes
The system provides base CSS classes:
- `.card` - Main card container with border and padding
- `.card-title` - Card title heading styling
- `.card-section` - Logical sections within cards
- `.form-field` - Individual input field containers
- `.card-error` - Error state styling

### Assigning Cards to Roles

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

### Examples

#### Ship Card (`data/cards/ship/`)
- **Rich HTML**: Ship stats, components, and weapon systems
- **Custom CSS**: Blue theme with ship emoji, hover effects, and stat-specific styling
- **Custom JavaScript**: Auto-fill stats by ship class, hull damage warnings, component dependencies
- **Features**: Warp-capable ship validation, component requirements

#### Crew Card (`data/cards/crew/`)  
- **Rich HTML**: Crew stats, experience levels, and status conditions
- **Custom CSS**: Red theme with person emoji, status-specific colors
- **Custom JavaScript**: Stat validation, experience logic, name generator, status conflicts
- **Features**: Random name generation, loyalty/corruption balancing, role-based suggestions

### Advanced Usage

#### From Moves
Moves can grant cards when selected using the `grantsCard` property. For example, an "Acquire Robotic Companion" move can show the robotic companion card inline when the move is taken.

### File Structure
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

### Benefits

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

### Implementation Notes

- **Async Loading**: Cards, CSS, and JavaScript are loaded asynchronously and cached
- **Smart Caching**: Assets are only loaded once per session to improve performance
- **Error Handling**: Failed card loads show helpful error messages instead of breaking
- **DOM Integration**: Cards integrate seamlessly with existing form and persistence systems
- **Script Isolation**: Each card's JavaScript runs in its own scope to prevent conflicts
- **Style Scoping**: Card CSS is namespaced to avoid affecting other elements
- **Persistence Compatible**: All card inputs work with URL persistence and "Copy URL"
- **Clear Button**: The "Clear" button removes all card data along with other form data
- **Development Mode**: Use `window.Cards.clearCache()` to reload cards during development

