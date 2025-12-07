/**
 * Ship Card - Simplified using CardHelpers framework
 * Supports duplicate instances via takeFromAllowsDuplicates
 */

(function() {
    'use strict';

    function initializeShipCard(container, suffix) {
        // Create scoped helpers for this specific card instance
        // This allows the card to work correctly even when duplicated
        const helpers = suffix ?
            window.CardHelpers.createScopedHelpers(container, suffix) :
            window.CardHelpers; // Use global helpers for backwards compatibility

        const { setupAutoFill, setupVisualValidation, setupDependency,
                ValidationPatterns, addEventListener } = helpers;
        
        // Ship class auto-fill
        const classDefaults = {
            'frigate': { ship_speed: 8, ship_maneuverability: 15, ship_hull_integrity: 35, ship_armour: 4 },
            'light_cruiser': { ship_speed: 6, ship_maneuverability: 10, ship_hull_integrity: 50, ship_armour: 5 },
            'cruiser': { ship_speed: 5, ship_maneuverability: 8, ship_hull_integrity: 65, ship_armour: 6 },
            'grand_cruiser': { ship_speed: 4, ship_maneuverability: 5, ship_hull_integrity: 80, ship_armour: 7 },
            'battleship': { ship_speed: 3, ship_maneuverability: 2, ship_hull_integrity: 100, ship_armour: 8 },
            'transport': { ship_speed: 4, ship_maneuverability: -10, ship_hull_integrity: 45, ship_armour: 3 },
            'raider': { ship_speed: 10, ship_maneuverability: 20, ship_hull_integrity: 25, ship_armour: 3 }
        };
        
        setupAutoFill('ship_class', classDefaults);
        
        // Visual feedback for critical hull damage
        setupVisualValidation('ship_hull_integrity', ValidationPatterns.numericRange([
            { max: 10, bgColor: '#fee2e2', color: '#dc2626' },
            { max: 25, bgColor: '#fef3c7', color: '#d97706' }
        ]));
        
        // Ship name validation
        addEventListener('ship_name', 'blur', function() {
            const name = this.value.trim();
            if (name && !name.match(/^[A-Za-z\s'\-]+$/)) {
                alert('Ship names should typically contain only letters, spaces, apostrophes, and hyphens.');
            }
        });
        
        setupComponentDependencies(helpers);

        console.log(`Ship card initialized with custom functionality (suffix: ${suffix || 'none'})`);
    }

    function setupComponentDependencies(helpers) {
        const { setupDependency } = helpers;
        
        // Void shields require plasma drive
        setupDependency('ship_void_shields', 'change', (element, helpers) => {
            if (element.checked && !helpers.isChecked('ship_plasma_drive')) {
                if (confirm('Void shields require a plasma drive. Add plasma drive?')) {
                    helpers.setChecked('ship_plasma_drive', true);
                } else {
                    element.checked = false;
                }
            }
        });
        
        // Warp shield is essential for warp travel
        setupDependency('ship_warp_shield', 'change', (element) => {
            if (!element.checked) {
                const warning = confirm('WARNING: Removing Warp Shield makes warp travel extremely dangerous! Are you sure?');
                if (!warning) {
                    element.checked = true;
                }
            }
        });
    }
    
    // Export initialization function for the card system to call
    window.CardInitializers = window.CardInitializers || {};
    window.CardInitializers.ship = initializeShipCard;
    
})();