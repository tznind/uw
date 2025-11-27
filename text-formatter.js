/**
 * Text Formatter - Basic markdown-style text formatting
 * Supports **bold** and *italic* without external dependencies
 * Also supports clickable glossary terms
 */
window.TextFormatter = (function() {
    'use strict';

    /**
     * Build a lookup map from terms glossary for fast matching
     * @returns {Map} Map of lowercase term to term definition
     */
    function buildTermsLookup() {
        const lookup = new Map();

        if (window.termsGlossary && Array.isArray(window.termsGlossary)) {
            window.termsGlossary.forEach(termDef => {
                if (termDef.term && termDef.description) {
                    lookup.set(termDef.term.toLowerCase(), termDef);
                }
            });
        }

        return lookup;
    }

    /**
     * Format text with basic markdown-style syntax
     * Supports: **bold** and *italic*
     * @param {string} text - The text to format
     * @returns {string} HTML string with formatting applied
     */
    function format(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        // Escape HTML to prevent XSS
        let formatted = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        // Build terms lookup
        const termsLookup = buildTermsLookup();

        // Apply bold (**text**) first, with glossary term detection
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, function(match, term) {
            const termDef = termsLookup.get(term.toLowerCase());
            if (termDef) {
                // This is a glossary term - make it clickable
                const escapedDescription = termDef.description
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;');
                return `<strong class="glossary-term" data-term-title="${termDef.term}" data-term-text="${escapedDescription}">${term}</strong>`;
            }
            return `<strong>${term}</strong>`;
        });

        // Apply italic (*text*) - single asterisks not already part of bold, with glossary term detection
        formatted = formatted.replace(/\*([^*]+?)\*/g, function(match, term) {
            const termDef = termsLookup.get(term.toLowerCase());
            if (termDef) {
                // This is a glossary term - make it clickable
                const escapedDescription = termDef.description
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;');
                return `<em class="glossary-term" data-term-title="${termDef.term}" data-term-text="${escapedDescription}">${term}</em>`;
            }
            return `<em>${term}</em>`;
        });

        // Convert double newlines to paragraph breaks
        formatted = formatted.replace(/\n\n/g, '</p><p>');

        // Convert single newlines to line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    // Public API
    return {
        format
    };
})();
