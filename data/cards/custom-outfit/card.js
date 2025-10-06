// Custom Outfit Card JavaScript
// Handles type descriptions, armor calculation, and hide untaken functionality
console.log('*** CUSTOM OUTFIT SCRIPT STARTING ***');

(function() {
    'use strict';
    
    console.log('Custom Outfit script loading...');
    
    // List of all upgrade checkbox IDs
    const upgradeCheckboxes = [
        'co_arm', 'co_car', 'co_com', 'co_con', 'co_imp', 'co_jum',
        'co_mes', 'co_rig', 'co_tou', 'co_sea', 'co_sen', 'co_shi',
        'co_ste', 'co_vis', 'co_cns', 'co_dis', 'co_emo', 'co_fol',
        'co_liv', 'co_sha', 'co_shf', 'co_sum', 'co_vir'
    ];
    
    function setupUpgradeCheckboxes() {
        console.log('Custom Outfit: Setting up checkboxes...');
        
        // Get type dropdown and description elements
        const typeSelect = document.getElementById('co_type');
        const typeDescription = document.getElementById('co_type_description');
        
        // Get armor-providing upgrade checkboxes
        const armoredCheckbox = document.getElementById('co_arm');
        const carapaceCheckbox = document.getElementById('co_car');
        const meshweaveCheckbox = document.getElementById('co_mes');
        const shieldedCheckbox = document.getElementById('co_shi');
        const consecratedCheckbox = document.getElementById('co_cns');
        
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
        
        // Function to update upgrade visibility
        function updateUpgradeDisplay() {
            console.log('Custom Outfit: Updating upgrade display...');
            
            // Check if hide untaken is enabled
            const hideUntakenCheckbox = document.getElementById('hide_untaken');
            const hideUntaken = hideUntakenCheckbox ? hideUntakenCheckbox.checked : false;
            
            upgradeCheckboxes.forEach(checkboxId => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    const label = checkbox.closest('label');
                    if (label) {
                        if (checkbox.checked) {
                            // Show and mark as selected
                            label.classList.add('selected');
                            label.style.display = '';
                            console.log(`Custom Outfit: Added selected to ${checkboxId}`);
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                                console.log(`Custom Outfit: Hid unselected ${checkboxId}`);
                            } else {
                                label.style.display = '';
                                console.log(`Custom Outfit: Removed selected from ${checkboxId}`);
                            }
                        }
                    } else {
                        console.log(`Custom Outfit: Missing label for ${checkboxId}`);
                    }
                } else {
                    console.log(`Custom Outfit: Checkbox ${checkboxId} NOT FOUND`);
                }
            });
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
            let conditionalArmor = '';
            
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
            
            // Consecrated upgrade: +2 Armor (conditional)
            if (consecratedCheckbox && consecratedCheckbox.checked) {
                conditionalArmor = ' (+2 vs enemies of cause)';
            }
            
            // Update display
            const armorValueElement = document.getElementById('co_armor_value');
            if (armorValueElement) {
                armorValueElement.textContent = totalArmor + conditionalArmor;
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
        
        // Set up upgrade checkbox listeners
        upgradeCheckboxes.forEach(checkboxId => {
            console.log(`Custom Outfit: Looking for checkbox: ${checkboxId}`);
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                console.log(`Custom Outfit: Found checkbox ${checkboxId}`);
                
                // Check if we already added a listener to prevent duplicates
                if (!checkbox.hasAttribute('data-outfit-listener')) {
                    console.log(`Custom Outfit: Adding event listener to ${checkboxId}`);
                    checkbox.addEventListener('change', function() {
                        console.log(`Custom Outfit: Checkbox ${checkboxId} changed to:`, this.checked);
                        updateUpgradeDisplay();
                        updateArmor(); // Also update armor when upgrades change
                    });
                    checkbox.setAttribute('data-outfit-listener', 'true');
                } else {
                    console.log(`Custom Outfit: Event listener already exists for ${checkboxId}`);
                }
            } else {
                console.log(`Custom Outfit: Checkbox ${checkboxId} NOT FOUND`);
            }
        });
        
        // Set up type select listener
        if (typeSelect && !typeSelect.hasAttribute('data-outfit-type-listener')) {
            typeSelect.addEventListener('change', updateTypeDescription);
            typeSelect.setAttribute('data-outfit-type-listener', 'true');
        }
        
        // Initial updates
        updateTypeDescription();
        updateArmor();
        updateUpgradeDisplay();
    }
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers['custom-outfit'] = setupUpgradeCheckboxes;
    
    // Simple initialization for first load following Stonetop pattern
    console.log('Custom Outfit: Setting up initialization...');
    
    // Try multiple times to catch the card when it's ready
    setTimeout(function() {
        console.log('Custom Outfit: First attempt at 100ms...');
        setupUpgradeCheckboxes();
    }, 100);
    
    setTimeout(function() {
        console.log('Custom Outfit: Second attempt at 1000ms...');
        setupUpgradeCheckboxes();
    }, 1000);
    
    setTimeout(function() {
        console.log('Custom Outfit: Third attempt at 2000ms...');
        setupUpgradeCheckboxes();
    }, 2000);
    
    // Also try immediately if DOM is ready
    if (document.readyState !== 'loading') {
        console.log('Custom Outfit: DOM ready, trying immediately...');
        setupUpgradeCheckboxes();
    }
    
})();

console.log('*** CUSTOM OUTFIT SCRIPT END ***');
