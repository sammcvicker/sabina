// Get the map-container from the DOM
let mapContainer = document.querySelector("#map-container");

// Get the map-overlay and its img from the DOM
let mapOverlay = document.querySelector("#map-overlay");
let mapOverlayImg = document.querySelector("#map-overlay img");

// Store the map's native resolution
let mapResolution = [4800, 2700];

// Store the initial map-container scale
let initialMapConatinerScale = 0.25;

// Set the initial map-container size
let initialMapContainerSize = [mapResolution[0] * initialMapConatinerScale, mapResolution[1] * initialMapConatinerScale];

// Size and center the map-container
sizeElement(mapContainer, initialMapContainerSize);
centerElement(mapContainer);

onwheel = (event) => {
    let mouseAbsPos = [event.clientX, event.clientY]
    if (event.deltaY > 0) mapOnScroll(-1, mouseAbsPos)
    else if (event.deltaY < 0) mapOnScroll(1, mouseAbsPos)
}

// Log the relative position of the cursor on mousemove anywhere within the window
// window.addEventListener("mousemove", (e) => {
//     let relPos = absToRel([e.clientX, e.clientY]);
//     console.log(relPos);
// })

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
}

function translateMapContainer(dimensions) {
    let mapRect = mapContainer.getBoundingClientRect();
    mapContainer.style.left = mapRect.left + dimensions[0] + "px";
    mapContainer.style.top = mapRect.top + dimensions[1] + "px";
}

function positionMapContainer(position) {
    mapContainer.style.left = position[0] + "px";
    mapContainer.style.top = position[1] + "px";
}

// Dragging / panning the map-container

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
    if (e.target === dragElement || e.target ===  mapOverlay || e.target === mapOverlayImg || e.target === document.querySelector("html")) {
        isDragging = true;
    }
}

function drag(e) {
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