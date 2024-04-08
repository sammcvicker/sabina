// TODO ---------------------------
// TODO: Merge translateMapContainer and positionMapContainer into one function; deprecate translateMapContainer
// TODO: Keep the map where it is at its current relative scale on window resize
// TODO: Implement a function to create pins from array of objects
// TODO: Implement a function to update pin positions
// TODO: Make sure the container loads at the right scale initially!

// DEBUGGING ------------------------

let isLogRelPos = true; // Log the relative position of the cursor on mousedown

// DATA OBJECT --------------------------
// ------------- INITIAL CONSTANTS
let data = {
    map: {
        resolution: [4800, 2700], // The native resolution of the map in pixels
        initialScale: 0.25, // The initial scale of the map (TO BE DEPRECATED)
    },
    label: {
        resolution: [700, 216], // The native resolution of the labels in pixels
        width: 264 // The actual width of the label in pixels (defined in stylesheet)
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
    ]
}
// ------------- CALCULATED CONSTANTS (MAP)
data.map.initialSize = [ // Calculate the initial size of the map-container
    data.map.resolution[0] * data.map.initialScale, 
    data.map.resolution[1] * data.map.initialScale
]
// ------------- CALCULATED CONSTANTS (LABELS)
data.label.height = data.label.resolution[1] * (data.label.width / data.label.resolution[0]); // Determine the label height in pixels from the width and resolution
data.label.size = [data.label.width, data.label.height]; // Store the actual label size in pixels
data.label.offset = [data.label.size[0] / 2, data.label.size[1] / 2]; // Store the label offset in pixels (1/2 width, 1/2 height)

// DOM OBJECT --------------------------------
let dom = {
    mapContainer: document.querySelector("#map-container"),
    labelsContainer: document.querySelector("#labels-container")
}

// MAP CONTAINER SETUP ----------------------
sizeElement(dom.mapContainer, data.map.initialSize); // Size the map-container
centerElement(dom.mapContainer); // Center the map-container

// LABEL CREATION ---------------------------
for (let i = 0; i < data.labels.length; i++) { // For each label
	data.labels[i].element = (makeLabelElement(data.labels[i])); // Create an element and store it in data.labels[i].element
}
updateLabelPositions(); // Update the positions of all the labels (MAYBE MOVE)

// ----------------- FUNCTIONS IN ORDER OF APPEARANCE -----------------

function sizeElement(element, size) {
    element.style.width = size[0] + "px"; // Set the width of the element
    if (size[1] != null) element.style.height = size[1] + "px"; // Set the height of the element if it's not null
}

function centerElement(element) {
    // Get the window and element dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;
    // ...
    element.style.left = (windowWidth - elementWidth) / 2 + "px"; // Center the element horizontally
    element.style.top = (windowHeight - elementHeight) / 2 + "px"; // Center the element vertically
}

function makeLabelElement(labelData) {
	let labelElement = document.createElement("img"); // Create a new image element
	labelElement.id = labelData.name; // Set the id of the element
	labelElement.classList.add("map-label"); // Add the map-label class to the element
	labelElement.src = labelData.src; // Set the source of the element
    labelElement.ondragstart = () => { return false; } // Disable dragging of the element
    dom.labelsContainer.appendChild(labelElement); // Append the element to the labels-container
    return labelElement;
}

function updateLabelPositions() {
	for (let i = 0; i < data.labels.length; i++) { // For each label
        let label = data.labels[i].element; // Get the label element
        let absPos = relToAbs(data.labels[i].relPos); // Convert its relative position to an absolute position
        let mapRect = dom.mapContainer.getBoundingClientRect(); // Get the current bounding rectangle of the map-container
        label.style.left = (absPos[0] - data.label.offset[0] - mapRect.left) + "px"; // Set the left position of the label
        label.style.top = (absPos[1] - data.label.offset[1] - mapRect.top) + "px"; // Set the top position of the label
    }
}

// EVENT LISTENERS ---------------------------
// -------------------------- DEBUGGING EVENTS
if (isLogRelPos) window.addEventListener("mousedown", logRelPos); // Log the relative position of the cursor on mousedown
// ----------------------------------- ZOOMING
window.addEventListener("wheel", mapScroll); // Zoom in and out on the map on scroll
// ----------------------------------- DRAGGING
window.addEventListener('mousedown', dragStart);
window.addEventListener('mouseup', dragEnd);
window.addEventListener('mousemove', dragMove);

// CALLABLES ---------------------------------

function logRelPos(e) { // Log the relative position of the cursor on mousedown
    let relPos = absToRel([e.clientX, e.clientY]); // Convert the absolute position of the cursor to a relative position
    console.log(relPos); // Log the relative position
}

function mapScroll(event) { // Zoom in and out on the map on scroll
    let mouseAbsPos = [event.clientX, event.clientY] // Store the absolute position of the cursor
    if (event.deltaY > 0) mapOnScroll(-1, mouseAbsPos) // If the scroll direction is down, zoom out
    else if (event.deltaY < 0) mapOnScroll(1, mouseAbsPos) // If the scroll direction is up, zoom in
}

// ----------------------------------- DRAGGING

let drag = {
    isDragging: false,
    currentX: null,
    currentY: null,
    initialX: null,
    initialY: null,
    xOffset: null,
    yOffset: null,
    element: dom.mapContainer
}

function dragStart(e) {
    drag.xOffset = dom.mapContainer.getBoundingClientRect().left;
    drag.yOffset = dom.mapContainer.getBoundingClientRect().top;
    drag.initialX = e.clientX - drag.xOffset;
    drag.initialY = e.clientY - drag.yOffset;
	let relPos = absToRel([e.clientX, e.clientY]);
    if ( // TODO: Refactor this!
        e.target === drag.element || 
        e.target === document.querySelector("#map") || 
        e.target ===  dom.labelsContainer || 
        Array.from(dom.labelsContainer.children).includes(e.target) || // This especially
        e.target === document.querySelector("html")
    ) {
        drag.isDragging = true;
    }
}

function dragMove(e) {
    updateLabelOpacities([e.clientX, e.clientY]);
    if (drag.isDragging) {
        e.preventDefault();
        drag.currentX = e.clientX - drag.initialX;
        drag.currentY = e.clientY - drag.initialY;
        drag.xOffset = drag.currentX;
        drag.yOffset = drag.currentY;
        positionMapContainer([drag.currentX, drag.currentY]);
    }
}

function dragEnd(e) {
    drag.initialX = drag.currentX;
    drag.initialY = drag.currentY;
    drag.isDragging = false;
}

function relToAbs(relPos) { // Convert a relative position to an absolute position
    let mapRect = dom.mapContainer.getBoundingClientRect();
    return [
        mapRect.left + (relPos[0] * mapRect.width),
        mapRect.top + (relPos[1] * mapRect.height)
    ]
}

function absToRel(absPos) {
    let mapRect = dom.mapContainer.getBoundingClientRect();
    return [
        (absPos[0] - mapRect.left) / mapRect.width,
        (absPos[1] - mapRect.top) / mapRect.height
    ]
}

function mapOnScroll(direction, mouseAbsPos) {
    let mapRect = dom.mapContainer.getBoundingClientRect();
    let mouseRelPos = absToRel(mouseAbsPos);
    let multiplier = 0.1;
    // Get the new width and height of the map-container
    let newRelWidth = (direction * multiplier) + 1;
    let currentAbsWidth = mapRect.width;
    let newAbsWidth = currentAbsWidth * newRelWidth;
    let newRelHeight = (direction * multiplier) + 1;
    let currentAbsHeight = mapRect.height;
    let newAbsHeight = currentAbsHeight * newRelHeight;
    // Resize the map-container
    sizeElement(dom.mapContainer, [newAbsWidth, newAbsHeight]);
    // Translate the map-container relative to the previous relative mouse position
    let absPosOfPrevRelPos = relToAbs(mouseRelPos)
    mapRect = dom.mapContainer.getBoundingClientRect();
    let newMapPosition = [
        mapRect.left + (-1 * (absPosOfPrevRelPos[0] - mouseAbsPos[0])),
        mapRect.top + (-1 * (absPosOfPrevRelPos[1] - mouseAbsPos[1]))
    ]
    positionMapContainer(newMapPosition);
}

function positionMapContainer(position) {
    dom.mapContainer.style.left = position[0] + "px";
    dom.mapContainer.style.top = position[1] + "px";
    updateLabelPositions();
}

// Dragging and panning the map-container



function updateLabelOpacities(mousePos) {
    let distances = [];
    let labelElements = [];
    for (let i = 0; i < data.labels.length; i++) {
        let label = document.querySelector("#" + data.labels[i].name);
        labelElements.push(label);
        let labelCenter = getCenterPositionOfLabel(label);
        distances.push(getDistanceBetweenPoints([mousePos[0], mousePos[1]], labelCenter));
    }
    let maximumDistance = Math.max(...distances);
    let minimumDistance = Math.min(...distances);
    let normalizedDistances = distances.map((distance) => (distance - minimumDistance) / (maximumDistance - minimumDistance));
    // Set opacities of elements based on normalized distances
    for (let i = 0; i < labelElements.length; i++) {
        let opacity = 1 - normalizedDistances[i];
        labelElements[i].style.opacity = opacity;
    }
}

function getCenterPositionOfLabel(label) {
    let labelRect = label.getBoundingClientRect();
    return [labelRect.left + (labelRect.width / 2), labelRect.top + (labelRect.height / 2)];
}

function getDistanceBetweenPoints(point1, point2) {
    return Math.abs(Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2)));
}

function findClosestLabelToPoint(point) {
    let closestLabel = null;
    let closestDistance = Infinity;
    for (let i = 0; i < labels.length; i++) {
        let label = document.querySelector("#" + labels[i].name);
        let labelCenter = getCenterPositionOfLabel(label);
        let distance = getDistanceBetweenPoints(point, labelCenter);
        if (distance < closestDistance) {
            closestLabel = label;
            closestDistance = distance;
        }
    }
    return closestLabel;
}

// ----------- OLD DEPRECATED STUFF ----------------

// Store the pins to create them dynamically.
// let pins = [
//     {
//         name: "pin 1",
//         relPos: [0.5, 0.5]
//     },
//     {
//         name: "pin 2",
//         relPos: [0.7, 0.3]
//     }
// ]

// Define an offset to accurately position the pin placed (1/2 width, full height)
// let pinOffset = [20, 80]