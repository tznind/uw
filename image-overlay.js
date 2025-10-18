/**
 * Image Overlay System
 * Dynamically combines origin and career SVG images
 */

(function() {
    'use strict';

    /**
     * Load and parse an SVG file
     * @param {string} path - Path to the SVG file
     * @returns {Promise<Document>} - Parsed SVG document
     */
    async function loadSVG(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load SVG: ${path}`);
            }
            const svgText = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(svgText, 'image/svg+xml');
        } catch (error) {
            console.error('Error loading SVG:', error);
            return null;
        }
    }

    /**
     * Combine origin and career SVGs into a single composite SVG
     * @param {string} originName - Name of the origin (e.g., "forlorn")
     * @param {string} career1Name - Name of the first career (e.g., "academic")
     * @param {string} career2Name - Name of the second career (e.g., "military")
     * @returns {Promise<string>} - Combined SVG as data URL
     */
    async function combineSVGs(originName, career1Name, career2Name) {
        // Load all SVGs
        const originPath = `/data/img/${originName.toLowerCase()}.svg`;
        const career1Path = career1Name ? `/data/img/${career1Name.toLowerCase()}.svg` : null;
        const career2Path = career2Name ? `/data/img/${career2Name.toLowerCase()}.svg` : null;

        const originDoc = await loadSVG(originPath);
        if (!originDoc) {
            console.error('Failed to load origin SVG');
            return null;
        }

        const originSVG = originDoc.querySelector('svg');
        if (!originSVG) {
            console.error('Invalid origin SVG');
            return null;
        }

        // If no careers specified, just return the origin
        if (!career1Path && !career2Path) {
            return originPath;
        }

        // Load career 1 if specified
        let career1SVG = null;
        if (career1Path) {
            const career1Doc = await loadSVG(career1Path);
            if (career1Doc) {
                career1SVG = career1Doc.querySelector('svg');
            }
        }

        // Load career 2 if specified
        let career2SVG = null;
        if (career2Path) {
            const career2Doc = await loadSVG(career2Path);
            if (career2Doc) {
                career2SVG = career2Doc.querySelector('svg');
            }
        }

        // Create a new SVG that combines both
        const combinedSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        // Use the viewBox from the origin SVG (they should be the same)
        combinedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        combinedSVG.setAttribute('viewBox', originSVG.getAttribute('viewBox'));
        combinedSVG.setAttribute('width', originSVG.getAttribute('width'));
        combinedSVG.setAttribute('height', originSVG.getAttribute('height'));

        // Get viewBox dimensions for clipping
        const viewBox = originSVG.getAttribute('viewBox').split(' ');
        const viewBoxX = parseFloat(viewBox[0]);
        const viewBoxY = parseFloat(viewBox[1]);
        const viewBoxWidth = parseFloat(viewBox[2]);
        const viewBoxHeight = parseFloat(viewBox[3]);

        // Create clipPath definitions for left and right halves
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Left half clip (for career 1)
        const leftClipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        leftClipPath.setAttribute('id', 'leftHalfClip');
        const leftClipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        leftClipRect.setAttribute('x', viewBoxX);
        leftClipRect.setAttribute('y', viewBoxY);
        leftClipRect.setAttribute('width', viewBoxWidth / 2);
        leftClipRect.setAttribute('height', viewBoxHeight);
        leftClipPath.appendChild(leftClipRect);
        defs.appendChild(leftClipPath);

        // Right half clip (for career 2)
        const rightClipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        rightClipPath.setAttribute('id', 'rightHalfClip');
        const rightClipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rightClipRect.setAttribute('x', viewBoxX + (viewBoxWidth / 2));
        rightClipRect.setAttribute('y', viewBoxY);
        rightClipRect.setAttribute('width', viewBoxWidth / 2);
        rightClipRect.setAttribute('height', viewBoxHeight);
        rightClipPath.appendChild(rightClipRect);
        defs.appendChild(rightClipPath);

        combinedSVG.appendChild(defs);

        // Clone all children from origin SVG (full, unclipped)
        Array.from(originSVG.children).forEach(child => {
            combinedSVG.appendChild(child.cloneNode(true));
        });

        // Use the viewBoxHeight we already calculated to get 28% offset (33% - 5%)
        const offsetY = viewBoxHeight * 0.28;

        // Add career 1 (left half) if available
        if (career1SVG) {
            const career1Group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            career1Group.setAttribute('transform', `translate(0, ${offsetY})`);
            career1Group.setAttribute('clip-path', 'url(#leftHalfClip)');

            Array.from(career1SVG.children).forEach(child => {
                career1Group.appendChild(child.cloneNode(true));
            });

            combinedSVG.appendChild(career1Group);
        }

        // Add career 2 (right half) if available
        if (career2SVG) {
            const career2Group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            career2Group.setAttribute('transform', `translate(0, ${offsetY})`);
            career2Group.setAttribute('clip-path', 'url(#rightHalfClip)');

            Array.from(career2SVG.children).forEach(child => {
                career2Group.appendChild(child.cloneNode(true));
            });

            combinedSVG.appendChild(career2Group);
        }

        // Convert to data URL
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(combinedSVG);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        return URL.createObjectURL(svgBlob);
    }

    /**
     * Update the displayed image based on current selections
     */
    async function updateImage() {
        const originSelect = document.getElementById('role');
        const career1Select = document.getElementById('role2');
        const career2Select = document.getElementById('role3');
        const imgElement = document.getElementById('origin-career-img');

        if (!originSelect || !imgElement) {
            console.error('Required elements not found');
            return;
        }

        const origin = originSelect.value;
        const career1 = career1Select ? career1Select.value : '';
        const career2 = career2Select ? career2Select.value : '';

        if (!origin) {
            // No origin selected, hide image
            imgElement.classList.add('hidden');
            return;
        }

        imgElement.classList.remove('hidden');

        // Combine the SVGs
        const combinedImageURL = await combineSVGs(origin, career1, career2);

        if (combinedImageURL) {
            // Revoke old object URL to prevent memory leaks
            if (imgElement.dataset.objectUrl) {
                URL.revokeObjectURL(imgElement.dataset.objectUrl);
            }

            imgElement.src = combinedImageURL;

            // Store object URL for cleanup
            if (combinedImageURL.startsWith('blob:')) {
                imgElement.dataset.objectUrl = combinedImageURL;
            }
        }
    }

    /**
     * Initialize the image overlay system
     */
    function initialize() {
        const originSelect = document.getElementById('role');
        const career1Select = document.getElementById('role2');
        const career2Select = document.getElementById('role3');

        if (originSelect) {
            originSelect.addEventListener('change', updateImage);
        }

        if (career1Select) {
            career1Select.addEventListener('change', updateImage);
        }

        if (career2Select) {
            career2Select.addEventListener('change', updateImage);
        }

        // Initial update - delayed to allow persistence system to restore values
        setTimeout(updateImage, 100);

        // Also update after a longer delay to catch any late-loading values
        setTimeout(updateImage, 500);
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Export for external use
    window.ImageOverlay = {
        updateImage,
        combineSVGs
    };

})();
