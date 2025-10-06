// Custom Melee Weapon Card JavaScript
// Handles hide untaken functionality
console.log('*** CUSTOM MELEE SCRIPT STARTING ***');

(function() {
    'use strict';
    
    console.log('Custom Melee script loading...');
    
    // List of all upgrade checkbox IDs
    const upgradeCheckboxes = [
        // New melee upgrades
        'cm_con', 'cm_dan', 'cm_dis', 'cm_ele', 'cm_liv', 'cm_pai',
        'cm_rad', 'cm_spe', 'cm_sum', 'cm_swi', 'cm_syp', 'cm_vir',
        // Basic melee upgrades
        'cm_cnc', 'cm_def', 'cm_des', 'cm_ene', 'cm_fle', 'cm_glo',
        'cm_haf', 'cm_hea', 'cm_imp', 'cm_pie', 'cm_rip', 'cm_sev',
        'cm_sho', 'cm_sty', 'cm_thr'
    ];
    
    function setupUpgradeCheckboxes() {
        console.log('Custom Melee: Setting up checkboxes...');
        
        // Function to update upgrade visibility
        function updateUpgradeDisplay() {
            console.log('Custom Melee: Updating upgrade display...');
            
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
                            console.log(`Custom Melee: Added selected to ${checkboxId}`);
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                                console.log(`Custom Melee: Hid unselected ${checkboxId}`);
                            } else {
                                label.style.display = '';
                                console.log(`Custom Melee: Removed selected from ${checkboxId}`);
                            }
                        }
                    } else {
                        console.log(`Custom Melee: Missing label for ${checkboxId}`);
                    }
                } else {
                    console.log(`Custom Melee: Checkbox ${checkboxId} NOT FOUND`);
                }
            });
        }
        
        // Set up upgrade checkbox listeners
        upgradeCheckboxes.forEach(checkboxId => {
            console.log(`Custom Melee: Looking for checkbox: ${checkboxId}`);
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                console.log(`Custom Melee: Found checkbox ${checkboxId}`);
                
                // Check if we already added a listener to prevent duplicates
                if (!checkbox.hasAttribute('data-melee-listener')) {
                    console.log(`Custom Melee: Adding event listener to ${checkboxId}`);
                    checkbox.addEventListener('change', function() {
                        console.log(`Custom Melee: Checkbox ${checkboxId} changed to:`, this.checked);
                        updateUpgradeDisplay();
                    });
                    checkbox.setAttribute('data-melee-listener', 'true');
                } else {
                    console.log(`Custom Melee: Event listener already exists for ${checkboxId}`);
                }
            } else {
                console.log(`Custom Melee: Checkbox ${checkboxId} NOT FOUND`);
            }
        });
        
        // Initial update
        updateUpgradeDisplay();
    }
    
    // Export initialization function for the card system
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers['custom-melee'] = setupUpgradeCheckboxes;
    
})();

console.log('*** CUSTOM MELEE SCRIPT END ***');