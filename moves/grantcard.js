/**
 * GrantCard Module - Handles moves that grant cards when selected
 */

window.GrantCard = (function() {
    'use strict';

    // Debounced save function to prevent excessive URL updates
    const debouncedSave = window.Utils ? window.Utils.debounce((form) => {
        if (form && window.Persistence) {
            window.Persistence.saveToURL(form);
        }
    }, 100) : null;

    /**
     * Handle card-granting move checkbox changes
     */
    function handleCardGrantingMoveToggle(moveId, isChecked) {
        // Check if this is a move that grants cards
        const move = window.moves && window.moves.find(m => m.id === moveId);
        if (!move || !move.grantsCard) {
            return;
        }

        if (!isChecked) {
            // Check if ANY checkbox for this move is still checked
            const anyStillChecked = checkIfAnyCardGrantingMoveChecked(moveId);
            
            if (anyStillChecked) {
                // Some checkboxes are still checked, don't remove card
                return;
            }
            
            // ALL checkboxes unchecked - remove the granted card
            removeGrantedCard(move);
        } else {
            // Move was checked - grant the card
            grantCard(move);
        }
    }

    /**
     * Grant a card to the current role
     */
    function grantCard(move) {
        const currentRole = getCurrentRole();
        if (!currentRole || !window.Cards) {
            return;
        }

        // Add the card to the current role
        window.Cards.addCardToRole(currentRole, move.grantsCard);
        console.log(`Granted card '${move.grantsCard}' to ${currentRole} via move '${move.title}'`);
        
        // Update URL to save the state
        updateURL();
    }

    /**
     * Remove a granted card from the current role
     */
    function removeGrantedCard(move) {
        const currentRole = getCurrentRole();
        if (!currentRole || !window.Cards) {
            return;
        }

        // Remove the card from the current role
        window.Cards.removeCardFromRole(currentRole, move.grantsCard);
        console.log(`Removed card '${move.grantsCard}' from ${currentRole} via move '${move.title}'`);
        
        // Update URL to save the state
        updateURL();
    }

    /**
     * Check if any checkbox for a card-granting move is still checked
     */
    function checkIfAnyCardGrantingMoveChecked(moveId) {
        // Check for single checkbox
        const singleCheckbox = document.getElementById(`move_${moveId}`);
        if (singleCheckbox && singleCheckbox.checked) {
            return true;
        }
        
        // Check for multiple checkboxes (move_id_1, move_id_2, etc.)
        let index = 1;
        while (true) {
            const multiCheckbox = document.getElementById(`move_${moveId}_${index}`);
            if (!multiCheckbox) break; // No more checkboxes
            
            if (multiCheckbox.checked) {
                return true;
            }
            index++;
        }
        
        return false;
    }

    /**
     * Restore card grants based on URL state (called when role changes)
     */
    function restoreCardGrants(role) {
        if (!window.moves || !role) {
            console.log('Cannot restore card grants: missing moves or role');
            return;
        }

        // Find all card-granting moves
        const cardGrantingMoves = window.moves.filter(move => move.grantsCard);
        console.log('Found card-granting moves:', cardGrantingMoves.map(m => m.id));
        
        cardGrantingMoves.forEach(move => {
            const isDirectlyChecked = checkIfAnyCardGrantingMoveChecked(move.id);
            const isLearnedViaTakefrom = checkIfMoveLearnedViaTakefrom(move.id);
            
            console.log(`Move ${move.id}: directly checked=${isDirectlyChecked}, learned=${isLearnedViaTakefrom}`);
            
            // Check if this move is currently selected (either directly or via takefrom)
            if (isDirectlyChecked || isLearnedViaTakefrom) {
                // Grant the card if not already granted
                if (window.Cards) {
                    const currentCards = window.Cards.getCardsForRole(role);
                    console.log(`Current cards for ${role}:`, currentCards);
                    
                    if (!currentCards.includes(move.grantsCard)) {
                        window.Cards.addCardToRole(role, move.grantsCard);
                        const source = isLearnedViaTakefrom ? 'learned move' : 'move';
                        console.log(`Restored card '${move.grantsCard}' to ${role} via ${source} '${move.title}'`);
                    } else {
                        console.log(`Card '${move.grantsCard}' already granted to ${role}`);
                    }
                }
            }
        });
    }

    /**
     * Initialize card grants for a role (called when role is first selected)
     */
    function initializeCardGrantsForRole(role) {
        if (!role) {
            return;
        }

        // Delay longer to ensure moves are rendered first and persistence is loaded
        setTimeout(() => {
            console.log('Initializing card grants for role:', role);
            restoreCardGrants(role);
        }, 300);
    }

    /**
     * Update URL with current state
     */
    function updateURL() {
        // Trigger debounced persistence save
        if (debouncedSave) {
            const form = document.querySelector('form');
            if (form) {
                debouncedSave(form);
            }
        }
    }

    /**
     * Check if a move is learned via takefrom system
     */
    function checkIfMoveLearnedViaTakefrom(moveId) {
        const urlParams = new URLSearchParams(location.search);
        
        // Check all takefrom move selectors to see if they've selected this move
        for (const [key, value] of urlParams) {
            if (key.includes('takefrom_') && key.includes('_move') && value === moveId) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get current role from the form
     */
    function getCurrentRole() {
        const roleSelect = document.getElementById('role');
        return roleSelect ? roleSelect.value : null;
    }

    /**
     * Clean up cards when role changes (remove cards that shouldn't be there)
     */
    function cleanupCardsForRole(role) {
        if (!window.moves || !window.Cards || !role) {
            return;
        }

        // Get all card-granting moves
        const cardGrantingMoves = window.moves.filter(move => move.grantsCard);
        
        cardGrantingMoves.forEach(move => {
            // If the move is not selected, make sure its card is not granted
            if (!checkIfAnyCardGrantingMoveChecked(move.id)) {
                window.Cards.removeCardFromRole(role, move.grantsCard);
            }
        });
    }

    /**
     * Handle role changes - called by the moves system
     */
    function handleRoleChange(newRole) {
        if (newRole) {
            initializeCardGrantsForRole(newRole);
        }
    }

    // Public API
    return {
        handleCardGrantingMoveToggle,
        checkIfAnyCardGrantingMoveChecked,
        restoreCardGrants,
        initializeCardGrantsForRole,
        cleanupCardsForRole,
        handleRoleChange,
        getCurrentRole
    };
})();