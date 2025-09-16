/**
 * Main Application - Character Sheet
 * Initialization and event handling for the character sheet application
 */

(function() {
    'use strict';

    /**
     * Initialize the application after all dependencies are loaded
     */
    async function initializeApp() {
        const form = document.querySelector('form');
        const roleSelect = document.getElementById('role');
        
        if (!form || !roleSelect) {
            throw new Error('Required form elements not found');
        }

        try {
            // Initialize moves data from separate role files
            await window.initializeMovesData();
            
            // Render stats
            window.renderStats('#stats-container', window.hexStats);
            
            // Populate all role selectors with available roles
            const roleSelectors = window.Utils.getRoleSelectors();
            roleSelectors.forEach(selector => {
                // Clear existing options (except the first "Select..." option)
                while (selector.children.length > 1) {
                    selector.removeChild(selector.lastChild);
                }
                
                // Add role options
                Object.keys(window.availableMap).forEach(role => {
                    const option = document.createElement('option');
                    option.value = role;
                    option.textContent = role;
                    selector.appendChild(option);
                });
            });
            
            // Initialize persistence first
            window.Persistence.setupAutoPersistence(form);
            
            // Load initial state from URL
            window.Persistence.loadFromURL(form);
            
            // Render initial moves and cards based on selected roles
            const selectedRoles = window.Utils.getCurrentRoles();
            if (selectedRoles.length > 0) {
                await renderRoleContent(selectedRoles, true);
            }

            console.log('Application initialized successfully');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    /**
     * Render all content for roles (cards and moves)
     * @param {string|Array<string>} roles - The role(s) to render content for
     * @param {boolean} isInitialLoad - Whether this is the initial page load
     */
    async function renderRoleContent(roles, isInitialLoad = false) {
        // Handle both single role (backward compatibility) and multiple roles
        const roleArray = Array.isArray(roles) ? roles : [roles];
        if (roleArray.length === 0 || (roleArray.length === 1 && !roleArray[0])) return;
        
        // For backward compatibility, use first role for single-role systems
        const primaryRole = roleArray[0];
        
        // Create merged availability map for multiple roles
        const mergedAvailability = window.Utils.mergeRoleAvailability(roleArray);
        
        // Render cards first (async) - use merged availability
        if (window.Cards) {
            await window.Cards.renderCardsForRoles(roleArray, mergedAvailability);
        }
        
        // Then render moves (without persistence refresh during initial load)
        if (window.Moves) {
            window.Moves.renderMovesForRoles(roleArray, mergedAvailability, !isInitialLoad);
        }
        
        // Learned moves are restored automatically by their takefrom sections
        
        // Handle card grants for the primary role (maintain backward compatibility)
        if (window.GrantCard) {
            window.GrantCard.handleRoleChange(primaryRole);
        }
        
        // Refresh persistence after everything loads (longer delay for initial load)
        const delay = isInitialLoad ? 500 : 100;
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form && window.Persistence) {
                window.Persistence.refreshPersistence(form);
            }
        }, delay);
    }

    /**
     * Clear all application state and UI
     */
    function clearApplication() {
        const form = document.querySelector('form');
        if (form && window.Persistence) {
            window.Persistence.clearState(form);
        }
        
        // Clear moves display (includes inline cards)
        const movesContainer = document.getElementById('moves');
        if (movesContainer) {
            movesContainer.innerHTML = '';
        }
        
        // Clear cards display
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
        }
    }

    /**
     * Copy current URL to clipboard with visual feedback
     */
    async function copyURLWithFeedback() {
        const button = document.getElementById('copy-url-button');
        if (!button) return;

        try {
            await window.Persistence.copyURLToClipboard();
            
            // Show success state
            button.classList.add('success');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.classList.remove('success');
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy URL:', error);
            alert('Failed to copy URL to clipboard');
        }
    }

    /**
     * Handle hide untaken moves toggle - only re-render moves, not cards
     */
    function handleHideUntakenToggle() {
        const selectedRoles = window.Utils.getCurrentRoles();
        if (selectedRoles.length > 0) {
            const mergedAvailability = window.Utils.mergeRoleAvailability(selectedRoles);
            
            // Only re-render moves, not cards (cards shouldn't change when hiding/showing moves)
            if (window.Moves) {
                window.Moves.renderMovesForRoles(selectedRoles, mergedAvailability);
            }
            if (window.GrantCard) {
                window.GrantCard.handleRoleChange(selectedRoles[0]); // Use primary role for backward compatibility
            }
            
            // Refresh persistence after moves are re-rendered
            setTimeout(() => {
                const form = document.querySelector('form');
                if (form && window.Persistence) {
                    window.Persistence.refreshPersistence(form);
                }
            }, 100);
        }
    }

    /**
     * Handle role selection change for any role selector
     */
    async function handleRoleChange() {
        const selectedRoles = window.Utils.getCurrentRoles();
        if (selectedRoles.length > 0) {
            await renderRoleContent(selectedRoles);
        } else {
            // Clear content when no roles selected
            const movesContainer = document.getElementById('moves');
            const cardsContainer = document.getElementById('cards-container');
            if (movesContainer) movesContainer.innerHTML = '';
            if (cardsContainer) cardsContainer.innerHTML = '';
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Set up event listeners for all role selectors
        const roleSelectors = window.Utils.getRoleSelectors();
        roleSelectors.forEach(selector => {
            selector.addEventListener('change', handleRoleChange);
        });
        
        // Clear button
        const clearButton = document.getElementById('clear-button');
        if (clearButton) {
            clearButton.addEventListener('click', clearApplication);
        }

        // Copy URL button
        const copyButton = document.getElementById('copy-url-button');
        if (copyButton) {
            copyButton.addEventListener('click', copyURLWithFeedback);
        }

        // Hide untaken moves checkbox
        const hideUntakenCheckbox = document.getElementById('hide_untaken');
        if (hideUntakenCheckbox) {
            hideUntakenCheckbox.addEventListener('change', handleHideUntakenToggle);
        }
    }

    /**
     * Start the application
     */
    async function startApplication() {
        try {
            await initializeApp();
            setupEventListeners();
        } catch (error) {
            console.error('Failed to start application:', error);
            alert('Failed to initialize the character sheet. Please refresh the page.');
        }
    }

    // Auto-start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }


    // Export for debugging/testing
    window.CharacterSheet = {
        renderRoleContent,
        clearApplication,
        copyURLWithFeedback
    };

})();