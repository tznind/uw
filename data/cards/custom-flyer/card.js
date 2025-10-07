// Custom Flyer Card JavaScript
// Automatically calculates armor and handles hide untaken functionality
console.log('*** CUSTOM FLYER SCRIPT STARTING ***');

(function() {
    'use strict';
    
    console.log('Custom Flyer script loading...');
    
    // List of all upgrade checkbox IDs
    const upgradeCheckboxes = [
        'cf_ag', 'cf_ar', 'cf_am', 'cf_co', 'cf_lu', 'cf_ru',
        'cf_se', 'cf_sn', 'cf_sh', 'cf_st', 'cf_to', 'cf_tr',
        'cf_tu', 'cf_wo', 'cf_ba', 'cf_bl', 'cf_cn', 'cf_fo',
        'cf_ke', 'cf_la', 'cf_li', 'cf_su', 'cf_tf', 'cf_vi'
    ];
    
    function setupUpgradeCheckboxes() {
        console.log('Custom Flyer: Setting up checkboxes...');
        
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
        
        // Function to update upgrade visibility
        function updateUpgradeDisplay() {
            console.log('Custom Flyer: Updating upgrade display...');
            
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
                            console.log(`Custom Flyer: Added selected to ${checkboxId}`);
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                                console.log(`Custom Flyer: Hid unselected ${checkboxId}`);
                            } else {
                                label.style.display = '';
                                console.log(`Custom Flyer: Removed selected from ${checkboxId}`);
                            }
                        }
                    } else {
                        console.log(`Custom Flyer: Missing label for ${checkboxId}`);
                    }
                } else {
                    console.log(`Custom Flyer: Checkbox ${checkboxId} NOT FOUND`);
                }
            });
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
        
        // Insert armor display after the health status section
        const healthSection = document.querySelector('.custom-flyer-card .health-options').parentNode;
        if (healthSection && healthSection.parentNode) {
            healthSection.parentNode.insertBefore(armorDisplay, healthSection.nextSibling);
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
    
        // Set up upgrade checkbox listeners
        upgradeCheckboxes.forEach(checkboxId => {
            console.log(`Custom Flyer: Looking for checkbox: ${checkboxId}`);
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                console.log(`Custom Flyer: Found checkbox ${checkboxId}`);
                
                // Check if we already added a listener to prevent duplicates
                if (!checkbox.hasAttribute('data-flyer-listener')) {
                    console.log(`Custom Flyer: Adding event listener to ${checkboxId}`);
                    checkbox.addEventListener('change', function() {
                        console.log(`Custom Flyer: Checkbox ${checkboxId} changed to:`, this.checked);
                        updateUpgradeDisplay();
                        updateArmor(); // Also update armor when upgrades change
                    });
                    checkbox.setAttribute('data-flyer-listener', 'true');
                } else {
                    console.log(`Custom Flyer: Event listener already exists for ${checkboxId}`);
                }
            } else {
                console.log(`Custom Flyer: Checkbox ${checkboxId} NOT FOUND`);
            }
        });
        
        // Set up type select listener
        if (typeSelect && !typeSelect.hasAttribute('data-flyer-type-listener')) {
            typeSelect.addEventListener('change', updateTypeDescription);
            typeSelect.setAttribute('data-flyer-type-listener', 'true');
        }
        
        // Initial updates
        updateTypeDescription();
        updateArmor();
        updateUpgradeDisplay();
    }
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers['custom-flyer'] = setupUpgradeCheckboxes;
    
    // Simple initialization for first load following Stonetop pattern
    console.log('Custom Flyer: Setting up initialization...');
    
    // Try multiple times to catch the card when it's ready
    setTimeout(function() {
        console.log('Custom Flyer: First attempt at 100ms...');
        setupUpgradeCheckboxes();
    }, 100);
    
    setTimeout(function() {
        console.log('Custom Flyer: Second attempt at 1000ms...');
        setupUpgradeCheckboxes();
    }, 1000);
    
    setTimeout(function() {
        console.log('Custom Flyer: Third attempt at 2000ms...');
        setupUpgradeCheckboxes();
    }, 2000);
    
    // Also try immediately if DOM is ready
    if (document.readyState !== 'loading') {
        console.log('Custom Flyer: DOM ready, trying immediately...');
        setupUpgradeCheckboxes();
    }
    
})();

console.log('*** CUSTOM FLYER SCRIPT END ***');
