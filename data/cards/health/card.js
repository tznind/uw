// Health Card - Enable/disable toughness checkboxes based on tou move
console.log('Health card script is loading!');
(function() {
    'use strict';
    
    function initializeHealthCard() {
        console.log('Health card: Enabling toughness checkboxes if player has tou move');
        
        const hasTou = new URLSearchParams(window.location.search).get('move_tou') === '1';
        
        document.querySelectorAll('.health-card .toughness-only').forEach(checkbox => {
            checkbox.disabled = !hasTou;
            checkbox.title = hasTou ? '' : 'Requires Toughness';
            if (!hasTou) checkbox.checked = false;
        });
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('health', initializeHealthCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="health"]')) {
            console.log('Health card already exists, initializing immediately');
            initializeHealthCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeHealthCard);
        } else {
            initializeHealthCard();
        }
    }
    
    // Export for debugging
    window.initializeHealthCard = initializeHealthCard;
    
})();
