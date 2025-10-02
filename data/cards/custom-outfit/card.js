// Custom Outfit Card JavaScript
// Handles type descriptions and armor calculation
console.log('Custom Outfit card script is loading!');
(function() {
    'use strict';
    
    function initializeCustomOutfitCard() {
        console.log('Custom Outfit card: Initializing type descriptions and armor calculation');
        
        // Get type dropdown and description elements
        const typeSelect = document.getElementById('co_type');
        const typeDescription = document.getElementById('co_type_description');
        
        // Get armor-providing upgrade checkboxes
        const armoredCheckbox = document.getElementById('co_arm');
        const carapaceCheckbox = document.getElementById('co_car');
        const meshweaveCheckbox = document.getElementById('co_mes');
        const shieldedCheckbox = document.getElementById('co_shi');
        
        if (!typeSelect || !typeDescription) {
            console.log('Custom Outfit card elements not found yet');
            return;
        }
        
        // Type descriptions
        const typeDescriptions = {
            'rugged': 'Crude, patched, aged and worn.',
            'simple': 'Utilitarian, favors function over looks.',
            'cultural': 'Incorporates popular styles/elements of a culture.',
            'formal': 'Well cut and stylish.',
            'uniform': 'Easily identifiable as belonging to a specific faction or group.'
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
        
        // Create and insert armor display element (only if it doesn't exist)
        let armorDisplay = document.getElementById('co_armor_display');
        if (!armorDisplay) {
            armorDisplay = document.createElement('div');
            armorDisplay.id = 'co_armor_display';
            armorDisplay.className = 'form-field';
            armorDisplay.innerHTML = '<strong>Armor:</strong> <span id="co_armor_value">0</span>';
            armorDisplay.style.marginTop = '10px';
            armorDisplay.style.padding = '8px';
            armorDisplay.style.background = '#e8f4f8';
            armorDisplay.style.borderRadius = '4px';
            armorDisplay.style.fontSize = '1.1em';
            
            // Insert armor display after the HR separator
            const hrElement = document.querySelector('.custom-outfit-card hr');
            if (hrElement && hrElement.parentNode) {
                hrElement.parentNode.insertBefore(armorDisplay, hrElement.nextSibling);
            }
        }
        
        // Function to calculate and update armor
        function updateArmor() {
            let totalArmor = 0;
            
            // Armored upgrade: +2 Armor
            if (armoredCheckbox && armoredCheckbox.checked) {
                totalArmor += 2;
            }
            
            // Carapace upgrade: +3 Armor
            if (carapaceCheckbox && carapaceCheckbox.checked) {
                totalArmor += 3;
            }
            
            // Meshweave upgrade: +1 Armor
            if (meshweaveCheckbox && meshweaveCheckbox.checked) {
                totalArmor += 1;
            }
            
            // Shielded upgrade: +1 Armor
            if (shieldedCheckbox && shieldedCheckbox.checked) {
                totalArmor += 1;
            }
            
            // Update display
            const armorValueElement = document.getElementById('co_armor_value');
            if (armorValueElement) {
                armorValueElement.textContent = totalArmor;
            }
            
            // Add visual feedback for armor values
            if (totalArmor >= 5) {
                armorDisplay.style.background = '#d4edda';
                armorDisplay.style.color = '#155724';
            } else if (totalArmor >= 3) {
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
        
        // Add event listeners
        if (typeSelect) {
            typeSelect.addEventListener('change', updateTypeDescription);
        }
        
        // Add event listeners to armor-affecting upgrades
        if (armoredCheckbox) {
            armoredCheckbox.addEventListener('change', updateArmor);
        }
        if (carapaceCheckbox) {
            carapaceCheckbox.addEventListener('change', updateArmor);
        }
        if (meshweaveCheckbox) {
            meshweaveCheckbox.addEventListener('change', updateArmor);
        }
        if (shieldedCheckbox) {
            shieldedCheckbox.addEventListener('change', updateArmor);
        }
        
        // Initial updates
        updateTypeDescription();
        updateArmor();
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('custom-outfit', initializeCustomOutfitCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="custom-outfit"]')) {
            console.log('Custom Outfit card already exists, initializing immediately');
            initializeCustomOutfitCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCustomOutfitCard);
        } else {
            initializeCustomOutfitCard();
        }
    }
    
    // Export for debugging
    window.initializeCustomOutfitCard = initializeCustomOutfitCard;
    
})();