// Custom Vehicle Card JavaScript
// Automatically calculates armor and handles hide untaken functionality
console.log('*** CUSTOM VEHICLE SCRIPT STARTING ***');

(function() {
    'use strict';
    
    console.log('Custom Vehicle script loading...');
    
    // List of all upgrade checkbox IDs
    const upgradeCheckboxes = [
        'cv_ag', 'cv_ar', 'cv_bo', 'cv_co', 'cv_lu', 'cv_pl',
        'cv_re', 'cv_ru', 'cv_se', 'cv_sn', 'cv_st', 'cv_to',
        'cv_tr', 'cv_tu', 'cv_wo', 'cv_ba', 'cv_bl', 'cv_cn',
        'cv_fo', 'cv_ke', 'cv_li', 'cv_pf', 'cv_sh', 'cv_su',
        'cv_tf', 'cv_vi'
    ];
    
    function setupUpgradeCheckboxes() {
        console.log('Custom Vehicle: Setting up checkboxes...');
        
        // Function to update upgrade visibility
        function updateUpgradeDisplay() {
            console.log('Custom Vehicle: Updating upgrade display...');
            
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
                            console.log(`Custom Vehicle: Added selected to ${checkboxId}`);
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                                console.log(`Custom Vehicle: Hid unselected ${checkboxId}`);
                            } else {
                                label.style.display = '';
                                console.log(`Custom Vehicle: Removed selected from ${checkboxId}`);
                            }
                        }
                    } else {
                        console.log(`Custom Vehicle: Missing label for ${checkboxId}`);
                    }
                } else {
                    console.log(`Custom Vehicle: Checkbox ${checkboxId} NOT FOUND`);
                }
            });
        }
        
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
    
        // Set up upgrade checkbox listeners
        upgradeCheckboxes.forEach(checkboxId => {
            console.log(`Custom Vehicle: Looking for checkbox: ${checkboxId}`);
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                console.log(`Custom Vehicle: Found checkbox ${checkboxId}`);
                
                // Check if we already added a listener to prevent duplicates
                if (!checkbox.hasAttribute('data-vehicle-listener')) {
                    console.log(`Custom Vehicle: Adding event listener to ${checkboxId}`);
                    checkbox.addEventListener('change', function() {
                        console.log(`Custom Vehicle: Checkbox ${checkboxId} changed to:`, this.checked);
                        updateUpgradeDisplay();
                        updateArmor(); // Also update armor when upgrades change
                    });
                    checkbox.setAttribute('data-vehicle-listener', 'true');
                } else {
                    console.log(`Custom Vehicle: Event listener already exists for ${checkboxId}`);
                }
            } else {
                console.log(`Custom Vehicle: Checkbox ${checkboxId} NOT FOUND`);
            }
        });
        
        // Set up type select listener
        if (typeSelect && !typeSelect.hasAttribute('data-vehicle-type-listener')) {
            typeSelect.addEventListener('change', updateTypeDescription);
            typeSelect.setAttribute('data-vehicle-type-listener', 'true');
        }
        
        // Initial updates
        updateTypeDescription();
        updateArmor();
        updateUpgradeDisplay();
    }
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers['custom-vehicle'] = setupUpgradeCheckboxes;
    
    // Simple initialization for first load following Stonetop pattern
    console.log('Custom Vehicle: Setting up initialization...');
    
    // Try multiple times to catch the card when it's ready
    setTimeout(function() {
        console.log('Custom Vehicle: First attempt at 100ms...');
        setupUpgradeCheckboxes();
    }, 100);
    
    setTimeout(function() {
        console.log('Custom Vehicle: Second attempt at 1000ms...');
        setupUpgradeCheckboxes();
    }, 1000);
    
    setTimeout(function() {
        console.log('Custom Vehicle: Third attempt at 2000ms...');
        setupUpgradeCheckboxes();
    }, 2000);
    
    // Also try immediately if DOM is ready
    if (document.readyState !== 'loading') {
        console.log('Custom Vehicle: DOM ready, trying immediately...');
        setupUpgradeCheckboxes();
    }
    
})();

console.log('*** CUSTOM VEHICLE SCRIPT END ***');
