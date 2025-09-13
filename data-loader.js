/**
 * Data Loader - Loads JSON data files for Rogue Trader character sheets
 */

/**
 * Initialize all game data (stats, availability map, and moves)
 * @returns {Promise} Promise that resolves when all data is loaded
 */
window.initializeMovesData = async function() {
    try {
        if (!window.JsonLoader) {
            throw new Error('JsonLoader not available');
        }
        
        console.log('Loading game data from JSON files...');
        
        // Load all game data
        await window.JsonLoader.loadAllGameData();
        
        // Combine moves from all roles
        window.moves = [];
        
        if (window.NavigatorMoves) {
            window.moves = window.moves.concat(window.NavigatorMoves);
        }
        
        if (window.MechAdeptMoves) {
            window.moves = window.moves.concat(window.MechAdeptMoves);
        }
        
        if (window.LordCommanderMoves) {
            window.moves = window.moves.concat(window.LordCommanderMoves);
        }
        
        console.log('All game data initialized:', window.moves.length, 'moves loaded');
        
        // Dispatch event to notify that data is ready
        window.dispatchEvent(new CustomEvent('movesDataReady'));
        
    } catch (error) {
        console.error('Failed to load game data:', error);
        throw error;
    }
};
