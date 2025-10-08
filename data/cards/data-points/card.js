// Data Points card functionality
(function() {
  'use strict';

  console.log('Data Points script loading...');

  let dataPointCount = 0;

  function initializeDataPoints() {
    console.log('Initializing Data Points...');

    const addDataPointBtn = document.getElementById('add-data-point');
    const dataPointsContainer = document.getElementById('data-points-container');

    if (!addDataPointBtn || !dataPointsContainer) {
      console.log('Data Points elements not found');
      return;
    }

    // Get initial values from URL
    const urlParams = new URLSearchParams(window.location.search);
    dataPointCount = parseInt(urlParams.get('dp_cnt')) || 0;

    console.log('Initial data point count:', dataPointCount);

    function updateURL() {
      const params = new URLSearchParams(window.location.search);

      // Update counts
      if (dataPointCount > 0) {
        params.set('dp_cnt', dataPointCount.toString());
      } else {
        params.delete('dp_cnt');
      }

      // Update data point data
      for (let i = 0; i < dataPointCount; i++) {
        const detailsInput = document.getElementById(`dp${i}`);

        if (detailsInput && detailsInput.value) {
          params.set(`dp${i}`, detailsInput.value);
        } else {
          params.delete(`dp${i}`);
        }
      }

      const newUrl = params.toString() ? '?' + params.toString() : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    function createItemRow(index) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <textarea class="item-details" id="dp${index}" placeholder="Information that could provide +1 to relevant roll"></textarea>
        <button type="button" class="remove-item" onclick="removeDataPoint(${index})">×</button>
      `;

      // Add event listeners for URL updates
      const textarea = row.querySelector('textarea');
      textarea.addEventListener('input', updateURL);

      return row;
    }

    function addDataPoint() {
      console.log('Adding data point, current count:', dataPointCount);

      const row = createItemRow(dataPointCount);
      dataPointsContainer.appendChild(row);

      dataPointCount++;
      console.log('Data point added, new count:', dataPointCount);
      updateURL();
    }

    function removeItem(index) {
      // Remove the specific row
      const row = document.querySelector(`#dp${index}`).closest('.item-row');
      if (row) row.remove();

      // Clean up URL params for this item
      const params = new URLSearchParams(window.location.search);
      params.delete(`dp${index}`);

      // If no items left, reset count
      if (dataPointsContainer.querySelectorAll('.item-row').length === 0) {
        dataPointCount = 0;
        params.delete('dp_cnt');
      }

      const newUrl = params.toString() ? '?' + params.toString() : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    // Make removeItem globally accessible
    window.removeDataPoint = removeItem;

    // Add event listener (only if not already added)
    if (!addDataPointBtn.hasAttribute('data-listener-added')) {
      addDataPointBtn.addEventListener('click', addDataPoint);
      addDataPointBtn.setAttribute('data-listener-added', 'true');
      console.log('Add data point event listener added');
    }

    // Load existing data points from URL
    for (let i = 0; i < dataPointCount; i++) {
      const row = createItemRow(i);
      dataPointsContainer.appendChild(row);

      // Populate values from URL
      const detailsVal = urlParams.get(`dp${i}`);
      if (detailsVal) document.getElementById(`dp${i}`).value = detailsVal;
    }

    console.log('Data Points initialization complete');
  }

  // Export initialization function for the card system
  window.CardInitializers = window.CardInitializers || {};
  window.CardInitializers['data-points'] = initializeDataPoints;
})();
