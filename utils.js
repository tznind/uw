/**
 * Utility Functions - Common helpers for the Rogue Trader character sheet
 */

window.Utils = (function() {
    'use strict';

    /**
     * Debounce function to limit rapid function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Safe element creation with error handling
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Attributes to set
     * @param {string} textContent - Text content
     * @returns {HTMLElement|null} Created element or null on error
     */
    function createElement(tag, attributes = {}, textContent = '') {
        try {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            if (textContent) {
                element.textContent = textContent;
            }
            
            return element;
        } catch (error) {
            console.error('Error creating element:', error);
            return null;
        }
    }

    /**
     * Safe query selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Context element (defaults to document)
     * @returns {HTMLElement|null} Found element or null
     */
    function safeQuerySelector(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.error('Invalid selector:', selector, error);
            return null;
        }
    }

    /**
     * Validate that required data exists
     * @param {Object} data - Data to validate
     * @param {Array} requiredFields - Array of required field names
     * @returns {boolean} True if valid
     */
    function validateData(data, requiredFields) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        return requiredFields.every(field => 
            data.hasOwnProperty(field) && data[field] !== null && data[field] !== undefined
        );
    }

    /**
     * Show user-friendly error message
     * @param {string} message - Error message
     * @param {string} type - Type of error ('error', 'warning', 'info')
     */
    function showMessage(message, type = 'error') {
        // Simple alert for now - could be enhanced with a toast system
        console[type](message);
        
        // You could enhance this to show a proper toast notification
        if (type === 'error') {
            alert(`Error: ${message}`);
        }
    }

    /**
     * Get friendly error messages for common issues
     * @param {Error} error - Error object
     * @returns {string} User-friendly message
     */
    function getFriendlyErrorMessage(error) {
        if (error.name === 'TypeError') {
            return 'There was a problem with the data format. Please try refreshing the page.';
        } else if (error.name === 'ReferenceError') {
            return 'A required component is missing. Please check that all files are loaded.';
        } else {
            return 'An unexpected error occurred. Please try again.';
        }
    }

    /**
     * Get current role from the form
     * @returns {string|null} Current selected role or null
     */
    function getCurrentRole() {
        const roleSelect = safeQuerySelector('#role');
        return roleSelect ? roleSelect.value : null;
    }

    /**
     * Check if any checkbox for a move is checked (handles single and multiple checkboxes)
     * @param {string} moveId - The move ID to check
     * @returns {boolean} True if any checkbox for this move is checked
     */
    function isAnyMoveCheckboxChecked(moveId) {
        // Check for single checkbox
        const singleCheckbox = safeQuerySelector(`#move_${moveId}`);
        if (singleCheckbox && singleCheckbox.checked) {
            return true;
        }
        
        // Check for multiple checkboxes (move_id_1, move_id_2, etc.)
        let index = 1;
        while (true) {
            const multiCheckbox = safeQuerySelector(`#move_${moveId}_${index}`);
            if (!multiCheckbox) break; // No more checkboxes
            
            if (multiCheckbox.checked) {
                return true;
            }
            index++;
        }
        
        return false;
    }

    /**
     * Safely dispatch custom event
     * @param {string} eventName - Name of the event
     * @param {Object} detail - Event detail object
     * @param {Element} target - Target element (defaults to window)
     */
    function dispatchCustomEvent(eventName, detail = {}, target = window) {
        try {
            const event = new CustomEvent(eventName, { detail });
            target.dispatchEvent(event);
        } catch (error) {
            console.error('Error dispatching custom event:', eventName, error);
        }
    }

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API
    return {
        debounce,
        throttle,
        createElement,
        safeQuerySelector,
        validateData,
        showMessage,
        getFriendlyErrorMessage,
        getCurrentRole,
        isAnyMoveCheckboxChecked,
        dispatchCustomEvent
    };
})();
