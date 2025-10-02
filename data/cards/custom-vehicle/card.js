// Custom Vehicle Card JavaScript
// Automatically calculates armor based on selected upgrades
console.log('Custom Vehicle card script is loading!');
(function() {
    'use strict';
    
    function initializeCustomVehicleCard() {
        console.log('Custom Vehicle card: Initializing type descriptions and armor calculation');
        
        // Get all upgrade checkboxes that affect armor
        const platedCheckbox = document.getElementById('cv_pl');
        const reinforcedCheckbox = document.getElementById('cv_re');
        
        // Get type dropdown and description elements
        const typeSelect = document.getElementById('cv_type');
        const typeDescription = document.getElementById('cv_type_description');
        
        if (!typeSelect || !typeDescription) {
            console.log('Custom Vehicle card elements not found yet');
            return;
        }
    
    // Type descriptions
    const typeDescriptions = {
        'bike': 'A fast, two-wheeled vehicle with a maneuverable frame. Up to one passenger.',
        'groundcar': 'A sturdy 4 or 6-wheeled transport. Fits a driver plus up to 4 passengers.',
        'walker': 'A bipedal humanoid chassis with lifter arms. 1 pilot suspended within.',
        'quadwalker': 'A quadruped vehicle for up to 3 people. All-terrain mobility with stability.'
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
    let armorDisplay = document.getElementById('cv_armor_display');
    if (!armorDisplay) {
        armorDisplay = document.createElement('div');
        armorDisplay.id = 'cv_armor_display';
        armorDisplay.className = 'form-field';
        armorDisplay.innerHTML = '<strong>Armor:</strong> <span id="cv_armor_value">0</span>';
        armorDisplay.style.marginTop = '10px';
        armorDisplay.style.padding = '8px';
        armorDisplay.style.background = '#e8f4f8';
        armorDisplay.style.borderRadius = '4px';
        armorDisplay.style.fontSize = '1.1em';
        
        // Insert armor display after the Brace for Impact help section
        const braceForImpactDetails = document.querySelector('.custom-vehicle-card details');
        if (braceForImpactDetails && braceForImpactDetails.parentNode) {
            braceForImpactDetails.parentNode.insertBefore(armorDisplay, braceForImpactDetails.nextSibling);
        }
    }
    
    // Function to calculate and update armor
    function updateArmor() {
        let totalArmor = 0;
        
        // Plated upgrade: +3 Armor
        if (platedCheckbox && platedCheckbox.checked) {
            totalArmor += 3;
        }
        
        // Reinforced upgrade: +3 Armor
        if (reinforcedCheckbox && reinforcedCheckbox.checked) {
            totalArmor += 3;
        }
        
        // Update display
        const armorValueElement = document.getElementById('cv_armor_value');
        if (armorValueElement) {
            armorValueElement.textContent = totalArmor;
        }
        
        // Add visual feedback for high armor values
        if (totalArmor >= 6) {
            armorDisplay.style.background = '#d4edda';
            armorDisplay.style.color = '#155724';
        } else if (totalArmor >= 3) {
            armorDisplay.style.background = '#fff3cd';
            armorDisplay.style.color = '#856404';
        } else {
            armorDisplay.style.background = '#e8f4f8';
            armorDisplay.style.color = 'inherit';
        }
    }
    
    // Add event listeners to armor-affecting upgrades
    if (platedCheckbox) {
        platedCheckbox.addEventListener('change', updateArmor);
    }
    if (reinforcedCheckbox) {
        reinforcedCheckbox.addEventListener('change', updateArmor);
    }
    
        // Initial calculation
        updateArmor();
        
        // Initial type description update
        updateTypeDescription();
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('custom-vehicle', initializeCustomVehicleCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="custom-vehicle"]')) {
            console.log('Custom Vehicle card already exists, initializing immediately');
            initializeCustomVehicleCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCustomVehicleCard);
        } else {
            initializeCustomVehicleCard();
        }
    }
    
    // Export for debugging
    window.initializeCustomVehicleCard = initializeCustomVehicleCard;
    
})();
