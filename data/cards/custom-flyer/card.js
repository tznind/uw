// Custom Flyer Card JavaScript
// Automatically calculates armor based on selected upgrades
console.log('Custom Flyer card script is loading!');
(function() {
    'use strict';
    
    function initializeCustomFlyerCard() {
        console.log('Custom Flyer card: Initializing type descriptions and armor calculation');
        
        // Get all upgrade checkboxes that affect armor
        const armoredCheckbox = document.getElementById('cf_ar');
        const shieldedCheckbox = document.getElementById('cf_sh');
        
        // Get type dropdown and description elements
        const typeSelect = document.getElementById('cf_type');
        const typeDescription = document.getElementById('cf_type_description');
        
        if (!typeSelect || !typeDescription) {
            console.log('Custom Flyer card elements not found yet');
            return;
        }
    
    // Type descriptions
    const typeDescriptions = {
        'speeder': 'A tiny, maneuverable flying vehicle. Space for a pilot and at most one passenger.',
        'shuttle': 'A flying vehicle for up to six people that can hover and take off vertically.'
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
    
    // Add event listener for type selection
    if (typeSelect) {
        typeSelect.addEventListener('change', updateTypeDescription);
        // Initial call in case there's already a selection
        updateTypeDescription();
    }
    
    // Create and insert armor display element (only if it doesn't exist)
    let armorDisplay = document.getElementById('cf_armor_display');
    if (!armorDisplay) {
        armorDisplay = document.createElement('div');
        armorDisplay.id = 'cf_armor_display';
        armorDisplay.className = 'form-field';
        armorDisplay.innerHTML = '<strong>Armor:</strong> <span id="cf_armor_value">0</span>';
        armorDisplay.style.marginTop = '10px';
        armorDisplay.style.padding = '8px';
        armorDisplay.style.background = '#e8f4f8';
        armorDisplay.style.borderRadius = '4px';
        armorDisplay.style.fontSize = '1.1em';
        
        // Insert armor display after the Brace for Impact help section
        const braceForImpactDetails = document.querySelector('.custom-flyer-card details');
        if (braceForImpactDetails && braceForImpactDetails.parentNode) {
            braceForImpactDetails.parentNode.insertBefore(armorDisplay, braceForImpactDetails.nextSibling);
        }
    }
    
    // Function to calculate and update armor
    function updateArmor() {
        let totalArmor = 0;
        
        // Armored upgrade: +2 Armor
        if (armoredCheckbox && armoredCheckbox.checked) {
            totalArmor += 2;
        }
        
        // Shielded upgrade: +1 Armor
        if (shieldedCheckbox && shieldedCheckbox.checked) {
            totalArmor += 1;
        }
        
        // Update display
        const armorValueElement = document.getElementById('cf_armor_value');
        if (armorValueElement) {
            armorValueElement.textContent = totalArmor;
        }
        
        // Add visual feedback for armor values
        if (totalArmor >= 3) {
            armorDisplay.style.background = '#d4edda';
            armorDisplay.style.color = '#155724';
        } else if (totalArmor >= 2) {
            armorDisplay.style.background = '#fff3cd';
            armorDisplay.style.color = '#856404';
        } else if (totalArmor >= 1) {
            armorDisplay.style.background = '#cce5ff';
            armorDisplay.style.color = '#004085';
        } else {
            armorDisplay.style.background = '#e8f4f8';
            armorDisplay.style.color = 'inherit';
        }
    }
    
    // Add event listeners to armor-affecting upgrades
    if (armoredCheckbox) {
        armoredCheckbox.addEventListener('change', updateArmor);
    }
    if (shieldedCheckbox) {
        shieldedCheckbox.addEventListener('change', updateArmor);
    }
    
        // Initial calculation
        updateArmor();
        
        // Initial type description update
        updateTypeDescription();
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('custom-flyer', initializeCustomFlyerCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="custom-flyer"]')) {
            console.log('Custom Flyer card already exists, initializing immediately');
            initializeCustomFlyerCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCustomFlyerCard);
        } else {
            initializeCustomFlyerCard();
        }
    }
    
    // Export for debugging
    window.initializeCustomFlyerCard = initializeCustomFlyerCard;
    
})();
