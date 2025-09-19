/**
 * Moves Module - Main coordinator for move rendering and event handling
 */

window.Moves = (function() {
    'use strict';

    /**
     * Initialize moves system
     */
    function initialize() {
        // Set up event listeners for special move functionality (takefrom, card granting)
        setupMoveEventListeners();
        
        // Role changes and regular checkboxes are now handled by persistence system
        // No additional setup needed
    }

    /**
     * Set up event listeners for move checkboxes and takefrom functionality
     */
    function setupMoveEventListeners() {
        document.addEventListener('change', (event) => {
            const target = event.target;
            
            // Only handle special takefrom checkbox logic, let persistence handle the rest
            if (target.id && target.id.startsWith('move_')) {
                handleTakeFromMoveIfNeeded(target);
            }
        });
    }

    /**
     * Handle special move checkbox changes (takefrom, card granting, etc.)
     */
    function handleTakeFromMoveIfNeeded(checkbox) {
        const moveId = extractMoveId(checkbox);
        
        // Check if this is a takefrom move that needs special handling
        const move = window.moves && window.moves.find(m => m.id === moveId);
        if (move && move.takefrom && window.TakeFrom) {
            window.TakeFrom.handleTakeFromMoveToggle(moveId, checkbox.checked);
        }
        
        // Check if this move grants a card
        if (move && move.grantsCard && window.InlineCards) {
            const containerId = `granted_card_${moveId}`;
            window.InlineCards.toggleCardDisplay(moveId, move.grantsCard, containerId, checkbox.checked);
        }
        
    }

    /**
     * Extract move ID from checkbox/radio element
     */
    function extractMoveId(element) {
        // Use the data attribute we set when creating the element
        return element.getAttribute('data-move-id');
    }



    /**
     * Render moves for roles with merged availability
     * @param {Array<string>} roles - Array of roles to render moves for
     * @param {Object} mergedAvailability - Merged availability map
     */
    function renderMovesForRole(roles, mergedAvailability) {
        if (window.MovesCore) {
            window.MovesCore.renderMovesForRole(roles, mergedAvailability);
            // Persistence is now handled by the layout system
        }
    }



    // Public API
    return {
        initialize,
        renderMovesForRole
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Moves.initialize);
} else {
    window.Moves.initialize();
}
