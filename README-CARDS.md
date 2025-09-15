# Cards System - Quick Start

The new card system provides a powerful way to add custom functionality to your character sheets.

## Quick Examples

### Testing the System
1. Open `cs.html` in a browser
2. Select "Navigator" or "Lord Commander" to see the **Ship Card**
3. Select "Mech Adept" to see the **Crew Card**
4. Notice the custom styling, emoji icons, and interactive features

### Ship Card Features
- **Auto-fill**: Select a ship class → get auto-suggested stats
- **Visual Feedback**: Low hull integrity turns red/yellow
- **Dependencies**: Void shields require plasma drive
- **Validation**: Gellar field removal warning

### Crew Card Features  
- **Name Generator**: Click 🎲 next to name field for random names
- **Stat Logic**: High loyalty conflicts with high corruption
- **Experience Validation**: Experience levels suggest minimum competence
- **Status Conflicts**: Mutinous crew can't have commendations

## Creating Your Own Cards

### 1. Create Folder Structure
```bash
mkdir data/cards/mycard
```

### 2. Add Card Definition
Create `data/cards/mycard/card.json`:
```json
{
  "id": "mycard",
  "title": "My Custom Card",
  "path": "data/cards/mycard",
  "description": "My awesome custom card",
  "version": "1.0.0",
  "author": "Me",
  "files": {
    "html": "card.html",
    "css": "card.css",
    "js": "card.js"
  }
}
```

### 3. Add HTML Template
Create `data/cards/mycard/card.html`:
```html
<div class="card mycard-card">
  <h3 class="card-title">My Custom Card</h3>
  <div class="card-section">
    <div class="form-field">
      <label for="my_field">My Field:</label>
      <input type="text" id="my_field" name="my_field" placeholder="Enter something">
    </div>
  </div>
</div>
```

### 4. Add Custom Styling (Optional)
Create `data/cards/mycard/card.css`:
```css
.mycard-card {
  border-left: 4px solid #7c3aed;
  background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%);
}

.mycard-card .card-title {
  color: #7c3aed;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mycard-card .card-title::before {
  content: "⚡";
  font-size: 24px;
}
```

### 5. Add Custom Logic (Optional)
Create `data/cards/mycard/card.js`:
```javascript
(function() {
    'use strict';
    
    function initializeMyCard() {
        const myField = document.getElementById('my_field');
        if (myField) {
            myField.addEventListener('input', function() {
                console.log('Field value changed:', this.value);
            });
        }
    }
    
    setTimeout(initializeMyCard, 100);
})();
```

### 6. Assign to Role
Edit `data/availability.json`:
```json
{
  "Navigator": {
    "_movesFile": "data/moves/navigator.json",
    "_cards": ["ship", "mycard"],
    "a1b2c3": true
  }
}
```

### 7. Test
Refresh the page, select Navigator, and see your custom card!

## Development Tips

- **Clear Cache**: Use browser dev tools → `window.Cards.clearCache()` to reload cards
- **Debug**: Check browser console for card loading messages and errors
- **Unique IDs**: Make sure all input IDs are unique across the entire form
- **Error Handling**: Failed card loads will show error messages instead of breaking

## File Locations

- **Cards**: `data/cards/[cardname]/`
- **Role Assignment**: `data/availability.json`
- **Documentation**: `CARDS.md` (full documentation)
- **Examples**: `data/cards/ship/` and `data/cards/crew/`

Happy card building! 🚀