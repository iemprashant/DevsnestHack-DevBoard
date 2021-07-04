const canv = document.getElementById('canvas')
const toolbox = document.getElementById('toolbox')
const canvascontext = canv.getContext('2d')
const defaultcolour = document.getElementById('boardcolor').value
var undoArray = []
var undoArrayIndex
var full_screen = false
var loc = { x: 0, y: 0 }
var controlPoint = { x: 0, y: 0 }
var strok = false


function init() {
    setCanvasSize()
    setBoardColour(defaultcolour)
    canvasEventSetup()
    canv.style.cursor = 'url("./icons/pencursor.png"), auto'
    toolbox.style.cursor = 'pointer'
    buttonStateCheck()
}

function setCanvasSize() {
    var originalsize = canvascontext.getImageData(0, 0, canv.width, canv.height)
    canv.width = window.innerWidth - 40
    canv.height = window.innerHeight - 90
    canvascontext.putImageData(originalsize, 0, 0, 0, 0, canv.width, canv.height)
}

function setBoardColour(setcolour) {
    canv.style.backgroundColor = setcolour
    canvascontext.fillStyle = setcolour
    canvascontext.fillRect(0, 0, canv.width, canv.height)
}

// Board clourpicker Btn function
function boardcolourpicker(target) {
    setBoardColour(target.value)
}

// get cursor location on click`
function cursorlocator(event) {
    loc.x = event.clientX - canv.offsetLeft
    loc.y = event.clientY - canv.offsetTop
}

function canvasEventSetup() {
    canv.addEventListener('mousedown', start_draw)
    canv.addEventListener('mouseup', stop_draw)
    canv.addEventListener('mouseout', stop_draw)
    canv.addEventListener('mouseup', updateActionToUndoArray)
    canv.addEventListener('pointerdown', start_draw)
    canv.addEventListener('pointermove', draw)
    canv.addEventListener('pointerup', stop_draw)
    canv.addEventListener('pointerup', updateActionToUndoArray)
    canv.addEventListener('pointerout', stop_draw)
}

// working of Undo
function buttonStateCheck() {
    if (undoArrayIndex == 0) {
        document.getElementById('undobtn').disabled = true
    }
    if (undoArrayIndex > 0) {
        document.getElementById('undobtn').disabled = false
    }
    // if (undoArrayIndex == undo_arr.length - 1) {
    //     document.getElementById('action9').disabled = true
    // }
    // if (undoArrayIndex < undo_arr.length - 1) {
    //     document.getElementById('action9').disabled = false
    // }
    //number of undo's that can be done
    if (undoArray.length > 3) {
        undoArray.splice(0, undoArray.length - 3)
    }
}

function updateActionToUndoArray() {
    var currentState = canvascontext.getImageData(0, 0, canv.width, canv.height)
    if (undoArrayIndex < undoArray.length) {
        undoArray.splice(undoArrayIndex + 1, undoArray.length - undoArrayIndex - 1)
    }
    undoArray.push(currentState)
    undoArrayIndex = undoArray.length - 1
}

function undo() {
    if (undoArrayIndex > 0) {
        undoArrayIndex -= 1
        canvascontext.putImageData(undoArray[undoArrayIndex], 0, 0)
    }
    buttonStateCheck()
}

function redo() {
    if (undoArrayIndex < undoArray.length) {
        undoArrayIndex++
        canvascontext.putImageData(undoArray[undoArrayIndex], 0, 0)
    }
    buttonStateCheck()
}

// load stroke details
function loadStrokedetails(canvascontext_name) {
    canvascontext_name.lineCap = 'round'
    canvascontext_name.lineWidth = document.getElementById('strokewidth').value
    canvascontext_name.strokeStyle = document.getElementById('strokecolor').value
    canvascontext_name.lineJoin = 'round'
}
// drawing function
function start_draw(event) {
    event.preventDefault()
    cursorlocator(event)
    loadStrokedetails(canvascontext)
    strok = true
}

function stop_draw(event) {
    strok = false
}

function draw(event) {
    if (!strok) {
        return
    }
    canvascontext.beginPath()
    canvascontext.moveTo(loc.x, loc.y)
    controlPoint.x = loc.x
    controlPoint.y = loc.y
    cursorlocator(event)
    controlPoint.x = (controlPoint.x + loc.x) / 2
    controlPoint.y = (controlPoint.y + loc.y) / 2
    cursorlocator(event)
    canvascontext.quadraticCurveTo(controlPoint.x, controlPoint.y, loc.x, loc.y)
    canvascontext.stroke()
    canvascontext.closePath()
}

// clear btn function
function clearPage() {
    canvascontext.clearRect(0, 0, canv.width, canv.height)
    canvascontext.fillStyle = document.getElementById('boardcolor').value
    canvascontext.fillRect(0, 0, canv.width, canv.height)
}

function savecanvas() {
    alert("hello")
    var image = canv.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "devnestWhiteboard.png";
    link.href = image;
    link.click();
}
document.onload = init()