/**
 * JSON Data Loader - Loads JSON files and populates window variables
 * Compatible with file:// URLs
 */

window.JsonLoader = (function() {
    'use strict';

    /**
     * Load a JSON file and assign it to a window variable
     * For file:// URLs, we need to load the data via script tags instead of fetch
     * @param {string} filePath - Path to the JSON file
     * @param {string} variableName - Name of the window variable to assign to
     * @returns {Promise} Promise that resolves when the JSON is loaded
     */
    async function loadJsonData(filePath, variableName) {
        // Check if we're running from file:// protocol
        if (location.protocol === 'file:') {
            throw new Error(`Cannot use fetch with file:// protocol for ${filePath}. Use embedded data instead.`);
        }
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            window[variableName] = data;
            console.log(`Loaded ${variableName} from ${filePath}:`, data.length || 'object', typeof data === 'object' ? 'loaded' : 'items');
            return data;
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Load multiple JSON files in parallel
     * @param {Array} fileConfigs - Array of {filePath, variableName} objects
     * @returns {Promise} Promise that resolves when all files are loaded
     */
    async function loadMultipleJsonData(fileConfigs) {
        const promises = fileConfigs.map(config => 
            loadJsonData(config.filePath, config.variableName)
        );
        
        return Promise.all(promises);
    }

    /**
     * Load all role move files
     * @returns {Promise} Promise that resolves when all role moves are loaded
     */
    async function loadAllRoleMoves() {
        const roleConfigs = [
            { filePath: 'data/moves/navigator.json', variableName: 'NavigatorMoves' },
            { filePath: 'data/moves/mech-adept.json', variableName: 'MechAdeptMoves' },
            { filePath: 'data/moves/lord-commander.json', variableName: 'LordCommanderMoves' }
        ];

        return loadMultipleJsonData(roleConfigs);
    }

    /**
     * Load stats configuration
     * @returns {Promise} Promise that resolves when stats data is loaded
     */
    async function loadStatsData() {
        return loadJsonData('data/stats.json', 'hexStats');
    }

    /**
     * Load role availability map
     * @returns {Promise} Promise that resolves when availability map is loaded
     */
    async function loadAvailabilityMap() {
        return loadJsonData('data/availability.json', 'availableMap');
    }

    /**
     * Load all game data (stats, availability map, and moves)
     * @returns {Promise} Promise that resolves when all data is loaded
     */
    async function loadAllGameData() {
        try {
            // Load stats and availability data first
            await Promise.all([
                loadStatsData(),
                loadAvailabilityMap()
            ]);

            // Then load all role moves
            await loadAllRoleMoves();

            console.log('All game data loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load game data:', error);
            throw error;
        }
    }

    // Public API
    return {
        loadJsonData,
        loadMultipleJsonData,
        loadAllRoleMoves,
        loadStatsData,
        loadAvailabilityMap,
        loadAllGameData
    };
})();
