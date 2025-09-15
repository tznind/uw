/**
 * Ship Card Custom JavaScript
 * This demonstrates how cards can have their own custom logic
 */

(function() {
    'use strict';
    
    // Wait for the ship card to be loaded
    function initializeShipCard() {
        // Auto-calculate some stats based on ship class
        const shipClassSelect = document.getElementById('ship_class');
        const speedInput = document.getElementById('ship_speed');
        const maneuverabilityInput = document.getElementById('ship_maneuverability');
        const hullIntegrityInput = document.getElementById('ship_hull_integrity');
        const armourInput = document.getElementById('ship_armour');
        
        if (shipClassSelect) {
            shipClassSelect.addEventListener('change', function() {
                const shipClass = this.value;
                
                // Auto-fill typical stats based on ship class
                const classDefaults = {
                    'frigate': { speed: 8, maneuverability: 15, hull: 35, armour: 4 },
                    'light_cruiser': { speed: 6, maneuverability: 10, hull: 50, armour: 5 },
                    'cruiser': { speed: 5, maneuverability: 8, hull: 65, armour: 6 },
                    'grand_cruiser': { speed: 4, maneuverability: 5, hull: 80, armour: 7 },
                    'battleship': { speed: 3, maneuverability: 2, hull: 100, armour: 8 },
                    'transport': { speed: 4, maneuverability: -10, hull: 45, armour: 3 },
                    'raider': { speed: 10, maneuverability: 20, hull: 25, armour: 3 }
                };
                
                const defaults = classDefaults[shipClass];
                if (defaults && confirm('Auto-fill typical stats for this ship class?')) {
                    if (speedInput && !speedInput.value) speedInput.value = defaults.speed;
                    if (maneuverabilityInput && !maneuverabilityInput.value) maneuverabilityInput.value = defaults.maneuverability;
                    if (hullIntegrityInput && !hullIntegrityInput.value) hullIntegrityInput.value = defaults.hull;
                    if (armourInput && !armourInput.value) armourInput.value = defaults.armour;
                    
                    // Trigger persistence save
                    if (window.Persistence) {
                        const form = document.querySelector('form');
                        if (form) window.Persistence.saveToURL(form);
                    }
                }
            });
        }
        
        // Add visual feedback for critical hull damage
        if (hullIntegrityInput) {
            hullIntegrityInput.addEventListener('input', function() {
                const hull = parseInt(this.value);
                if (hull && hull <= 10) {
                    this.style.backgroundColor = '#fee2e2';
                    this.style.color = '#dc2626';
                } else if (hull && hull <= 25) {
                    this.style.backgroundColor = '#fef3c7';
                    this.style.color = '#d97706';
                } else {
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }
            });
        }
        
        // Add ship name validation
        const shipNameInput = document.getElementById('ship_name');
        if (shipNameInput) {
            shipNameInput.addEventListener('blur', function() {
                const name = this.value.trim();
                if (name && !name.match(/^[A-Za-z\s'\-]+$/)) {
                    alert('Ship names should typically contain only letters, spaces, apostrophes, and hyphens.');
                }
            });
        }
        
        // Add component dependency logic
        setupComponentDependencies();
        
        console.log('Ship card initialized with custom functionality');
    }
    
    function setupComponentDependencies() {
        // Void shields require plasma drive
        const plasmadriveCheckbox = document.getElementById('ship_plasma_drive');
        const voidShieldsCheckbox = document.getElementById('ship_void_shields');
        
        if (plasmadriveCheckbox && voidShieldsCheckbox) {
            voidShieldsCheckbox.addEventListener('change', function() {
                if (this.checked && !plasmadriveCheckbox.checked) {
                    if (confirm('Void shields require a plasma drive. Add plasma drive?')) {
                        plasmadriveCheckbox.checked = true;
                        // Trigger persistence
                        if (window.Persistence) {
                            const form = document.querySelector('form');
                            if (form) window.Persistence.saveToURL(form);
                        }
                    } else {
                        this.checked = false;
                    }
                }
            });
        }
        
        // Gellar field is essential for warp travel
        const gellarFieldCheckbox = document.getElementById('ship_gellar_field');
        if (gellarFieldCheckbox) {
            gellarFieldCheckbox.addEventListener('change', function() {
                if (!this.checked) {
                    const warning = confirm('WARNING: Removing Gellar Field makes warp travel extremely dangerous! Are you sure?');
                    if (!warning) {
                        this.checked = true;
                    }
                }
            });
        }
    }
    
    // Initialize when the card is loaded
    // We need to wait a bit for the DOM to be ready
    setTimeout(initializeShipCard, 100);
    
    // Also expose initialization function globally for manual triggering
    window.initializeShipCard = initializeShipCard;
    
})();