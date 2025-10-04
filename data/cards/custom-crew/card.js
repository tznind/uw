// Custom Crew Card JavaScript
// Handles type descriptions and hide untaken functionality
console.log('*** CUSTOM CREW SCRIPT STARTING ***');

(function() {
    'use strict';
    
    console.log('Custom Crew script loading...');
    
    // List of all upgrade checkbox IDs
    const upgradeCheckboxes = [
        'cc_arm', 'cc_art', 'cc_ath', 'cc_bea', 'cc_bui', 'cc_cri',
        'cc_equ', 'cc_fea', 'cc_imp', 'cc_inf', 'cc_loy', 'cc_mec',
        'cc_med', 'cc_num', 'cc_rug', 'cc_ste', 'cc_tea', 'cc_wre'
    ];
    
    function setupUpgradeCheckboxes() {
        console.log('Custom Crew: Setting up checkboxes...');
        
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
            'staff': 'Refined and professional. Able to serve guests, keep accounts, prepare meals and perform daily household chores.',
            'artificial': 'Choose form (robot, undead, golem, spirit, etc.). Obedient, but rarely takes initiative or acts on their own. Commanded with +Interface.'
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
            console.log('Custom Crew: Updating upgrade display...');
            
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
                            console.log(`Custom Crew: Added selected to ${checkboxId}`);
                        } else {
                            // Remove selected styling
                            label.classList.remove('selected');
                            // Hide if 'Hide untaken' is checked, else show
                            if (hideUntaken) {
                                label.style.display = 'none';
                                console.log(`Custom Crew: Hid unselected ${checkboxId}`);
                            } else {
                                label.style.display = '';
                                console.log(`Custom Crew: Removed selected from ${checkboxId}`);
                            }
                        }
                    } else {
                        console.log(`Custom Crew: Missing label for ${checkboxId}`);
                    }
                } else {
                    console.log(`Custom Crew: Checkbox ${checkboxId} NOT FOUND`);
                }
            });
        }
        
        // Set up upgrade checkbox listeners
        upgradeCheckboxes.forEach(checkboxId => {
            console.log(`Custom Crew: Looking for checkbox: ${checkboxId}`);
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                console.log(`Custom Crew: Found checkbox ${checkboxId}`);
                
                // Check if we already added a listener to prevent duplicates
                if (!checkbox.hasAttribute('data-crew-listener')) {
                    console.log(`Custom Crew: Adding event listener to ${checkboxId}`);
                    checkbox.addEventListener('change', function() {
                        console.log(`Custom Crew: Checkbox ${checkboxId} changed to:`, this.checked);
                        updateUpgradeDisplay();
                    });
                    checkbox.setAttribute('data-crew-listener', 'true');
                } else {
                    console.log(`Custom Crew: Event listener already exists for ${checkboxId}`);
                }
            } else {
                console.log(`Custom Crew: Checkbox ${checkboxId} NOT FOUND`);
            }
        });
        
        // Set up type select listener
        if (typeSelect && !typeSelect.hasAttribute('data-crew-type-listener')) {
            typeSelect.addEventListener('change', updateTypeDescription);
            typeSelect.setAttribute('data-crew-type-listener', 'true');
        }
        
        // Initial updates
        updateTypeDescription();
        updateUpgradeDisplay();
    }
    
    // Create global initialization function that can be called whenever card is recreated
    window.initializeCustomCrewCard = function() {
        console.log('Custom Crew: Initializing Custom Crew card...');
        setupUpgradeCheckboxes();
    };
    
    // Simple initialization for first load following Stonetop pattern
    console.log('Custom Crew: Setting up initialization...');
    
    // Try multiple times to catch the card when it's ready
    setTimeout(function() {
        console.log('Custom Crew: First attempt at 100ms...');
        setupUpgradeCheckboxes();
    }, 100);
    
    setTimeout(function() {
        console.log('Custom Crew: Second attempt at 1000ms...');
        setupUpgradeCheckboxes();
    }, 1000);
    
    setTimeout(function() {
        console.log('Custom Crew: Third attempt at 2000ms...');
        setupUpgradeCheckboxes();
    }, 2000);
    
    // Also try immediately if DOM is ready
    if (document.readyState !== 'loading') {
        console.log('Custom Crew: DOM ready, trying immediately...');
        setupUpgradeCheckboxes();
    }
    
})();

console.log('*** CUSTOM CREW SCRIPT END ***');
