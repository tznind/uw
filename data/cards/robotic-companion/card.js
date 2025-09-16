/**
 * Robotic Companion Card - Mechanicus Logic
 * Simplified using CardHelpers framework
 */

(function() {
    'use strict';
    
    function initializeRoboticCompanionCard() {
        const { setupAutoFill, setupVisualValidation, setupDependency, addUtilityButton, 
                ValidationPatterns, DependencyPatterns } = window.CardHelpers;
        
        // Robot type auto-fill configuration
        setupRobotTypeLogic();
        setupStatValidation();
        setupEquipmentDependencies();
        setupStatusLogic();
        setupDesignationGenerator();
        
        console.log('Robotic Companion card initialized - Machine God be praised!');
    }
    
    function setupRobotTypeLogic() {
        const { setupAutoFill } = window.CardHelpers;
        
        // Robot type configurations
        const typeDefaults = {
            'recon_drone': { 
                robot_toughness: 20, robot_agility: 60, robot_intelligence: 30, 
                robot_wounds: 4, robot_armour: 2, robot_movement: 6,
                description: 'Small hovering reconnaissance unit'
            },
            'combat_servitor': { 
                robot_toughness: 45, robot_agility: 30, robot_intelligence: 15, 
                robot_wounds: 12, robot_armour: 4, robot_movement: 3,
                description: 'Combat-optimized servitor unit'
            },
            'tech_adept': { 
                robot_toughness: 35, robot_agility: 40, robot_intelligence: 55, 
                robot_wounds: 10, robot_armour: 5, robot_movement: 4,
                description: 'Tech Adept artificial construct'
            },
            'guardian_servitor': { 
                robot_toughness: 50, robot_agility: 25, robot_intelligence: 20, 
                robot_wounds: 15, robot_armour: 6, robot_movement: 3,
                description: 'Heavy protection servitor'
            },
            'medicae_servitor': { 
                robot_toughness: 30, robot_agility: 35, robot_intelligence: 40, 
                robot_wounds: 8, robot_armour: 3, robot_movement: 4,
                description: 'Medical assistance servitor'
            },
            'utility_servitor': { 
                robot_toughness: 35, robot_agility: 30, robot_intelligence: 25, 
                robot_wounds: 10, robot_armour: 3, robot_movement: 3,
                description: 'General purpose work unit'
            },
            'heavy_servitor': { 
                robot_toughness: 65, robot_agility: 15, robot_intelligence: 10, 
                robot_wounds: 20, robot_armour: 8, robot_movement: 2,
                description: 'Heavy combat platform'
            }
        };
        
        setupAutoFill('robot_type', typeDefaults, (type, defaults) => {
            return `Auto-fill typical stats for ${type.replace('_', ' ')}?\n${defaults.description}`;
        });
    }
    
    function setupStatValidation() {
        const { setupVisualValidation, setupDependency, ValidationPatterns } = window.CardHelpers;
        
        // Visual feedback for wounds (critical damage indication)
        setupVisualValidation('robot_wounds', ValidationPatterns.numericRange([
            { max: 2, bgColor: '#fee2e2', color: '#dc2626' },
            { max: 5, bgColor: '#fef3c7', color: '#d97706' }
        ]));
        
        // Toughness affects wound capacity
        setupDependency('robot_toughness', 'input', (element, helpers) => {
            const toughness = parseInt(element.value);
            const currentWounds = parseInt(helpers.getValue('robot_wounds')) || 0;
            if (toughness && toughness < 20 && currentWounds > 5) {
                if (confirm('Low toughness units typically have fewer wounds. Adjust wounds?')) {
                    helpers.setValue('robot_wounds', Math.max(1, Math.floor(toughness / 4)));
                }
            }
        });
        
        // Intelligence affects equipment compatibility
        setupDependency('robot_intelligence', 'input', (element, helpers) => {
            const intelligence = parseInt(element.value);
            if (intelligence && intelligence < 20) {
                if (helpers.isChecked('robot_scanner') && 
                    confirm('Low intelligence units may struggle with complex equipment like Scanner. Remove?')) {
                    helpers.setChecked('robot_scanner', false);
                }
                if (helpers.isChecked('robot_vox_caster') && 
                    confirm('Low intelligence units may not operate Communicators effectively. Remove?')) {
                    helpers.setChecked('robot_vox_caster', false);
                }
            }
        });
    }
    
    function setupEquipmentDependencies() {
        const { setupDependency, DependencyPatterns } = window.CardHelpers;
        
        // Power weapons require higher toughness
        setupDependency('robot_power_fist', 'change', 
            DependencyPatterns.requireMinStat('robot_toughness', 40, 'Power Fist requires sturdy construction (Toughness 40+). Increase toughness?'));
        
        // Self-repair requires intelligence
        setupDependency('robot_self_repair', 'change', 
            DependencyPatterns.requireMinStat('robot_intelligence', 25, 'Self-repair systems require Intelligence 25+. Increase intelligence?'));
        
        // Heavy weapons reduce agility (custom logic)
        setupDependency('robot_flamer', 'change', (element, helpers) => {
            if (element.checked) {
                const agility = parseInt(helpers.getValue('robot_agility')) || 0;
                if (agility > 40) {
                    if (confirm('Heavy weapons like flamers reduce mobility. Reduce agility?')) {
                        helpers.setValue('robot_agility', Math.max(10, agility - 15));
                    }
                }
            }
        });
    }
    
    function setupStatusLogic() {
        const { setupDependency, DependencyPatterns } = window.CardHelpers;
        
        // Damaged conflicts with combat ready (bidirectional)
        setupDependency('robot_damaged', 'change', 
            DependencyPatterns.conflictingCheckboxes('robot_combat_ready', 'Damaged units are rarely combat ready. Remove combat ready status?'));
        setupDependency('robot_combat_ready', 'change', 
            DependencyPatterns.conflictingCheckboxes('robot_damaged', 'Combat ready units should not be damaged. Remove damage status?'));
        
        // Malfunctioning conflicts with blessing
        setupDependency('robot_malfunctioning', 'change', 
            DependencyPatterns.conflictingCheckboxes('robot_blessed', 'The Machine God rarely blesses malfunctioning machines. Remove blessing?'));
        
        // Machine spirit bonding is rare and auto-blesses
        setupDependency('robot_bonded', 'change', (element, helpers) => {
            if (element.checked) {
                if (confirm('Machine Spirit bonding is a rare and sacred occurrence. Are you certain?')) {
                    // Auto-bless bonded machines
                    if (!helpers.isChecked('robot_blessed')) {
                        helpers.setChecked('robot_blessed', true);
                    }
                } else {
                    element.checked = false;
                }
            }
        });
    }
    
    function setupDesignationGenerator() {
        const { addUtilityButton, getElement, savePersistence } = window.CardHelpers;
        
        addUtilityButton('robot_designation', {
            text: '⚙️',
            title: 'Generate designation',
            style: {
                marginLeft: '8px',
                padding: '4px 8px',
                fontSize: '14px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            },
            onclick: () => {
                const robotTypeSelect = getElement('robot_type');
                const designationInput = getElement('robot_designation');
                
                if (designationInput) {
                    const robotType = robotTypeSelect ? robotTypeSelect.value : '';
                    designationInput.value = generateDesignation(robotType);
                    savePersistence();
                }
            }
        });
    }
    
    function generateDesignation(robotType) {
        const prefixes = {
            'recon_drone': ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'],
            'combat_servitor': ['Guardian', 'Defender', 'Warrior', 'Sentinel', 'Warden', 'Protector'],
            'tech_adept': ['Magos', 'Technus', 'Cogitator', 'Oracle', 'Binary', 'Logic'],
            'guardian_servitor': ['Fortress', 'Bastion', 'Shield', 'Rampart', 'Bulwark', 'Aegis'],
            'medicae_servitor': ['Healing', 'Vitalis', 'Sanguine', 'Curator', 'Mender', 'Suture'],
            'utility_servitor': ['Worker', 'Builder', 'Maker', 'Forge', 'Craft', 'Tool'],
            'heavy_servitor': ['Thunder', 'Demolisher', 'Crusher', 'Devastator', 'Titan', 'Juggernaut']
        };
        
        const suffixes = ['Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus'];
        const numbers = Array.from({length: 99}, (_, i) => (i + 1).toString().padStart(2, '0'));
        const greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
        
        const typePrefix = prefixes[robotType] || ['Unit', 'Construct', 'Machine', 'Automaton'];
        const selectedPrefix = typePrefix[Math.floor(Math.random() * typePrefix.length)];
        
        // Different designation patterns
        const patterns = [
            () => `${selectedPrefix}-${numbers[Math.floor(Math.random() * numbers.length)]}`,
            () => `${selectedPrefix} ${greekLetters[Math.floor(Math.random() * greekLetters.length)]}`,
            () => `${selectedPrefix} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
            () => `${selectedPrefix}-${greekLetters[Math.floor(Math.random() * greekLetters.length)]}-${Math.floor(Math.random() * 9) + 1}`
        ];
        
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        return selectedPattern();
    }
    
    // Register with CardHelpers for proper lifecycle management
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('robotic-companion', initializeRoboticCompanionCard);
    } else {
        // Fallback for development
        setTimeout(initializeRoboticCompanionCard, 100);
    }
    
})();