/**
 * Core Moves Module - Basic move rendering functionality
 */

window.MovesCore = (function() {
    'use strict';

    /**
     * Create move checkboxes (single or multiple)
     */
    function createMoveCheckboxes(move, available, urlParams) {
        const checkboxCount = move.multiple || 1;
        const checkboxes = [];
        
        for (let i = 0; i < checkboxCount; i++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            
            // Add data attribute to identify the parent move
            checkbox.setAttribute('data-move-id', move.id);
            
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
            
            // Disable the first checkbox if the move is always available (true in availability map)
            if (i === 0 && available[move.id] === true) {
                checkbox.disabled = true;
                checkbox.checked = true; // Always ensure disabled checkboxes are checked
                checkbox.setAttribute('title', 'This move is always available for this role');
            }
            
            checkboxes.push(checkbox);
        }
        
        return checkboxes;
    }

    /**
     * Create move title with checkboxes and optional track display
     * @param {Object} move - The move data
     * @param {Array} checkboxes - Array of checkbox elements
     * @param {URLSearchParams} urlParams - URL parameters
     * @param {boolean} isNestedInCard - Whether this move is nested inside a granted card
     */
    function createMoveTitle(move, checkboxes, urlParams, isNestedInCard = false) {
        const titleContainer = document.createElement("div");
        titleContainer.className = "move-title";
        // Make the whole title area act as a disclosure control (except interactive elements)
        titleContainer.setAttribute('role', 'button');
        titleContainer.setAttribute('tabindex', '0');
        // Default expanded on initial render; collapse functions will update as needed
        titleContainer.setAttribute('aria-expanded', 'true');
        
        if (checkboxes.length === 1) {
            // Single checkbox - do NOT wrap in a label so title clicks don't toggle the checkbox
            const checkbox = checkboxes[0];
            checkbox.setAttribute('aria-label', checkbox.getAttribute('aria-label') || `Toggle ${move.title}`);
            
            const titleText = document.createElement("span");
            titleText.className = "move-title-text";
            titleText.textContent = move.title;
            
            titleContainer.appendChild(checkbox);
            titleContainer.appendChild(titleText);
        } else {
            // Multiple checkboxes - put checkboxes inline before title
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "move-checkboxes";
            
            checkboxes.forEach((checkbox) => {
                checkboxContainer.appendChild(checkbox);
            });
            
            const titleText = document.createElement("span");
            titleText.className = "move-title-text";
            titleText.textContent = move.title;
            
            titleContainer.appendChild(checkboxContainer);
            titleContainer.appendChild(titleText);
        }
        
        // Add track display if move has tracking (support both single track and multiple tracks)
        if ((move.track || move.tracks) && window.Track) {
            console.log('MovesCore: Found track/tracks for move:', move.id, 'calling createTrackDisplay');
            const trackDisplay = window.Track.createTrackDisplay(move, urlParams);
            if (trackDisplay) {
                console.log('MovesCore: Adding track display to title container for move:', move.id);
                titleContainer.appendChild(trackDisplay);
            } else {
                console.log('MovesCore: createTrackDisplay returned null for move:', move.id);
            }
        } else {
            console.log('MovesCore: No track system or no tracks for move:', move.id, 'track:', move.track, 'tracks:', move.tracks, 'window.Track:', !!window.Track);
        }
        
        // Add collapse/expand indicator (non-focusable, decorative)
        const collapseToggle = document.createElement("span");
        collapseToggle.className = "move-collapse-toggle";
        collapseToggle.setAttribute('aria-label', `Toggle ${move.title} details`);
        collapseToggle.setAttribute('role', 'presentation');
        collapseToggle.setAttribute('aria-hidden', 'true');
        collapseToggle.innerHTML = "-"; // Minus sign (expanded state)
        
        // Clicking the title background or text (but not inputs/buttons) toggles expand/collapse
        titleContainer.addEventListener('click', function(e) {
            // Ignore clicks on interactive elements to preserve their behavior
            if (e.target.closest('input, button, select, textarea, a, label')) {
                return;
            }
            toggleMoveCollapse(collapseToggle);
        });
        
        // Keyboard accessibility: Space/Enter on title toggles
        titleContainer.addEventListener('keydown', function(e) {
            // Only handle keyboard events if they originated from the title container itself,
            // not from interactive elements within it
            if (e.target !== titleContainer) {
                return;
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMoveCollapse(collapseToggle);
            }
        });
        
        titleContainer.appendChild(collapseToggle);
        
        return titleContainer;
    }

    /**
     * Create description display
     */
    function createDescription(move) {
        if (!move.description || move.description.trim() === "") {
            return null;
        }
        
        const descriptionDiv = document.createElement("div");
        descriptionDiv.className = "move-description";
        
        const p = document.createElement("p");
        p.textContent = move.description;
        descriptionDiv.appendChild(p);
        
        return descriptionDiv;
    }

    /**
     * Create outcome display
     */
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

    /**
     * Create granted card section
     */
    function createGrantedCardSection(move, urlParams) {
        if (!move.grantsCard || !window.InlineCards) {
            return null;
        }
        
        const containerId = `granted_card_${move.id}`;
        const cardSection = window.InlineCards.createCardContainer(containerId, "Grants:");
        
        // Use the existing isMoveTaken function to check if move is selected
        const isTaken = isMoveTaken(move, urlParams);
        
        if (isTaken) {
            // Show the card immediately if taken
            window.InlineCards.displayCard(containerId, move.grantsCard);
        } else {
            // Hide initially
            cardSection.style.display = 'none';
        }
        
        return cardSection;
    }

    /**
     * Create details input section
     */
    function createDetailsInput(move, urlParams) {
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "move-details";
        
        const label = document.createElement("label");
        label.setAttribute('for', `move_${move.id}_dtl`);
        label.textContent = "Details:";
        
        const input = document.createElement("input");
        input.type = "text";
        input.id = `move_${move.id}_dtl`;
        input.name = `move_${move.id}_dtl`;
        input.placeholder = "Add additional details...";
        input.setAttribute('aria-label', `Details for ${move.title}`);
        input.setAttribute('data-move-id', move.id);
        
        // Restore value from URL if exists
        if (urlParams.has(input.id)) {
            input.value = urlParams.get(input.id);
        }
        
        detailsDiv.appendChild(label);
        detailsDiv.appendChild(input);
        
        return detailsDiv;
    }

    /**
     * Create pick options section
     */
    function createPickOptions(move, urlParams) {
        const pickDiv = document.createElement("div");
        pickDiv.className = "pick-options";
        
        const pickTitle = document.createElement("strong");
        pickTitle.textContent = "Pick:";
        pickDiv.appendChild(pickTitle);
        
        const multiplePick = move.multiplePick || 1;
        const useColumns = move.pick.length > 10;
        
        if (multiplePick > 1) {
            // Create list with multiple checkboxes per option (like multiple moves)
            const pickList = document.createElement("ul");
            if (useColumns) {
                pickList.className = "pick-list-columns";
            }
            
            move.pick.forEach((option, optionIndex) => {
                const li = document.createElement("li");
                li.className = "pick-option-item";
                
                // Create multiple checkboxes for this option
                const checkboxContainer = document.createElement("div");
                checkboxContainer.className = "pick-checkboxes";
                
                for (let col = 1; col <= multiplePick; col++) {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    
                    // ID format: first column uses _p1, _p2, etc. Additional columns use _p1_c2, _p1_c3, etc.
                    const baseId = `move_${move.id}_p${optionIndex + 1}`;
                    checkbox.id = col === 1 ? baseId : `${baseId}_c${col}`;
                    checkbox.name = checkbox.id;
                    checkbox.setAttribute('aria-label', `Pick ${option} (Instance ${col})`);
                    checkbox.setAttribute('data-move-id', move.id);
                    
                    // Restore from URL if exists
                    if (urlParams.has(checkbox.id)) {
                        checkbox.checked = urlParams.get(checkbox.id) === '1';
                    }
                    
                    checkboxContainer.appendChild(checkbox);
                }
                
                // Add the option text after all checkboxes
                const optionText = document.createElement("span");
                optionText.className = "pick-option-text";
                optionText.textContent = option;
                
                li.appendChild(checkboxContainer);
                li.appendChild(optionText);
                pickList.appendChild(li);
            });
            
            pickDiv.appendChild(pickList);
        } else {
            // Single column layout (original behavior) or 2-column layout for large lists
            const pickList = document.createElement("ul");
            if (useColumns) {
                pickList.className = "pick-list-columns";
            }
            
            move.pick.forEach((option, index) => {
                const li = document.createElement("li");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                
                checkbox.id = `move_${move.id}_p${index + 1}`;
                checkbox.name = `move_${move.id}_p${index + 1}`;
                checkbox.setAttribute('aria-label', `Pick ${option}`);
                checkbox.setAttribute('data-move-id', move.id);
                
                // Restore from URL if exists
                if (urlParams.has(checkbox.id)) {
                    checkbox.checked = urlParams.get(checkbox.id) === '1';
                }
                
                const label = document.createElement("label");
                label.setAttribute('for', checkbox.id);
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(option));
                
                li.appendChild(label);
                pickList.appendChild(li);
            });
            
            pickDiv.appendChild(pickList);
        }
        
        return pickDiv;
    }

    /**
     * Create pickOne options section (radio buttons)
     */
    function createPickOneOptions(move, urlParams) {
        const pickOneDiv = document.createElement("div");
        pickOneDiv.className = "pick-one-options";
        
        const pickOneTitle = document.createElement("strong");
        pickOneTitle.textContent = "Pick One:";
        pickOneDiv.appendChild(pickOneTitle);
        
        const multiplePick = move.multiplePick || 1;
        const useColumns = move.pickOne.length > 10;
        
        if (multiplePick > 1) {
            // Create list with multiple radio buttons per option (like multiple moves)
            const pickOneList = document.createElement("ul");
            if (useColumns) {
                pickOneList.className = "pick-list-columns";
            }
            
            move.pickOne.forEach((option, optionIndex) => {
                const li = document.createElement("li");
                li.className = "pick-one-option-item";
                
                // Create multiple radio buttons for this option
                const radioContainer = document.createElement("div");
                radioContainer.className = "pick-one-radios";
                
                for (let col = 1; col <= multiplePick; col++) {
                    const radio = document.createElement("input");
                    radio.type = "radio";
                    
                    // Each column gets its own radio group
                    radio.name = col === 1 ? `move_${move.id}_pickone` : `move_${move.id}_pickone_c${col}`;
                    
                    // ID format: first column uses _o1, _o2, etc. Additional columns use _o1_c2, _o1_c3, etc.
                    const baseId = `move_${move.id}_o${optionIndex + 1}`;
                    radio.id = col === 1 ? baseId : `${baseId}_c${col}`;
                    radio.value = `${optionIndex + 1}`;
                    radio.setAttribute('aria-label', `Pick one: ${option} (Instance ${col})`);
                    radio.setAttribute('data-move-id', move.id);
                    
                    // Restore from URL if exists
                    if (urlParams.has(radio.id)) {
                        radio.checked = urlParams.get(radio.id) === '1';
                    }
                    
                    radioContainer.appendChild(radio);
                }
                
                // Add the option text after all radio buttons
                const optionText = document.createElement("span");
                optionText.className = "pick-one-option-text";
                optionText.textContent = option;
                
                li.appendChild(radioContainer);
                li.appendChild(optionText);
                pickOneList.appendChild(li);
            });
            
            pickOneDiv.appendChild(pickOneList);
        } else {
            // Single column layout (original behavior) or 2-column layout for large lists
            const pickOneList = document.createElement("ul");
            if (useColumns) {
                pickOneList.className = "pick-list-columns";
            }
            
            const radioGroupName = `move_${move.id}_pickone`;
            
            move.pickOne.forEach((option, index) => {
                const li = document.createElement("li");
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = radioGroupName;
                
                radio.id = `move_${move.id}_o${index + 1}`;
                radio.value = `${index + 1}`;
                radio.setAttribute('aria-label', `Pick one: ${option}`);
                radio.setAttribute('data-move-id', move.id);
                
                // Restore from URL if exists
                if (urlParams.has(radio.id)) {
                    radio.checked = urlParams.get(radio.id) === '1';
                }
                
                const label = document.createElement("label");
                label.setAttribute('for', radio.id);
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                
                li.appendChild(label);
                pickOneList.appendChild(li);
            });
            
            pickOneDiv.appendChild(pickOneList);
        }
        
        return pickOneDiv;
    }

    /**
     * Render a single move
     * @param {Object} move - The move data
     * @param {Object} available - Available moves map
     * @param {URLSearchParams} urlParams - URL parameters
     * @param {boolean} isNestedInCard - Whether this move is nested inside a granted card
     */
    function renderMove(move, available, urlParams, isNestedInCard = false) {
        const moveDiv = document.createElement("div");
        moveDiv.className = "move";
        
        // Create checkboxes and title
        const checkboxes = createMoveCheckboxes(move, available, urlParams);
        const titleContainer = createMoveTitle(move, checkboxes, urlParams, isNestedInCard);
        moveDiv.appendChild(titleContainer);
        
        // Create collapsible content container
        const contentContainer = document.createElement("div");
        contentContainer.className = "move-content";
        
        // Add description if it exists
        const descriptionElement = createDescription(move);
        if (descriptionElement) {
            contentContainer.appendChild(descriptionElement);
        }
        
        // Add outcomes if they exist
        if (move.outcomes && Array.isArray(move.outcomes) && move.outcomes.length > 0) {
            move.outcomes.forEach(outcome => {
                if (outcome) {
                    const outcomeElement = createOutcome(outcome);
                    contentContainer.appendChild(outcomeElement);
                }
            });
        }
        
        // Add pickOne options if they exist (render first as they're typically more fundamental)
        if (move.pickOne && Array.isArray(move.pickOne) && move.pickOne.length > 0) {
            const pickOneElement = createPickOneOptions(move, urlParams);
            contentContainer.appendChild(pickOneElement);
        }
        
        // Add pick options if they exist (render after pickOne as they're typically add-on features)
        if (move.pick && Array.isArray(move.pick) && move.pick.length > 0) {
            const pickElement = createPickOptions(move, urlParams);
            contentContainer.appendChild(pickElement);
        }
        
        // Add takeFrom section if it exists
        if (move.takeFrom && Array.isArray(move.takeFrom) && move.takeFrom.length > 0) {
            if (window.TakeFrom) {
                const takeFromSection = window.TakeFrom.createTakeFromSection(move, urlParams);
                contentContainer.appendChild(takeFromSection);
            }
        }
        
        // Add granted card section if move grants a card
        if (move.grantsCard) {
            const grantedCardSection = createGrantedCardSection(move, urlParams);
            if (grantedCardSection) {
                contentContainer.appendChild(grantedCardSection);
            }
        }
        
        // Add details input if specified
        if (move.details) {
            const detailsElement = createDetailsInput(move, urlParams);
            contentContainer.appendChild(detailsElement);
        }
        
        // Append content container to move div
        moveDiv.appendChild(contentContainer);
        
        return moveDiv;
    }

    /**
     * Create category header element
     */
    function createCategoryHeader(categoryName) {
        const headerElement = document.createElement("h3");
        headerElement.className = "category-header";
        headerElement.textContent = categoryName;
        return headerElement;
    }

    /**
     * Toggle collapse/expand state for a single move
     */
    function toggleMoveCollapse(toggleButton) {
        const moveDiv = toggleButton.closest('.move');
        if (!moveDiv) return;
        
        const contentContainer = moveDiv.querySelector('.move-content');
        if (!contentContainer) return;
        
        const isCurrentlyCollapsed = contentContainer.classList.contains('collapsed');
        
        if (isCurrentlyCollapsed) {
            // Expand - show minus sign
            contentContainer.classList.remove('collapsed');
            toggleButton.classList.remove('collapsed');
            toggleButton.innerHTML = '-'; // Minus (expanded state)
            toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Expand', 'Collapse'));
            const titleEl = moveDiv.querySelector('.move-title');
            if (titleEl) titleEl.setAttribute('aria-expanded', 'true');
        } else {
            // Collapse - show plus sign
            contentContainer.classList.add('collapsed');
            toggleButton.classList.add('collapsed');
            toggleButton.innerHTML = '+'; // Plus (collapsed state)
            toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Collapse', 'Expand'));
            const titleEl = moveDiv.querySelector('.move-title');
            if (titleEl) titleEl.setAttribute('aria-expanded', 'false');
        }
    }
    
    /**
     * Collapse all moves
     */
    function collapseAllMoves() {
        const allMoves = document.querySelectorAll('.move');
        allMoves.forEach(moveDiv => {
            const contentContainer = moveDiv.querySelector('.move-content');
            const toggleButton = moveDiv.querySelector('.move-collapse-toggle');
            
            if (contentContainer && toggleButton) {
                contentContainer.classList.add('collapsed');
                toggleButton.classList.add('collapsed');
                toggleButton.innerHTML = '+'; // Plus (collapsed state)
                toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Collapse', 'Expand'));
                const titleEl = moveDiv.querySelector('.move-title');
                if (titleEl) titleEl.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    /**
     * Expand all moves
     */
    function expandAllMoves() {
        const allMoves = document.querySelectorAll('.move');
        allMoves.forEach(moveDiv => {
            const contentContainer = moveDiv.querySelector('.move-content');
            const toggleButton = moveDiv.querySelector('.move-collapse-toggle');
            
            if (contentContainer && toggleButton) {
                contentContainer.classList.remove('collapsed');
                toggleButton.classList.remove('collapsed');
                toggleButton.innerHTML = '-' ; // Minus (expanded state)
                toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Expand', 'Collapse'));
                const titleEl = moveDiv.querySelector('.move-title');
                if (titleEl) titleEl.setAttribute('aria-expanded', 'true');
            }
        });
    }
    
    /**
     * Get current collapse state of all moves
     * Returns a map of move titles to their collapse state
     */
    function getCurrentCollapseState() {
        const collapseState = new Map();
        const allMoves = document.querySelectorAll('.move');
        
        allMoves.forEach(moveDiv => {
            const titleElement = moveDiv.querySelector('.move-title label, .move-title .move-title-text');
            const contentContainer = moveDiv.querySelector('.move-content');
            
            if (titleElement && contentContainer) {
                // Extract move title text
                const moveTitle = titleElement.textContent || titleElement.innerText;
                const isCollapsed = contentContainer.classList.contains('collapsed');
                collapseState.set(moveTitle.trim(), isCollapsed);
            }
        });
        
        console.log('MovesCore: Stored collapse state for', collapseState.size, 'moves');
        return collapseState;
    }
    
    /**
     * Restore collapse state for moves
     * @param {Map} collapseState - Map of move titles to collapse state
     */
    function restoreCollapseState(collapseState) {
        if (!collapseState || collapseState.size === 0) {
            console.log('MovesCore: No collapse state to restore');
            return;
        }
        
        const allMoves = document.querySelectorAll('.move');
        let restoredCount = 0;
        
        allMoves.forEach(moveDiv => {
            const titleElement = moveDiv.querySelector('.move-title label, .move-title .move-title-text');
            const contentContainer = moveDiv.querySelector('.move-content');
            const toggleButton = moveDiv.querySelector('.move-collapse-toggle');
            
            if (titleElement && contentContainer && toggleButton) {
                const moveTitle = (titleElement.textContent || titleElement.innerText).trim();
                const shouldBeCollapsed = collapseState.get(moveTitle);
                
                if (shouldBeCollapsed !== undefined) {
                    if (shouldBeCollapsed) {
                        // Collapse this move - show plus sign
                        contentContainer.classList.add('collapsed');
                        toggleButton.classList.add('collapsed');
                        toggleButton.innerHTML = '+'; // Plus (collapsed state)
                        toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Collapse', 'Expand'));
                        const titleEl = moveDiv.querySelector('.move-title');
                        if (titleEl) titleEl.setAttribute('aria-expanded', 'false');
                    } else {
                        // Ensure this move is expanded - show minus sign
                        contentContainer.classList.remove('collapsed');
                        toggleButton.classList.remove('collapsed');
                        toggleButton.innerHTML = '-' ; // Minus (expanded state)
                        toggleButton.setAttribute('aria-label', toggleButton.getAttribute('aria-label').replace('Expand', 'Collapse'));
                        const titleEl = moveDiv.querySelector('.move-title');
                        if (titleEl) titleEl.setAttribute('aria-expanded', 'true');
                    }
                    restoredCount++;
                }
            }
        });
        
        console.log('MovesCore: Restored collapse state for', restoredCount, 'moves');
    }

    /**
     * Check if a move is "taken" based on URL parameters
     */
    function isMoveTaken(move, urlParams) {
        // Check main move checkboxes
        const moveCheckboxId = `move_${move.id}`;
        if (urlParams.get(moveCheckboxId) === '1') {
            return true;
        }
        
        // Check multiple move checkboxes if they exist
        if (move.multiple) {
            for (let i = 1; i <= move.multiple; i++) {
                if (urlParams.get(`move_${move.id}_${i}`) === '1') {
                    return true;
                }
            }
        }
        
        // Check pick option checkboxes if they exist (_p1, _p2, etc. and _p1_c2, _p1_c3, etc.)
        if (move.pick && Array.isArray(move.pick)) {
            const multiplePick = move.multiplePick || 1;
            for (let i = 1; i <= move.pick.length; i++) {
                // Check first column
                if (urlParams.get(`move_${move.id}_p${i}`) === '1') {
                    return true;
                }
                // Check additional columns if multiplePick > 1
                for (let col = 2; col <= multiplePick; col++) {
                    if (urlParams.get(`move_${move.id}_p${i}_c${col}`) === '1') {
                        return true;
                    }
                }
            }
        }
        
        // Check pickOne option radio buttons if they exist (_o1, _o2, etc. and _o1_c2, _o1_c3, etc.)
        if (move.pickOne && Array.isArray(move.pickOne)) {
            const multiplePick = move.multiplePick || 1;
            for (let i = 1; i <= move.pickOne.length; i++) {
                // Check first column
                if (urlParams.get(`move_${move.id}_o${i}`) === '1') {
                    return true;
                }
                // Check additional columns if multiplePick > 1
                for (let col = 2; col <= multiplePick; col++) {
                    if (urlParams.get(`move_${move.id}_o${i}_c${col}`) === '1') {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    /**
     * Sort categories according to global configuration
     * @param {Array<string>} categories - Array of category names to sort
     * @returns {Array<string>} Sorted array of category names
     */
    function sortCategories(categories) {
        // Get the global category order if available
        const categoryOrder = window.categoriesConfig?.order || [];
        
        if (categoryOrder.length === 0) {
            // No category order defined, fall back to alphabetical sorting
            return categories.sort();
        }
        
        // Create a map of category name to its position in the order
        const orderMap = new Map();
        categoryOrder.forEach((category, index) => {
            orderMap.set(category, index);
        });
        
        // Sort categories using the order map, with undefined positions at the end
        return categories.sort((a, b) => {
            const posA = orderMap.get(a);
            const posB = orderMap.get(b);
            
            // If both are in the order list, sort by position
            if (posA !== undefined && posB !== undefined) {
                return posA - posB;
            }
            
            // If only A is in the order list, A comes first
            if (posA !== undefined && posB === undefined) {
                return -1;
            }
            
            // If only B is in the order list, B comes first
            if (posA === undefined && posB !== undefined) {
                return 1;
            }
            
            // If neither is in the order list, sort alphabetically
            return a.localeCompare(b);
        });
    }

    /**
     * Group moves by category
     */
    function groupMovesByCategory(moves, available, hideUntaken = false, urlParams = null) {
        console.log('groupMovesByCategory called with:');
        console.log('- Total moves:', moves.length);
        console.log('- Available moves:', Object.keys(available));
        console.log('- Looking for move "is":', moves.find(m => m.id === 'is'));
        console.log('- "is" in available:', available.hasOwnProperty('is'), available['is']);
        
        const categorized = new Map(); // Map of category name to moves
        
        moves.forEach(move => {
            if (available.hasOwnProperty(move.id)) {
                // Skip untaken moves if hideUntaken is true
                if (hideUntaken && urlParams && !isMoveTaken(move, urlParams)) {
                    return;
                }
                
                // All moves should have a category by now (normalized to "Moves" if empty)
                const category = move.category || "Moves";
                if (!categorized.has(category)) {
                    categorized.set(category, []);
                }
                categorized.get(category).push(move);
            }
        });
        
        return categorized;
    }


    /**
     * Render all moves for roles with merged availability
     */
    function renderMovesForRole(roles, mergedAvailability) {
        const movesContainer = document.getElementById("moves");
        if (!movesContainer) return;
        
        movesContainer.innerHTML = "";
        
        if (!roles || roles.length === 0 || !mergedAvailability) {
            return;
        }
        
        const urlParams = new URLSearchParams(location.search);
        
        // Check if hiding untaken moves
        const hideUntakenCheckbox = document.getElementById('hide_untaken');
        const hideUntaken = hideUntakenCheckbox && hideUntakenCheckbox.checked;
        
        // Group moves by category using merged availability
        const categorized = groupMovesByCategory(window.moves, mergedAvailability, hideUntaken, urlParams);
        
        // Add role information to the header
        if (roles.length > 1) {
            const rolesHeader = document.createElement("h2");
            rolesHeader.className = "roles-header";
            rolesHeader.textContent = `Roles: ${roles.join(', ')}`;
            movesContainer.appendChild(rolesHeader);
        }
        
        // Sort categories according to configuration
        const sortedCategories = sortCategories(Array.from(categorized.keys()));
        
        // Render categories in sorted order
        sortedCategories.forEach(categoryName => {
            const categoryHeader = createCategoryHeader(categoryName);
            movesContainer.appendChild(categoryHeader);
            
            const categoryMoves = categorized.get(categoryName);
            categoryMoves.forEach(move => {
                const moveElement = renderMove(move, mergedAvailability, urlParams);
                movesContainer.appendChild(moveElement);
            });
        });
    }

    // Public API
    return {
        createMoveCheckboxes,
        createMoveTitle,
        createDescription,
        createOutcome,
        createDetailsInput,
        createPickOptions,
        createPickOneOptions,
        createCategoryHeader,
        sortCategories,
        groupMovesByCategory,
        isMoveTaken,
        renderMove,
        renderMovesForRole,
        toggleMoveCollapse,
        collapseAllMoves,
        expandAllMoves,
        getCurrentCollapseState,
        restoreCollapseState
    };
})();
