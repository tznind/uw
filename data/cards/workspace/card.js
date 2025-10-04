// Workspace Card JavaScript - Career-based workspace selection
console.log('Workspace card script is loading!');
(function() {
    'use strict';
    
    // Define workspace options for each career
    const CAREER_WORKSPACES = {
        'Academic': [
            {
                id: 'medical',
                title: 'Medical',
                description: 'Sterile environment. Medbay, cryotubes, surgical servo arms, isolation chamber, recovery ward.'
            },
            {
                id: 'research',
                title: 'Research',
                description: 'Sensors gather scientific readings. Laboratory, containment units, sample scanners, sealed storage.'
            }
        ],
        'Clandestine': [
            {
                id: 'stealthy',
                title: 'Stealthy',
                description: 'Difficult to detect, high tech camouflage, cloaking or concealment. Scanning bafflers, sound dampening, hidden doors/rooms.'
            },
            {
                id: 'secure',
                title: 'Secure',
                description: 'Sensors to track people and movement. Security cameras, monitoring stations, holding cells, security doors.'
            }
        ],
        'Commercial': [
            {
                id: 'mercantile',
                title: 'Mercantile',
                description: 'Prominent advertisement, easy access. Large cargo storage space, automatic loader-unloader systems.'
            },
            {
                id: 'leisure',
                title: 'Leisure',
                description: 'Relaxing, inviting, well-lit. Studio, lounge, entertainment systems, recreation area.'
            }
        ],
        'Explorer': [
            {
                id: 'rugged',
                title: 'Rugged',
                description: 'Withstands harsh climates and weather. Decontamination units, hydroponics facilities, advanced water/air/waste recyclers, self-sufficient.'
            },
            {
                id: 'survey',
                title: 'Survey',
                description: 'Planetary scanners (weather, geological activity, etc). Probe launcher, topography holo-projector, motor-pool.'
            }
        ],
        'Industrial': [
            {
                id: 'refinery',
                title: 'Refinery',
                description: 'Heavy raw-material collectors. Gathers, processes raw matter into refined materials. Material storage tanks.'
            },
            {
                id: 'manufactory',
                title: 'Manufactory',
                description: 'Engineering bays. Builds, upgrades and repairs. Workbenches, tool racks, winches, pulleys, lifts.'
            }
        ],
        'Military': [
            {
                id: 'armored',
                title: 'Armored',
                description: 'Made of reinforced materials. Difficult to damage, can withstand direct impacts and explosions. Reinforced blast doors, structurally sound.'
            },
            {
                id: 'barracks',
                title: 'Barracks',
                description: 'Efficient, defensible, practical. Berthing for many soldiers, lockers, gym, training ring, mobilization area.'
            }
        ],
        'Personality': [
            {
                id: 'habitation',
                title: 'Habitation',
                description: 'Living space for many guests or crew. Communal eating rooms, extended life-support/facilities.'
            },
            {
                id: 'stately',
                title: 'Stately',
                description: 'Expensive, luxurious, finely appointed décor. More expensive to maintain, but provides much higher quality of life.'
            }
        ],
        'Scoundrel': [
            {
                id: 'facade',
                title: 'Facade',
                description: 'False identification/registry, disguised as something else. Crawlspaces, hidden compartments, false walls.'
            },
            {
                id: 'sleazy',
                title: 'Sleazy',
                description: 'Ramshackle, grimy, dimly lit. Space for drinking, smoking, recreational drug use, or other vices.'
            }
        ],
        'Starfarer': [
            {
                id: 'navigation',
                title: 'Navigation',
                description: 'Wide bay windows, observation decks, star-charts, holo-screens. Satellite uplinks, orbital tracking systems, airspace control/coordination tower.'
            },
            {
                id: 'launchpad',
                title: 'Launchpad',
                description: 'Aircraft/shuttle hangar with wide bay doors, launchpads for shuttles and speeders.'
            }
        ],
        'Technocrat': [
            {
                id: 'communication',
                title: 'Communication',
                description: 'High-powered communications array, transceivers, antennae. Screens, conference rooms, holo-projectors.'
            },
            {
                id: 'observer',
                title: 'Observer',
                description: 'Advanced, multi-band sensors, capable of long-distance scans. Probe launchers. Recording equipment, shielded data storage.'
            }
        ],
        'Augmented': [
            {
                id: 'powered',
                title: 'Powered',
                description: 'A powerful generator or backup system. Converts fuel into power, can recharge batteries and energy cells.'
            },
            {
                id: 'collector',
                title: 'Collector',
                description: 'Tools and machinery designed to gather a specific type of fuel into appropriate storage units.'
            }
        ],
        'Chosen': [
            {
                id: 'ceremonial',
                title: 'Ceremonial',
                description: 'An elaborate, gaudy space, covered in trappings of religious and/or spiritual significance, suitable for religious celebrations.'
            },
            {
                id: 'holy',
                title: 'Holy',
                description: 'A peaceful, austere space wholly dedicated to a greater being or spiritual force. A place of quiet contemplation and prayer.'
            }
        ],
        'Consul': [
            {
                id: 'habitat',
                title: 'Habitat',
                description: 'Highly controlled, sealed space. Mimics natural habitats or planetary environments. Self-contained life support, gravity simulators, and so on.'
            },
            {
                id: 'culinary',
                title: 'Culinary',
                description: 'Designed to produce and serve food, either providing a wide variety of dishes, or tailored to a specific species or culture.'
            }
        ],
        'Fanatic': [
            {
                id: 'discipline',
                title: 'Discipline',
                description: 'Secure, private, sound-proofed confines. Provides extreme mental and physical conditioning, exertion, torture, or self-punishment.'
            },
            {
                id: 'shrine',
                title: 'Shrine',
                description: 'A deeply personal space entirely devoted to your obsession, filled with samples, inspirations, trinkets and memorabilia.'
            }
        ],
        'Kinetic': [
            {
                id: 'arena',
                title: 'Arena',
                description: 'Open area designed for physical activity. Contains protective measures and equipment appropriate to the activity.'
            },
            {
                id: 'shielded',
                title: 'Shielded',
                description: 'A workspace designed to either provide a force field or augment existing defenses. Creates barriers between or within other workspaces.'
            }
        ],
        'Psychic': [
            {
                id: 'tranquil',
                title: 'Tranquil',
                description: 'A peaceful, austere, quiet space, suitable for meditation and deep thought. Simple decorations and few distractions.'
            },
            {
                id: 'nullified',
                title: 'Nullified',
                description: 'Sound absorbing, featureless, with full light control. Cancels and suppresses weak forms of psionic and supernatural energies.'
            }
        ],
        'Shaper': [
            {
                id: 'mystic',
                title: 'Mystic',
                description: 'Full of ancient tomes, curios, and baubles. Equipped for magical study and experimentation. Marked with runes of protection and binding. Cannot be entered or exited by supernatural beings, unless allowed.'
            },
            {
                id: 'elemental',
                title: 'Elemental',
                description: 'Tied to a specific element (fire, frost, lightning, light or darkness). Generates and/or contains that element.'
            }
        ]
    };
    
    function getSelectedCareers() {
        // Get careers from URL parameters or form fields
        const params = new URLSearchParams(window.location.search);
        const careers = [];
        
        // Check role2 and role3 (careers)
        const role2 = params.get('role2') || document.querySelector('#role2')?.value;
        const role3 = params.get('role3') || document.querySelector('#role3')?.value;
        
        if (role2) careers.push(role2);
        if (role3) careers.push(role3);
        
        return careers;
    }
    
    function populateWorkspaceOptions() {
        const container = document.querySelector('#workspace-options');
        if (!container) return;
        
        const careers = getSelectedCareers();
        const options = [];
        
        // Collect all workspace options from selected careers
        careers.forEach(career => {
            if (CAREER_WORKSPACES[career]) {
                options.push(...CAREER_WORKSPACES[career]);
            }
        });
        
        if (options.length === 0) {
            // Show message if no careers selected
            const message = careers.length === 0 
                ? 'Select careers (Career 1 and/or Career 2) to see available workspace options.'
                : 'No workspace options available for the selected careers.';
            container.innerHTML = `<p class="no-careers-message">${message}</p>`;
            return;
        }
        
        // Generate radio buttons for all available options
        let html = '';
        options.forEach(option => {
            html += `
                <div class="workspace-option">
                    <label>
                        <input type="radio" name="workspace_selection" id="workspace_${option.id}" value="${option.id}">
                        ${option.title}
                    </label>
                    <div class="description">${option.description}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Restore any previously selected workspace
        restoreSelectedWorkspace();
        
        // Set up hide untaken functionality
        setupHideUntakenForWorkspace();
    }
    
    function restoreSelectedWorkspace() {
        const params = new URLSearchParams(window.location.search);
        const selectedWorkspace = params.get('workspace_selection');
        
        if (selectedWorkspace) {
            const radio = document.querySelector(`#workspace_${selectedWorkspace}`);
            if (radio) {
                radio.checked = true;
            }
        }
    }
    
    function updateWorkspaceDisplay() {
        console.log('Workspace: Updating workspace display for hide untaken...');
        
        // Check if hide untaken is enabled
        const hideUntakenCheckbox = document.getElementById('hide_untaken');
        const hideUntaken = hideUntakenCheckbox ? hideUntakenCheckbox.checked : false;
        
        // Find all workspace radio buttons
        const workspaceOptions = document.querySelectorAll('input[name="workspace_selection"]');
        
        workspaceOptions.forEach(radio => {
            const workspaceOption = radio.closest('.workspace-option');
            if (workspaceOption) {
                if (radio.checked) {
                    // Always show selected option
                    workspaceOption.style.display = '';
                    console.log(`Workspace: Showing selected ${radio.value}`);
                } else {
                    // Hide unselected if 'Hide untaken' is checked
                    if (hideUntaken) {
                        workspaceOption.style.display = 'none';
                        console.log(`Workspace: Hiding unselected ${radio.value}`);
                    } else {
                        workspaceOption.style.display = '';
                        console.log(`Workspace: Showing unselected ${radio.value}`);
                    }
                }
            }
        });
    }
    
    function setupHideUntakenForWorkspace() {
        console.log('Workspace: Setting up hide untaken functionality...');
        
        // Listen for changes to workspace radio buttons
        const workspaceOptions = document.querySelectorAll('input[name="workspace_selection"]');
        workspaceOptions.forEach(radio => {
            if (!radio.hasAttribute('data-workspace-listener')) {
                radio.addEventListener('change', updateWorkspaceDisplay);
                radio.setAttribute('data-workspace-listener', 'true');
                console.log(`Workspace: Added listener to ${radio.value}`);
            }
        });
        
        // Listen for changes to hide untaken checkbox
        const hideUntakenCheckbox = document.getElementById('hide_untaken');
        if (hideUntakenCheckbox && !hideUntakenCheckbox.hasAttribute('data-workspace-hide-listener')) {
            hideUntakenCheckbox.addEventListener('change', updateWorkspaceDisplay);
            hideUntakenCheckbox.setAttribute('data-workspace-hide-listener', 'true');
            console.log('Workspace: Added listener to hide_untaken checkbox');
        }
        
        // Initial update
        updateWorkspaceDisplay();
    }
    
    function initializeWorkspaceCard() {
        console.log('Workspace card: Initializing career-based workspace options');
        populateWorkspaceOptions();
        
        // Listen for career changes to update workspace options
        document.addEventListener('change', function(event) {
            if (event.target.id === 'role2' || event.target.id === 'role3') {
                setTimeout(() => populateWorkspaceOptions(), 100);
            }
        });
    }
    
    // Register with CardHelpers for automatic reinitialization
    if (window.CardHelpers) {
        window.CardHelpers.registerCard('workspace', initializeWorkspaceCard);
        
        // If card already exists, initialize it immediately
        if (document.querySelector('[data-card-id="workspace"]')) {
            console.log('Workspace card already exists, initializing immediately');
            initializeWorkspaceCard();
        }
    } else {
        // Fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWorkspaceCard);
        } else {
            initializeWorkspaceCard();
        }
    }
    
    // Export for debugging
    window.initializeWorkspaceCard = initializeWorkspaceCard;
    
})();
