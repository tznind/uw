// Artificial Intelligence Card JavaScript
// Basic initialization for AI card
console.log('Artificial Intelligence card script is loading!');
(function() {
    'use strict';
    
    function initializeArtificialIntelligenceCard() {
        console.log('Artificial Intelligence card: Initializing');
        
        // Get form elements
        const nameField = document.getElementById('ai_name');
        const personalityField = document.getElementById('ai_personality');
        
        if (!nameField || !personalityField) {
            console.log('Artificial Intelligence card elements not found yet');
            return;
        }
        
        // Add character counter for personality field
        if (personalityField) {
            const maxLength = 50;
            const counter = document.createElement('small');
            counter.style.cssText = 'color: #999; font-size: 0.8em; display: block; text-align: right; margin-top: 2px;';
            counter.textContent = `0/${maxLength}`;
            
            personalityField.parentNode.appendChild(counter);
            
            personalityField.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/${maxLength}`;
                
                if (length > maxLength * 0.9) {
                    counter.style.color = '#f44336';
                } else if (length > maxLength * 0.8) {
                    counter.style.color = '#ff9800';
                } else {
                    counter.style.color = '#999';
                }
            });
        }
        
        console.log('Artificial Intelligence card initialized successfully');
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('artificial-intelligence', initializeArtificialIntelligenceCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="artificial-intelligence"]')) {
            console.log('Artificial Intelligence card already exists, initializing immediately');
            initializeArtificialIntelligenceCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeArtificialIntelligenceCard);
        } else {
            initializeArtificialIntelligenceCard();
        }
    }
    
    // Export for debugging
    window.initializeArtificialIntelligenceCard = initializeArtificialIntelligenceCard;
    
})();