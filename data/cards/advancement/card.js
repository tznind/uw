// Advancement Card JavaScript - Minimal version for debugging
console.log('Advancement card script is loading!');
console.log('CardHelpers available:', !!window.CardHelpers);
console.log('Document ready state:', document.readyState);

// Simple initialization function
function initializeAdvancementCard() {
    console.log('Advancement card: Starting initialization');
    
    // Find containers
    const availableContainer = document.querySelector('#available-advancements');
    const currentGoalContainer = document.querySelector('#current-goal');
    const achievedContainer = document.querySelector('#achieved-advancements');
    const hiddenContainer = document.querySelector('.hidden-advancement-state');
    
    console.log('Containers found:', {
        available: !!availableContainer,
        currentGoal: !!currentGoalContainer,
        achieved: !!achievedContainer,
        hidden: !!hiddenContainer
    });
    
    if (!availableContainer) {
        console.error('Available container not found!');
        return;
    }
    
    // Simple test - just add some items
    const advancements = [
        'Increase a stat by +1',
        'Gain a new move from your careers',
        'Gain a new move from another career',
        'Gain a new move from your origin',
        'Change your class'
    ];
    
    availableContainer.innerHTML = '';
    
    // Create hidden container for persistence if it doesn't exist
    if (!hiddenContainer) {
        const newHiddenContainer = document.createElement('div');
        newHiddenContainer.className = 'hidden-advancement-state';
        newHiddenContainer.style.display = 'none';
        availableContainer.parentElement.parentElement.appendChild(newHiddenContainer);
        hiddenContainer = newHiddenContainer;
    } else {
        hiddenContainer.innerHTML = '';
    }
    
    advancements.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'advancement-item';
        item.textContent = text;
        item.id = `advancement_${index}`;
        item.draggable = true;
        item.dataset.advancementId = `advancement_${index}`;
        
        // Create hidden number input for URL persistence (0=available, 1=current, 2=achieved)
        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.id = `advancement_${index}`;
        numberInput.name = `advancement_${index}`;
        numberInput.min = '0';
        numberInput.max = '2';
        numberInput.value = '0'; // Default to available
        hiddenContainer.appendChild(numberInput);
        
        // Check if there's a saved state in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has(`advancement_${index}`)) {
            const savedState = parseInt(urlParams.get(`advancement_${index}`));
            if (savedState >= 0 && savedState <= 2) {
                numberInput.value = savedState.toString();
                
                // Apply appropriate styling and placement
                if (savedState === 1) {
                    // Current goal
                    item.classList.add('in-current-goal');
                    if (currentGoalContainer) {
                        currentGoalContainer.appendChild(item);
                        const hint = currentGoalContainer.querySelector('.zone-hint');
                        if (hint) hint.style.display = 'none';
                        currentGoalContainer.classList.add('has-item');
                        console.log(`Restored ${item.id} to current goal`);
                        return; // Skip adding to available container
                    }
                } else if (savedState === 2) {
                    // Achieved
                    item.classList.add('achieved');
                    if (achievedContainer) {
                        achievedContainer.appendChild(item);
                        console.log(`Restored ${item.id} to achieved`);
                        return; // Skip adding to available container
                    }
                }
            }
        }
        
        // Add drag event listeners (desktop)
        item.addEventListener('dragstart', function(e) {
            console.log('Drag started for:', text);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function(e) {
            console.log('Drag ended for:', text);
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
            console.log('Touch started for:', text);
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
                console.log(`Touch moving ${item.id} to ${dropZone.id}`);
                handleTouchDrop(item, dropZone);
            }
            
        console.log('Touch ended for:', text);
        });
        
        // Add double-tap fallback for mobile
        let lastTap = 0;
        item.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                e.preventDefault();
                console.log('Double tap detected on:', text);
                cycleThroughZones(item);
            }
            lastTap = currentTime;
        });
        
        availableContainer.appendChild(item);
        console.log(`Added draggable advancement: ${text}`);
    });
    
    // Set up drop zones
    setupDropZones();
    
    console.log('Advancement card initialization complete');
}

function updateAdvancementState(advancementId, newState) {
    const numberInput = document.querySelector(`#${advancementId}`);
    if (numberInput) {
        numberInput.value = newState.toString();
        console.log(`Updated ${advancementId} state to ${newState}`);
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
        console.log(`Double-tap cycling ${item.id} from ${currentContainer.id} to ${targetZone.id}`);
        handleTouchDrop(item, targetZone);
    }
}

function handleTouchDrop(draggedElement, zone) {
    console.log(`Touch drop: Moving ${draggedElement.id} to ${zone.id}`);
    
    // Same logic as desktop drop but without dataTransfer
    if (draggedElement && zone !== draggedElement.parentElement) {
        // Handle current goal zone hint
        if (zone.id === 'current-goal') {
            const hint = zone.querySelector('.zone-hint');
            if (hint) hint.style.display = 'none';
            
            // Only allow one item in current goal
            const existingItem = zone.querySelector('.advancement-item');
            if (existingItem) {
                console.log('Moving existing current goal back to available (touch)');
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
                console.log('Touch state saved to URL');
            }
        }
        
        console.log(`Touch drop successful: ${draggedElement.id} moved to ${zone.id} with state ${newState}`);
    }
}

function setupDropZones() {
    console.log('Setting up drop zones');
    const dropZones = document.querySelectorAll('.advancement-list');
    
    dropZones.forEach(zone => {
        console.log('Setting up drop zone:', zone.id);
        
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
                console.log(`Moving ${draggedId} to ${zone.id}`);
                
                // Handle current goal zone hint
                if (zone.id === 'current-goal') {
                    const hint = zone.querySelector('.zone-hint');
                    if (hint) hint.style.display = 'none';
                    
                    // Only allow one item in current goal
                    const existingItem = zone.querySelector('.advancement-item');
                    if (existingItem) {
                        console.log('Moving existing current goal back to available');
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
                        console.log('State saved to URL');
                    }
                }
                
                console.log(`Successfully moved ${draggedId} to ${zone.id} with state ${newState}`);
            }
        });
    });
}

// Initialize card when ready
if (window.CardHelpers) {
    // Register callback with CardHelpers
    console.log('Registering advancement card initialization callback');
    
    window.CardHelpers.registerCard('advancement', initializeAdvancementCard);
    
    // Try immediate initialization
    const cardElement = document.querySelector('[data-card-id="advancement"]') || document.querySelector('.advancement-card');
    if (cardElement) {
        console.log('Advancement card found, initializing immediately');
        initializeAdvancementCard();
    } else {
        console.log('Advancement card not found, will wait for callback');
    }
} else {
    console.log('CardHelpers not available, using direct initialization');
    initializeAdvancementCard();
}

// Export for manual testing
window.initializeAdvancementCard = initializeAdvancementCard;
console.log('Advancement card script loaded successfully');
