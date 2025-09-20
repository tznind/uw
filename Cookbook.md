# Cookbook

This comprehensive guide covers creating roles, moves, and cards for the Rogue Trader character system.

## Table of Contents
- [Customizing Stats](#customizing-stats)
- [Creating Roles](#creating-roles)
- [Basic Moves](#basic-moves)
- [Advanced Move Types](#advanced-move-types)
  - [Pick One Moves (Radio Buttons)](#pick-one-moves-radio-buttons)
  - [Pick Multiple Moves (Checkboxes)](#pick-multiple-moves-checkboxes)
  - [Repeatable Moves](#repeatable-moves)
  - [Take From Other Roles](#take-from-other-roles)
  - [Move Categories](#move-categories)
  - [Moves That Grant Cards](#moves-that-grant-cards)
- [Cards System](#cards-system)

---

## Customizing Stats

Each game system typically has its own set of character statistics. The example system uses five core stats, but you can customize these for your own game.

### Modifying Stats

Stats are defined in `data/stats.json`. Each stat has an `id` (used internally) and a `title` (displayed to players):

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
```json
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
```

**Note:** The example above shows a common three-outcome structure, but you can use any number of outcomes or ranges that make sense for your game. You could have just two outcomes (success/failure), or more complex breakdowns. The `range` field is displayed as-is to players, so write it in whatever way makes sense for your system.

### Example: Adding a Basic Move to Lord Commander

Let's add a simple command move to `data/moves/lord-commander.json`:

```json
{
  "id": "lc_inspire",
  "title": "Inspire the Troops (+Influence)",
  "description": "Rally your forces with a rousing speech or display of courage",
  "outcomes": [
    {
      "range": "≥ 10",
      "text": "Your words ignite unshakeable resolve. Your troops fight with renewed vigor and courage.",
      "bullets": []
    },
    {
      "range": "7–9",
      "text": "Your inspiration works, but choose one:",
      "bullets": [
        "The effect is temporary—it will fade quickly",
        "Only some of your forces are truly inspired",
        "Your words carry unintended consequences"
      ]
    },
    {
      "range": "≤ 6",
      "text": "Your attempt backfires:",
      "bullets": [
        "Your troops question your leadership",
        "Morale actually decreases",
        "A rival seizes the moment to undermine you"
      ]
    }
  ]
}
```

**Key Points:**
- `id` must be unique across ALL moves in the system
- `title` should be clear and descriptive for players (stat references like "+Influence" are common but optional)
- `description` is optional but helpful for complex moves or additional context
- `outcomes` can have as many or as few ranges as your game needs
- `range` text is displayed exactly as written - use whatever notation makes sense for your players
- `bullets` arrays are optional and used for player choices or lists of consequences
- The structure should make sense when read by players, not necessarily parsed by machines

---

## Advanced Move Types

Beyond basic roll-based moves, the system supports several specialized move types for different gameplay needs.

### Pick One Moves (Radio Buttons)

**When to use:** For moves where the character must choose exactly one option from a list, typically for specialization or weapon configuration.

**Example use case:** Configuring a weapon's firing mode or choosing a character's specialization focus.

#### Structure
```json
{
  "id": "move_id",
  "title": "Move Name",
  "description": "Choose your character's focus",
  "pickOne": [
    "Option 1",
    "Option 2", 
    "Option 3"
  ],
  "outcomes": [
    {
      "range": "",
      "text": "Description of what this choice represents"
    }
  ]
}
```

#### Real Example: Stat Improvement from Lord Commander
```json
{
  "id": "is",
  "title": "Improved Stat",
  "description": "Choose one stat to improve by 1 (can be taken twice)",
  "multiple": 2,
  "multiplePick": 2,
  "category": "Advancement",
  "pickOne": [
    "Mettle",
    "Physique",
    "Influence",
    "Expertise",
    "Conviction"
  ]
}
```

**Key Features:**
- `pickOne` creates radio buttons (only one selection allowed)
- Can combine with `multiple` for repeated selections
- `multiplePick` creates separate columns for multiple independent choices
- Usually doesn't need standard outcome ranges

### Pick Multiple Moves (Checkboxes)

**When to use:** For moves that let characters select multiple benefits or properties, like customizing equipment or gaining multiple abilities.

**Example use case:** Customizing a weapon with multiple properties or choosing several training bonuses.

#### Structure
```json
{
  "id": "move_id",
  "title": "Move Name",
  "description": "Choose multiple options",
  "pick": [
    "First Option",
    "Second Option",
    "Third Option",
    "Fourth Option"
  ],
  "outcomes": [
    {
      "range": "",
      "text": "Pick one or more from the list above"
    }
  ]
}
```

#### Real Example: Relic Weapon from Mech Adept
```json
{
  "id": "85757e",
  "title": "Relic Weapon",
  "description": "You have a priceless relic of the before time, choose 2 then +1 for each additional time you take this move",
  "multiple": 3,
  "category": "Equipment",
  "pick": [
    "+1 Harm",
    "Armor Piercing",
    "Reliable",
    "Precise",
    "Terrifying",
    "Messy"
  ],
  "pickOne": [
    "Ranged weapon (projectile or energy)",
    "Melee weapon (blade or maul)",
    "Exotic weapon (unique mechanism)"
  ]
}
```

**Key Features:**
- `pick` creates checkboxes (multiple selections allowed)
- Can combine `pick` and `pickOne` in the same move
- Often combined with `multiple` for repeated taking
- Perfect for equipment customization

### Repeatable Moves

**When to use:** For moves that can be taken multiple times to stack effects or represent ongoing advancement.

**Example use case:** Training moves that improve with repetition, or equipment upgrades that can be applied multiple times.

#### Structure
```json
{
  "id": "move_id",
  "title": "Repeatable Move - Description of stacking benefit",
  "multiple": 3,
  "outcomes": [
    // Standard outcomes or pick options
  ]
}
```

#### Real Example: Tactical Superiority from Lord Commander
```json
{
  "id": "lc001",
  "title": "Tactical Superiority - Each time taken, add +1 die to tactical rolls",
  "multiple": 2,
  "outcomes": [
    {
      "range": "≥ 10",
      "text": "Your strategic insight is flawless. Enemies fall into your carefully laid traps.",
      "bullets": []
    },
    {
      "range": "7–9",
      "text": "Your tactics succeed, but choose one:",
      "bullets": [
        "Victory comes at higher cost than expected",
        "You reveal your strategic approach to watching enemies",
        "Success breeds overconfidence in your ranks"
      ]
    },
    {
      "range": "≤ 6",
      "text": "Your tactics backfire:",
      "bullets": [
        "The enemy anticipated your move and counterattacks",
        "Your forces are caught out of position",
        "Morale suffers as troops question your leadership"
      ]
    }
  ]
}
```

**Key Features:**
- `multiple` defines how many times the move can be taken (2-10)
- Creates separate checkboxes for each instance
- Title should clearly explain the stacking benefit
- Great for gradual character advancement

### Take From Other Roles

**When to use:** For versatile characters who can learn techniques from other roles, representing cross-training or adaptability.

**Example use case:** A Lord Commander learning navigation from a Navigator, or a jack-of-all-trades character.

#### Structure
```json
{
  "id": "move_id",
  "title": "Cross-Training Move Name",
  "takefrom": ["Role Name 1", "Role Name 2"]
}
```

#### Real Example: Adaptable from Lord Commander
```json
{
  "id": "adapt1",
  "title": "Adaptable - Learn techniques from other roles",
  "takefrom": ["Navigator", "Mech Adept"]
}
```

**Key Features:**
- `takefrom` lists roles this character can learn from
- Creates dropdown menus populated with moves from those roles
- Allows character versatility and cross-class abilities
- No outcomes needed—the move grants access to other moves

### Move Categories

**When to use:** To organize moves into logical groups on the character sheet.

**Available categories:**
- `"Advancement"` - Character improvement moves
- `"Equipment"` - Gear and weapon moves
- `"Companion"` - Allies and followers
- `"Custom Category"` - Any name you choose

#### Structure
```json
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
- Helps players find related moves quickly

### Moves That Grant Cards

**When to use:** When a move should give the character a new card interface for tracking complex information.

**Example use case:** Acquiring a robotic companion, getting a ship, or gaining a complex piece of equipment.

#### Structure
```json
{
  "id": "move_id",
  "title": "Move Name",
  "grantsCard": "card-name",
  "outcomes": [
    {
      "range": "Always",
      "text": "Description of what you gain",
      "bullets": [
        "Details about the new capability",
        "Any limitations or requirements",
        "Ongoing considerations"
      ]
    }
  ]
}
```

#### Real Example: Acquire Robotic Companion from Mech Adept
```json
{
  "id": "ac001",
  "title": "Acquire Robotic Companion",
  "description": "Through techno-arcane rites or salvage operations, you have created or acquired a robotic companion to serve the Machine God.",
  "category": "Advancement",
  "grantsCard": "robotic-companion",
  "outcomes": [
    {
      "range": "Always",
      "text": "You now have a robotic companion. Its exact nature depends on your craftsmanship and available resources:",
      "bullets": [
        "Choose its type: reconnaissance drone, combat servitor, tech-adept construct, or custom design",
        "Its loyalty is absolute, but its machine spirit has its own quirks",
        "It requires maintenance and may malfunction at inopportune times",
        "Other Tech Adepts may covet or critique your work"
      ]
    }
  ]
}
```

**Key Features:**
- `grantsCard` references a card by its folder name
- The card must exist in `data/cards/[card-name]/`
- Cards appear inline when the move is selected
- Perfect for companions, equipment, or other complex game elements

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

