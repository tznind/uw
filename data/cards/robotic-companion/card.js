/**
 * Robotic Companion Card - Mechanicus Logic
 * Advanced companion management with type-based stats and equipment validation
 */

(function() {
    'use strict';
    
    function initializeRoboticCompanionCard() {
        setupRobotTypeLogic();
        setupStatValidation();
        setupEquipmentDependencies();
        setupStatusLogic();
        setupDesignationGenerator();
        
        console.log('Robotic Companion card initialized - Omnissiah be praised!');
    }
    
    function setupRobotTypeLogic() {
        const robotTypeSelect = document.getElementById('robot_type');
        const toughnessInput = document.getElementById('robot_toughness');
        const agilityInput = document.getElementById('robot_agility');
        const intelligenceInput = document.getElementById('robot_intelligence');
        const woundsInput = document.getElementById('robot_wounds');
        const armourInput = document.getElementById('robot_armour');
        const movementInput = document.getElementById('robot_movement');
        
        if (robotTypeSelect) {
            robotTypeSelect.addEventListener('change', function() {
                const robotType = this.value;
                
                // Auto-fill stats based on robot type
                const typeDefaults = {
                    'servo_skull': { 
                        toughness: 20, agility: 60, intelligence: 30, 
                        wounds: 4, armour: 2, movement: 6,
                        description: 'Small hovering reconnaissance unit'
                    },
                    'combat_servitor': { 
                        toughness: 45, agility: 30, intelligence: 15, 
                        wounds: 12, armour: 4, movement: 3,
                        description: 'Combat-optimized servitor unit'
                    },
                    'tech_adept': { 
                        toughness: 35, agility: 40, intelligence: 55, 
                        wounds: 10, armour: 5, movement: 4,
                        description: 'Tech-Priest artificial construct'
                    },
                    'guardian_servitor': { 
                        toughness: 50, agility: 25, intelligence: 20, 
                        wounds: 15, armour: 6, movement: 3,
                        description: 'Heavy protection servitor'
                    },
                    'medicae_servitor': { 
                        toughness: 30, agility: 35, intelligence: 40, 
                        wounds: 8, armour: 3, movement: 4,
                        description: 'Medical assistance servitor'
                    },
                    'utility_servitor': { 
                        toughness: 35, agility: 30, intelligence: 25, 
                        wounds: 10, armour: 3, movement: 3,
                        description: 'General purpose work unit'
                    },
                    'heavy_servitor': { 
                        toughness: 65, agility: 15, intelligence: 10, 
                        wounds: 20, armour: 8, movement: 2,
                        description: 'Heavy combat platform'
                    }
                };
                
                const defaults = typeDefaults[robotType];
                if (defaults) {
                    const message = `Auto-fill typical stats for ${robotType.replace('_', ' ')}?\n${defaults.description}`;
                    if (confirm(message)) {
                        if (toughnessInput && !toughnessInput.value) toughnessInput.value = defaults.toughness;
                        if (agilityInput && !agilityInput.value) agilityInput.value = defaults.agility;
                        if (intelligenceInput && !intelligenceInput.value) intelligenceInput.value = defaults.intelligence;
                        if (woundsInput && !woundsInput.value) woundsInput.value = defaults.wounds;
                        if (armourInput && !armourInput.value) armourInput.value = defaults.armour;
                        if (movementInput && !movementInput.value) movementInput.value = defaults.movement;
                        
                        triggerPersistence();
                    }
                }
            });
        }
    }
    
    function setupStatValidation() {
        const toughnessInput = document.getElementById('robot_toughness');
        const woundsInput = document.getElementById('robot_wounds');
        const intelligenceInput = document.getElementById('robot_intelligence');
        
        // Toughness affects wound capacity
        if (toughnessInput && woundsInput) {
            toughnessInput.addEventListener('input', function() {
                const toughness = parseInt(this.value);
                if (toughness && toughness < 20 && parseInt(woundsInput.value) > 5) {
                    if (confirm('Low toughness units typically have fewer wounds. Adjust wounds?')) {
                        woundsInput.value = Math.max(1, Math.floor(toughness / 4));
                        triggerPersistence();
                    }
                }
            });
        }
        
        // Visual feedback for critical damage
        if (woundsInput) {
            woundsInput.addEventListener('input', function() {
                const wounds = parseInt(this.value);
                if (wounds && wounds <= 2) {
                    this.style.backgroundColor = '#fee2e2';
                    this.style.color = '#dc2626';
                } else if (wounds && wounds <= 5) {
                    this.style.backgroundColor = '#fef3c7';
                    this.style.color = '#d97706';
                } else {
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }
            });
        }
        
        // Intelligence affects equipment compatibility
        if (intelligenceInput) {
            intelligenceInput.addEventListener('input', function() {
                const intelligence = parseInt(this.value);
                const auspexCheckbox = document.getElementById('robot_auspex');
                const voxCheckbox = document.getElementById('robot_vox_caster');
                
                if (intelligence && intelligence < 20) {
                    if (auspexCheckbox && auspexCheckbox.checked) {
                        if (confirm('Low intelligence units may struggle with complex equipment like Auspex. Remove?')) {
                            auspexCheckbox.checked = false;
                            triggerPersistence();
                        }
                    }
                    if (voxCheckbox && voxCheckbox.checked) {
                        if (confirm('Low intelligence units may not operate Vox-casters effectively. Remove?')) {
                            voxCheckbox.checked = false;
                            triggerPersistence();
                        }
                    }
                }
            });
        }
    }
    
    function setupEquipmentDependencies() {
        // Power weapons require higher toughness
        const powerFistCheckbox = document.getElementById('robot_power_fist');
        const toughnessInput = document.getElementById('robot_toughness');
        
        if (powerFistCheckbox && toughnessInput) {
            powerFistCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    const toughness = parseInt(toughnessInput.value) || 0;
                    if (toughness < 40) {
                        if (confirm('Power Fist requires sturdy construction (Toughness 40+). Increase toughness?')) {
                            toughnessInput.value = 45;
                            triggerPersistence();
                        } else {
                            this.checked = false;
                        }
                    }
                }
            });
        }
        
        // Heavy weapons reduce agility
        const flamerCheckbox = document.getElementById('robot_flamer');
        const agilityInput = document.getElementById('robot_agility');
        
        if (flamerCheckbox && agilityInput) {
            flamerCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    const agility = parseInt(agilityInput.value) || 0;
                    if (agility > 40) {
                        if (confirm('Heavy weapons like flamers reduce mobility. Reduce agility?')) {
                            agilityInput.value = Math.max(10, agility - 15);
                            triggerPersistence();
                        }
                    }
                }
            });
        }
        
        // Self-repair requires intelligence
        const selfRepairCheckbox = document.getElementById('robot_self_repair');
        const intelligenceInput = document.getElementById('robot_intelligence');
        
        if (selfRepairCheckbox && intelligenceInput) {
            selfRepairCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    const intelligence = parseInt(intelligenceInput.value) || 0;
                    if (intelligence < 25) {
                        if (confirm('Self-repair systems require Intelligence 25+. Increase intelligence?')) {
                            intelligenceInput.value = 30;
                            triggerPersistence();
                        } else {
                            this.checked = false;
                        }
                    }
                }
            });
        }
    }
    
    function setupStatusLogic() {
        const damagedCheckbox = document.getElementById('robot_damaged');
        const malfunctioningCheckbox = document.getElementById('robot_malfunctioning');
        const blessedCheckbox = document.getElementById('robot_blessed');
        const combatReadyCheckbox = document.getElementById('robot_combat_ready');
        const bondedCheckbox = document.getElementById('robot_bonded');
        
        // Damaged conflicts with combat ready
        if (damagedCheckbox && combatReadyCheckbox) {
            damagedCheckbox.addEventListener('change', function() {
                if (this.checked && combatReadyCheckbox.checked) {
                    if (confirm('Damaged units are rarely combat ready. Remove combat ready status?')) {
                        combatReadyCheckbox.checked = false;
                        triggerPersistence();
                    }
                }
            });
            
            combatReadyCheckbox.addEventListener('change', function() {
                if (this.checked && damagedCheckbox.checked) {
                    if (confirm('Combat ready units should not be damaged. Remove damage status?')) {
                        damagedCheckbox.checked = false;
                        triggerPersistence();
                    }
                }
            });
        }
        
        // Malfunctioning makes blessing less likely
        if (malfunctioningCheckbox && blessedCheckbox) {
            malfunctioningCheckbox.addEventListener('change', function() {
                if (this.checked && blessedCheckbox.checked) {
                    if (confirm('The Omnissiah rarely blesses malfunctioning machines. Remove blessing?')) {
                        blessedCheckbox.checked = false;
                        triggerPersistence();
                    }
                }
            });
        }
        
        // Machine spirit bonding is rare
        if (bondedCheckbox) {
            bondedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    if (confirm('Machine Spirit bonding is a rare and sacred occurrence. Are you certain?')) {
                        // Auto-bless bonded machines
                        if (blessedCheckbox && !blessedCheckbox.checked) {
                            blessedCheckbox.checked = true;
                            triggerPersistence();
                        }
                    } else {
                        this.checked = false;
                    }
                }
            });
        }
    }
    
    function setupDesignationGenerator() {
        const designationInput = document.getElementById('robot_designation');
        const robotTypeSelect = document.getElementById('robot_type');
        
        if (designationInput) {
            // Add random designation generator
            const designationField = designationInput.parentElement;
            const generateBtn = document.createElement('button');
            generateBtn.type = 'button';
            generateBtn.textContent = '⚙️';
            generateBtn.title = 'Generate designation';
            generateBtn.style.marginLeft = '8px';
            generateBtn.style.padding = '4px 8px';
            generateBtn.style.fontSize = '14px';
            generateBtn.style.backgroundColor = '#dc2626';
            generateBtn.style.color = 'white';
            generateBtn.style.border = 'none';
            generateBtn.style.borderRadius = '4px';
            generateBtn.style.cursor = 'pointer';
            
            generateBtn.addEventListener('click', function() {
                const robotType = robotTypeSelect ? robotTypeSelect.value : '';
                designationInput.value = generateDesignation(robotType);
                triggerPersistence();
            });
            
            designationField.appendChild(generateBtn);
        }
    }
    
    function generateDesignation(robotType) {
        const prefixes = {
            'servo_skull': ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'],
            'combat_servitor': ['Guardian', 'Defender', 'Warrior', 'Sentinel', 'Warden', 'Protector'],
            'tech_adept': ['Magos', 'Technus', 'Cogitator', 'Omnissiah', 'Binary', 'Logic'],
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
    
    function triggerPersistence() {
        if (window.Persistence) {
            const form = document.querySelector('form');
            if (form) window.Persistence.saveToURL(form);
        }
    }
    
    // Initialize when card loads
    setTimeout(initializeRoboticCompanionCard, 100);
    
    // Expose for manual initialization
    window.initializeRoboticCompanionCard = initializeRoboticCompanionCard;
    
})();