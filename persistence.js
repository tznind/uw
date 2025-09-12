/**
 * Persistence Module - Handles saving and loading form state to/from URL parameters
 * Works with any form inputs without needing to know specific field names
 */

window.Persistence = (function() {
    'use strict';

    /**
     * Get all persistable form inputs from a form
     * @param {HTMLFormElement} form - The form to scan for inputs
     * @returns {Array} Array of input elements that should be persisted
     */
    function getPersistableInputs(form) {
        // Get all inputs that have an id and should be persisted
        const selectors = [
            'input[type="text"]',
            'input[type="number"]', 
            'input[type="email"]',
            'input[type="url"]',
            'input[type="tel"]',
            'input[type="search"]',
            'input[type="password"]',
            'input[type="hidden"]',
            'select',
            'textarea'
        ];
        
        const inputs = [];
        selectors.forEach(selector => {
            const elements = form.querySelectorAll(selector);
            elements.forEach(element => {
                // Only include elements with an id (needed for persistence)
                if (element.id) {
                    inputs.push(element);
                }
            });
        });
        
        return inputs;
    }

    /**
     * Save current form state to URL parameters
     * @param {HTMLFormElement} form - The form to save
     */
    function saveToURL(form) {
        const params = new URLSearchParams(location.search);
        const inputs = getPersistableInputs(form);
        
        inputs.forEach(input => {
            const value = input.value || '';
            if (value) {
                params.set(input.id, value);
            } else {
                // Remove empty values from URL to keep it clean
                params.delete(input.id);
            }
        });
        
        // Update URL without page reload
        const newUrl = params.toString() ? '?' + params.toString() : location.pathname;
        history.replaceState({}, '', newUrl);
    }

    /**
     * Load form state from URL parameters
     * @param {HTMLFormElement} form - The form to populate
     * @returns {Object} Object containing the loaded values by input id
     */
    function loadFromURL(form) {
        const params = new URLSearchParams(location.search);
        const inputs = getPersistableInputs(form);
        const loadedValues = {};
        
        inputs.forEach(input => {
            if (params.has(input.id)) {
                const value = params.get(input.id);
                input.value = value;
                loadedValues[input.id] = value;
            }
        });
        
        return loadedValues;
    }

    /**
     * Clear all form values and remove from URL
     * @param {HTMLFormElement} form - The form to clear
     */
    function clearState(form) {
        const inputs = getPersistableInputs(form);
        
        // Clear form inputs
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Clear URL parameters
        history.replaceState({}, '', location.pathname);
    }

    /**
     * Set up automatic persistence for a form
     * @param {HTMLFormElement} form - The form to monitor
     * @param {Function} onStateChange - Optional callback when state changes
     */
    function setupAutoPersistence(form, onStateChange) {
        const inputs = getPersistableInputs(form);
        
        // Set up event listeners for automatic saving
        inputs.forEach(input => {
            const eventType = input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
            
            input.addEventListener(eventType, () => {
                saveToURL(form);
                if (onStateChange) {
                    onStateChange(input.id, input.value);
                }
            });
        });
    }

    /**
     * Get current URL as a shareable string
     * @returns {string} Current page URL
     */
    function getCurrentURL() {
        return window.location.href;
    }

    /**
     * Copy current URL to clipboard
     * @returns {Promise} Promise that resolves when copying is complete
     */
    function copyURLToClipboard() {
        const url = getCurrentURL();
        return navigator.clipboard.writeText(url).then(() => {
            return url;
        });
    }

    // Public API
    return {
        saveToURL: saveToURL,
        loadFromURL: loadFromURL,
        clearState: clearState,
        setupAutoPersistence: setupAutoPersistence,
        getCurrentURL: getCurrentURL,
        copyURLToClipboard: copyURLToClipboard,
        getPersistableInputs: getPersistableInputs
    };
})();
