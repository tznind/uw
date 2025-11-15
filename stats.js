// Render hex stats inside a container
window.renderStats = function(containerSelector, hexStats) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Stats container not found:', containerSelector);
    return;
  }

  if (!hexStats || !Array.isArray(hexStats)) {
    console.error('Invalid hexStats data provided');
    return;
  }

  const hexRow = document.createElement("div");
  hexRow.className = "hex-row";
  
  const urlParams = new URLSearchParams(location.search);

  hexStats.forEach(stat => {
    if (!stat) {
      console.warn('Invalid stat data:', stat);
      return;
    }

    const hexContainer = document.createElement("div");
    hexContainer.className = "hex-container";

    // Apply shape class if specified (default to hexagon)
    const shape = stat.shape || "hexagon";

    // Handle clock shape differently
    if (shape === "clock") {
      if (!stat.clock || !stat.clock.type || !stat.clock.faces) {
        console.warn('Clock stat missing required clock configuration:', stat);
        return;
      }
      
      const clockType = stat.clock.type;
      const clockFaces = stat.clock.faces;
      const clockFolder = `clocks/${clockType}`;
      
      const clockDiv = document.createElement("div");
      clockDiv.className = "clock stat-clock";
      clockDiv.id = stat.id || `clock_${Date.now()}`;
      clockDiv.setAttribute('data-clock-folder', clockFolder);
      clockDiv.setAttribute('data-clock-faces', clockFaces);
      
      // Create hidden input for persistence
      const input = document.createElement("input");
      input.type = "hidden";
      input.id = clockDiv.id + "-value";
      // Read initial value from URL params (same pattern as tracks)
      input.value = urlParams.get(input.id) || "0";
      
      hexContainer.appendChild(clockDiv);
      hexContainer.appendChild(input);
      
      // Add title if provided
      if (stat.title) {
        const title = document.createElement("div");
        title.className = "hex-title";
        title.textContent = stat.title;
        hexContainer.appendChild(title);
      }
    } else {
      // Standard stat (hexagon/square)
      if (!stat.id || !stat.title) {
        console.warn('Invalid stat data (missing id or title):', stat);
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "hex-input-wrapper";
      
      if (shape === "square") {
        wrapper.classList.add("shape-square");
      }

      const input = document.createElement("input");
      input.type = "text";
      input.id = stat.id;
      input.name = stat.id;
      input.placeholder = stat.title;
      input.setAttribute('aria-label', stat.title);
      
      // Note: persistence.js will handle loading/saving values

      wrapper.appendChild(input);
      hexContainer.appendChild(wrapper);

      const title = document.createElement("div");
      title.className = "hex-title";
      title.textContent = stat.title;
      hexContainer.appendChild(title);
    }
    
    // Add track display if stat has tracks
    if (stat.tracks && Array.isArray(stat.tracks) && stat.tracks.length > 0) {
      const trackDisplay = createStatTrackDisplay(stat, urlParams);
      if (trackDisplay) {
        hexContainer.appendChild(trackDisplay);
      }
    }

    hexRow.appendChild(hexContainer);
  });

  container.appendChild(hexRow);

  // Initialize any clocks that were just added
  if (window.Clock) {
    const newClocks = hexRow.querySelectorAll('.clock');
    newClocks.forEach(clock => {
      window.Clock.setupClock(clock);
    });
  }

  return hexRow;
};

/**
 * Create a track counter display for a stat
 */
function createStatTrackDisplay(stat, urlParams) {
  if (!stat.tracks || !window.Track) {
    return null;
  }
  
  const trackConfigs = stat.tracks;
  const trackContainer = document.createElement('div');
  trackContainer.className = 'stat-track-counter';
  
  // Prevent clicks from bubbling
  trackContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  
  // Create each track counter
  trackConfigs.forEach((trackConfig, index) => {
    const trackId = trackConfigs.length > 1 ? `stat_${stat.id}_${index}` : `stat_${stat.id}`;
    const currentValue = window.Track.getCurrentTrackValue(trackId, urlParams);
    const maxValue = trackConfig.max || 5;
    const shape = trackConfig.shape || 'square';
    
    // Create individual track container
    const individualTrackContainer = document.createElement('div');
    individualTrackContainer.className = 'stat-individual-track';
    
    // Create shapes container
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'track-shapes';
    
    // Create individual shapes
    for (let i = 1; i <= maxValue; i++) {
      const shapeElement = document.createElement('div');
      shapeElement.className = `track-shape track-${shape}`;
      shapeElement.dataset.value = i;
      shapeElement.setAttribute('data-track-id', trackId);
      
      // Make focusable and accessible
      shapeElement.setAttribute('tabindex', '0');
      shapeElement.setAttribute('role', 'button');
      shapeElement.setAttribute('aria-label', `${trackConfig.name} - Set to ${i} of ${maxValue}`);
      
      if (i <= currentValue) {
        shapeElement.classList.add('filled');
      }
      
      // Add click handler for toggling
      shapeElement.addEventListener('click', (event) => {
        event.stopPropagation();
        handleStatTrackClick(trackId, i, maxValue);
      });
      
      // Add keyboard handler
      shapeElement.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          handleStatTrackClick(trackId, i, maxValue);
        }
      });
      
      shapesContainer.appendChild(shapeElement);
    }
    
    // Create label showing track name and current/max (if name is provided)
    if (trackConfig.name) {
      const trackLabel = document.createElement('div');
      trackLabel.className = 'stat-track-label';
      trackLabel.textContent = `${trackConfig.name}: ${currentValue}/${maxValue}`;
      individualTrackContainer.appendChild(trackLabel);
    }
    
    // Create shapes container wrapper to include end label
    const shapesWrapper = document.createElement('div');
    shapesWrapper.className = 'stat-track-shapes-wrapper';
    shapesWrapper.appendChild(shapesContainer);
    
    // Add end label if provided (after the shapes)
    if (trackConfig.endLabel) {
      const endLabel = document.createElement('span');
      endLabel.className = 'stat-track-end-label';
      endLabel.textContent = trackConfig.endLabel;
      shapesWrapper.appendChild(endLabel);
    }
    
    individualTrackContainer.appendChild(shapesWrapper);
    trackContainer.appendChild(individualTrackContainer);
  });
  
  return trackContainer;
}

/**
 * Handle clicking on a stat track shape
 */
function handleStatTrackClick(trackId, clickedValue, maxValue) {
  if (!window.Track) return;
  
  const currentValue = window.Track.getCurrentTrackValue(trackId, new URLSearchParams(location.search));
  
  let newValue;
  if (clickedValue <= currentValue) {
    // Clicking on a filled shape or lower - set to one less than clicked
    newValue = clickedValue - 1;
  } else {
    // Clicking on an empty shape - fill up to that shape
    newValue = clickedValue;
  }
  
  // Clamp to valid range
  newValue = Math.max(0, Math.min(newValue, maxValue));
  
  // Update display using Track module's function
  if (window.Track.updateSingleTrackDisplay) {
    window.Track.updateSingleTrackDisplay(trackId, newValue, maxValue);
  } else {
    // Fallback: update manually
    updateStatTrackDisplay(trackId, newValue, maxValue);
  }
  
  // Update URL
  updateStatTrackValueInURL(trackId, newValue);
}

/**
 * Update the visual display of a stat track counter
 */
function updateStatTrackDisplay(trackId, currentValue, maxValue) {
  const shapes = document.querySelectorAll(`[data-track-id="${trackId}"]`);
  shapes.forEach((shape) => {
    const shapeValue = parseInt(shape.dataset.value);
    if (shapeValue <= currentValue) {
      shape.classList.add('filled');
    } else {
      shape.classList.remove('filled');
    }
  });
  
  // Update corresponding label (if it exists)
  const trackContainer = shapes[0]?.closest('.stat-individual-track');
  const label = trackContainer?.querySelector('.stat-track-label');
  if (label && shapes.length > 0) {
    const currentText = label.textContent;
    const trackName = currentText.split(':')[0];
    label.textContent = `${trackName}: ${currentValue}/${maxValue}`;
  }
}

/**
 * Update stat track value in URL parameters
 */
function updateStatTrackValueInURL(trackId, value) {
  const params = new URLSearchParams(location.search);
  const paramName = `track_${trackId}`;
  
  if (value > 0) {
    params.set(paramName, value.toString());
  } else {
    params.delete(paramName);
  }
  
  const newUrl = params.toString() ? '?' + params.toString() : location.pathname;
  history.replaceState({}, '', newUrl);
}
