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
        
        // List of all firearm upgrade checkbox IDs
        const firearmUpgradeCheckboxes = [
            'uw_f_att', 'uw_f_burst', 'uw_f_con', 'uw_f_chem', 'uw_f_dest', 'uw_f_exp',
            'uw_f_imp', 'uw_f_key', 'uw_f_las', 'uw_f_lau', 'uw_f_mou', 'uw_f_pen',
            'uw_f_pla', 'uw_f_rap', 'uw_f_sco', 'uw_f_sho', 'uw_f_shr', 'uw_f_sil',
            'uw_f_sta', 'uw_f_stu', 'uw_f_sty', 'uw_f_cha', 'uw_f_chg', 'uw_f_cns',
            'uw_f_dis', 'uw_f_liv', 'uw_f_pai', 'uw_f_rad', 'uw_f_ric', 'uw_f_sum',
            'uw_f_swi', 'uw_f_syp', 'uw_f_vir'
        ];
        
        // List of all heavy weapon upgrade checkbox IDs  
        const heavyUpgradeCheckboxes = [
            'uw_h_bre', 'uw_h_chem', 'uw_h_con', 'uw_h_det', 'uw_h_imp', 'uw_h_key',
            'uw_h_las', 'uw_h_pen', 'uw_h_pla', 'uw_h_see', 'uw_h_sho', 'uw_h_shr',
            'uw_h_spr', 'uw_h_stu', 'uw_h_sty', 'uw_h_sus', 'uw_h_cha', 'uw_h_dis',
            'uw_h_ipl', 'uw_h_liv', 'uw_h_ric', 'uw_h_sum', 'uw_h_swi', 'uw_h_tur',
            'uw_h_vir', 'uw_h_vol'
        ];
        
        // Combined list for hide untaken functionality
        const allUpgradeCheckboxes = [...firearmUpgradeCheckboxes, ...heavyUpgradeCheckboxes];
        
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
            
            // Also update hide untaken functionality
            updateUpgradeDisplay();
        }
        
        // Function to update individual upgrade visibility (hide untaken)
        function updateUpgradeDisplay() {
            console.log('Unique Weapon: Updating upgrade display for hide untaken...');
            
            // Check if hide untaken is enabled
            const hideUntakenCheckbox = document.getElementById('hide_untaken');
            const hideUntaken = hideUntakenCheckbox ? hideUntakenCheckbox.checked : false;
            
            allUpgradeCheckboxes.forEach(checkboxId => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    const label = checkbox.closest('label');
                    if (label) {
                        if (checkbox.checked) {
                            // Show and mark as selected
                            label.classList.add('selected');
                            label.style.display = '';
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                            } else {
                                label.style.display = '';
                            }
                        }
                    }
                }
            });
        }
        
        // Add event listeners
        if (categorySelect) {
            categorySelect.addEventListener('change', updateWeaponInterface);
        }
        
        if (subtypeSelect) {
            subtypeSelect.addEventListener('change', updateWeaponInterface);
        }
        
        // Set up upgrade checkbox listeners for hide untaken functionality
        allUpgradeCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox && !checkbox.hasAttribute('data-weapon-listener')) {
                checkbox.addEventListener('change', function() {
                    updateUpgradeDisplay();
                });
                checkbox.setAttribute('data-weapon-listener', 'true');
            }
        });
        
        // Initial update
        updateWeaponInterface();
    }
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers['unique-weapon'] = initializeUniqueWeaponCard;
    
})();