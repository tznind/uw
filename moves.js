/**
 * Moves Rendering Module - Modular approach for rendering RPG moves
 */

// Create move checkbox with proper ID and persistence
function createMoveCheckbox(move, available) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `move_${move.id}`;
    checkbox.name = `move_${move.id}`;
    checkbox.setAttribute('aria-label', `Toggle ${move.title}`);
    
    // Set default state from available map (persistence.js will handle loading saved state)
    checkbox.checked = available[move.id] || false;
    
    return checkbox;
}

// Create move title label
function createMoveTitle(move, checkbox) {
    const label = document.createElement("label");
    label.className = "move-title";
    label.setAttribute('for', checkbox.id);
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(move.title));
    
    return label;
}

// Create outcome display
function createOutcome(outcome) {
    const outcomeDiv = document.createElement("div");
    outcomeDiv.className = "outcome";

    const p = document.createElement("p");
    if (outcome.range && outcome.range.trim() !== "") {
        p.innerHTML = `<strong>${outcome.range}:</strong> ${outcome.text}`;
    } else {
        p.innerHTML = outcome.text;
    }
    outcomeDiv.appendChild(p);

    if (outcome.bullets && outcome.bullets.length) {
        const ul = document.createElement("ul");
        outcome.bullets.forEach(bulletText => {
            const li = document.createElement("li");
            li.textContent = bulletText;
            ul.appendChild(li);
        });
        outcomeDiv.appendChild(ul);
    }

    return outcomeDiv;
}

// Create pick options section
function createPickOptions(move) {
    const pickDiv = document.createElement("div");
    pickDiv.className = "pick-options";
    
    const heading = document.createElement("strong");
    heading.textContent = "Pick one:";
    pickDiv.appendChild(heading);

    move.pick.forEach((option, index) => {
        const label = document.createElement("label");
        
        const pickCheckbox = document.createElement("input");
        pickCheckbox.type = "checkbox";
        pickCheckbox.id = `move_${move.id}_pick_${index}`;
        pickCheckbox.name = `move_${move.id}_pick_${index}`;
        pickCheckbox.value = option;
        pickCheckbox.setAttribute('aria-label', `Pick option: ${option}`);

        label.appendChild(pickCheckbox);
        label.appendChild(document.createTextNode(option));
        pickDiv.appendChild(label);
    });

    return pickDiv;
}

// Create complete move element
function createMoveElement(move, available) {
    if (!move || !move.id || !move.title) {
        console.warn('Invalid move data:', move);
        return null;
    }

    const moveDiv = document.createElement("div");
    moveDiv.className = "move";
    moveDiv.setAttribute('data-move-id', move.id);

    // Create and add title with checkbox
    const checkbox = createMoveCheckbox(move, available);
    const titleLabel = createMoveTitle(move, checkbox);
    moveDiv.appendChild(titleLabel);

    // Add outcomes if they exist
    if (move.outcomes && Array.isArray(move.outcomes) && move.outcomes.length > 0) {
        move.outcomes.forEach(outcome => {
            if (outcome) {
                const outcomeElement = createOutcome(outcome);
                moveDiv.appendChild(outcomeElement);
            }
        });
    }

    // Add pick options if they exist
    if (move.pick && Array.isArray(move.pick) && move.pick.length > 0) {
        const pickElement = createPickOptions(move);
        moveDiv.appendChild(pickElement);
    }

    // Add separator
    const hr = document.createElement("hr");
    moveDiv.appendChild(hr);

    return moveDiv;
}

// Main render function
function renderMoves(containerId, available, movesArray) {
    // Input validation
    if (!containerId || !available || !movesArray) {
        console.error('renderMoves: Missing required parameters');
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('renderMoves: Container not found:', containerId);
        return;
    }

    const moves = Array.isArray(movesArray) ? movesArray : [];
    
    // Clear existing content
    container.innerHTML = '';

    // Filter and render moves that are available for this role
    const availableMoves = moves.filter(move => 
        move && move.id && available.hasOwnProperty(move.id)
    );

    if (availableMoves.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No moves available for this role.';
        emptyMessage.style.fontStyle = 'italic';
        emptyMessage.style.color = '#666';
        container.appendChild(emptyMessage);
        return;
    }

    // Create and add move elements
    availableMoves.forEach(move => {
        const moveElement = createMoveElement(move, available);
        if (moveElement) {
            container.appendChild(moveElement);
        }
    });

    console.log(`Rendered ${availableMoves.length} moves for role`);
}

// Export to global scope
window.renderMoves = renderMoves;
