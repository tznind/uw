// Custom Vehicle Card JavaScript
// Automatically calculates armor based on selected upgrades

document.addEventListener('DOMContentLoaded', function() {
    // Get all upgrade checkboxes that affect armor
    const platedCheckbox = document.getElementById('cv_pl');
    const reinforcedCheckbox = document.getElementById('cv_re');
    
    // Create and insert armor display element
    const armorDisplay = document.createElement('div');
    armorDisplay.id = 'cv_armor_display';
    armorDisplay.className = 'form-field';
    armorDisplay.innerHTML = '<strong>Armor:</strong> <span id="cv_armor_value">0</span>';
    armorDisplay.style.marginTop = '10px';
    armorDisplay.style.padding = '8px';
    armorDisplay.style.background = '#e8f4f8';
    armorDisplay.style.borderRadius = '4px';
    armorDisplay.style.fontSize = '1.1em';
    
    // Insert armor display after the Brace for Impact help section
    const braceForImpactDetails = document.querySelector('.custom-vehicle-card details');
    if (braceForImpactDetails && braceForImpactDetails.parentNode) {
        braceForImpactDetails.parentNode.insertBefore(armorDisplay, braceForImpactDetails.nextSibling);
    }
    
    // Function to calculate and update armor
    function updateArmor() {
        let totalArmor = 0;
        
        // Plated upgrade: +3 Armor
        if (platedCheckbox && platedCheckbox.checked) {
            totalArmor += 3;
        }
        
        // Reinforced upgrade: +3 Armor
        if (reinforcedCheckbox && reinforcedCheckbox.checked) {
            totalArmor += 3;
        }
        
        // Update display
        const armorValueElement = document.getElementById('cv_armor_value');
        if (armorValueElement) {
            armorValueElement.textContent = totalArmor;
        }
        
        // Add visual feedback for high armor values
        if (totalArmor >= 6) {
            armorDisplay.style.background = '#d4edda';
            armorDisplay.style.color = '#155724';
        } else if (totalArmor >= 3) {
            armorDisplay.style.background = '#fff3cd';
            armorDisplay.style.color = '#856404';
        } else {
            armorDisplay.style.background = '#e8f4f8';
            armorDisplay.style.color = 'inherit';
        }
    }
    
    // Add event listeners to armor-affecting upgrades
    if (platedCheckbox) {
        platedCheckbox.addEventListener('change', updateArmor);
    }
    if (reinforcedCheckbox) {
        reinforcedCheckbox.addEventListener('change', updateArmor);
    }
    
    // Initial calculation
    updateArmor();
});