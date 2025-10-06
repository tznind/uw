// Advancement Card JavaScript
function initializeAdvancementCard() {
    console.log('Advancement card: Starting initialization');
    
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
        ],
        'Augmented': [
            'A surgical encounter is endured.',
            'A key component is installed.',
            'A limitation is surpassed.',
            'A body\'s limits are reached.',
            'An old wound causes new pain.'
        ],
        'Chosen': [
            'A heresy is vanquished.',
            'A scripture is fulfilled.',
            'A prayer is heeded.',
            'A sinner repents.',
            'A death is denied.'
        ],
        'Consul': [
            'An abuse of power is resisted.',
            'A taste of exotica is enjoyed.',
            'A voice is no longer silenced.',
            'An embarrassment proves critical.',
            'A foreign belief is embraced.'
        ],
        'Fanatic': [
            'An opponent is shown the error of their ways.',
            'A problem is purged by fire.',
            'A fear proves to be justified.',
            'An injustice is rectified.',
            'A hero suffers for their cause.'
        ],
        'Kinetic': [
            'A single pebble causes a landslide.',
            'A plan is thwarted by gravity.',
            'A great weight is lifted.',
            'A danger is turned aside.',
            'A moment balance is achieved.'
        ],
        'Psychic': [
            'An unwilling pawn acts.',
            'A future refused to change.',
            'A mind is opened.',
            'A great disturbance gives pause.',
            'An unquiet psyche finds rest.'
        ],
        'Shaper': [
            'An environment shifts to suit one\'s needs.',
            'A universal law is transgressed.',
            'A step is taken between two worlds.',
            'A fundamental change is wrought.',
            'A hard truth is reached.'
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
    
    // If no careers selected, show no advancements
    if (advancements.length === 0) {
        console.log('No careers selected, showing empty advancement list');
    }
    
    availableContainer.innerHTML = '';
    
    // Show message if no advancements available
    if (advancements.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-careers-message';
        message.style.cssText = 'text-align: center; color: #666; font-style: italic; padding: 20px 10px;';
        message.textContent = 'Select careers (Career 1 and/or Career 2) to see available advancements.';
        availableContainer.appendChild(message);
        return; // Exit early since there are no advancements to process
    }
    
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
            numberInput.id = `a${index}_s`;
            numberInput.name = `a${index}_s`;
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
            if (urlParams.has(`a${index}_s`)) {
                savedState = parseInt(urlParams.get(`a${index}_s`));
                numberInput.value = savedState.toString();
                console.log(`Found URL param a${index}_s=${savedState}`);
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
        let isDragging = false;
        let startX, startY;
        const DRAG_THRESHOLD = 8; // pixels to move before starting drag
        
        item.addEventListener('touchstart', function(e) {
            touchStarted = true;
            isDragging = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        item.addEventListener('touchmove', function(e) {
            if (!touchStarted) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Only start dragging if we've moved far enough
            if (!isDragging && distance > DRAG_THRESHOLD) {
                isDragging = true;
                item.classList.add('dragging');
            }
            
            // Only prevent scrolling and do drag behavior if we're actually dragging
            if (isDragging) {
                e.preventDefault(); // Prevent scrolling only when dragging
                
                // Move the item visually
                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                item.style.zIndex = '1000';
                
                // Find what we're hovering over - hide dragged element first
                const originalDisplay = item.style.display;
                item.style.display = 'none';
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                item.style.display = originalDisplay;
                
                let dropZone = null;
                if (elementBelow) {
                    // Try multiple ways to find the drop zone
                    dropZone = elementBelow.closest('.advancement-list') ||
                              elementBelow.querySelector('.advancement-list') ||
                              (elementBelow.classList.contains('advancement-list') ? elementBelow : null);
                }
                
                // Highlight drop zones
                document.querySelectorAll('.advancement-list').forEach(zone => {
                    zone.classList.remove('drag-over');
                });
                if (dropZone) {
                    dropZone.classList.add('drag-over');
                }
            }
        });
        
        item.addEventListener('touchend', function(e) {
            if (!touchStarted) return;
            
            let dropZone = null;
            
            // Only try to find drop zone if we were actually dragging
            if (isDragging) {
                const touch = e.changedTouches[0];
                
                // Hide dragged element to get accurate drop zone detection
                const originalDisplay = item.style.display;
                item.style.display = 'none';
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                item.style.display = originalDisplay;
                
                console.log('Touch end - elementBelow:', elementBelow?.className || elementBelow?.tagName || 'null');
                
                if (elementBelow) {
                    // More comprehensive drop zone detection
                    dropZone = elementBelow.closest('.advancement-list') ||
                              elementBelow.querySelector('.advancement-list') ||
                              (elementBelow.classList.contains('advancement-list') ? elementBelow : null);
                    
                    console.log('Found dropZone:', dropZone?.id || 'none');
                    
                    // If still no zone found, check if we're in a zone's vicinity
                    if (!dropZone) {
                        const zones = document.querySelectorAll('.advancement-list');
                        const touchRect = { x: touch.clientX, y: touch.clientY };
                        
                        zones.forEach(zone => {
                            const rect = zone.getBoundingClientRect();
                            const buffer = 20; // 20px buffer around zones
                            
                            if (touchRect.x >= rect.left - buffer && 
                                touchRect.x <= rect.right + buffer &&
                                touchRect.y >= rect.top - buffer && 
                                touchRect.y <= rect.bottom + buffer) {
                                dropZone = zone;
                            }
                        });
                    }
                }
            }
            
            // Reset visual state
            item.style.transform = '';
            item.style.zIndex = '';
            item.classList.remove('dragging');
            document.querySelectorAll('.advancement-list').forEach(zone => {
                zone.classList.remove('drag-over');
            });
            
            // Handle drop only if we found a valid zone and were dragging
            if (isDragging && dropZone && dropZone !== item.parentElement) {
                handleTouchDrop(item, dropZone);
            }
            
            // Reset state
            touchStarted = false;
            isDragging = false;
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
    
    console.log('Advancement card initialization complete');
}

function updateAdvancementState(advancementId, newState) {
    console.log(`Updating advancement ${advancementId} to state ${newState}`);
    const numberInput = document.querySelector(`#${advancementId}_s`);
    
    if (numberInput) {
        numberInput.value = newState.toString();
        console.log(`Set input #${advancementId}_s value to ${numberInput.value}`);
    } else {
        console.warn(`Could not find hidden input #${advancementId}_s`);
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
console.log('Advancement card script loaded, attempting initialization');
if (window.CardHelpers) {
    console.log('CardHelpers found, registering advancement card');
    window.CardHelpers.registerCard('advancement', initializeAdvancementCard);
    
    // Try immediate initialization
    const cardElement = document.querySelector('[data-card-id="advancement"]') || document.querySelector('.advancement-card');
    console.log('Looking for card element:', !!cardElement, cardElement?.className);
    if (cardElement) {
        console.log('Card element found, initializing immediately');
        initializeAdvancementCard();
    } else {
        console.log('Card element not found, waiting for callback');
    }
} else {
    console.log('CardHelpers not available, direct initialization');
    initializeAdvancementCard();
}

// Export for manual testing
window.initializeAdvancementCard = initializeAdvancementCard;
