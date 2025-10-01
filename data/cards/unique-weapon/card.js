// Unique Weapon Card JavaScript
// Handles cascading dropdowns and dynamic descriptions
console.log('Unique Weapon card script is loading!');
(function() {
    'use strict';
    
    function initializeUniqueWeaponCard() {
        console.log('Unique Weapon card: Initializing cascading dropdowns and descriptions');
        
        // Get dropdown elements
        const categorySelect = document.getElementById('uw_category');
        const subtypeField = document.getElementById('uw_subtype_field');
        const subtypeSelect = document.getElementById('uw_subtype');
        const weaponDescription = document.getElementById('uw_weapon_description');
        
        // Get upgrade sections
        const firearmUpgrades = document.getElementById('firearm_upgrades');
        const heavyUpgrades = document.getElementById('heavy_upgrades');
        
        if (!categorySelect || !subtypeField || !subtypeSelect || !weaponDescription) {
            console.log('Unique Weapon card elements not found yet');
            return;
        }
        
        // Weapon descriptions
        const weaponDescriptions = {
            // Firearm subtypes
            'pistol': 'One handed ranged weapon, Optimal Ranges: Adjacent, Close.',
            'rifle': 'Two handed ranged weapon, Optimal Ranges: Close, Far.',
            // Heavy weapon (no subtypes)
            'heavy': 'Heavy Weapon: Two-handed ranged weapon. Optimal Ranges: Far, Distant.<br>• <strong>Destructive:</strong> Causes property damage, damages machinery and vehicles.<br>• <strong>Clumsy:</strong> Heavy and awkward, forces Face Adversity on physical activity.'
        };
        
        // Function to update subtype dropdown and descriptions
        function updateWeaponInterface() {
            const selectedCategory = categorySelect.value;
            
            // Handle subtype field visibility
            if (selectedCategory === 'firearm') {
                subtypeField.style.display = 'block';
                // Show description based on subtype selection
                const selectedSubtype = subtypeSelect.value;
                if (selectedSubtype && weaponDescriptions[selectedSubtype]) {
                    weaponDescription.innerHTML = weaponDescriptions[selectedSubtype];
                    weaponDescription.style.display = 'block';
                } else {
                    weaponDescription.style.display = 'none';
                }
            } else if (selectedCategory === 'heavy') {
                subtypeField.style.display = 'none';
                subtypeSelect.value = ''; // Clear subtype selection
                // Show heavy weapon description
                weaponDescription.innerHTML = weaponDescriptions['heavy'];
                weaponDescription.style.display = 'block';
            } else {
                // No category selected
                subtypeField.style.display = 'none';
                subtypeSelect.value = '';
                weaponDescription.style.display = 'none';
            }
            
            // Update upgrade sections
            updateUpgradeVisibility();
        }
        
        // Function to update upgrade section visibility
        function updateUpgradeVisibility() {
            const selectedCategory = categorySelect.value;
            
            if (selectedCategory === 'firearm') {
                firearmUpgrades.style.display = 'grid';
                heavyUpgrades.style.display = 'none';
            } else if (selectedCategory === 'heavy') {
                firearmUpgrades.style.display = 'none';
                heavyUpgrades.style.display = 'grid';
            } else {
                firearmUpgrades.style.display = 'none';
                heavyUpgrades.style.display = 'none';
            }
        }
        
        // Add event listeners
        if (categorySelect) {
            categorySelect.addEventListener('change', updateWeaponInterface);
        }
        
        if (subtypeSelect) {
            subtypeSelect.addEventListener('change', updateWeaponInterface);
        }
        
        // Initial update
        updateWeaponInterface();
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('unique-weapon', initializeUniqueWeaponCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="unique-weapon"]')) {
            console.log('Unique Weapon card already exists, initializing immediately');
            initializeUniqueWeaponCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeUniqueWeaponCard);
        } else {
            initializeUniqueWeaponCard();
        }
    }
    
    // Export for debugging
    window.initializeUniqueWeaponCard = initializeUniqueWeaponCard;
    
})();