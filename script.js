let map = document.querySelector("#map");

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

let pinOffset = [10, 10] // in pixels

placePins()

window.onresize = updatePinPositions
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

// TODO: adjust position by size of pin.