# Adding New Careers and Origins to Uncharted Worlds

This document describes how to add new careers and origins to the Uncharted Worlds character sheet system.

## Overview

The system distinguishes between **Origins** and **Careers** based on their card configuration:
- **Origins** (Academic, Brutal, Colonist, etc.) - Provide **all cards** (`["health", "workspace", "advancement"]`)
- **Careers** (Clandestine, Commercial, Explorer, etc.) - Provide **no cards** (no "cards" property at all)

### ⚠️ IMPORTANT: Key Differences

- **Origins**: Provide all cards (health, workspace, advancement) and moves/skills. Origins do NOT get workspace options or advancement goals - these are provided by the cards themselves.
- **Careers**: Provide only moves/skills. They have NO cards property. Workspace options and advancement goals are provided by the origin's cards.
- **Only origins provide cards. Careers provide only additional skills/moves.**

## Required Files to Update

### 1. `data/availability.json` - Core Configuration

This is the main configuration file that defines what moves each career/origin has access to.

**Structure for Origins:**
```json
"OriginName": {
  "_movesFile": "data/moves/all.json",  // Optional: custom moves file
  "cards": ["health", "workspace", "advancement"],  // Origins MUST include "health"
  "skillId1": false,
  "skillId2": false,
  "skillId3": false,
  "skillId4": false,
  "skillId5": false,
  "gs": false  // Group Skill - usually included
}
```

**Structure for Careers:**
```json
"CareerName": {
  // Careers have NO "cards" property - cards are provided by origins only
  "skillId1": false,
  "skillId2": false,
  "skillId3": false,
  "skillId4": false,
  "skillId5": false
}
```

**Notes:**
- Each career/origin should have exactly 5 skills
- All skill values are set to `false` by default (unchecked)
- The `"gs"` (Group Skill) is typically only for origins
- Skill IDs must match those defined in `data/moves/all.json`

### 2. `cs.html` - HTML Form Dropdowns

Update the dropdown menus to include new careers/origins.

**Lines to update:**
- **Line 44** - Origin dropdown: `data-roles="Advanced, Brutal, Colonist, ..."`
- **Line 51** - Career 1 dropdown: `data-roles="Academic, Clandestine, Commercial, ..."`  
- **Line 58** - Career 2 dropdown: `data-roles="Academic, Clandestine, Commercial, ..."`

**Example:**
```html
<select id="role" name="role" data-roles="Advanced, Brutal, Colonist, Crowded, Galactic, Impoverished, NewOrigin, Privileged, Productive, Regimented, Rustic">
```

### 3. `data/cards/workspace/card.js` - Workspace Options (CAREERS ONLY)

⚠️ **CAREERS ONLY** - Do not add workspace options for origins.

Add workspace options for new careers in the `CAREER_WORKSPACES` object.

**Structure:**
```javascript
'NewCareer': [
    {
        id: 'workspace_type_1',
        title: 'Workspace Type 1',
        description: 'Description of what this workspace provides and contains.'
    },
    {
        id: 'workspace_type_2', 
        title: 'Workspace Type 2',
        description: 'Description of what this workspace provides and contains.'
    }
]
```

**Notes:**
- Each career should have exactly 2 workspace options
- IDs should be unique and descriptive
- Descriptions should explain what the workspace contains and its capabilities

### 4. `data/cards/advancement/card.js` - Advancement Goals (CAREERS ONLY)

⚠️ **CAREERS ONLY** - Do not add advancement goals for origins.

Add advancement options for new careers in the `careerAdvancements` object.

**Structure:**
```javascript
'NewCareer': [
    'An advancement goal is achieved.',
    'A significant milestone occurs.',
    'A challenge is overcome.',
    'A discovery is made.',
    'A problem is solved creatively.'
]
```

**Notes:**
- Each career should have exactly 5 advancement goals
- Goals should be thematic and relate to the career's focus
- Write them as completed actions (past tense)

## Optional Files to Update

### 5. `data/moves/all.json` - New Moves/Skills

Only update if adding completely new skills that don't exist yet.

**Structure:**
```json
{
    "id": "newskill",
    "title": "New Skill Name",
    "description": "What this skill does when used.",
    "category": "Skills",
    "outcomes": [  // Optional: for moves with dice rolls
        {
            "range": "≥ 10",
            "text": "On a strong hit..."
        },
        {
            "range": "7-9", 
            "text": "On a weak hit..."
        }
    ]
}
```

### 6. `data/moves/fbh.json` - Beyond Humanity Moves

Only needed if the career/origin uses special "Beyond Humanity" mechanics.

## Step-by-Step Process

### Adding a New Origin

1. **Choose 5 existing skills** from `data/moves/all.json` that fit the origin theme
2. **Add entry to `availability.json`** with `"health"` card included
3. **Update `cs.html`** origin dropdown (line 44)
4. **Test** that it appears in dropdown and shows health card
5. **Origins do NOT get workspace options or advancement goals**

### Adding a New Career

1. **Choose 5 existing skills** from `data/moves/all.json` that fit the career theme
2. **Add entry to `availability.json`** with NO "cards" property at all
3. **Update `cs.html`** career dropdowns (lines 51 & 58)
4. **Add workspace options** to `workspace/card.js`
5. **Add advancement goals** to `advancement/card.js` 
6. **Test** that it appears in dropdowns and provides only skills (cards come from origin)

## Example: Adding "Psyker" Origin

### 1. availability.json
```json
"Psyker": {
  "cards": ["health", "workspace", "advancement"],
  "men": false,    // Mental powers
  "pre": false,    // Precognition  
  "tel": false,    // Telepathy
  "psy": false,    // Psychic shield
  "dra": false,    // Psychic drain
  "gs": false
}
```

### 2. cs.html (line 44)
```html
data-roles="Advanced, Brutal, Colonist, Crowded, Galactic, Impoverished, Privileged, Productive, Psyker, Regimented, Rustic"
```

### 3. workspace/card.js
```javascript
'Psyker': [
    {
        id: 'meditation',
        title: 'Meditation',
        description: 'Quiet, isolated chambers for mental focus. Sensory deprivation pods, psionic dampening fields, mental training equipment.'
    },
    {
        id: 'laboratory',
        title: 'Laboratory', 
        description: 'Research facility for studying psychic phenomena. Brain scanners, neural interfaces, psionic research equipment, test subjects.'
    }
]
```

### 4. advancement/card.js
```javascript
'Psyker': [
    'A mind is read or influenced.',
    'A psychic phenomenon is controlled.',
    'A mental barrier is overcome.',
    'A vision of the future proves accurate.',
    'A psychic threat is neutralized.'
]
```

## Testing Checklist

After adding new careers/origins:

- [ ] New option appears in appropriate dropdown(s)
- [ ] Selecting it shows the correct moves/skills
- [ ] Origins provide all cards (health, workspace, advancement), careers provide no cards
- [ ] Workspace options appear when career is selected
- [ ] Advancement goals appear when career/origin is selected
- [ ] URL persistence works (selections are saved in URL)
- [ ] No JavaScript console errors

## File Locations Reference

```
E:\unchartedworlds\uw\
├── cs.html                           # Main HTML file with dropdowns
├── data/
│   ├── availability.json             # Core configuration
│   ├── moves/
│   │   ├── all.json                  # Standard moves/skills
│   │   └── fbh.json                  # Beyond Humanity moves
│   └── cards/
│       ├── workspace/
│       │   └── card.js               # Workspace options
│       └── advancement/
│           └── card.js               # Advancement goals
└── ADDING_CAREERS_AND_ORIGINS.md     # This document
```