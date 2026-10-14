/* -------- FILTER CONFIGURATION -------- */

// Default values and ranges for all image filters
const defaultFilters = {
    brightness : {
        value : 100,
        min : 0,
        max : 200,
        unit : "%"
    },
    contrast : {
        value : 100,
        min : 0,
        max : 200,
        unit : "%"
    },
    saturation : {
        value : 100,
        min : 0,
        max : 200,
        unit : "%"
    },
    hueRotation : {
        value : 0,
        min : 0,
        max : 360,
        unit : "deg"
    },
    blur : {
        value : 0,
        min : 0,
        max : 20,
        unit : "px"
    },
    grayscale : {
        value : 0,
        min : 0,
        max : 100,
        unit : "%"
    },
    sepia : {
        value : 0,
        min : 0,
        max : 100,
        unit : "%"
    },
    opacity : {
        value : 100,
        min : 0,
        max : 100,
        unit : "%"
    },
    invert : {
        value : 0,
        min : 0,
        max : 100,
        unit : "%"
    }
};

// Stores the current filter values
let filters = structuredClone(defaultFilters);

/* -------- DOM ELEMENTS -------- */

// Canvas elements
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");

// Control buttons
const resetButton = document.querySelector("#reset-btn");
const downloadButton = document.querySelector("#download-btn");

// Filter and preset containers
const presetsContainer = document.querySelector(".presets");

// Stores the currently selected image
let image = null;

const filtersContainer = document.querySelector(".filters");

/* -------- FILTER CREATION -------- */

// Creates an individual filter slider
function createFilterElement(name, unit = "%", value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    const p = document.createElement("p");
    p.innerText = name;

    div.appendChild(p);
    div.appendChild(input);

    // Update the filter value when the slider changes
    input.addEventListener("input" , (event) => {
        filters[name].value = input.value;
        applyFilters();
    })

    return div;
}

// Generates sliders for all available filters
function createFilters() {
    Object.keys(filters).forEach(filter => {
        const filterElement = createFilterElement(filter ,filters[filter].unit , filters[filter].value , filters[filter].min , filters[filter].max);
        filtersContainer.appendChild(filterElement);
    })
}

// Create filter controls when the page loads
createFilters();

/* -------- IMAGE UPLOAD -------- */

// Loads the selected image into the canvas
imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const imagePlaceHolder = document.querySelector(".placeholder");

    // Display the canvas and hide the placeholder
    imageCanvas.style.display = 'block';
    imagePlaceHolder.style.display = "none";

    // Create an image object from the selected file
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        image = img;

        // Set canvas dimensions to match the uploaded image
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;

        // Draw the uploaded image on the canvas
        canvasCtx.drawImage(img, 0, 0);

        // Enable downloading after an image is loaded
        downloadButton.disabled = false;
    }
})

/* -------- APPLY IMAGE FILTERS -------- */

// Applies the current filter values to the uploaded image
function applyFilters() {

    // Prevent applying filters when no image is selected
    if (!image) return;

    // Clear the previous canvas content
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    // Combine all filter values into a canvas filter string
    canvasCtx.filter = `
    brightness(${filters.brightness.value}${filters.brightness.unit})
    contrast(${filters.contrast.value}${filters.contrast.unit})
    saturate(${filters.saturation.value}${filters.saturation.unit})
    hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
    blur(${filters.blur.value}${filters.blur.unit})
    grayscale(${filters.grayscale.value}${filters.grayscale.unit})
    sepia(${filters.sepia.value}${filters.sepia.unit})
    opacity(${filters.opacity.value}${filters.opacity.unit})
    invert(${filters.invert.value}${filters.invert.unit})
    `.trim();

    // Redraw the original image with the updated filters
    canvasCtx.drawImage(image, 0, 0);
}

/* -------- RESET FILTERS -------- */

// Restores all filters to their default values
resetButton.addEventListener("click", () => {

    // Create a fresh copy of the default filter configuration
    filters = structuredClone(defaultFilters);

    // Apply the default filters to the image
    applyFilters();

    // Recreate sliders with their default values
    filtersContainer.innerHTML = "";
    createFilters();
});

/* -------- DOWNLOAD IMAGE -------- */

// Downloads the edited canvas as a PNG image
downloadButton.addEventListener("click", () => {

    // Prevent downloading when no image is selected
    if (!image) return;
    const link = document.createElement("a");
    link.download = "edited-image.png";

    // Convert canvas content into a downloadable image
    link.href = imageCanvas.toDataURL();
    link.click();
})

/* -------- FILTER PRESETS -------- */

// Predefined combinations of filter values
const presets = {

    drama: {
        brightness: 90,
        contrast: 160,
        saturation: 125,
        hueRotation: 0,
        blur: 0,
        grayscale: 10,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    vintage: {
        brightness: 110,
        contrast: 85,
        saturation: 70,
        hueRotation: 10,
        blur: 0,
        grayscale: 10,
        sepia: 45,
        opacity: 100,
        invert: 0
    },

    oldSchool: {
        brightness: 105,
        contrast: 110,
        saturation: 55,
        hueRotation: 0,
        blur: 0.5,
        grayscale: 30,
        sepia: 65,
        opacity: 100,
        invert: 0
    },

    blackAndWhite: {
        brightness: 105,
        contrast: 125,
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    cinematic: {
        brightness: 90,
        contrast: 135,
        saturation: 85,
        hueRotation: 190,
        blur: 0,
        grayscale: 10,
        sepia: 10,
        opacity: 100,
        invert: 0
    },

    warm: {
        brightness: 110,
        contrast: 105,
        saturation: 120,
        hueRotation: 345,
        blur: 0,
        grayscale: 0,
        sepia: 25,
        opacity: 100,
        invert: 0
    },

    cool: {
        brightness: 105,
        contrast: 110,
        saturation: 90,
        hueRotation: 180,
        blur: 0,
        grayscale: 5,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    faded: {
        brightness: 115,
        contrast: 75,
        saturation: 65,
        hueRotation: 0,
        blur: 0,
        grayscale: 15,
        sepia: 15,
        opacity: 90,
        invert: 0
    },

    vibrant: {
        brightness: 110,
        contrast: 115,
        saturation: 175,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    dreamy: {
        brightness: 120,
        contrast: 85,
        saturation: 115,
        hueRotation: 0,
        blur: 1.5,
        grayscale: 0,
        sepia: 10,
        opacity: 95,
        invert: 0
    },

    noir: {
        brightness: 85,
        contrast: 175,
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0
    }
};

/* -------- PRESET BUTTON CREATION -------- */

// Creates a button for every predefined filter preset
Object.keys(presets).forEach(presetName => {
    const presetButton = document.createElement("button");
    presetButton.classList.add("btn");
    presetButton.innerText = presetName;
    presetsContainer.appendChild(presetButton);

    // Apply the selected preset when its button is clicked
    presetButton.addEventListener('click', () => {

        const preset = presets[presetName];

        // Update all filter values using the selected preset
        Object.keys(preset).forEach(filterName => {
            filters[filterName].value  = preset[filterName];
        })

        // Apply the preset to the uploaded image
        applyFilters();

        // Recreate sliders to reflect the selected preset values
        filtersContainer.innerHTML = "";
        createFilters();
    })
})