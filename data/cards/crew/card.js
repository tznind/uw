/**
 * Crew Card Custom JavaScript
 * Demonstrates advanced crew management functionality
 */

(function() {
    'use strict';
    
    function initializeCrewCard() {
        setupStatValidation();
        setupExperienceLogic();
        setupStatusConflicts();
        setupNameGeneration();
        
        console.log('Crew card initialized with custom functionality');
    }
    
    function setupStatValidation() {
        const loyaltyInput = document.getElementById('crew_loyalty');
        const competenceInput = document.getElementById('crew_competence');
        const corruptionInput = document.getElementById('crew_corruption');
        
        // Loyalty and corruption are inversely related
        if (loyaltyInput && corruptionInput) {
            loyaltyInput.addEventListener('input', function() {
                const loyalty = parseInt(this.value);
                if (loyalty > 80 && corruptionInput.value > 20) {
                    if (confirm('High loyalty usually means low corruption. Set corruption to 5?')) {
                        corruptionInput.value = 5;
                        triggerPersistence();
                    }
                }
            });
            
            corruptionInput.addEventListener('input', function() {
                const corruption = parseInt(this.value);
                if (corruption > 50 && loyaltyInput.value > 50) {
                    if (confirm('High corruption usually means low loyalty. Adjust loyalty?')) {
                        loyaltyInput.value = Math.max(10, 100 - corruption);
                        triggerPersistence();
                    }
                }
                
                // Visual warning for high corruption
                if (corruption >= 75) {
                    this.style.backgroundColor = '#fee2e2';
                    this.style.color = '#dc2626';
                } else if (corruption >= 50) {
                    this.style.backgroundColor = '#fef3c7';
                    this.style.color = '#d97706';
                } else {
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }
            });
        }
    }
    
    function setupExperienceLogic() {
        const experienceSelect = document.getElementById('crew_experience');
        const competenceInput = document.getElementById('crew_competence');
        
        if (experienceSelect && competenceInput) {
            experienceSelect.addEventListener('change', function() {
                const experience = this.value;
                const currentCompetence = parseInt(competenceInput.value) || 0;
                
                const minCompetence = {
                    'green': 20,
                    'trained': 40,
                    'veteran': 60,
                    'elite': 80
                };
                
                const requiredMin = minCompetence[experience];
                if (requiredMin && currentCompetence < requiredMin) {
                    if (confirm(`${experience} crew typically have competence of ${requiredMin}+. Adjust competence to ${requiredMin}?`)) {
                        competenceInput.value = requiredMin;
                        triggerPersistence();
                    }
                }
            });
        }
    }
    
    function setupStatusConflicts() {
        const veteranCheckbox = document.getElementById('crew_veteran');
        const injuredCheckbox = document.getElementById('crew_injured');
        const promotedCheckbox = document.getElementById('crew_promoted');
        const disciplinedCheckbox = document.getElementById('crew_disciplined');
        const commendationCheckbox = document.getElementById('crew_commendation');
        const mutinousCheckbox = document.getElementById('crew_mutinous');
        
        // Mutinous conflicts with commendation and promotion
        if (mutinousCheckbox) {
            mutinousCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    if (commendationCheckbox && commendationCheckbox.checked) {
                        if (confirm('Mutinous crew rarely have commendations. Remove commendation?')) {
                            commendationCheckbox.checked = false;
                            triggerPersistence();
                        }
                    }
                    if (promotedCheckbox && promotedCheckbox.checked) {
                        if (confirm('Mutinous crew are rarely promoted. Remove promotion status?')) {
                            promotedCheckbox.checked = false;
                            triggerPersistence();
                        }
                    }
                }
            });
        }
        
        // Commendation conflicts with discipline
        if (commendationCheckbox && disciplinedCheckbox) {
            commendationCheckbox.addEventListener('change', function() {
                if (this.checked && disciplinedCheckbox.checked) {
                    if (confirm('Commended crew are rarely disciplined recently. Remove discipline status?')) {
                        disciplinedCheckbox.checked = false;
                        triggerPersistence();
                    }
                }
            });
            
            disciplinedCheckbox.addEventListener('change', function() {
                if (this.checked && commendationCheckbox.checked) {
                    if (confirm('Recently disciplined crew rarely have commendations. Remove commendation?')) {
                        commendationCheckbox.checked = false;
                        triggerPersistence();
                    }
                }
            });
        }
    }
    
    function setupNameGeneration() {
        const nameInput = document.getElementById('crew_name');
        const roleSelect = document.getElementById('crew_role');
        
        if (nameInput) {
            // Add a small button next to the name field for random generation
            const nameField = nameInput.parentElement;
            const generateBtn = document.createElement('button');
            generateBtn.type = 'button';
            generateBtn.textContent = '🎲';
            generateBtn.title = 'Generate random name';
            generateBtn.style.marginLeft = '8px';
            generateBtn.style.padding = '4px 8px';
            generateBtn.style.fontSize = '14px';
            
            generateBtn.addEventListener('click', function() {
                const role = roleSelect ? roleSelect.value : '';
                nameInput.value = generateRandomName(role);
                triggerPersistence();
            });
            
            nameField.appendChild(generateBtn);
        }
    }
    
    function generateRandomName(role) {
        const firstNames = [
            'Marcus', 'Lucius', 'Gaius', 'Quintus', 'Titus', 'Cassius', 'Brutus', 'Maximus',
            'Valerius', 'Octavius', 'Helena', 'Livia', 'Claudia', 'Julia', 'Aurelia', 'Serena',
            'Mordian', 'Catachan', 'Tallarn', 'Vostroyan', 'Krieg', 'Cadian', 'Valhallan'
        ];
        
        const lastNames = [
            'Victorum', 'Imperialis', 'Sanctus', 'Gloriana', 'Invictus', 'Eternus', 'Fortis',
            'Maximus', 'Validus', 'Ferro', 'Stella', 'Corona', 'Aquila', 'Terminus', 'Rex',
            'Draconis', 'Tempest', 'Voss', 'Kane', 'Cross', 'Stone', 'Steel', 'Throne'
        ];
        
        const roleSpecificNames = {
            'navigator': ['Noospheric', 'Wayfinder', 'Stellaris', 'Voidborn'],
            'engineer': ['Mechanicus', 'Ferrous', 'Cogitator', 'Technus'],
            'medicae': ['Sanguinus', 'Vitalis', 'Curator', 'Biologis'],
            'security': ['Guardian', 'Castellan', 'Vigilant', 'Fortress'],
            'pilot': ['Voidhawk', 'Starborne', 'Navigator', 'Velocity']
        };
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Use role-specific surnames sometimes
        if (role && roleSpecificNames[role] && Math.random() > 0.6) {
            lastName = roleSpecificNames[role][Math.floor(Math.random() * roleSpecificNames[role].length)];
        }
        
        return `${firstName} ${lastName}`;
    }
    
    function triggerPersistence() {
        if (window.Persistence) {
            const form = document.querySelector('form');
            if (form) window.Persistence.saveToURL(form);
        }
    }
    
    // Initialize when the card is loaded
    setTimeout(initializeCrewCard, 100);
    
    // Expose for manual initialization
    window.initializeCrewCard = initializeCrewCard;
    
})();