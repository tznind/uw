// Advancement Card JavaScript
console.log('Advancement card script is loading!');
(function() {
    'use strict';
    
    function initializeAdvancementCard() {
        console.log('Advancement card: Initialized');
        // Add any advancement-specific functionality here
    }
    
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