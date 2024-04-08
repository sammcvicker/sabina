// TODO: Merge translateMapContainer and positionMapContainer into one function; deprecate translateMapContainer
// TODO: Keep the map where it is at its current relative scale on window resize
// TODO: Implement a function to create pins from array of objects
// TODO: Implement a function to update pin positions

// Create an object that stores the label positions, names, and alt-text
let labels = [
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

// Store the label resolution in pixels
let labelResolution = [700, 216];

// Store the actual label width in pixels
let labelWidth = 264;

// Store the actual label size in pixels
let labelSize = [labelWidth, labelResolution[1] * (labelWidth / labelResolution[0])];

// Store the label offset in pixels
let labelOffset = [labelSize[0] / 2, labelSize[1] / 2];

// Get the map-container from the DOM
let mapContainer = document.querySelector("#map-container");

// Get the map-overlay and its img from the DOM
let mapOverlay = document.querySelector("#map-overlay");
let mapOverlayImg = document.querySelector("#map-overlay img");

// Get the map-labels from the DOM
let mapLabels = document.querySelector("#map-labels");

// Store the map's native resolution
let mapResolution = [4800, 2700];

// Store the initial map-container scale
// TODO: Make sure the map loads at the right scale!
let initialMapConatinerScale = 0.25;

// Set the initial map-container size
let initialMapContainerSize = [mapResolution[0] * initialMapConatinerScale, mapResolution[1] * initialMapConatinerScale];

// Size and center the map-container
sizeElement(mapContainer, initialMapContainerSize);
centerElement(mapContainer);

// Create the labels on the map.
for (let i = 0; i < labels.length; i++) {
	makeLabel(labels[i]);
}

// Update the scales of all the labels
// updateLabelScales();

// Update the positions of all the labels
updateLabelPositions();

function makeLabel(labelData) {
	let label = document.createElement("img");
	label.id = labelData.name;
	label.classList.add("map-label");
	label.src = labelData.src;
    label.ondragstart = () => { return false; }
    let mapLabels = document.querySelector("#map-labels");
    mapLabels.appendChild(label);
}

// function updateLabelScales() {
//     let mapRect = mapContainer.getBoundingClientRect();
//     let mapWidth = mapRect.width;
//     let scaleFactor = mapWidth / mapResolution[0];
//     let newLabelWidth = labelResolution[0] * scaleFactor;
//     for (let i = 0; i < labels.length; i++) {
//         let label = document.querySelector("#" + labels[i].name);
//         sizeElement(label, [newLabelWidth, null]);
//     }
// }

function updateLabelPositions() {
	for (let i = 0; i < labels.length; i++) {
        let label = document.querySelector("#" + labels[i].name);
        let absPos = relToAbs(labels[i].relPos);
        let mapRect = mapContainer.getBoundingClientRect();
        label.style.left = (absPos[0] - labelOffset[0] - mapRect.left) + "px";
        label.style.top = (absPos[1] - labelOffset[1] - mapRect.top) + "px";
        // label.style.left = (absPos[0]) + "px";
        // label.style.top = (absPos[1]) + "px";
    }
}

onwheel = (event) => {
    let mouseAbsPos = [event.clientX, event.clientY]
    if (event.deltaY > 0) mapOnScroll(-1, mouseAbsPos)
    else if (event.deltaY < 0) mapOnScroll(1, mouseAbsPos)
}

// Log the relative position of the cursor on mousemove anywhere within the window
window.addEventListener("mousedown", (e) => {
    let relPos = absToRel([e.clientX, e.clientY]);
    // console.log(relPos);
})

// Store the pins to create them dynamically.
let pins = [
    {
        name: "pin 1",
        relPos: [0.5, 0.5]
    },
    {
        name: "pin 2",
        relPos: [0.7, 0.3]
    }
]

// Define an offset to accurately position the pin placed (1/2 width, full height)
let pinOffset = [20, 80]

function sizeElement(element, size) {
    element.style.width = size[0] + "px";
    if (size[1] != null) element.style.height = size[1] + "px";
}

function centerElement(element) {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;
    element.style.left = (windowWidth - elementWidth) / 2 + "px";
    element.style.top = (windowHeight - elementHeight) / 2 + "px";
}

function relToAbs(relPos) {
    let mapRect = mapContainer.getBoundingClientRect();
    return [
        mapRect.left + (relPos[0] * mapRect.width),
        mapRect.top + (relPos[1] * mapRect.height)
    ]
}

function absToRel(absPos) {
    let mapRect = mapContainer.getBoundingClientRect();
    return [
        (absPos[0] - mapRect.left) / mapRect.width,
        (absPos[1] - mapRect.top) / mapRect.height
    ]
}

function mapOnScroll(direction, mouseAbsPos) {
    let mapRect = mapContainer.getBoundingClientRect();
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
    sizeElement(mapContainer, [newAbsWidth, newAbsHeight]);
    // Translate the map-container relative to the previous relative mouse position
    let absPosOfPrevRelPos = relToAbs(mouseRelPos)
    let absPosDifference = [
        -1 * (absPosOfPrevRelPos[0] - mouseAbsPos[0]),
        -1 * (absPosOfPrevRelPos[1] - mouseAbsPos[1])
    ]
    translateMapContainer(absPosDifference);
    updateLabelPositions();
}

function translateMapContainer(dimensions) {
    let mapRect = mapContainer.getBoundingClientRect();
    mapContainer.style.left = mapRect.left + dimensions[0] + "px";
    mapContainer.style.top = mapRect.top + dimensions[1] + "px";
    updateLabelPositions();
}

function positionMapContainer(position) {
    mapContainer.style.left = position[0] + "px";
    mapContainer.style.top = position[1] + "px";
    updateLabelPositions();
}

// Dragging and panning the map-container

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset;
let yOffset;
const dragElement = mapContainer;

window.addEventListener('mousedown', dragStart);
window.addEventListener('mouseup', dragEnd);
window.addEventListener('mousemove', drag);

function dragStart(e) {
    xOffset = mapContainer.getBoundingClientRect().left;
    yOffset = mapContainer.getBoundingClientRect().top;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
	let relPos = absToRel([e.clientX, e.clientY]);
	console.log(relPos);
    // let mapLabelsChildren = mapLabels.children;
    // if (mapLabels.children.includes(e.target)) {}
    if (
        e.target === dragElement || 
        e.target === document.querySelector("#map") || 
        e.target ===  mapLabels || 
        Array.from(mapLabels.children).includes(e.target) || 
        e.target === document.querySelector("html")
    ) {
        isDragging = true;
    }
}

function drag(e) {
    let distances = [];
    let labelElements = [];
    for (let i = 0; i < labels.length; i++) {
        let label = document.querySelector("#" + labels[i].name);
        labelElements.push(label);
        let labelCenter = getCenterPositionOfLabel(label);
        distances.push(getDistanceBetweenPoints([e.clientX, e.clientY], labelCenter));
    }
    let maximumDistance = Math.max(...distances);
    let minimumDistance = Math.min(...distances);
    let normalizedDistances = distances.map((distance) => (distance - minimumDistance) / (maximumDistance - minimumDistance));
    // Set opacities of elements based on normalized distances
    for (let i = 0; i < labelElements.length; i++) {
        let opacity = 1 - normalizedDistances[i];
        labelElements[i].style.opacity = opacity;
    }
    closestLabel = findClosestLabelToPoint([e.clientX, e.clientY]);
    let shownLabels = document.querySelectorAll(".label-shown");
    for (let i = 0; i < shownLabels.length; i++) {
        if (shownLabels[i] !== closestLabel) shownLabels[i].classList.remove("label-shown");
    }
    // closestLabel.classList.add("label-shown");
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        positionMapContainer([currentX, currentY]);
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
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