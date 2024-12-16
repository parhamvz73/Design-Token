document.addEventListener('DOMContentLoaded', () => {
  const colorBox = document.getElementById('selected-color-box');
  const popover = document.getElementById('color-popover');
  const selectButton = document.getElementById('select-color-button');
  const cardButton = document.querySelector('.card-button');
  const cardLink = document.querySelector('.card-link');
  const toastContainer = document.getElementById('toast-container'); // Toast container
  let selectedColor = '#ff0000'; // Default selected color
  let isSelected = false; // Flag to track button state
  

   // Toggle button for switching between vertical and horizontal card layout
   const cardLayoutToggle = document.getElementById('cardLayoutToggle');
   const cardElement = document.getElementById('card'); // The card to switch layout
 
   cardLayoutToggle.addEventListener('change', () => {
     if (cardLayoutToggle.checked) {
       // If the toggle is on, switch to horizontal layout
       cardElement.classList.add('horizontal');
     } else {
       // If the toggle is off, revert to vertical layout
       cardElement.classList.remove('horizontal');
     }
   });
  

  colorBox.addEventListener('click', () => {
    popover.style.display = 'block';
  });

  const streamNav = document.getElementById('stream-nav');
const sections = document.querySelectorAll('.stream-section');

sections.forEach(section => {
  const navLink = document.createElement('a');
  navLink.href = `#${section.id}`;
  navLink.textContent = section.querySelector('h2').textContent;
  navLink.classList.add('nav-link');

  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.getElementById(section.id);
    console.log('Link clicked'); // Debugging line
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
    // Highlight the section
    highlightSection(targetSection);
  });
  streamNav.appendChild(navLink);
});


  const colorWheelContainer = document.getElementById('color-wheel');
  const colorPicker = new iro.ColorPicker(colorWheelContainer, { width: 200, color: selectedColor });

  const harmonyBoxElements = [
    document.getElementById("harmonyBox1"),
    document.getElementById("harmonyBox2"),
    document.getElementById("harmonyBox3")
  ];

  function updateColorTooltip(elementId, hexColor) {
    const colorBox = document.getElementById(elementId);
    colorBox.setAttribute("data-tooltip", hexColor);
  }
  
  // Update generateTriadicHarmonyColors function to include the tooltip update
  function generateTriadicHarmonyColors(hex) {
    const baseColor = chroma(hex);
  
    const harmonyColors = [
      baseColor.hex(), // Harmony Box 1 (Primary)
      chroma(baseColor).set('hsl.h', '+120').hex(), // Harmony Box 2 (Secondary)
      chroma(baseColor).set('hsl.h', '+240').hex()  // Harmony Box 3 (Tertiary)
    ];
  
  
    harmonyBoxElements.forEach((box, index) => {
        if (index < harmonyColors.length) {
          box.style.backgroundColor = harmonyColors[index];
          box.style.display = "flex";
    
           // Update tooltips for Harmony Boxes
      if (index === 0) {
        updateColorTooltip("harmonyBox1", harmonyColors[index]); // Main Color Tooltip
      } else if (index === 1) {
        updateColorTooltip("harmonyBox2", harmonyColors[index]); // First Triadic Color Tooltip
      } else if (index === 2) {
        updateColorTooltip("harmonyBox3", harmonyColors[index]); // Second Triadic Color Tooltip
      }
    } else {
      box.style.display = "none";
    }
  });
    
      const primaryColor = harmonyColors[0]; // Harmony Box 1
      const secondaryColor = harmonyColors[1]; // Harmony Box 2
      const tertiaryColor = harmonyColors[2]; // Harmony Box 3
  
    // Set CSS variables for harmony colors
    document.documentElement.style.setProperty('--primary-triadic-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-triadic-color', secondaryColor);
    document.documentElement.style.setProperty('--tertiary-triadic-color', tertiaryColor); // Set Tertiary Color
  
    // Update the link's hover behavior using the primary color
    const cardLink = document.querySelector('.card-link');
  
    // Default link color
    cardLink.style.color = '#000'; // Black by default
  
    // Hover state (Primary Triadic Color)
    cardLink.addEventListener('mouseenter', () => {
      cardLink.style.color = primaryColor;
    });
  
    // Reset to default black on mouse leave
    cardLink.addEventListener('mouseleave', () => {
      cardLink.style.color = '#000';
    });
  
    generateColorPalette(primaryColor, 'primary-color-shades');
    generateColorPalette(secondaryColor, 'secondary-color-shades');
    generateColorPalette(tertiaryColor, 'tertiary-color-shades');
    generateGrayscalePalette(); // Generate Grayscale Palette
  
    // Update button and other card elements
    setCardButtonColors(primaryColor, secondaryColor);
    setCardLinkColors(primaryColor);
  
    // Restore palettes
    generateInformativeColor(primaryColor);
    generateSuccessColor(primaryColor);
    generateWarningColor(primaryColor);
    generateErrorColor(primaryColor);
  }
  
  

  function setCardButtonColors(primaryColor, secondaryColor) {
    const cardButtons = document.querySelectorAll('.card-button'); // Select all buttons
  
    cardButtons.forEach((button) => {
      let isSelected = false; // Each button tracks its own state
  
      // Update button background color and apply contrast check
      function updateButtonColor() {
        button.style.backgroundColor = isSelected ? secondaryColor : primaryColor;
        checkContrast(button.style.backgroundColor, button); // Check contrast for text visibility
      }
  
      // Default button background color
      updateButtonColor();
  
      // Hover state: Darken by 1
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = chroma(isSelected ? secondaryColor : primaryColor).darken(1).hex();
        checkContrast(button.style.backgroundColor, button);
      });
  
      // Reset to normal color on mouse leave
      button.addEventListener('mouseleave', () => {
        updateButtonColor();
      });
  
      // Pressed state: Darken by 2
      button.addEventListener('mousedown', () => {
        button.style.backgroundColor = chroma(isSelected ? secondaryColor : primaryColor).darken(2).hex();
        checkContrast(button.style.backgroundColor, button);
      });
  
      button.addEventListener('mouseup', () => {
        updateButtonColor(); // Return to default or hover state after press
      });
  
      // Button click toggles between "Select" and "Selected" and switches color
      button.addEventListener('click', () => {
        isSelected = !isSelected; // Toggle the button's state
        button.textContent = isSelected ? "Selected" : "Select";
        updateButtonColor();
  
        // Show toast notification based on the state
        if (isSelected) {
          showToastBar('This training is added to your list', 'success');
        } else {
          showToastBar('Training was removed from your list', 'error');
        }
      });
  
      // Handle disabled state: Use the 10th grayscale color
      if (button.disabled) {
        button.style.backgroundColor = chroma.scale(['#000000', '#FFFFFF'])(10 / 10).hex();
        button.style.color = "#fff"; // Ensure text is always white for disabled state
      }
    });
  }

  function setCardLinkColors(primaryColor) {
    const cardLinks = document.querySelectorAll('.card-link'); // Select all links
  
    cardLinks.forEach((link) => {
      // Default link color
      link.style.color = '#000'; // Black by default
  
      // Remove any existing event listeners to prevent duplicate handlers
      link.onmouseenter = null;
      link.onmouseleave = null;
  
      // Hover state: Change to primary color
      link.addEventListener('mouseenter', () => {
        link.style.color = primaryColor;
      });
  
      // Reset to black when mouse leaves
      link.addEventListener('mouseleave', () => {
        link.style.color = '#000';
      });
    });
  }
  
  

  // Function to show the toast bar with dynamic colors for success and error
function showToastBar(message, type) {
  const toastBar = document.createElement('div');
  toastBar.className = `toast-bar toast-${type}`; // Set the toast type (success or error)
  toastBar.textContent = message;

  // Apply dynamic background colors based on type
  if (type === 'success') {
    const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
    toastBar.style.backgroundColor = successColor || '#28a745'; // Fallback to a green color if not set
  } else if (type === 'error') {
    const errorColor = getComputedStyle(document.documentElement).getPropertyValue('--error-color');
    toastBar.style.backgroundColor = errorColor || '#dc3545'; // Fallback to a red color if not set
  }

  // Append the toast bar to the container
  toastContainer.appendChild(toastBar);

  // Make it visible
  setTimeout(() => {
    toastBar.classList.add('toast-visible');
  }, 100);

  // Remove the toast after 5 seconds
  setTimeout(() => {
    toastBar.classList.remove('toast-visible');
    setTimeout(() => {
      toastContainer.removeChild(toastBar);
    }, 300); // Time for the fade-out transition
  }, 5000); // 5 seconds visible
}

  // Function to check contrast and adjust text color based on WCAG AAA
  function checkContrast(bgColor, element) {
    const white = chroma('#ffffff');
    const black = chroma('#000000');
    const contrastWithWhite = chroma.contrast(bgColor, white);
    const contrastWithBlack = chroma.contrast(bgColor, black);
  
    // Adjust text color based on contrast
    if (contrastWithWhite >= 7) {
      element.style.color = '#ffffff'; // Set text to white
    } else if (contrastWithBlack >= 7) {
      element.style.color = '#000000'; // Set text to black
    } else {
      // If neither contrast is good enough, fallback to brightness check
      const brightness = chroma(bgColor).luminance();
      element.style.color = brightness > 0.5 ? '#000000' : '#ffffff'; // Light background = black text, dark background = white text
    }
  }
  

  // Function to generate the color palette, keeping hue consistent and only changing lightness
  function generateColorPalette(baseColor, rowId) {
    const colorRow = document.getElementById(rowId);
    colorRow.innerHTML = '';

    const hslBaseColor = chroma(baseColor).hsl(); // Get the base color in HSL format
    const colorArray = [];

    // Adjust lightness for darkened shades (lightness decreases)
    for (let i = 5; i >= 1; i--) {
      const darkenedColor = chroma.hsl(hslBaseColor[0], hslBaseColor[1], hslBaseColor[2] - i * 0.1).hex();
      colorArray.push(darkenedColor);
    }

    // Add the base color itself (no lightness modification)
    colorArray.push(baseColor);

    // Adjust lightness for lightened shades (lightness increases)
    for (let i = 1; i <= 5; i++) {
      const lightenedColor = chroma.hsl(hslBaseColor[0], hslBaseColor[1], hslBaseColor[2] + i * 0.1).hex();
      colorArray.push(lightenedColor);
    }

    // Display the colors
    colorArray.forEach(color => {
      const colorBox = document.createElement("div");
      colorBox.className = "color-box";
      colorBox.style.backgroundColor = color;
      colorBox.setAttribute("data-tooltip", color); // Add tooltip with HEX color
      colorRow.appendChild(colorBox);
    });
  }

  // Function to generate Grayscale Palette from black to white
  function generateGrayscalePalette() {
    const grayscaleRow = document.getElementById('grayscale-shades');
    grayscaleRow.innerHTML = '';

    // Generate 11 grayscale shades between black and white
    for (let i = 0; i <= 10; i++) {
      const grayColor = chroma.scale(['#000000', '#FFFFFF'])(i / 10).hex();
      const colorBox = document.createElement("div");
      colorBox.className = "color-box";
      colorBox.style.backgroundColor = grayColor;
      colorBox.setAttribute("data-tooltip", grayColor); // Add tooltip with HEX color
      grayscaleRow.appendChild(colorBox);
    }
  }

  // Function to display a single color for informative, success, warning, and error
  function displaySingleColor(color, elementId) {
    const colorBox = document.getElementById(elementId);
    colorBox.style.backgroundColor = color;
  }

  // Generate colors for informative, success, warning, and error with target hue ranges
  function generateInformativeColor(baseColor) {
    const hslBase = chroma(baseColor).hsl();
    const informativeHue = 200; // Informative is set to blue-like hues
    const informativeColor = chroma.hsl(informativeHue, hslBase[1], hslBase[2]).hex();
    displaySingleColor(informativeColor, 'informative-color');
    updateColorTooltip('informative-color', informativeColor); // Add tooltip dynamically
  }

  function generateSuccessColor(baseColor) {
    const hslBase = chroma(baseColor).hsl();
    const successHue = 120; // Success is set to green-like hues
    const successColor = chroma.hsl(successHue, hslBase[1], hslBase[2]).hex();
    document.documentElement.style.setProperty('--success-color', successColor); // Set as CSS variable
    displaySingleColor(successColor, 'success-color');
    updateColorTooltip('success-color', successColor); // Add tooltip dynamically
  }

  function generateWarningColor(baseColor) {
    const hslBase = chroma(baseColor).hsl();
    const warningHue = 45; // Warning is set to yellow-like hues
    const warningColor = chroma.hsl(warningHue, hslBase[1], hslBase[2]).hex();
    displaySingleColor(warningColor, 'warning-color');
    updateColorTooltip('warning-color', warningColor); // Add tooltip dynamically
  }

  function generateErrorColor(baseColor) {
    const hslBase = chroma(baseColor).hsl();
    const errorHue = 0; // Error is set to red-like hues
    const errorColor = chroma.hsl(errorHue, hslBase[1], hslBase[2]).hex();
    document.documentElement.style.setProperty('--error-color', errorColor); // Set as CSS variable
    displaySingleColor(errorColor, 'error-color');
    updateColorTooltip('error-color', errorColor); // Add tooltip dynamically
  }

  colorPicker.on('color:change', (color) => {
    selectedColor = color.hexString;
    colorBox.style.backgroundColor = selectedColor;
    selectButton.disabled = false; // Enable select button when color changes
    
  });

  selectButton.addEventListener('click', () => {
    generateTriadicHarmonyColors(selectedColor);
    popover.style.display = 'none'; // Hide the popover
    selectButton.disabled = true; // Disable select button again

    // Hide the bubble by adding the 'hide-bubble' class
    colorBox.classList.add('hide-bubble');

    // Toggle the placeholder visibility by removing 'visible' and adding 'hidden'
    const placeholders = document.querySelectorAll('.color-box.placeholder');
    placeholders.forEach(placeholder => {
        placeholder.classList.remove('visible');
        placeholder.classList.add('hidden');
    });
});

const fontSelect = document.getElementById("fontSelect");
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownBtn = document.getElementById('dropdownBtn'); // Add a new dropdown button

// Replace default behavior
dropdownBtn.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    
});

dropdownMenu.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        const selectedFont = event.target.getAttribute('data-font');
        dropdownBtn.textContent = event.target.textContent; // Update button text

        // Update the font for all elements across all cards
document.querySelectorAll(".card-title").forEach((title) => {
  title.style.fontFamily = selectedFont;
});

document.querySelectorAll(".card-text").forEach((text) => {
  text.style.fontFamily = selectedFont;
});

document.querySelectorAll(".card-link").forEach((link) => {
  link.style.fontFamily = selectedFont;
});

document.querySelectorAll(".card-list li").forEach((item) => {
  item.style.fontFamily = selectedFont;
});


        dropdownMenu.style.display = "none"; // Hide menu after selection
    }
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
        dropdownMenu.style.display = "none";
    }
});

// Get all spacer elements with classes 'spacer' and 'spacer1'
const spacerElements = document.querySelectorAll('.spacer, .spacer1, .spacer2');

// Function to adjust spacer sizes and font sizes
function adjustSpacerSizes() {
  spacerElements.forEach(spacer => {
    // Get the width of the box from computed styles
    const size = parseInt(window.getComputedStyle(spacer).width, 10);

    // Set the font size to 70% of the box size
    const fontSize = size * 0.7;
    spacer.style.fontSize = `${fontSize}px`;

    // Set the content of the spacer box to display only the size number (without "px")
    spacer.textContent = size;
  });
}

// Call the function on page load
adjustSpacerSizes();

// Existing code for showing/hiding the spacer boxes
const showSpaceGuidesCheckbox = document.getElementById('showSpaceGuides');

// Toggle visibility of the spacer boxes when the checkbox is clicked
showSpaceGuidesCheckbox.addEventListener('change', () => {
  spacerElements.forEach(spacer => {
    if (showSpaceGuidesCheckbox.checked) {
      spacer.style.opacity = '1'; // Make spacers visible
    } else {
      spacer.style.opacity = '0'; // Make spacers invisible, but still keep their space
    }
  });
});

// Set initial atom value
let atomValue = document.getElementById("atom-slider").value;
const root = document.documentElement;
const atomDisplay = document.getElementById("atom-value");

// Function to update tokens based on the atom value
function updateTokens(atom) {
  // Base Tokens
  root.style.setProperty('--base-unit', `${atom * 4}px`);
  root.style.setProperty('--base-font-size', `${atom * 3}px`);
  root.style.setProperty('--base-border-radius', `${atom * 0.5}px`);
  root.style.setProperty('--base-shadow-offset', `${atom}px`);

  // Display current atom value
  atomDisplay.textContent = atom;

  // Recalculate spacer sizes based on the new atom value
  adjustSpacerSizes();
}

// Adjust spacer sizes and display the size
function adjustSpacerSizes() {
  spacerElements.forEach(spacer => {
    // Get the computed width of the spacer box
    const size = parseInt(window.getComputedStyle(spacer).width, 10);

    // Set the font size to 70% of the box size
    const fontSize = size * 0.7;
    spacer.style.fontSize = `${fontSize}px`;

    // Display the size inside the spacer
    spacer.textContent = size;
  });
}

// Event listener for slider to update atom value and tokens dynamically
document.getElementById("atom-slider").addEventListener("input", (event) => {
  atomValue = event.target.value;
  updateTokens(atomValue);
});

// Initial token update and spacer size adjustment based on default atom value
updateTokens(atomValue);

// Get elements for overlay functionality
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('close-button');
const visitWebsiteLink = document.querySelector('.card-link');

// Show overlay when "Visit Website" link is clicked
visitWebsiteLink.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent actual navigation
  overlay.style.display = 'flex'; // Show overlay
});

// Hide overlay when close button is clicked
closeButton.addEventListener('click', () => {
  overlay.style.display = 'none'; // Hide overlay
});
// Function to add highlight effect to a section
function highlightSection(section) {
  section.classList.add('highlight');
  setTimeout(() => {
    section.classList.remove('highlight');
  }, 800); // Remove highlight after 800ms to match the CSS animation duration
}
function updateCardQuantity() {
  const cardsContainer = document.getElementById('cards-container'); // Target container for cards
  const originalCard = document.querySelector('.card'); // Select the first card to duplicate
  const cardQuantityInput = document.getElementById('card-quantity'); // Number input for card quantity

  const desiredQuantity = parseInt(cardQuantityInput.value, 10) || 1; // Default to 1 if input is invalid
  const currentCardCount = cardsContainer.querySelectorAll('.card').length;

  // Add or remove cards to match the desired quantity
  if (desiredQuantity > currentCardCount) {
    for (let i = currentCardCount; i < desiredQuantity; i++) {
      const newCard = originalCard.cloneNode(true); // Clone the original card
      newCard.classList.add(`card-${i + 1}`); // Add a unique class for differentiation if needed

      // Update title for differentiation
      const title = newCard.querySelector('.card-title');
      if (title) title.textContent = `Card ${i + 1}`;

      // Reattach event listeners for interactivity
      attachCardListeners(newCard);

      // Append the new card to the container
      cardsContainer.appendChild(newCard);
    }
  } else if (desiredQuantity < currentCardCount) {
    for (let i = currentCardCount; i > desiredQuantity; i--) {
      const cardToRemove = cardsContainer.lastElementChild; // Get the last card
      if (cardToRemove) cardsContainer.removeChild(cardToRemove); // Remove the card
    }
  }
}

// Function to attach event listeners to interactive elements in the card
function attachCardListeners(card) {
  const button = card.querySelector('.card-button');
  const link = card.querySelector('.card-link');

  if (button) {
    button.addEventListener('click', () => {
      button.textContent = button.textContent === "Select" ? "Selected" : "Select";
      // Additional logic for button behavior
    });
  }

  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert(`You clicked the link in ${card.querySelector('.card-title').textContent}!`);
    });
  }
  
}

// Attach the input listener for dynamically updating card quantity
document.getElementById('card-quantity').addEventListener('input', updateCardQuantity);
 // Apply current color scheme to the new button and link
 const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-triadic-color').trim();
 const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-triadic-color').trim();

 setCardButtonColors(primaryColor, secondaryColor);
 setCardLinkColors(primaryColor);

});
