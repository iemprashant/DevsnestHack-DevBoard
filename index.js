const canv = document.getElementById('canvas')
const toolbox = document.getElementById('toolbox')
const clearbtn = document.getElementById('clearbtn')
const undobtn = document.getElementById('undobtn')
const redobtn = document.getElementById('redobtn')
const strokecolourbutton = document.getElementById("strokecolor")
const currentstrokewidth = document.getElementById("strokewidth")
const currentstrokecolor = document.getElementById('strokecolor')
const eraser = document.getElementById('eraser')
const pencil = document.getElementById('pencil')
const canvascontext = canv.getContext('2d')
const defaultcolour = document.getElementById('boardcolor').value
var undoArray = []
var undoArrayIndex = 0;
var full_screen = false
var loc = { x: 0, y: 0 }
var controlPoint = { x: 0, y: 0 }
var strok = false
var firstcheck = false;


function init() {
    if (!firstcheck) {
        buttonStateCheck()
        firstcheck = true;
    }
    setCanvasSize()
    setBoardColour(defaultcolour)
    canvasEventSetup()
    canv.style.cursor = 'url("./assets/pencursor.png"), auto'
    toolbox.style.cursor = 'pointer'
    startPencil()
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
    canv.addEventListener('mouseup', auxillaryStopDraw())
    canv.addEventListener('pointerdown', start_draw)
    canv.addEventListener('pointermove', draw)
    canv.addEventListener('pointerup', stop_draw)
    canv.addEventListener('pointerup', auxillaryStopDraw())
    canv.addEventListener('pointerout', stop_draw)
}

// working of Undo
function buttonStateCheck() {
    if (undoArrayIndex < 1) {
        undobtn.classList.add("disabled")
        redobtn.classList.add("disabled")
    } else if (undoArray.length >= 1) {
        undobtn.classList.remove("disabled")
        redobtn.classList.add("disabled")
    } else if (undoArrayIndex == undoArray.length - 1) {
        redobtn.classList.add("disabled")
    } else if (undoArrayIndex < undoArray.length - 1) {
        redobtn.classList.remove("disabled")
        redobtn.disabled = false;
    }
    //number of undo's that can be done
    if (undoArray.length > 3) {
        undoArray.splice(0, undoArray.length - 3)
    }
}

function auxillaryStopDraw() {
    strok = false
    updateActionToUndoArray()
}

function updateActionToUndoArray() {
    strok = false
    var currentState = canvascontext.getImageData(0, 0, canv.width, canv.height)
    if (undoArrayIndex < undoArray.length) {
        undoArray.splice(undoArrayIndex + 1, undoArray.length - undoArrayIndex - 1)
    }
    undoArray.push(currentState)
    undoArrayIndex = undoArray.length - 1
    if (firstcheck) {
        buttonStateCheck()
    }
}

function undo() {
    if (undoArrayIndex > 0) {
        undoArrayIndex -= 1
        canvascontext.putImageData(undoArray[undoArrayIndex], 0, 0)
    }
    if (firstcheck) {
        buttonStateCheck()
    }

}

function redo() {
    if (undoArrayIndex < undoArray.length) {
        undoArrayIndex++
        canvascontext.putImageData(undoArray[undoArrayIndex], 0, 0)
    }
    if (firstcheck) {
        buttonStateCheck()
    }
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

// SHifting and working of pen eraser 
var penstrokewidth = 5;
var penstrokecolor;
var eraserstrokewidth = 30;
var eraserstrokecolor = document.getElementById("boardcolor").value;
var lstrokewidth = document.getElementById("strokewidth").value;
var lstrokecolor = document.getElementById('strokecolor').value;

function startEraser() {
    strokecolourbutton.disabled = true;
    strokecolourbutton.classList.add("disabled")
    canv.style.cursor = "url('./assets/eraser.svg'),auto";
    tool_toggler();
    isEraserOn = true;
    currentstrokewidth.value = eraserstrokewidth;
    currentstrokecolor.value = eraserstrokecolor;
    eraser.style.backgroundColor = "#9392FF";
}

function stopEraser() {
    eraser.style.backgroundColor = "whitesmoke";
    isEraserOn = false;
    strokecolourbutton.disabled = false;
    strokecolourbutton.classList.remove("disabled")
}

function startPencil() {
    canv.style.cursor = 'url("./assets/pencursor.png"), auto'
    tool_toggler()
    isPencilOn = true
    currentstrokewidth.value = penstrokewidth
    currentstrokecolor.value = penstrokecolor
    pencil.style.backgroundColor = '#9392FF'
}

function stopPencil() {
    isPencilOn = false
    pencil.style.backgroundColor = 'whitesmoke'
    penstrokewidth = currentstrokewidth.value
    penstrokecolor = currentstrokecolor.value
}

var isPencilOn = true,
    isEraserOn = false,
    isLineOn = false,
    isCircleOn = false,
    isRectOn = false

function tool_toggler() {
    if (isPencilOn) {
        stopPencil()
    }
    if (isEraserOn) {
        stopEraser()
    }

}
document.onload = init()