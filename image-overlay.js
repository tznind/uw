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
     * @param {string} careerName - Name of the career (e.g., "academic")
     * @returns {Promise<string>} - Combined SVG as data URL
     */
    async function combineSVGs(originName, careerName) {
        // Load both SVGs
        const originPath = `/data/img/${originName.toLowerCase()}.svg`;
        const careerPath = careerName ? `/data/img/${careerName.toLowerCase()}.svg` : null;

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

        // If no career specified, just return the origin
        if (!careerPath) {
            return originPath;
        }

        const careerDoc = await loadSVG(careerPath);
        if (!careerDoc) {
            console.warn('Failed to load career SVG, showing origin only');
            return originPath;
        }

        const careerSVG = careerDoc.querySelector('svg');
        if (!careerSVG) {
            console.warn('Invalid career SVG, showing origin only');
            return originPath;
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

        // Create a clipPath definition to show only the left half (for career)
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'leftHalfClip');

        const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipRect.setAttribute('x', viewBoxX);
        clipRect.setAttribute('y', viewBoxY);
        clipRect.setAttribute('width', viewBoxWidth / 2);
        clipRect.setAttribute('height', viewBoxHeight);

        clipPath.appendChild(clipRect);
        defs.appendChild(clipPath);
        combinedSVG.appendChild(defs);

        // Clone all children from origin SVG (full, unclipped)
        Array.from(originSVG.children).forEach(child => {
            combinedSVG.appendChild(child.cloneNode(true));
        });

        // Clone all children from career SVG and overlay them with a vertical offset
        // Create a group to hold the career elements with a transform and clip-path
        const careerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        // Use the viewBoxHeight we already calculated to get 28% offset (33% - 5%)
        const offsetY = viewBoxHeight * 0.28;

        careerGroup.setAttribute('transform', `translate(0, ${offsetY})`);
        careerGroup.setAttribute('clip-path', 'url(#leftHalfClip)');

        Array.from(careerSVG.children).forEach(child => {
            careerGroup.appendChild(child.cloneNode(true));
        });

        combinedSVG.appendChild(careerGroup);

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
        const imgElement = document.getElementById('origin-career-img');

        if (!originSelect || !imgElement) {
            console.error('Required elements not found');
            return;
        }

        const origin = originSelect.value;
        const career1 = career1Select ? career1Select.value : '';

        if (!origin) {
            // No origin selected, hide image
            imgElement.style.display = 'none';
            return;
        }

        imgElement.style.display = 'block';

        // Combine the SVGs
        const combinedImageURL = await combineSVGs(origin, career1);

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

        if (originSelect) {
            originSelect.addEventListener('change', updateImage);
        }

        if (career1Select) {
            career1Select.addEventListener('change', updateImage);
        }

        // Initial update
        updateImage();
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
