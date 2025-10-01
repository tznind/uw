// Health Card JavaScript - Handle Toughness move
(function() {
    'use strict';
    
    console.log('Health card script loading...');
    
    // Check if character has Toughness move by looking at URL parameters
    function hasToughness() {
        const urlParams = new URLSearchParams(window.location.search);
        const touValue = urlParams.get('tou');
        console.log('Checking toughness move - tou parameter:', touValue);
        return touValue === '1' || touValue === 'true' || touValue === 'on';
    }
    
    // Initialize health card toughness functionality
    function initializeHealthCard() {
        console.log('Initializing health card...');
        
        const toughnessCheckboxes = document.querySelectorAll('.health-card .toughness-only');
        console.log('Found', toughnessCheckboxes.length, 'toughness checkboxes');
        
        if (toughnessCheckboxes.length === 0) {
            console.log('No toughness checkboxes found, aborting');
            return;
        }
        
        const hasToughnessMove = hasToughness();
        console.log('Has toughness move:', hasToughnessMove);
        
        toughnessCheckboxes.forEach((checkbox, index) => {
            console.log('Updating checkbox', index + 1, 'disabled:', !hasToughnessMove);
            checkbox.disabled = !hasToughnessMove;
            if (!hasToughnessMove) {
                checkbox.checked = false; // Uncheck if disabled
            }
        });
        
        console.log('Health card initialization complete');
    }
    
    // Create global initialization function that can be called whenever card is recreated
    window.initializeHealthCard = function() {
        console.log('Initializing Health card...');
        initializeHealthCard();
    };
    
    // Multiple initialization attempts for first load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHealthCard);
    } else {
        initializeHealthCard();
    }
    
    // Also try after delays in case cards are loaded dynamically
    setTimeout(initializeHealthCard, 500);
    setTimeout(initializeHealthCard, 1000);
    
})();
