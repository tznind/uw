// Favours & Debts card functionality
(function() {
  'use strict';
  
  console.log('Favours & Debts script loading...');
  
  let favourCount = 0;
  let debtCount = 0;
  
  function initializeFavoursDebts() {
    console.log('Initializing Favours & Debts...');
    
    const addFavourBtn = document.getElementById('add-favour');
    const addDebtBtn = document.getElementById('add-debt');
    const favoursContainer = document.getElementById('favours-container');
    const debtsContainer = document.getElementById('debts-container');
    
    if (!addFavourBtn || !addDebtBtn || !favoursContainer || !debtsContainer) {
      console.log('Favours & Debts elements not found');
      return;
    }
    
    // Get initial values from URL
    const urlParams = new URLSearchParams(window.location.search);
    favourCount = parseInt(urlParams.get('fav_cnt')) || 0;
    debtCount = parseInt(urlParams.get('debt_cnt')) || 0;
    
    console.log('Initial favour count:', favourCount);
    console.log('Initial debt count:', debtCount);
    
    function updateURL() {
      const params = new URLSearchParams(window.location.search);
      
      // Update counts
      if (favourCount > 0) {
        params.set('fav_cnt', favourCount.toString());
      } else {
        params.delete('fav_cnt');
      }
      
      if (debtCount > 0) {
        params.set('debt_cnt', debtCount.toString());
      } else {
        params.delete('debt_cnt');
      }
      
      // Update favour data
      for (let i = 0; i < favourCount; i++) {
        const factionInput = document.getElementById(`fav${i}f`);
        const detailsInput = document.getElementById(`fav${i}d`);
        
        if (factionInput && factionInput.value) {
          params.set(`fav${i}f`, factionInput.value);
        } else {
          params.delete(`fav${i}f`);
        }
        
        if (detailsInput && detailsInput.value) {
          params.set(`fav${i}d`, detailsInput.value);
        } else {
          params.delete(`fav${i}d`);
        }
      }
      
      // Update debt data
      for (let i = 0; i < debtCount; i++) {
        const factionInput = document.getElementById(`debt${i}f`);
        const detailsInput = document.getElementById(`debt${i}d`);
        
        if (factionInput && factionInput.value) {
          params.set(`debt${i}f`, factionInput.value);
        } else {
          params.delete(`debt${i}f`);
        }
        
        if (detailsInput && detailsInput.value) {
          params.set(`debt${i}d`, detailsInput.value);
        } else {
          params.delete(`debt${i}d`);
        }
      }
      
      const newUrl = params.toString() ? '?' + params.toString() : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    function createItemRow(index, type) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <input type="text" class="item-faction" id="${type}${index}f" placeholder="Faction">
        <input type="text" class="item-details" id="${type}${index}d" placeholder="Details">
        <button type="button" class="remove-item" onclick="removeItem('${type}', ${index})">×</button>
      `;

      // Add event listeners for URL updates
      const inputs = row.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('input', updateURL);
      });

      return row;
    }
    
    function addFavour() {
      console.log('Adding favour, current count:', favourCount);
      
      const row = createItemRow(favourCount, 'fav');
      favoursContainer.appendChild(row);
      
      favourCount++;
      console.log('Favour added, new count:', favourCount);
      updateURL();
    }
    
    function addDebt() {
      console.log('Adding debt, current count:', debtCount);
      
      const row = createItemRow(debtCount, 'debt');
      debtsContainer.appendChild(row);
      
      debtCount++;
      console.log('Debt added, new count:', debtCount);
      updateURL();
    }
    
    function removeItem(type, index) {
      // Remove the specific row
      const row = document.querySelector(`#${type}${index}f`).closest('.item-row');
      if (row) row.remove();
      
      // Clean up URL params for this item
      const params = new URLSearchParams(window.location.search);
      params.delete(`${type}${index}f`);
      params.delete(`${type}${index}d`);
      
      const container = type === 'fav' ? favoursContainer : debtsContainer;
      
      // If no items left, reset count
      if (container.querySelectorAll('.item-row').length === 0) {
        if (type === 'fav') {
          favourCount = 0;
          params.delete('fav_cnt');
        } else {
          debtCount = 0;
          params.delete('debt_cnt');
        }
      }
      
      const newUrl = params.toString() ? '?' + params.toString() : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    // Make removeItem globally accessible
    window.removeItem = removeItem;
    
    // Add event listeners (only if not already added)
    if (!addFavourBtn.hasAttribute('data-listener-added')) {
      addFavourBtn.addEventListener('click', addFavour);
      addFavourBtn.setAttribute('data-listener-added', 'true');
      console.log('Add favour event listener added');
    }
    
    if (!addDebtBtn.hasAttribute('data-listener-added')) {
      addDebtBtn.addEventListener('click', addDebt);
      addDebtBtn.setAttribute('data-listener-added', 'true');
      console.log('Add debt event listener added');
    }
    
    // Load existing favours from URL
    for (let i = 0; i < favourCount; i++) {
      const row = createItemRow(i, 'fav');
      favoursContainer.appendChild(row);
      
      // Populate values from URL
      const factionVal = urlParams.get(`fav${i}f`);
      const detailsVal = urlParams.get(`fav${i}d`);
      
      if (factionVal) document.getElementById(`fav${i}f`).value = factionVal;
      if (detailsVal) document.getElementById(`fav${i}d`).value = detailsVal;
    }
    
    // Load existing debts from URL
    for (let i = 0; i < debtCount; i++) {
      const row = createItemRow(i, 'debt');
      debtsContainer.appendChild(row);
      
      // Populate values from URL
      const factionVal = urlParams.get(`debt${i}f`);
      const detailsVal = urlParams.get(`debt${i}d`);
      
      if (factionVal) document.getElementById(`debt${i}f`).value = factionVal;
      if (detailsVal) document.getElementById(`debt${i}d`).value = detailsVal;
    }
    
    console.log('Favours & Debts initialization complete');
  }
  
  // Export initialization function for the card system
  window.CardInitializers = window.CardInitializers || {};
  window.CardInitializers['favours-debts'] = initializeFavoursDebts;
})();