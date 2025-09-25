/**
 * Track Module - Handles tracking temporary points for moves
 */

window.Track = (function() {
    'use strict';

    /**
     * Create a track counter display for a move
     */
    function createTrackDisplay(move, urlParams) {
        if (!move.track) return null;

        const trackContainer = document.createElement('div');
        trackContainer.className = 'track-counter';
        trackContainer.id = `track_${move.id}`;
        
        // Track display shows current/max as filled/empty squares
        const currentValue = getCurrentTrackValue(move.id, urlParams);
        const maxValue = move.track.max || 5; // Default max of 5
        
        // Create squares container
        const squaresContainer = document.createElement('div');
        squaresContainer.className = 'track-squares';
        
        // Create individual squares
        for (let i = 1; i <= maxValue; i++) {
            const square = document.createElement('div');
            square.className = 'track-square';
            square.dataset.value = i;
            
            if (i <= currentValue) {
                square.classList.add('filled');
            }
            
            // Add click handler for toggling
            square.addEventListener('click', () => {
                handleSquareClick(move.id, i, maxValue);
            });
            
            squaresContainer.appendChild(square);
        }
        
        // Create label showing track name and current/max
        const trackLabel = document.createElement('div');
        trackLabel.className = 'track-label';
        trackLabel.textContent = `${move.track.name}: ${currentValue}/${maxValue}`;
        
        trackContainer.appendChild(trackLabel);
        trackContainer.appendChild(squaresContainer);
        
        return trackContainer;
    }

    /**
     * Handle clicking on a track square
     */
    function handleSquareClick(moveId, clickedValue, maxValue) {
        const currentValue = getCurrentTrackValue(moveId, new URLSearchParams(location.search));
        
        let newValue;
        if (clickedValue <= currentValue) {
            // Clicking on a filled square or lower - set to one less than clicked
            newValue = clickedValue - 1;
        } else {
            // Clicking on an empty square - fill up to that square
            newValue = clickedValue;
        }
        
        // Clamp to valid range
        newValue = Math.max(0, Math.min(newValue, maxValue));
        
        // Update display
        updateTrackDisplay(moveId, newValue, maxValue);
        
        // Update URL
        updateTrackValueInURL(moveId, newValue);
    }

    /**
     * Update the visual display of a track counter
     */
    function updateTrackDisplay(moveId, currentValue, maxValue) {
        const trackContainer = document.getElementById(`track_${moveId}`);
        if (!trackContainer) return;
        
        // Update squares
        const squares = trackContainer.querySelectorAll('.track-square');
        squares.forEach((square, index) => {
            const squareValue = index + 1;
            if (squareValue <= currentValue) {
                square.classList.add('filled');
            } else {
                square.classList.remove('filled');
            }
        });
        
        // Update label
        const label = trackContainer.querySelector('.track-label');
        if (label) {
            const move = window.moves?.find(m => m.id === moveId);
            const trackName = move?.track?.name || 'Track';
            label.textContent = `${trackName}: ${currentValue}/${maxValue}`;
        }
    }

    /**
     * Get current track value from URL parameters
     */
    function getCurrentTrackValue(moveId, urlParams) {
        const paramName = `track_${moveId}`;
        const value = urlParams.get(paramName);
        return value ? parseInt(value, 10) : 0;
    }

    /**
     * Update track value in URL parameters
     */
    function updateTrackValueInURL(moveId, value) {
        const params = new URLSearchParams(location.search);
        const paramName = `track_${moveId}`;
        
        if (value > 0) {
            params.set(paramName, value.toString());
        } else {
            params.delete(paramName);
        }
        
        const newUrl = params.toString() ? '?' + params.toString() : location.pathname;
        history.replaceState({}, '', newUrl);
    }

    /**
     * Initialize track counters after page render
     */
    function initializeTrackCounters() {
        if (!window.moves) return;
        
        const urlParams = new URLSearchParams(location.search);
        
        // Update all track displays based on current URL state
        window.moves.forEach(move => {
            if (move.track) {
                const currentValue = getCurrentTrackValue(move.id, urlParams);
                const maxValue = move.track.max || 5;
                updateTrackDisplay(move.id, currentValue, maxValue);
            }
        });
    }

    /**
     * Handle when a move with tracking is toggled on/off
     */
    function handleTrackedMoveToggle(moveId, isChecked) {
        if (!isChecked) {
            // Move was unchecked - reset track to 0
            const move = window.moves?.find(m => m.id === moveId);
            if (move?.track) {
                const maxValue = move.track.max || 5;
                updateTrackDisplay(moveId, 0, maxValue);
                updateTrackValueInURL(moveId, 0);
            }
        }
        // If checked, leave current track value as is (don't auto-reset)
    }

    // Public API
    return {
        createTrackDisplay,
        updateTrackDisplay,
        getCurrentTrackValue,
        initializeTrackCounters,
        handleTrackedMoveToggle
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Track.initializeTrackCounters);
} else {
    window.Track.initializeTrackCounters();
}