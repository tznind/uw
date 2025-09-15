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

        const currentRole = getCurrentRole();
        if (!currentRole || !window.Cards) return;

        if (isChecked) {
            // Grant the card
            window.Cards.addCardToRole(currentRole, move.grantsCard);
            console.log(`Granted card '${move.grantsCard}' to ${currentRole}`);
        } else {
            // Only remove if no other checkboxes for this move are checked
            if (!checkIfAnyMoveChecked(moveId)) {
                window.Cards.removeCardFromRole(currentRole, move.grantsCard);
                console.log(`Removed card '${move.grantsCard}' from ${currentRole}`);
            }
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

        // Find all card-granting moves and check if they're selected
        window.moves
            .filter(move => move.grantsCard)
            .forEach(move => {
                if (checkIfAnyMoveChecked(move.id)) {
                    window.Cards.addCardToRole(role, move.grantsCard);
                    console.log(`Restored card '${move.grantsCard}' to ${role}`);
                }
            });
    }

    /**
     * Initialize for a role (called when role is selected)
     */
    function handleRoleChange(role) {
        if (role) {
            // Small delay to ensure moves are rendered first
            setTimeout(() => restoreCardGrants(role), 200);
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