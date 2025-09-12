/**
 * Moves Rendering Module - Modular approach for rendering RPG moves
 */

// Create move checkboxes (single or multiple)
function createMoveCheckboxes(move, available, urlParams) {
    const checkboxCount = move.multiple || 1;
    const checkboxes = [];
    
    for (let i = 0; i < checkboxCount; i++) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        
        if (checkboxCount === 1) {
            // Single checkbox - use original ID format
            checkbox.id = `move_${move.id}`;
            checkbox.name = `move_${move.id}`;
            checkbox.setAttribute('aria-label', `Toggle ${move.title}`);
        } else {
            // Multiple checkboxes - add instance number
            checkbox.id = `move_${move.id}_${i + 1}`;
            checkbox.name = `move_${move.id}_${i + 1}`;
            checkbox.setAttribute('aria-label', `${move.title} - Instance ${i + 1}`);
        }
        
        // Check if there's a saved state in URL first
        if (urlParams.has(checkbox.id)) {
            checkbox.checked = urlParams.get(checkbox.id) === '1';
        } else {
            // For multiple checkboxes, only check the first one if default is true
            checkbox.checked = (i === 0 && available[move.id]) || false;
        }
        
        checkboxes.push(checkbox);
    }
    
    return checkboxes;
}

// Create move title with checkboxes
function createMoveTitle(move, checkboxes) {
    const titleContainer = document.createElement("div");
    titleContainer.className = "move-title";
    
    if (checkboxes.length === 1) {
        // Single checkbox - use label as before
        const label = document.createElement("label");
        label.setAttribute('for', checkboxes[0].id);
        label.appendChild(checkboxes[0]);
        label.appendChild(document.createTextNode(move.title));
        titleContainer.appendChild(label);
    } else {
        // Multiple checkboxes - put checkboxes inline before title
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "move-checkboxes";
        
        checkboxes.forEach((checkbox, index) => {
            checkboxContainer.appendChild(checkbox);
        });
        
        const titleText = document.createElement("span");
        titleText.className = "move-title-text";
        titleText.textContent = move.title;
        
        titleContainer.appendChild(checkboxContainer);
        titleContainer.appendChild(titleText);
    }
    
    return titleContainer;
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
function createPickOptions(move, urlParams) {
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
        
        // Check if there's a saved state in URL first
        if (urlParams.has(`move_${move.id}_pick_${index}`)) {
            pickCheckbox.checked = urlParams.get(`move_${move.id}_pick_${index}`) === '1';
        } else {
            pickCheckbox.checked = false;
        }

        label.appendChild(pickCheckbox);
        label.appendChild(document.createTextNode(option));
        pickDiv.appendChild(label);
    });

    return pickDiv;
}

// Create complete move element
function createMoveElement(move, available, urlParams) {
    if (!move || !move.id || !move.title) {
        console.warn('Invalid move data:', move);
        return null;
    }

    const moveDiv = document.createElement("div");
    moveDiv.className = "move";
    moveDiv.setAttribute('data-move-id', move.id);

    // Create and add title with checkbox(es)
    const checkboxes = createMoveCheckboxes(move, available, urlParams);
    const titleContainer = createMoveTitle(move, checkboxes);
    moveDiv.appendChild(titleContainer);

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
        const pickElement = createPickOptions(move, urlParams);
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
    
    // Parse URL parameters once for efficiency
    const urlParams = new URLSearchParams(location.search);
    
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
        const moveElement = createMoveElement(move, available, urlParams);
        if (moveElement) {
            container.appendChild(moveElement);
        }
    });
}

// Export to global scope
window.renderMoves = renderMoves;
