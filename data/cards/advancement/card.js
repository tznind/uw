// Advancement Card JavaScript
function initializeAdvancementCard() {
    
    // Find containers
    const availableContainer = document.querySelector('#available-advancements');
    const currentGoalContainer = document.querySelector('#current-goal');
    const achievedContainer = document.querySelector('#achieved-advancements');
    const hiddenContainer = document.querySelector('.hidden-advancement-state');
    
    if (!availableContainer) {
        console.error('Advancement card: Available container not found!');
        return;
    }
    // Career-specific advancement definitions
    const careerAdvancements = {
        'Academic': [
            'A life is saved or destroyed by science.',
            'A vital lesson is imparted.',
            'An experiment yields surprising results.',
            'A subject is thoroughly analyzed.',
            'A fascinating phenomenon is explained.'
        ],
        'Clandestine': [
            'An intentional "accident" happens.',
            'A victim experiences true fear.',
            'A conspiracy is uncovered.',
            'An act is performed covertly.',
            'A dark secret is extracted.'
        ],
        'Commercial': [
            'A solution is purchased.',
            'A frivolous expense is made.',
            'A celebration is held.',
            'A rich resource is found.',
            'A cargo unit is exchanged.'
        ],
        'Explorer': [
            'An alien wilderness is traversed.',
            'A bold act fails spectacularly.',
            'A needed item is scrounged up.',
            'A ludicrous stunt turns the tides.',
            'A forgotten place is excavated.'
        ],
        'Industrial': [
            'A piece of junk proves pivotal.',
            'A piece of technology is "improved".',
            'A breakage occurs.',
            'An explosion alters the situation.',
            'A structural weakness is exposed.'
        ],
        'Military': [
            'An objective is taken by force.',
            'A perilous order is obeyed.',
            'An injury is sustained.',
            'A problem is resolved with firepower.',
            'A worthy enemy is exterminated.'
        ],
        'Personality': [
            'A relationship changes drastically.',
            'A statement starts or ends a fight.',
            'A difficult promise is upheld.',
            'A rumor spreads like wildfire.',
            'An unlikely hero is exalted.'
        ],
        'Scoundrel': [
            'A deal ends in betrayal.',
            'A broken law goes unpunished.',
            'A valuable is stolen.',
            'A threat is pre-emptively removed.',
            'An unsuspecting victim is exploited.'
        ],
        'Starfarer': [
            'A passenger reaches a destination.',
            'A solution leverages gravity.',
            'A piloting maneuver causes a reversal.',
            'A system is pushed to the limit.',
            'A new culture is experienced.'
        ],
        'Technocrat': [
            'A system\'s security is breached.',
            'A solution is found on the SectorNet.',
            'A computer crash causes chaos.',
            'A pivotal data cluster is accessed.',
            'An offending program is expunged.'
        ]
    };
    
    // Get current careers from URL parameters or form fields (like workspace card does)
    function getSelectedCareers() {
        const params = new URLSearchParams(window.location.search);
        const careers = [];
        
        // Check role2 and role3 (careers)
        const role2 = params.get('role2') || document.querySelector('#role2')?.value;
        const role3 = params.get('role3') || document.querySelector('#role3')?.value;
        
        if (role2) careers.push(role2);
        if (role3) careers.push(role3);
        
        return careers;
    }
    
    const careers = getSelectedCareers();
    let advancements = [];
    
    // Collect all advancements from selected careers
    careers.forEach(career => {
        if (careerAdvancements[career]) {
            advancements.push(...careerAdvancements[career]);
        }
    });
    
    // Remove duplicates if any exist
    advancements = [...new Set(advancements)];
    
    // Fallback to Academic if no advancements found
    if (advancements.length === 0) {
        advancements = careerAdvancements['Academic'] || [];
    }
    
    availableContainer.innerHTML = '';
    
    // Create hidden container for persistence if it doesn't exist
    let hiddenContainerElement = hiddenContainer;
    if (!hiddenContainerElement) {
        const newHiddenContainer = document.createElement('div');
        newHiddenContainer.className = 'hidden-advancement-state';
        newHiddenContainer.style.display = 'none';
        availableContainer.parentElement.parentElement.appendChild(newHiddenContainer);
        hiddenContainerElement = newHiddenContainer;
    }
    
    advancements.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'advancement-item';
        item.textContent = text;
        item.id = `a${index}`;
        item.draggable = true;
        item.dataset.advancementId = `a${index}`;
        
        // Check if hidden input already exists (created by main persistence system)
        let numberInput = document.querySelector(`input[name="a${index}"]`);
        
        if (!numberInput) {
            // Create hidden number input for URL persistence (0=available, 1=current, 2=achieved)
            numberInput = document.createElement('input');
            numberInput.type = 'number';
            numberInput.id = `a${index}_state`; // Different ID to avoid conflicts
            numberInput.name = `a${index}`; // Keep same name for URL params
            numberInput.min = '0';
            numberInput.max = '2';
            numberInput.value = '0'; // Default to available
            hiddenContainerElement.appendChild(numberInput);
        }
        
        // Check if there's a saved state (either from existing input or URL)
        let savedState = 0; // Default to available
        
        if (numberInput.value && numberInput.value !== '0') {
            // Input already has a value (likely from main persistence system)
            savedState = parseInt(numberInput.value);
        } else {
            // Check URL parameters as fallback
            const urlParams = new URLSearchParams(window.location.search);
            // Check both possible parameter names (short and legacy)
            if (urlParams.has(`a${index}`)) {
                savedState = parseInt(urlParams.get(`a${index}`));
                numberInput.value = savedState.toString();
            } else if (urlParams.has(`advancement_${index}`)) {
                // Legacy support for old long IDs
                savedState = parseInt(urlParams.get(`advancement_${index}`));
                numberInput.value = savedState.toString();
            } else if (urlParams.has(`advancement_${index}_state`)) {
                // Legacy support for old long IDs
                savedState = parseInt(urlParams.get(`advancement_${index}_state`));
                numberInput.value = savedState.toString();
            }
        }
        
        // Add drag event listeners (desktop) - BEFORE state restoration so all items get them
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function(e) {
            item.classList.remove('dragging');
        });
        
        // Add touch event listeners (mobile)
        let touchStarted = false;
        let startX, startY;
        
        item.addEventListener('touchstart', function(e) {
            touchStarted = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            item.classList.add('dragging');
        });
        
        item.addEventListener('touchmove', function(e) {
            if (!touchStarted) return;
            e.preventDefault(); // Prevent scrolling
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // Move the item visually
            item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            item.style.zIndex = '1000';
            
            // Find what we're hovering over
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow ? elementBelow.closest('.advancement-list') : null;
            
            // Highlight drop zones
            document.querySelectorAll('.advancement-list').forEach(zone => {
                zone.classList.remove('drag-over');
            });
            if (dropZone) {
                dropZone.classList.add('drag-over');
            }
        });
        
        item.addEventListener('touchend', function(e) {
            if (!touchStarted) return;
            touchStarted = false;
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow ? elementBelow.closest('.advancement-list') : null;
            
            // Reset visual state
            item.style.transform = '';
            item.style.zIndex = '';
            item.classList.remove('dragging');
            document.querySelectorAll('.advancement-list').forEach(zone => {
                zone.classList.remove('drag-over');
            });
            
            // Handle drop
            if (dropZone && dropZone !== item.parentElement) {
                handleTouchDrop(item, dropZone);
            }
        });
        
        // Add double-tap fallback for mobile
        let lastTap = 0;
        item.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                e.preventDefault();
                cycleThroughZones(item);
            }
            lastTap = currentTime;
        });
        
        // Now handle state restoration and placement AFTER event listeners are set up
        if (savedState >= 0 && savedState <= 2) {
            // Apply appropriate styling and placement based on saved state
            if (savedState === 1) {
                // Current goal
                item.classList.add('in-current-goal');
                if (currentGoalContainer) {
                    currentGoalContainer.appendChild(item);
                    const hint = currentGoalContainer.querySelector('.zone-hint');
                    if (hint) hint.style.display = 'none';
                    currentGoalContainer.classList.add('has-item');
                } else {
                    // Fallback to available if current goal container not found
                    availableContainer.appendChild(item);
                }
            } else if (savedState === 2) {
                // Achieved
                item.classList.add('achieved');
                if (achievedContainer) {
                    achievedContainer.appendChild(item);
                } else {
                    // Fallback to available if achieved container not found
                    availableContainer.appendChild(item);
                }
            } else {
                // Available (default)
                availableContainer.appendChild(item);
            }
        } else {
            // Invalid state, default to available
            availableContainer.appendChild(item);
        }
    });
    
    // Set up drop zones
    setupDropZones();
    
    // Listen for career changes to update advancement options (like workspace card does)
    document.addEventListener('change', function(event) {
        if (event.target.id === 'role2' || event.target.id === 'role3') {
            setTimeout(() => initializeAdvancementCard(), 100);
        }
    });
}

function updateAdvancementState(advancementId, newState) {
    // Try to find input with _state suffix first (our created inputs)
    let numberInput = document.querySelector(`#${advancementId}_state`);
    
    // If not found, try to find by name attribute (persistence system inputs)
    if (!numberInput) {
        numberInput = document.querySelector(`input[name="${advancementId}"]`);
    }
    
    if (numberInput) {
        numberInput.value = newState.toString();
    }
}

function cycleThroughZones(item) {
    const currentContainer = item.parentElement;
    let targetZone;
    
    // Cycle: Available -> Current Goal -> Achieved -> Available
    switch (currentContainer.id) {
        case 'available-advancements':
            targetZone = document.querySelector('#current-goal');
            break;
        case 'current-goal':
            targetZone = document.querySelector('#achieved-advancements');
            break;
        case 'achieved-advancements':
            targetZone = document.querySelector('#available-advancements');
            break;
        default:
            targetZone = document.querySelector('#available-advancements');
    }
    
    if (targetZone) {
        handleTouchDrop(item, targetZone);
    }
}

function handleTouchDrop(draggedElement, zone) {
    // Same logic as desktop drop but without dataTransfer
    if (draggedElement && zone !== draggedElement.parentElement) {
        // Handle current goal zone hint
        if (zone.id === 'current-goal') {
            const hint = zone.querySelector('.zone-hint');
            if (hint) hint.style.display = 'none';
            
            // Only allow one item in current goal
            const existingItem = zone.querySelector('.advancement-item');
            if (existingItem) {
                const availableZone = document.querySelector('#available-advancements');
                availableZone.appendChild(existingItem);
                
                // Update the existing item's state
                updateAdvancementState(existingItem.dataset.advancementId, 0);
                existingItem.classList.remove('achieved', 'in-current-goal');
            }
        }
        
        // Determine new state based on zone
        let newState = 0; // Available
        if (zone.id === 'current-goal') {
            newState = 1; // Current goal
        } else if (zone.id === 'achieved-advancements') {
            newState = 2; // Achieved
        }
        
        // Update the hidden input
        updateAdvancementState(draggedElement.dataset.advancementId, newState);
        
        // Update item styling based on zone
        if (zone.id === 'achieved-advancements') {
            draggedElement.classList.add('achieved');
            draggedElement.classList.remove('in-current-goal');
        } else if (zone.id === 'current-goal') {
            draggedElement.classList.add('in-current-goal');
            draggedElement.classList.remove('achieved');
        } else {
            draggedElement.classList.remove('achieved', 'in-current-goal');
        }
        
        // Move the item
        zone.appendChild(draggedElement);
        
        // Update current goal zone styling
        const currentGoal = document.querySelector('#current-goal');
        if (currentGoal) {
            const hasItem = currentGoal.querySelector('.advancement-item');
            const hint = currentGoal.querySelector('.zone-hint');
            
            if (hasItem) {
                currentGoal.classList.add('has-item');
                if (hint) hint.style.display = 'none';
            } else {
                currentGoal.classList.remove('has-item');
                if (hint) hint.style.display = 'block';
            }
        }
        
        // Save to URL
        if (window.Persistence) {
            const form = document.querySelector('form');
            if (form) {
                window.Persistence.saveToURL(form);
            }
        }
    }
}

function setupDropZones() {
    const dropZones = document.querySelectorAll('.advancement-list');
    
    dropZones.forEach(zone => {
        
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragenter', function(e) {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function(e) {
            // Only remove if we're actually leaving the zone
            if (!zone.contains(e.relatedTarget)) {
                zone.classList.remove('drag-over');
            }
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);
            
            if (draggedElement && zone !== draggedElement.parentElement) {
                // Handle current goal zone hint
                if (zone.id === 'current-goal') {
                    const hint = zone.querySelector('.zone-hint');
                    if (hint) hint.style.display = 'none';
                    
                    // Only allow one item in current goal
                    const existingItem = zone.querySelector('.advancement-item');
                    if (existingItem) {
                        const availableZone = document.querySelector('#available-advancements');
                        availableZone.appendChild(existingItem);
                        
                        // Update the existing item's state
                        updateAdvancementState(existingItem.dataset.advancementId, 0);
                        existingItem.classList.remove('achieved', 'in-current-goal');
                    }
                }
                
                // Determine new state based on zone
                let newState = 0; // Available
                if (zone.id === 'current-goal') {
                    newState = 1; // Current goal
                } else if (zone.id === 'achieved-advancements') {
                    newState = 2; // Achieved
                }
                
                // Update the hidden input
                updateAdvancementState(draggedElement.dataset.advancementId, newState);
                
                // Update item styling based on zone
                if (zone.id === 'achieved-advancements') {
                    draggedElement.classList.add('achieved');
                    draggedElement.classList.remove('in-current-goal');
                } else if (zone.id === 'current-goal') {
                    draggedElement.classList.add('in-current-goal');
                    draggedElement.classList.remove('achieved');
                } else {
                    draggedElement.classList.remove('achieved', 'in-current-goal');
                }
                
                // Move the item
                zone.appendChild(draggedElement);
                
                // Update current goal zone styling
                const currentGoal = document.querySelector('#current-goal');
                if (currentGoal) {
                    const hasItem = currentGoal.querySelector('.advancement-item');
                    const hint = currentGoal.querySelector('.zone-hint');
                    
                    if (hasItem) {
                        currentGoal.classList.add('has-item');
                        if (hint) hint.style.display = 'none';
                    } else {
                        currentGoal.classList.remove('has-item');
                        if (hint) hint.style.display = 'block';
                    }
                }
                
                // Save to URL
                if (window.Persistence) {
                    const form = document.querySelector('form');
                    if (form) {
                        window.Persistence.saveToURL(form);
                    }
                }
            }
        });
    });
}

// Initialize card when ready
if (window.CardHelpers) {
    window.CardHelpers.registerCard('advancement', initializeAdvancementCard);
    
    // Try immediate initialization
    const cardElement = document.querySelector('[data-card-id="advancement"]') || document.querySelector('.advancement-card');
    if (cardElement) {
        initializeAdvancementCard();
    }
} else {
    initializeAdvancementCard();
}

// Export for manual testing
window.initializeAdvancementCard = initializeAdvancementCard;
