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
    advancements.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'advancement-item';
        item.textContent = text;
        item.id = `advancement_${index}`;
        item.draggable = true;
        item.dataset.advancementId = `advancement_${index}`;
        
        // Add drag event listeners
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
        
        availableContainer.appendChild(item);
        console.log(`Added draggable advancement: ${text}`);
    });
    
    // Set up drop zones
    setupDropZones();
    
    console.log('Advancement card initialization complete');
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
                    }
                }
                
                // Move the item
                zone.appendChild(draggedElement);
                
                // Check if we need to show the current goal hint again
                const currentGoal = document.querySelector('#current-goal');
                if (currentGoal && !currentGoal.querySelector('.advancement-item')) {
                    const hint = currentGoal.querySelector('.zone-hint');
                    if (hint) hint.style.display = 'block';
                }
                
                console.log(`Successfully moved ${draggedId} to ${zone.id}`);
            }
        });
    });
    
    console.log(`Set up ${dropZones.length} drop zones`);
}

// Simple registration with CardHelpers
console.log('About to register advancement card');
if (window.CardHelpers) {
    console.log('Registering advancement card with CardHelpers');
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
