// Get the map object from the DOM
let map = document.querySelector("#map-container");


// TODO: Add links to each of the pins that reference actual pages.
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

// Define an offset to accurately position the pin placed
let pinOffset = [20, 80] // 1/2 width, full height

centerElement(map)
placePins()

// Update the pin positions whenever we resize the window
window.onresize = updatePinPositions

// Make a new pin and log its relative position in the console when we click on the map
// map.onclick = clickFunction

function placePins() { // argumentless function for easy callable
    for (let i = 0; i < pins.length; i++) { // for each pin
        pins[i].element = makePin(pins[i].name); // make it and add it to the pins object
    }
    updatePinPositions() // then update all their positions
}

function makePin(pinName) {
    let pin = document.createElement("a");
    pin.href = "./detail.html"
    pin.id = pinName
    pin.classList.add("pin")
    document.body.append(pin)
    return pin
}

function makeNewPin(relPos, pinName) {
    let newPin = {
        "name": pinName,
        "relPos": relPos,
        "element": makePin(pinName)
    }
    pins.push(newPin)
    updatePinPositions()
}

function updatePinPosition(mapRect, pin, relPos) {
    pin.style.left = relToAbs(mapRect, relPos)[0] - pinOffset[0] + "px"
    pin.style.top = relToAbs(mapRect, relPos)[1] - pinOffset[1] + "px"
}

function updatePinPositions() {
    let mapRect = map.getBoundingClientRect();
    for (let i = 0; i < pins.length; i++) {
        updatePinPosition(mapRect, pins[i].element, pins[i].relPos)
    }
}

function relToAbs(mapRect, relPos) {
    return [
        mapRect.left + (relPos[0] * mapRect.width),
        mapRect.top + (relPos[1] * mapRect.height)
    ]
}

function absToRel(mapRect, absPos) {
    return [
        Math.round(100 * ((absPos[0] - mapRect.left) / mapRect.width)) / 100, 
        Math.round(100 * ((absPos[1] - mapRect.top) / mapRect.height)) / 100
    ]
}

function clickFunction(event) {
    var relPos = absToRel(event.target.getBoundingClientRect(), [event.clientX, event.clientY])
    makeNewPin(relPos, "nameless pin")
}

// --------

// Zooming

onwheel = (event) => {
    if (event.deltaY > 0) resizeMap(-1)
    else if (event.deltaY < 0) resizeMap(1)
}

function resizeMap(direction) {
    let multiplier = 0.1
    let newRelWidth = (direction * multiplier) + 1
    let currentAbsWidth = map.getBoundingClientRect().width
    let newAbsWidth = currentAbsWidth * newRelWidth
    map.style.width = newAbsWidth + "px"
    centerElement(map)
    updatePinPositions()
}

function centerElement(element) {
    if (element) {
      // Get the element's dimensions
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;
  
      // Get the window's dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      // Calculate the top and left positions for centering
      const top = (windowHeight - elementHeight) / 2;
      const left = (windowWidth - elementWidth) / 2;
  
      // Set the element's position and styles
      element.style.position = 'fixed';
      element.style.top = `${top}px`;
      element.style.left = `${left}px`;
    }
}

// Panning

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
const dragElement = map;

window.addEventListener('mousedown', dragStart);
window.addEventListener('mouseup', dragEnd);
window.addEventListener('mousemove', drag);

function dragStart(e) {
  initialX = e.clientX - xOffset;
  initialY = e.clientY - yOffset;

  if (e.target === dragElement || e.target === document.querySelector("html")) {
    isDragging = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dragElement);

    updatePinPositions();
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}