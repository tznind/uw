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
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers.health = initializeHealthCard;
    
})();
