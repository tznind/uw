// Custom Crew Card JavaScript
// Handles type descriptions
console.log('Custom Crew card script is loading!');
(function() {
    'use strict';
    
    function initializeCustomCrewCard() {
        console.log('Custom Crew card: Initializing type descriptions');
        
        // Get type dropdown and description elements
        const typeSelect = document.getElementById('cc_type');
        const typeDescription = document.getElementById('cc_type_description');
        
        if (!typeSelect || !typeDescription) {
            console.log('Custom Crew card elements not found yet');
            return;
        }
        
        // Type descriptions
        const typeDescriptions = {
            'squad': 'Disciplined and stolid. Equipped with a similar type of weaponry (pistols, stun batons, rifles, etc). Able to guard areas and engage in small-scale combat.',
            'techs': 'Educated and well trained. Equipped with basic tools. Able to provide technical or manual assistance to a variety of scientific or engineering projects.',
            'gang': 'Crude and self-reliant. Equipped with a smattering of mismatched weaponry (pistols, shotguns, chains, knives, etc). Able to attack people or break things.',
            'staff': 'Refined and professional. Able to serve guests, keep accounts, prepare meals and perform daily household chores.'
        };
        
        // Function to update type description
        function updateTypeDescription() {
            const selectedType = typeSelect.value;
            if (selectedType && typeDescriptions[selectedType]) {
                typeDescription.innerHTML = typeDescriptions[selectedType];
                typeDescription.style.display = 'block';
            } else {
                typeDescription.style.display = 'none';
            }
        }
        
        // Add event listener
        if (typeSelect) {
            typeSelect.addEventListener('change', updateTypeDescription);
        }
        
        // Initial update
        updateTypeDescription();
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('custom-crew', initializeCustomCrewCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="custom-crew"]')) {
            console.log('Custom Crew card already exists, initializing immediately');
            initializeCustomCrewCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCustomCrewCard);
        } else {
            initializeCustomCrewCard();
        }
    }
    
    // Export for debugging
    window.initializeCustomCrewCard = initializeCustomCrewCard;
    
})();