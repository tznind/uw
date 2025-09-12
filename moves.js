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

// Create takefrom section for learning moves from other roles
function createTakeFromSection(move, urlParams) {
    const takeFromDiv = document.createElement("div");
    takeFromDiv.className = "takefrom-options";
    
    const heading = document.createElement("strong");
    heading.textContent = "Learn from:";
    takeFromDiv.appendChild(heading);
    
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "takefrom-controls";
    
    // Role selector
    const roleLabel = document.createElement("label");
    roleLabel.textContent = "Role: ";
    const roleSelect = document.createElement("select");
    roleSelect.id = `takefrom_${move.id}_role`;
    roleSelect.name = `takefrom_${move.id}_role`;
    
    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select role...";
    roleSelect.appendChild(defaultOption);
    
    // Add role options
    move.takefrom.forEach(role => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    
    // Move selector
    const moveLabel = document.createElement("label");
    moveLabel.textContent = "Move: ";
    const moveSelect = document.createElement("select");
    moveSelect.id = `takefrom_${move.id}_move`;
    moveSelect.name = `takefrom_${move.id}_move`;
    moveSelect.disabled = true; // Initially disabled
    console.log('Created move select with id:', moveSelect.id);
    
    // Add default option
    const defaultMoveOption = document.createElement("option");
    defaultMoveOption.value = "";
    defaultMoveOption.textContent = "Select move...";
    moveSelect.appendChild(defaultMoveOption);
    
    // Restore values from URL
    if (urlParams.has(`takefrom_${move.id}_role`)) {
        const savedRole = urlParams.get(`takefrom_${move.id}_role`);
        const savedMove = urlParams.get(`takefrom_${move.id}_move`);
        
        roleSelect.value = savedRole;
        updateMoveOptions(roleSelect, moveSelect, move.id);
        
        // Use a slight delay to ensure options are populated before setting value
        setTimeout(() => {
            if (savedMove) {
                moveSelect.value = savedMove;
            }
        }, 10);
    }
    
    // Event listener for role change
    roleSelect.addEventListener('change', () => {
        console.log('Role dropdown changed to:', roleSelect.value);
        updateMoveOptions(roleSelect, moveSelect, move.id);
        // Clear move selection when role changes
        moveSelect.value = '';
        handleTakeFromSelection(roleSelect, moveSelect, move.id);
        
        // Manually update URL with the role selection
        const params = new URLSearchParams(location.search);
        if (roleSelect.value) {
            params.set(roleSelect.id, roleSelect.value);
        } else {
            params.delete(roleSelect.id);
        }
        // Also clear the move selection from URL since we reset it
        params.delete(moveSelect.id);
        const newUrl = params.toString() ? '?' + params.toString() : location.pathname;
        history.replaceState({}, '', newUrl);
        
        // Also trigger the normal persistence save
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form && window.Persistence) {
                window.Persistence.saveToURL(form);
            }
        }, 10);
    });
    
    // Event listener for move selection
    moveSelect.addEventListener('change', () => {
        console.log('Move dropdown changed to:', moveSelect.value);
        
        // FIRST: Update URL synchronously
        const params = new URLSearchParams(location.search);
        console.log('Move select ID:', moveSelect.id, 'Value:', moveSelect.value);
        if (moveSelect.value) {
            params.set(moveSelect.id, moveSelect.value);
            console.log('Added parameter:', moveSelect.id, '=', moveSelect.value);
        } else {
            params.delete(moveSelect.id);
            console.log('Removed parameter:', moveSelect.id);
        }
        const newUrl = params.toString() ? '?' + params.toString() : location.pathname;
        console.log('About to update URL to:', newUrl);
        history.replaceState({}, '', newUrl);
        console.log('Updated URL, current location:', window.location.href);
        
        // THEN: Handle the selection change (which may trigger re-render)
        handleTakeFromSelection(roleSelect, moveSelect, move.id);
        
        // Also trigger the normal persistence save
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form && window.Persistence) {
                window.Persistence.saveToURL(form);
            }
        }, 10);
    });
    
    roleLabel.appendChild(roleSelect);
    moveLabel.appendChild(moveSelect);
    
    controlsDiv.appendChild(roleLabel);
    controlsDiv.appendChild(moveLabel);
    takeFromDiv.appendChild(controlsDiv);
    
    return takeFromDiv;
}

// Update move options based on selected role
function updateMoveOptions(roleSelect, moveSelect, moveId) {
    const selectedRole = roleSelect.value;
    const currentValue = moveSelect.value; // Preserve current selection
    
    // Clear existing options except default
    moveSelect.innerHTML = '';
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select move...";
    moveSelect.appendChild(defaultOption);
    
    if (selectedRole && window.availableMap && window.availableMap[selectedRole]) {
        moveSelect.disabled = false;
        
        // Get available moves for selected role
        const availableMoves = window.availableMap[selectedRole];
        
        // Filter moves to only show those available to that role
        window.moves.forEach(move => {
            if (move.id !== moveId && availableMoves.hasOwnProperty(move.id)) {
                const option = document.createElement("option");
                option.value = move.id;
                option.textContent = move.title;
                moveSelect.appendChild(option);
            }
        });
        
        // Restore the previously selected value if it's still available
        if (currentValue && moveSelect.querySelector(`option[value="${currentValue}"]`)) {
            moveSelect.value = currentValue;
        }
    } else {
        moveSelect.disabled = true;
    }
}

// Add learned move to current role's available moves
function addLearnedMove(currentRole, learnedMoveId) {
    if (currentRole && learnedMoveId && window.availableMap && window.availableMap[currentRole]) {
        // Add the learned move to the current role's available moves
        window.availableMap[currentRole][learnedMoveId] = true;
        
        // Trigger a re-render of moves to show the newly available move
        const event = new CustomEvent('availableMapUpdated', {
            detail: { role: currentRole, addedMove: learnedMoveId }
        });
        window.dispatchEvent(event);
    }
}

// Remove learned move from current role's available moves
function removeLearnedMove(currentRole, learnedMoveId) {
    if (currentRole && learnedMoveId && window.availableMap && window.availableMap[currentRole]) {
        // Remove the learned move from the current role's available moves
        delete window.availableMap[currentRole][learnedMoveId];
        
        // Trigger a re-render of moves to hide the no-longer-available move
        const event = new CustomEvent('availableMapUpdated', {
            detail: { role: currentRole, removedMove: learnedMoveId }
        });
        window.dispatchEvent(event);
    }
}

// Handle takefrom selection changes
function handleTakeFromSelection(roleSelect, moveSelect, takeFromMoveId) {
    const currentRole = getCurrentRole();
    const selectedMove = moveSelect.value;
    
    // Get previous selection to remove it if changed
    const prevKey = `takefrom_${takeFromMoveId}_move`;
    const urlParams = new URLSearchParams(location.search);
    const previousMove = urlParams.get(prevKey);
    
    // Remove previously learned move if it exists and is different
    if (previousMove && previousMove !== selectedMove && currentRole) {
        // Use quiet removal to avoid triggering re-render yet
        if (window.availableMap && window.availableMap[currentRole]) {
            delete window.availableMap[currentRole][previousMove];
        }
    }
    
    // Add newly selected move to available moves (but don't trigger re-render immediately)
    if (selectedMove && currentRole) {
        addLearnedMoveQuiet(currentRole, selectedMove);
        
        // Trigger a delayed re-render to show the new learned move
        setTimeout(() => {
            const event = new CustomEvent('availableMapUpdated', {
                detail: { role: currentRole, addedMove: selectedMove }
            });
            window.dispatchEvent(event);
        }, 100); // Delay to allow URL update to complete first
    } else if (!selectedMove && !previousMove) {
        // No selection change, don't trigger re-render
        return;
    }
}

// Get current role from the form (utility function)
function getCurrentRole() {
    const roleSelect = document.getElementById('role');
    return roleSelect ? roleSelect.value : null;
}

// Restore all learned moves from URL on page load/role change
function restoreLearnedMoves() {
    const currentRole = getCurrentRole();
    if (!currentRole || !window.availableMap || !window.availableMap[currentRole]) return;
    
    const urlParams = new URLSearchParams(location.search);
    const originalAvailable = {...window.availableMap[currentRole]}; // Copy original moves
    
    // Method 1: Find explicit takefrom selections in URL
    for (const [key, value] of urlParams.entries()) {
        if (key.includes('takefrom_') && key.endsWith('_move') && value) {
            addLearnedMoveQuiet(currentRole, value);
        }
    }
    
    // Method 2: Infer learned moves from checked moves that aren't originally available
    for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('move_') && value === '1') {
            const moveId = key.replace('move_', '').replace(/_\d+$/, ''); // Remove _1, _2 suffixes
            
            // If this move is checked but wasn't originally available to this role, it must be learned
            if (!originalAvailable.hasOwnProperty(moveId)) {
                // Check if this move exists and is available to other roles
                const moveExists = window.moves && window.moves.find(m => m.id === moveId);
                if (moveExists) {
                    // console.log('Inferred learned move:', moveId, 'for role:', currentRole);
                    addLearnedMoveQuiet(currentRole, moveId);
                }
            }
        }
    }
}

// Restore takefrom dropdown selections (called after DOM is updated)
function restoreTakeFromSelections() {
    const urlParams = new URLSearchParams(location.search);
    const currentRole = getCurrentRole();
    
    console.log('Restoring takefrom selections from URL:', location.search);
    console.log('Current role:', currentRole);
    
    // Method 1: Restore from explicit URL parameters
    for (const [key, value] of urlParams.entries()) {
        if (key.includes('takefrom_') && value) {
            console.log('Found takefrom parameter:', key, '=', value);
            const element = document.getElementById(key);
            console.log('Found element:', element ? element.tagName : 'NOT FOUND');
            
            if (element && element.tagName === 'SELECT') {
                element.value = value;
                console.log('Set', key, 'to value:', value, 'actual value now:', element.value);
                
                // If this is a role select, also update the move options
                if (key.endsWith('_role')) {
                    const moveId = key.replace('takefrom_', '').replace('_role', '');
                    const moveSelect = document.getElementById(`takefrom_${moveId}_move`);
                    console.log('Role select detected, updating move options for:', moveId);
                    
                    if (moveSelect) {
                        updateMoveOptions(element, moveSelect, moveId);
                        // Restore move selection with a small delay
                        setTimeout(() => {
                            const moveKey = `takefrom_${moveId}_move`;
                            if (urlParams.has(moveKey)) {
                                const moveValue = urlParams.get(moveKey);
                                console.log('Restoring move selection:', moveKey, '=', moveValue);
                                moveSelect.value = moveValue;
                                console.log('Move select value is now:', moveSelect.value);
                            }
                        }, 50);
                    }
                }
            }
        }
    }
    
    // Method 2: Infer dropdown selections from learned moves
    if (currentRole) {
        // Find takefrom moves that are checked but don't have explicit dropdown settings
        const takefromMoves = document.querySelectorAll('[id^="takefrom_"][id$="_role"]');
        takefromMoves.forEach(roleSelect => {
            const moveId = roleSelect.id.replace('takefrom_', '').replace('_role', '');
            const moveSelect = document.getElementById(`takefrom_${moveId}_move`);
            
            // If role is not set but we have a learned move, try to infer it
            if (roleSelect.value === '' && moveSelect) {
                // Look for learned moves in the URL
                for (const [key, value] of urlParams.entries()) {
                    if (key.startsWith('move_') && value === '1') {
                        const learnedMoveId = key.replace('move_', '').replace(/_\d+$/, '');
                        
                        // Check which role this move originally belongs to
                        console.log('Looking for learned move:', learnedMoveId, 'in availableMap');
                        for (const [role, moves] of Object.entries(window.availableMap || {})) {
                            console.log('Checking role:', role, 'moves:', Object.keys(moves));
                            if (role !== currentRole && moves.hasOwnProperty(learnedMoveId)) {
                                console.log('Found match! Setting dropdown to:', role, learnedMoveId);
                                // This move belongs to this role, set the dropdown
                                roleSelect.value = role;
                                updateMoveOptions(roleSelect, moveSelect, moveId);
                                setTimeout(() => {
                                    moveSelect.value = learnedMoveId;
                                    console.log('Set dropdown values:', roleSelect.value, moveSelect.value);
                                }, 100);
                                return; // Exit the loop once we find a match
                            }
                        }
                    }
                }
            }
        });
    }
}

// Add learned move without triggering re-render (quiet version)
function addLearnedMoveQuiet(currentRole, learnedMoveId) {
    if (currentRole && learnedMoveId && window.availableMap && window.availableMap[currentRole]) {
        window.availableMap[currentRole][learnedMoveId] = true;
    }
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
    
    // Add takefrom options if they exist
    if (move.takefrom && Array.isArray(move.takefrom) && move.takefrom.length > 0) {
        const takeFromElement = createTakeFromSection(move, urlParams);
        moveDiv.appendChild(takeFromElement);
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
window.restoreLearnedMoves = restoreLearnedMoves;
window.restoreTakeFromSelections = restoreTakeFromSelections;
