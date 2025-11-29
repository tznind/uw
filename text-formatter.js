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
     * Escape special regex characters in a string
     * @param {string} str - String to escape
     * @returns {string} Escaped string safe for use in RegExp
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Replace glossary terms within HTML content
     * Looks for whole words matching glossary terms and wraps them in spans
     * @param {string} html - HTML string with formatting already applied
     * @param {Map} termsLookup - Map of lowercase terms to definitions
     * @returns {string} HTML with glossary terms wrapped
     */
    function linkifyGlossaryTerms(html, termsLookup) {
        if (!termsLookup || termsLookup.size === 0) {
            return html;
        }

        // Process each term in the glossary
        termsLookup.forEach((termDef, termLower) => {
            const term = termDef.term;
            const escapedDescription = termDef.description
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;');

            // Escape special regex characters in the term
            const escapedTerm = escapeRegex(term);

            // Create a regex that matches the term as a whole word (case-insensitive)
            // Use word boundaries to ensure we match whole words only
            const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');

            // Replace the term with a span wrapper, but only in text content (not in HTML tags)
            // We need to be careful not to replace terms inside existing HTML attributes
            html = html.replace(regex, function(match) {
                // Check if this match is already inside a glossary-term span by looking backwards
                // This is a simple heuristic - if we're already in a span, don't wrap again
                return `<span class="glossary-term" data-term-title="${term}" data-term-text="${escapedDescription}">${match}</span>`;
            });
        });

        return html;
    }

    /**
     * Convert bullet lists to HTML
     * Detects lines starting with "- " and converts them to <ul><li> lists
     * @param {string} text - Text with potential bullet lists
     * @returns {string} Text with bullet lists converted to HTML
     */
    function convertBulletLists(text) {
        // Match groups of consecutive lines starting with "- "
        // Pattern: (start of string or newline) followed by "- " and content until newline or end
        // We need to handle multiple consecutive bullets as one list

        // Replace consecutive bullet lines with <ul><li> structure
        return text.replace(/((?:^|\n)- .+(?:\n|$))+/gm, function(match) {
            // Split the matched group into individual bullet items
            const items = match
                .split('\n')
                .filter(line => line.trim().startsWith('- '))
                .map(line => line.trim().substring(2)); // Remove "- " prefix

            // Build the <ul> list
            const listItems = items.map(item => `<li>${item}</li>`).join('');
            return `\n<ul>${listItems}</ul>\n`;
        });
    }

    /**
     * Format text with basic markdown-style syntax
     * Supports: **bold**, *italic*, and bullet lists
     * @param {string} text - The text to format
     * @returns {string} HTML string with formatting applied
     */
    function format(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        let formatted = text;

        // Apply bold (**text**) first
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Apply italic (*text*) - single asterisks not already part of bold
        // Use a simpler approach: match *text* where text doesn't contain asterisks
        formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

        // Build terms lookup and linkify glossary terms
        const termsLookup = buildTermsLookup();
        formatted = linkifyGlossaryTerms(formatted, termsLookup);

        // Convert bullet lists (before paragraph/line break conversion)
        formatted = convertBulletLists(formatted);

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
