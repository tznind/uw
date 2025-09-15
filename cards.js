/**
 * Cards Module - Handles loading and rendering card templates with custom CSS/JS
 * Cards are loaded from data/cards/[cardname]/ folders with card.json definitions
 */

window.Cards = (function() {
    'use strict';

    // Cache for loaded card data
    const cardCache = new Map();
    const loadedStyles = new Set();
    const loadedScripts = new Set();

    /**
     * Load a card's definition and files
     * @param {string} cardId - ID of the card to load
     * @returns {Promise<Object>} Card data with HTML content
     */
    async function loadCard(cardId) {
        if (cardCache.has(cardId)) {
            return cardCache.get(cardId);
        }

        try {
            // Load card definition
            const definitionResponse = await fetch(`data/cards/${cardId}/card.json`);
            if (!definitionResponse.ok) {
                throw new Error(`Failed to load card definition: ${cardId}`);
            }
            
            const cardDef = await definitionResponse.json();
            
            // Load HTML content
            const htmlResponse = await fetch(`${cardDef.path}/${cardDef.files.html}`);
            if (!htmlResponse.ok) {
                throw new Error(`Failed to load card HTML: ${cardId}`);
            }
            
            const html = await htmlResponse.text();
            
            // Load CSS if it exists and hasn't been loaded yet
            if (cardDef.files.css && !loadedStyles.has(cardId)) {
                await loadCardCSS(cardDef.path, cardDef.files.css, cardId);
            }
            
            // Load JavaScript if it exists and hasn't been loaded yet
            if (cardDef.files.js && !loadedScripts.has(cardId)) {
                await loadCardScript(cardDef.path, cardDef.files.js, cardId);
            }
            
            const cardData = {
                ...cardDef,
                html: html
            };
            
            cardCache.set(cardId, cardData);
            return cardData;
            
        } catch (error) {
            console.error(`Error loading card ${cardId}:`, error);
            return {
                id: cardId,
                title: `${cardId} (Error)`,
                html: `<div class="card card-error">
                    <h3>Card Error</h3>
                    <p>Failed to load card: ${cardId}</p>
                    <p class="error-details">${error.message}</p>
                </div>`
            };
        }
    }

    /**
     * Load and inject card CSS
     * @param {string} cardPath - Path to the card folder
     * @param {string} cssFile - CSS filename
     * @param {string} cardId - Card ID for tracking
     */
    async function loadCardCSS(cardPath, cssFile, cardId) {
        try {
            const response = await fetch(`${cardPath}/${cssFile}`);
            if (response.ok) {
                const css = await response.text();
                
                // Create and inject style element
                const style = document.createElement('style');
                style.setAttribute('data-card', cardId);
                style.textContent = css;
                document.head.appendChild(style);
                
                loadedStyles.add(cardId);
                console.log(`Loaded CSS for card: ${cardId}`);
            }
        } catch (error) {
            console.warn(`Failed to load CSS for card ${cardId}:`, error);
        }
    }

    /**
     * Load and execute card JavaScript
     * @param {string} cardPath - Path to the card folder
     * @param {string} jsFile - JavaScript filename  
     * @param {string} cardId - Card ID for tracking
     */
    async function loadCardScript(cardPath, jsFile, cardId) {
        try {
            const response = await fetch(`${cardPath}/${jsFile}`);
            if (response.ok) {
                const script = document.createElement('script');
                script.setAttribute('data-card', cardId);
                script.src = `${cardPath}/${jsFile}`;
                document.head.appendChild(script);
                
                loadedScripts.add(cardId);
                console.log(`Loaded script for card: ${cardId}`);
            }
        } catch (error) {
            console.warn(`Failed to load script for card ${cardId}:`, error);
        }
    }

    /**
     * Render cards for a specific role
     * @param {string} role - The role to render cards for
     * @param {string} containerId - ID of the container to render cards into
     */
    async function renderCardsForRole(role, containerId = 'cards-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Cards container not found: ${containerId}`);
            return;
        }

        // Clear existing cards
        container.innerHTML = '';

        // Get card list for this role
        const cardIds = getCardsForRole(role);
        if (!cardIds || cardIds.length === 0) {
            // Hide container if no cards
            container.style.display = 'none';
            return;
        }

        // Show container if we have cards
        container.style.display = 'block';

        try {
            // Load and render each card
            for (const cardId of cardIds) {
                const cardData = await loadCard(cardId);
                
                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'card-wrapper';
                cardWrapper.setAttribute('data-card-id', cardId);
                cardWrapper.innerHTML = cardData.html;
                container.appendChild(cardWrapper);
            }

            // After all cards are rendered, refresh persistence to capture new inputs
            if (window.Persistence) {
                const form = document.querySelector('form');
                if (form) {
                    setTimeout(() => {
                        window.Persistence.refreshPersistence(form);
                    }, 100);
                }
            }

        } catch (error) {
            console.error('Error rendering cards:', error);
            container.innerHTML = '<div class="card card-error"><p>Error loading cards</p></div>';
        }
    }

    /**
     * Get list of card IDs for a role from availability data
     * @param {string} role - The role to get cards for
     * @returns {string[]} Array of card IDs
     */
    function getCardsForRole(role) {
        if (!window.availableMap || !window.availableMap[role]) {
            return [];
        }

        const roleData = window.availableMap[role];
        return roleData._cards || [];
    }

    /**
     * Add a card to a role (useful for moves that grant cards)
     * @param {string} role - The role to add the card to
     * @param {string} cardId - ID of the card to add
     */
    function addCardToRole(role, cardId) {
        if (!window.availableMap || !window.availableMap[role]) {
            console.error(`Role not found: ${role}`);
            return;
        }

        const roleData = window.availableMap[role];
        if (!roleData._cards) {
            roleData._cards = [];
        }

        if (!roleData._cards.includes(cardId)) {
            roleData._cards.push(cardId);
            
            // Trigger re-render if this is the current role
            const currentRole = getCurrentRole();
            if (currentRole === role) {
                renderCardsForRole(role);
            }
        }
    }

    /**
     * Remove a card from a role
     * @param {string} role - The role to remove the card from
     * @param {string} cardId - ID of the card to remove
     */
    function removeCardFromRole(role, cardId) {
        if (!window.availableMap || !window.availableMap[role] || !window.availableMap[role]._cards) {
            return;
        }

        const roleData = window.availableMap[role];
        const index = roleData._cards.indexOf(cardId);
        if (index > -1) {
            roleData._cards.splice(index, 1);
            
            // Trigger re-render if this is the current role
            const currentRole = getCurrentRole();
            if (currentRole === role) {
                renderCardsForRole(role);
            }
        }
    }

    /**
     * Get current role from role select
     * @returns {string|null} Current role or null
     */
    function getCurrentRole() {
        const roleSelect = document.getElementById('role');
        return roleSelect ? roleSelect.value : null;
    }

    /**
     * Clear all caches (useful for development/testing)
     */
    function clearCache() {
        cardCache.clear();
        
        // Remove loaded stylesheets
        document.querySelectorAll('style[data-card]').forEach(style => style.remove());
        loadedStyles.clear();
        
        // Remove loaded scripts
        document.querySelectorAll('script[data-card]').forEach(script => script.remove());
        loadedScripts.clear();
    }

    /**
     * Get information about a loaded card
     * @param {string} cardId - ID of the card
     * @returns {Object|null} Card data or null
     */
    function getCardInfo(cardId) {
        return cardCache.get(cardId) || null;
    }

    /**
     * List all available cards (scans data/cards directory)
     * This is a helper for development - in production you'd know your card IDs
     * @returns {Promise<string[]>} Array of available card IDs
     */
    async function listAvailableCards() {
        // This is a simplified version - in a real implementation you might
        // want to have a cards registry or scan the filesystem
        const knownCards = ['ship', 'crew']; // Add more as needed
        return knownCards;
    }

    /**
     * Initialize cards system
     */
    function initialize() {
        // Listen for role changes to re-render cards
        const roleSelect = document.getElementById('role');
        if (roleSelect) {
            roleSelect.addEventListener('change', (event) => {
                const selectedRole = event.target.value;
                if (selectedRole) {
                    renderCardsForRole(selectedRole);
                } else {
                    // Hide cards if no role selected
                    const container = document.getElementById('cards-container');
                    if (container) {
                        container.style.display = 'none';
                    }
                }
            });
        }
    }

    // Public API
    return {
        loadCard,
        renderCardsForRole,
        getCardsForRole,
        addCardToRole,
        removeCardFromRole,
        getCardInfo,
        listAvailableCards,
        clearCache,
        initialize
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Cards.initialize);
} else {
    window.Cards.initialize();
}