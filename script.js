// TODO: Rename pin1 (LEAVING FOR LATER)
// TODO: Keep the map where it is at its current relative scale on window resize (LATER)
// TODO: Take some liberties with the arrangement of the title!

// TABLE OF CONTENTS -----------------------------------------------------------

// DEBUGGING
// DATA OBJECT
//     Calculated Constants (Map)
//         calculateInitialScale()
//     Calculated Constants (Labels)
//     Calculated Constants (Pins)
// DOM OBJECT
// INITIALIZATION OF MAP, LABELS, & PINS
//     Window
//     Map
//     Labels
//         makeLabelElement()
//         updateLabelPositions()
//     Pins
//         makePinElement()
//         updatePinPositions()
// EVENT LISTENERS & THEIR FUNCTIONS
//     Debugging
//         logRelPos()
//     Label Opacities
//         updateLabelOpacities()
//     Zooming
//         mapScroll()
//         zoomAndPositionMap()
//     Dragging
//         dragStart()
//         dragMove()
//         dragEnd()
// UTILITIES
//     Sizing and Positioning
//         sizeElement()
//         position()
//         centerElement()
//         getCenterOf()
//         constrainPositionToWindow()
//         constrainSizeToWindow()
//         getWindowScaleByHypoteneuse()
//         getElementScaleByHypoteneuse()
//     Absolute and Relative Conversion
//         relToAbs()
//         absToRel()
//         windowRelToAbs()
//         windowAbsToRel()

// DEBUGGING -------------------------------------------------------------------

let isLogRelPos = true; // Log the relative position of the cursor on mousedown

// DATA OBJECT -----------------------------------------------------------------

let data = {
    window: {
        currentHypoteneuse: null // The current hypoteneuse of the window (will be calculated later)
    },
    map: {
        resolution: [4800, 2700], // The native resolution of the map in pixels
        currentHypoteneuse: null, // The current scale of the map (will be calculated later)
        targetWindowCenterRelPos: null, // The current relative position of the map in the window (will be calculated later)
        temporaryWindowCenterRelPos: null // The temporary relative position of the map in the window (will be calculated later)
    },
    label: {
        resolution: [700, 216], // The native resolution of the labels in pixels
        // width: 264 // The actual width of the label in pixels (defined in stylesheet)
        width: 232, // The actual width of the label in pixels (defined in stylesheet)
    },
    labels: [ // The names, sources, and relative positions of the labels to show on the map (the element property will be populated later)
        {
            name: "cuba",
            src: "./assets/labels/label_cuba.png",
            relPos: [0.3625, 0.0837037037037037]
        },
        {
            name: "gramercy",
            src: "./assets/labels/label_gramercy.png",
            relPos: [0.5233333333333333, 0.042222222222222223]
        },
        {
            name: "stuyvesant",
            src: "./assets/labels/label_stuyvesant.png",
            relPos: [0.6108333333333333, 0.0837037037037037]
        },
        {
            name: "greenwich-village",
            src: "./assets/labels/label_greenwich_village.png",
            relPos: [0.49083333333333334, 0.23925925925925925]
        },
        {
            name: "east-village",
            src: "./assets/labels/label_east_village.png",
            relPos: [0.6308333333333334, 0.27037037037037037]
        },
        {
            name: "west-village",
            src: "./assets/labels/label_west_village.png",
            relPos: [0.4141666666666667, 0.35185185185185186]
        },
        {
            name: "soho",
            src: "./assets/labels/label_soho.png",
            relPos: [0.5208333333333334, 0.4140740740740741]
        },
        {
            name: "lower-east-side",
            src: "./assets/labels/label_lower_east_side.png",
            relPos: [0.6591666666666667, 0.4540740740740741]
        },
        {
            name: "tribeca",
            src: "./assets/labels/label_tribeca.png",
            relPos: [0.4575, 0.577037037037037]
        },
        {
            name: "chinatown",
            src: "./assets/labels/label_chinatown.png",
            relPos: [0.63, 0.662962962962963]
        },
        {
            name: "lower-manhattan",
            src: "./assets/labels/label_lower_manhattan.png",
            relPos: [0.5466666666666666, 0.74]
        }
    ],
    pin: {
        resolution: [168, 305], // The native resolution of the pins in pixels
        // width: 40 // The actual width of the pin in pixels (defined in stylesheet)
        width: 32 // The actual width of the pin in pixels (defined in stylesheet)
    },
    pins: [
        { // The names, sources, and relative positions of the pins to show on the map (the element property will be populated later)
            name: "pin1",
            src: "./pin1.html",
            relPos: [0.5, 0.5]
        }
    ]
}

// Calculated Constants (Map)

data.map.initialScale = calculateInitialScale(); // The initial scale of the map to fill the viewport
data.map.initialSize = [ // Calculate the initial size of the map-container from that scale factor...
    data.map.resolution[0] * data.map.initialScale, 
    data.map.resolution[1] * data.map.initialScale
]

function calculateInitialScale() { // Calculate a scale factor for the map to fill up the viewport...
    let viewportWidth = window.innerWidth; // Get the width of the viewport
    let viewportHeight = window.innerHeight; // Get the height of the viewport
    let viewportAspect = viewportWidth / viewportHeight; // Calculate the aspect ratio of the viewport
    let mapAspect = data.map.resolution[0] / data.map.resolution[1]; // Calculate the aspect ratio of the map
    if (viewportAspect < mapAspect) { // If the viewport is taller than the map,
        return viewportHeight / data.map.resolution[1]; // Set to height of the viewport
    }
    else { // If the viewport is wider than the map,
        return viewportWidth / data.map.resolution[0]; // Set to width of the viewport
    }
}

// Calculated Constants (Labels)

data.label.height = data.label.resolution[1] * (data.label.width / data.label.resolution[0]); // Determine the label height in pixels from the width and resolution
data.label.size = [data.label.width, data.label.height]; // Store the actual label size in pixels
data.label.offset = [data.label.size[0] / 2, data.label.size[1] / 2]; // Store the label offset in pixels (1/2 width, 1/2 height)

// Calculated Constants (Pins)

data.pin.height = data.pin.resolution[1] * (data.pin.width / data.pin.resolution[0]); // Determine the pin height in pixels from the width and resolution
data.pin.size = [data.pin.width, data.pin.height]; // Store the actual pin size in pixels
data.pin.offset = [data.pin.size[0] / 2, data.pin.size[1]]; // Store the pin offset in pixels (1/2 width, height)

// DOM OBJECT ------------------------------------------------------------------

let dom = {
    mapContainer: document.querySelector("#map-container"),
    labelsContainer: document.querySelector("#labels-container"),
    pinsContainer: document.querySelector("#pins-container")
}

// INITIALIZATION OF MAP, LABELS, & PINS -------------------------------------------

// Window

data.window.currentHypoteneuse = getWindowScaleByHypoteneuse(); // Calculate the current hypoteneuse of the window

// Map

sizeElement(dom.mapContainer, data.map.initialSize); // Size the map-container
centerElement(dom.mapContainer); // Center the map-container
data.map.currentHypoteneuse = getElementScaleByHypoteneuse(dom.mapContainer); // Calculate the current scale of the map-container
data.map.targetWindowCenterRelPos = absToRel([window.width / 2, window.height / 2]); // Calculate the relative position of the center of the window on the map

// Labels

for (let i = 0; i < data.labels.length; i++) { // For each label, create an element and store it in data.labels[i].element...
	data.labels[i].element = (makeLabelElement(data.labels[i]));
}
updateLabelPositions(); // Update the positions of all the labels (MAYBE MOVE)

function makeLabelElement(labelData) { // Create a label element and return it...
	let labelElement = document.createElement("img"); // Create a new image element
	labelElement.id = labelData.name; // Set the id of the element
	labelElement.classList.add("map-label"); // Add the map-label class to the element
	labelElement.src = labelData.src; // Set the source of the element
    labelElement.ondragstart = () => { return false; } // Disable dragging of the element
    dom.labelsContainer.appendChild(labelElement); // Append the element to the labels-container
    return labelElement;
}

function updateLabelPositions() { // Update the positions of all the labels...
	for (let i = 0; i < data.labels.length; i++) { // For each label
        let label = data.labels[i].element; // Get the label element
        let absPos = relToAbs(data.labels[i].relPos); // Convert its relative position to an absolute position
        let mapRect = dom.mapContainer.getBoundingClientRect(); // Get the current bounding rectangle of the map-container
        label.style.left = (absPos[0] - data.label.offset[0] - mapRect.left) + "px"; // Set the left position of the label
        label.style.top = (absPos[1] - data.label.offset[1] - mapRect.top) + "px"; // Set the top position of the label
    }
}

// Pins

for (let i = 0; i < data.pins.length; i++) { // For each pin, create an element and store it in data.pins[i].element...
    data.pins[i].element = (makePinElement(data.pins[i]));
}
updatePinPositions(); // Update the positions of all the pins (MAYBE MOVE)

function makePinElement(pinData) { // Create a pin element and return it...
    let pinElement = document.createElement("a"); // Create a new anchor element
    pinElement.id = pinData.name; // Set the id of the element
    pinElement.classList.add("map-pin"); // Add the map-pin class to the element
    pinElement.href = pinData.src; // Set the source of the element
    pinElement.ondragstart = () => { return false; } // Disable dragging of the element
    pinElement.style.height = data.pin.height + "px"; // Set the height of the element
    dom.pinsContainer.appendChild(pinElement); // Append the element to the pins-container
    console.log(pinElement);
    return pinElement;
}

function updatePinPositions() { // Update the positions of all the pins...
	for (let i = 0; i < data.pins.length; i++) { // For each pin
        let pin = data.pins[i].element; // Get the pin element
        let absPos = relToAbs(data.pins[i].relPos); // Convert its relative position to an absolute position
        let mapRect = dom.mapContainer.getBoundingClientRect(); // Get the current bounding rectangle of the map-container
        pin.style.left = (absPos[0] - data.pin.offset[0] - mapRect.left) + "px"; // Set the left position of the pin
        pin.style.top = (absPos[1] - data.pin.offset[1] - mapRect.top) + "px"; // Set the top position of the pin
    }
}

// EVENT LISTENERS & THEIR FUNCTIONS ------------------------------------------

// Debugging

if (isLogRelPos) window.addEventListener("mousedown", logRelPos); // Create a listener that calls logRelPos on mousedown

function logRelPos(e) { // Log the relative position of the cursor on mousedown...
    let relPos = absToRel([e.clientX, e.clientY]); // Convert the absolute position of the cursor to a relative position
    console.log(relPos); // Log the relative position
}

// Label Opacities

window.addEventListener('mousemove', updateLabelOpacities); // Create a listener that calls updateLabelOpacities on mousemove

function updateLabelOpacities(e) { // Update the opacities of the labels based on the distance between the cursor and the labels...
    let distances = []; // Prepare to store the distances between the cursor and the labels
    let point1 = [e.clientX, e.clientY];
    for (let i = 0; i < data.labels.length; i++) { // For each label,
        let point2 = getCenterOf(data.labels[i].element); // Set point2 to the center of the label
        distances.push( // Add to distances between points to the array (using Pythagorean theorem)...
            Math.abs( // The absolute value of
                Math.sqrt( // The square root of
                    Math.pow( // The square of
                        point2[0] - point1[0], 2 // The difference between the x-coordinates of the two points
                    ) + Math.pow( // Plus the square of
                        point2[1] - point1[1], 2 // The difference between the y-coordinates of the two points
                    )
                )
            )
        );
    }
    let maximumDistance = Math.max(...distances);
    let minimumDistance = Math.min(...distances);
    let normalizedDistances = distances.map( // Normalize the distances...
        (distance) => (distance - minimumDistance) / (maximumDistance - minimumDistance)
    );
    for (let i = 0; i < data.labels.length; i++) { // Set opacities of label elements based on normalized distances...
        let opacity = 1 - normalizedDistances[i];
        data.labels[i].element.style.opacity = opacity;
    }
}

// Zooming

window.addEventListener("wheel", mapScroll); // Create a listener that calls mapScroll on scroll

function mapScroll(event) { // Zoom in and out on the map on scroll
    let mouseAbsPos = [event.clientX, event.clientY] // Store the absolute position of the cursor
    if (event.deltaY > 0) zoomAndPositionMap(-1, mouseAbsPos) // If the scroll direction is down, zoom out
    else if (event.deltaY < 0) zoomAndPositionMap(1, mouseAbsPos) // If the scroll direction is up, zoom in
}

function zoomAndPositionMap(direction, mouseAbsPos) { // TODO: Refactor for readability
    let mapRect = dom.mapContainer.getBoundingClientRect(); // Get the current bounding rectangle of the map-container
    let mouseRelPos = absToRel(mouseAbsPos); // Convert the absolute position of the cursor to a relative position
    let multiplier = 0.05; // Set the zoom speed multiplier
    let newRelWidth = (direction * multiplier) + 1; // Get the new width and height of the map-container...
    let currentAbsWidth = mapRect.width;
    let newAbsWidth = currentAbsWidth * newRelWidth;
    let newRelHeight = (direction * multiplier) + 1;
    let currentAbsHeight = mapRect.height;
    let newAbsHeight = currentAbsHeight * newRelHeight;
    let newAbsSize = [newAbsWidth, newAbsHeight];
    let constrainedSize = constrainSizeToWindow(newAbsSize); // Constrain the new size of the map-container to the window
    sizeElement(dom.mapContainer, constrainedSize); // Set the new width and height of the map-container
    let absPosOfPrevRelPos = relToAbs(mouseRelPos); // Convert the old relative position of cursor to an absolute position
    mapRect = dom.mapContainer.getBoundingClientRect(); // Get the new bounding rectangle of the map-container
    let newMapPosition = [ // Calculate the new position of the map-container...
        mapRect.left + (-1 * (absPosOfPrevRelPos[0] - mouseAbsPos[0])),
        mapRect.top + (-1 * (absPosOfPrevRelPos[1] - mouseAbsPos[1]))
    ]
    position(dom.mapContainer, constrainPositionToWindow(newMapPosition)); // Set the new position of the map-container, constrained to the window
    updateLabelPositions(); // Update the positions of the labels
    updatePinPositions(); // Update the positions of the pins
    data.map.currentHypoteneuse = getElementScaleByHypoteneuse(dom.mapContainer); // Update the current scale of the map-container
    data.map.targetWindowCenterRelPos = absToRel([window.width / 2, window.height / 2]); // Update the current relative position of the map in the window
}

// Dragging

window.addEventListener('mousedown', dragStart); // Create listeners for mousedown, mouseup, and mousemove events...
window.addEventListener('mouseup', dragEnd);
window.addEventListener('mousemove', dragMove);

let drag = { // Store the dragging state and properties
    isDragging: false,
    currentX: null,
    currentY: null,
    initialX: null,
    initialY: null,
    xOffset: null,
    yOffset: null,
    element: dom.mapContainer // MAYBE replace with array? 
}

function dragStart(e) { // Start dragging the map-container...
    let mapRect = dom.mapContainer.getBoundingClientRect(); // Get the current bounding rectangle of the map-container
    drag.xOffset = mapRect.left; // Set the x offset of the map-container
    drag.yOffset = mapRect.top; // Set the y offset of the map-container
    drag.initialX = e.clientX - drag.xOffset; // Set the initial x position of the cursor
    drag.initialY = e.clientY - drag.yOffset; // Set the initial y position of the cursor
    if ( // TODO: Refactor this!
        e.target === drag.element || 
        e.target === document.querySelector("#map") || 
        e.target ===  dom.labelsContainer || 
        Array.from(dom.labelsContainer.children).includes(e.target) || // This especially
        e.target === document.querySelector("html") ||
        e.target === document.querySelector("#map-title")
    ) {
        drag.isDragging = true; // Set the dragging state to true if the target should be dragged (e.g. not a link or button)
    }
}

function dragMove(e) { // Move the map-container as the mouse moves...
    if (drag.isDragging) { // If the map-container is being dragged,
        e.preventDefault(); // Prevent the default behavior of the event
        drag.currentX = e.clientX - drag.initialX; // Calculate the current x and y positions of the cursor...
        drag.currentY = e.clientY - drag.initialY;
        drag.xOffset = drag.currentX; // Set the x and y offsets of the map-container to the current x and y positions of the cursor...
        drag.yOffset = drag.currentY;
        position(dom.mapContainer, constrainPositionToWindow([drag.currentX, drag.currentY])) // Position the map-container at the current x and y positions of the cursor
        updateLabelPositions(); // Update the positions of the labels
        updatePinPositions(); // Update the positions of the pins
        data.map.targetWindowCenterRelPos = absToRel([window.width / 2, window.height / 2]); // Update the current relative position of window center on the map
    }
}

function dragEnd(e) { // Stop dragging the map-container, reset the dragging state and properties...
    drag.initialX = drag.currentX;
    drag.initialY = drag.currentY;
    drag.isDragging = false;
}

// Resizing

window.addEventListener('resize', maintainRelativeCenterAndScale); // Create a listener that calls resizeAtRelativeScale on resize

function maintainRelativeCenterAndScale(e) { // Resize the map-container to maintain its current relative scale...
    data.map.temporaryWindowCenterRelPos = absToRel([window.width / 2, window.height / 2]); // Calculate the temporary relative position of the center of the window on the map
    positionElementByRelativeOffset(dom.mapContainer, data.map.temporaryWindowCenterRelPos, data.map.targetWindowCenterRelPos); // Position the map-container at the temporary relative position of the center of the window
}

// UTILITIES -------------------------------------------------------------------

// Sizing and Positioning

function sizeElement(element, size) { // Size an element to a specific size...
    element.style.width = size[0] + "px"; // Set the width of the element
    if (size[1] != null) element.style.height = size[1] + "px"; // Set the height of the element if it's not null
}

function position(element, absPos) { // Position an element at an absolute position...
    element.style.left = absPos[0] + "px";
    element.style.top = absPos[1] + "px";
}

function centerElement(element) { // Center an element in the window TODO: Involve getCenterOf for clarity!
    let windowWidth = window.innerWidth; // Get the window and element dimensions...
    let windowHeight = window.innerHeight;
    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;
    let absPos = [(windowWidth - elementWidth) / 2, (windowHeight - elementHeight) / 2] // Calculate the center position of the element in the window
    position(element, absPos); // Position the element at the center
}

function getCenterOf(element) { // Get the center position of an element...
    let rect = element.getBoundingClientRect();
    return [rect.left + (rect.width / 2), rect.top + (rect.height / 2)];
}

function constrainPositionToWindow(absPos) { // Constrain a position to the window...
    let windowWidth = window.innerWidth; // Get the window dimensions
    let windowHeight = window.innerHeight;
    let elementWidth = dom.mapContainer.offsetWidth; // Get the element dimensions
    let elementHeight = dom.mapContainer.offsetHeight;
    let left = absPos[0]; // Get the left and top positions of the element
    let top = absPos[1];
    if (left > 0) left = 0; // Constrain the left and top positions of the element
    if (top > 0) top = 0;
    if (left < windowWidth - elementWidth) left = windowWidth - elementWidth;
    if (top < windowHeight - elementHeight) top = windowHeight - elementHeight;
    return [left, top]; // Return the constrained position
}

function constrainSizeToWindow(absSize) { // Constrain a size to only ever be larger than the window, ensuring aspect ratio is maintained...
    let windowWidth = window.innerWidth; // Get the window dimensions
    let windowHeight = window.innerHeight;
    let width = absSize[0]; // Get the width and height of the element
    let height = absSize[1];
    if (width < windowWidth) {
        width = windowWidth; // Set the width to the window width
        height = (windowWidth / absSize[0]) * absSize[1] // Set the height to maintain the aspect ratio
    }
    if (height < windowHeight) {
        height = windowHeight; // Set the height to the window height
        width = (windowHeight / absSize[1]) * absSize[0] // Set the width to maintain the aspect ratio
    }
    return [width, height]; // Return the constrained size
}

function getWindowScaleByHypoteneuse() { // Get the window scale by the hypoteneuse of the window dimensions...
    return Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
}

function getElementScaleByHypoteneuse(element) { // Get the scale of an element by the hypoteneuse of its dimensions...
    let rect = element.getBoundingClientRect();
    return Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2));
}

// Absolute and Relative Conversion

function relToAbs(relPos) { // Convert a relative position to an absolute position...
    let mapRect = dom.mapContainer.getBoundingClientRect();
    return [
        mapRect.left + (relPos[0] * mapRect.width),
        mapRect.top + (relPos[1] * mapRect.height)
    ]
}

function absToRel(absPos) { // Convert an absolute position to a relative position...
    let mapRect = dom.mapContainer.getBoundingClientRect();
    return [
        (absPos[0] - mapRect.left) / mapRect.width,
        (absPos[1] - mapRect.top) / mapRect.height
    ]
}

function windowRelToAbs(relPos) {
    return [
        relPos[0] * window.innerWidth,
        relPos[1] * window.innerHeight
    ]
}

function windowAbsToRel(absPos) {
    return [
        absPos[0] / window.innerWidth,
        absPos[1] / window.innerHeight
    ]
}

function positionElementByRelativeOffset(element, relPos1, relPos2) {
    let mapRect = dom.mapContainer.getBoundingClientRect();
    let relDifference = [relPos2[0] - relPos1[0], relPos2[1] - relPos1[1]];
    let absDifference = [relDifference[0] * mapRect.width, relDifference[1] * mapRect.height];
    let eRect = element.getBoundingClientRect();
    let absPos = [eRect.left + absDifference[0], eRect.top + absDifference[1]];
    position(element, absPos);
}