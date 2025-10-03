// Advancement Card JavaScript - XP tracking and drag-and-drop advancements
console.log('Advancement card script is loading!');
(function() {
    'use strict';
    
    // Define available advancements (these could be loaded from data later)
    const AVAILABLE_ADVANCEMENTS = [
        'Increase a stat by +1',
        'Gain a new move from your careers',
        'Gain a new move from another career',
        'Gain a new move from your origin',
        'Change your class',
        'Acquire a signature asset',
        'Gain a new attachment',
        'Retire to safety',
        'Create a new character concept',
        'Advance the story'
    ];
    
    let draggedElement = null;
    
    function createAdvancementItem(text, id, isAchieved = false) {
        const item = document.createElement('div');
        item.className = `advancement-item ${isAchieved ? 'achieved' : ''}`;
        item.draggable = true;
        item.dataset.advancementId = id;
        item.textContent = text;
        
        // Add drag event listeners
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('contextmenu', handleRightClick);
        
        return item;
    }
    
    function handleDragStart(e) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }
    
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedElement = null;
    }
    
    function handleRightClick(e) {
        e.preventDefault();
        const advancementId = e.target.dataset.advancementId;
        const isInAvailable = e.target.parentElement.id === 'available-advancements';
        
        if (isInAvailable) {
            setCurrentGoal(advancementId, e.target.textContent);
        }
    }
    
    function setCurrentGoal(advancementId, text) {
        // Update hidden input
        const currentGoalInput = document.querySelector('#current_goal');
        if (currentGoalInput) {
            currentGoalInput.value = advancementId;
        }
        
        // Update display
        const goalDisplay = document.querySelector('#current-goal-display');
        if (goalDisplay) {
            goalDisplay.className = 'current-goal has-goal';
            goalDisplay.innerHTML = `<span class="goal-text">🎯 ${text}</span>`;
        }
        
        // Update visual indicators
        updateCurrentGoalVisuals(advancementId);
        
        // Trigger persistence
        if (window.Persistence) {
            const form = document.querySelector('form');
            if (form) window.Persistence.saveToURL(form);
        }
    }
    
    function updateCurrentGoalVisuals(currentGoalId) {
        // Remove current-goal class from all items
        document.querySelectorAll('.advancement-item').forEach(item => {
            item.classList.remove('current-goal');
        });
        
        // Add current-goal class to the selected item
        if (currentGoalId) {
            const goalItem = document.querySelector(`[data-advancement-id="${currentGoalId}"]`);
            if (goalItem) {
                goalItem.classList.add('current-goal');
            }
        }
    }
    
    function populateAdvancementLists() {
        const availableContainer = document.querySelector('#available-advancements');
        const achievedContainer = document.querySelector('#achieved-advancements');
        const hiddenContainer = document.querySelector('.hidden-advancement-state');
        
        if (!availableContainer || !achievedContainer || !hiddenContainer) return;
        
        // Clear containers
        availableContainer.innerHTML = '';
        achievedContainer.innerHTML = '';
        hiddenContainer.innerHTML = '';
        
        // Create items and hidden checkboxes
        AVAILABLE_ADVANCEMENTS.forEach((text, index) => {
            const id = `advancement_${index}`;
            
            // Create hidden checkbox for URL persistence
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.name = id;
            hiddenContainer.appendChild(checkbox);
            
            // Check if this advancement is achieved (from URL)
            const isAchieved = checkbox.checked;
            
            // Create visual item
            const item = createAdvancementItem(text, id, isAchieved);
            
            // Place in appropriate container
            if (isAchieved) {
                achievedContainer.appendChild(item);
            } else {
                availableContainer.appendChild(item);
            }
        });
        
        // Restore current goal
        restoreCurrentGoal();
    }
    
    function restoreCurrentGoal() {
        const currentGoalInput = document.querySelector('#current_goal');
        const currentGoalId = currentGoalInput?.value;
        
        if (currentGoalId) {
            const goalItem = document.querySelector(`[data-advancement-id="${currentGoalId}"]`);
            if (goalItem) {
                const goalText = goalItem.textContent;
                setCurrentGoal(currentGoalId, goalText);
            }
        }
    }
    
    function setupDragAndDrop() {
        const containers = document.querySelectorAll('.advancement-list');
        
        containers.forEach(container => {
            container.addEventListener('dragover', allowDrop);
            container.addEventListener('drop', handleDrop);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
        });
    }
    
    function allowDrop(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        if (draggedElement) {
            const targetContainer = e.target.closest('.advancement-list');
            const advancementId = draggedElement.dataset.advancementId;
            
            if (targetContainer && targetContainer !== draggedElement.parentElement) {
                // Move the item
                targetContainer.appendChild(draggedElement);
                
                // Update the hidden checkbox
                const checkbox = document.querySelector(`#${advancementId}`);
                if (checkbox) {
                    checkbox.checked = targetContainer.id === 'achieved-advancements';
                    
                    // Update visual state
                    if (checkbox.checked) {
                        draggedElement.classList.add('achieved');
                        // Clear current goal if moving to achieved
                        if (draggedElement.classList.contains('current-goal')) {
                            clearCurrentGoal();
                        }
                    } else {
                        draggedElement.classList.remove('achieved');
                    }
                }
                
                // Save to URL
                if (window.Persistence) {
                    const form = document.querySelector('form');
                    if (form) window.Persistence.saveToURL(form);
                }
            }
        }
    }
    
    function clearCurrentGoal() {
        const currentGoalInput = document.querySelector('#current_goal');
        if (currentGoalInput) {
            currentGoalInput.value = '';
        }
        
        const goalDisplay = document.querySelector('#current-goal-display');
        if (goalDisplay) {
            goalDisplay.className = 'current-goal';
            goalDisplay.innerHTML = '<em>Select a current goal by right-clicking an available advancement</em>';
        }
        
        // Remove visual indicators
        document.querySelectorAll('.advancement-item').forEach(item => {
            item.classList.remove('current-goal');
        });
    }
    
    function initializeAdvancementCard() {
        console.log('Advancement card: Initializing XP tracking and drag-and-drop advancements');
        
        // Populate advancement lists
        populateAdvancementLists();
        
        // Set up drag and drop
        setupDragAndDrop();
        
        // Add double-click alternative to drag-and-drop
        document.addEventListener('dblclick', function(e) {
            if (e.target.classList.contains('advancement-item')) {
                const item = e.target;
                const currentContainer = item.parentElement;
                const targetContainer = currentContainer.id === 'available-advancements' 
                    ? document.querySelector('#achieved-advancements')
                    : document.querySelector('#available-advancements');
                
                if (targetContainer) {
                    // Simulate drag and drop
                    draggedElement = item;
                    const dropEvent = new Event('drop');
                    Object.defineProperty(dropEvent, 'target', { value: targetContainer });
                    handleDrop(dropEvent);
                }
            }
        });
    }
    
    // Make drag and drop functions global for HTML onclick handlers
    window.allowDrop = allowDrop;
    window.drop = handleDrop;
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('advancement', initializeAdvancementCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="advancement"]')) {
            console.log('Advancement card already exists, initializing immediately');
            initializeAdvancementCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAdvancementCard);
        } else {
            initializeAdvancementCard();
        }
    }
    
    // Export for debugging
    window.initializeAdvancementCard = initializeAdvancementCard;
    
})();
