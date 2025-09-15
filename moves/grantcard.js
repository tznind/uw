/**
 * GrantCard Module - Simplified version for moves that grant cards
 */

window.GrantCard = (function() {
    'use strict';

    /**
     * Handle card-granting move checkbox changes
     */
    function handleCardGrantingMoveToggle(moveId, isChecked) {
        const move = window.moves && window.moves.find(m => m.id === moveId);
        if (!move || !move.grantsCard) return;

        // Update the inline card display
        updateInlineCardDisplay(moveId, isChecked);
    }

    /**
     * Update the inline card display under a move
     */
    function updateInlineCardDisplay(moveId, isChecked) {
        const grantedCardContainer = document.getElementById(`granted_card_${moveId}`);
        if (!grantedCardContainer) return;
        
        const move = window.moves && window.moves.find(m => m.id === moveId);
        if (!move || !move.grantsCard) return;
        
        if (isChecked || checkIfAnyMoveChecked(moveId)) {
            // Show the card
            if (window.Cards) {
                window.Cards.loadCard(move.grantsCard).then(cardData => {
                    grantedCardContainer.innerHTML = '';
                    const grantedCardDiv = document.createElement("div");
                    grantedCardDiv.className = "granted-card";
                    grantedCardDiv.innerHTML = cardData.html;
                    grantedCardContainer.appendChild(grantedCardDiv);
                    
                    // Refresh persistence to capture new card inputs
                    if (window.Persistence) {
                        const form = document.querySelector('form');
                        setTimeout(() => {
                            window.Persistence.refreshPersistence(form);
                        }, 100);
                    }
                    
                    console.log(`Displayed card '${move.grantsCard}' inline under move '${move.title}'`);
                }).catch(error => {
                    console.error('Error loading granted card:', error);
                    grantedCardContainer.innerHTML = '<div class="card-error">Error loading card</div>';
                });
            }
        } else {
            // Hide the card
            grantedCardContainer.innerHTML = '';
            console.log(`Removed card '${move.grantsCard}' from inline display`);
        }
    }
    
    /**
     * Check if any checkbox for a move is checked (handles multiple checkboxes)
     */
    function checkIfAnyMoveChecked(moveId) {
        // Check single checkbox
        const singleCheckbox = document.getElementById(`move_${moveId}`);
        if (singleCheckbox && singleCheckbox.checked) return true;
        
        // Check multiple checkboxes
        let index = 1;
        while (true) {
            const checkbox = document.getElementById(`move_${moveId}_${index}`);
            if (!checkbox) break;
            if (checkbox.checked) return true;
            index++;
        }
        return false;
    }

    /**
     * Restore card grants on page load
     */
    function restoreCardGrants(role) {
        if (!window.moves || !role) return;

        console.log('Restoring card grants for role:', role);
        
        // Find all card-granting moves and check if they're selected
        window.moves
            .filter(move => move.grantsCard)
            .forEach(move => {
                console.log(`Checking move ${move.id} for restoration`);
                if (checkIfAnyMoveChecked(move.id)) {
                    console.log(`Restoring inline card for move ${move.id}`);
                    updateInlineCardDisplay(move.id, true);
                }
            });
    }

    /**
     * Initialize for a role (called when role is selected)
     */
    function handleRoleChange(role) {
        if (role) {
            // Longer delay to ensure moves are fully rendered and checkboxes restored
            setTimeout(() => restoreCardGrants(role), 400);
        }
    }

    /**
     * Get current role
     */
    function getCurrentRole() {
        const roleSelect = document.getElementById('role');
        return roleSelect ? roleSelect.value : null;
    }

    return {
        handleCardGrantingMoveToggle,
        handleRoleChange
    };
})();