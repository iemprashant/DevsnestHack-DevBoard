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
const line = document.getElementById('line')
const circle = document.getElementById('circle')
const rectang = document.getElementById('rectangle')
const canvascontext = canv.getContext('2d')
const defaultcolour = document.getElementById('boardcolor').value
var undoArray = []
var undoArrayIndex = 0;
var full_screen = false
var loc = { x: 0, y: 0 }
var controlPoint = { x: 0, y: 0 }
var strok = false
var firstcheck = false;
// toggle variable
var isPencilOn = true,
    isEraserOn = false,
    isLineOn = false,
    isCircleOn = false,
    isRectOn = false

function init() {
    if (!firstcheck) {
        buttonStateCheck()

    }
    setCanvasSize()
    setBoardColour(defaultcolour)
    canv.style.cursor = 'url("./assets/pencursor.png"), auto'
    toolbox.style.cursor = 'pointer'
    startPencil()
    firstcheck = true;
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
    if (isLineOn) {
        canv.addEventListener('touchstart', start_line)
        canv.addEventListener('touchmove', draw_line)
        canv.addEventListener('touchend', stop_line)
        canv.addEventListener('mousedown', start_line)
        canv.addEventListener('mousemove', draw_line)
        canv.addEventListener('mouseup', stop_line)
        canv.addEventListener('pointerdown', start_line)
        canv.addEventListener('pointermove', draw_line)
        canv.addEventListener('pointerup', stop_line)
    } else {
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
}

//enable and diable undo redo
function buttonStateCheck() {
    if (undoArrayIndex == 0) {
        undobtn.classList.add("disabled")
        redobtn.classList.add("disabled")
        clearbtn.classList.add("disabled")
    }
    if (undoArray.length >= 1) {
        clearbtn.classList.remove("disabled")
        if (undoArrayIndex == undoArray.length - 1) {
            undobtn.classList.remove("disabled")
            redobtn.classList.add("disabled")
        } else {
            redobtn.classList.remove("disabled")
            undobtn.classList.remove("disabled")
        }
    }
    if (undoArray.length > 10) {
        undoArray.splice(0, (undoArray.length - 10));
    }
}


function updateActionToUndoArray() {
    strok = false
    var currentState = canvascontext.getImageData(0, 0, canv.width, canv.height)
    if (undoArrayIndex < undoArray.length) {
        undoArray.splice(undoArrayIndex + 1, undoArray.length - undoArrayIndex - 1)
    }
    undoArray.push(currentState)
    undoArrayIndex = undoArray.length - 1;
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

// clear btn function
function clearPage() {
    canvascontext.clearRect(0, 0, canv.width, canv.height)
    canvascontext.fillStyle = document.getElementById('boardcolor').value
    canvascontext.fillRect(0, 0, canv.width, canv.height)
}

function savecanvas() {
    var image = canv.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "devnestWhiteboard.png";
    link.href = image;
    link.click();
}

// load stroke details
function loadStrokedetails(canvascontext_name) {
    canvascontext_name.lineCap = 'round'
    canvascontext_name.lineWidth = document.getElementById('strokewidth').value
    canvascontext_name.strokeStyle = document.getElementById('strokecolor').value
    canvascontext_name.lineJoin = 'round'
}

function tool_toggler() {
    if (isPencilOn) {
        stopPencil()
    }
    if (isEraserOn) {
        stopEraser()
    }
    if (isLineOn) {
        stopLineDrawing()
    }
    if (isCircleOn) {
        stopCircleDrawing()
    }
    if (isRectOn) {

        stopRectDrawing()
    }
}

var penstrokewidth = 5;
var penstrokecolor = currentstrokecolor.value;
var eraserstrokewidth = 100;
var eraserstrokecolor = document.getElementById("boardcolor").value;

// pen and eraser drawing function

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


//working of pen eraser 

// pen function
function startPencil() {
    canv.style.cursor = 'url("./assets/pencursor.png"), auto'
    tool_toggler()
    isPencilOn = true
    currentstrokewidth.value = penstrokewidth
    currentstrokecolor.value = penstrokecolor
    pencil.style.backgroundColor = '#9392FF'
    canvasEventSetup()
}

function stopPencil() {
    isPencilOn = false
    pencil.style.backgroundColor = 'whitesmoke'
    penstrokewidth = currentstrokewidth.value
    penstrokecolor = currentstrokecolor.value
}

// eraser function

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

// line drawing function

function startLineDrawing() {
    canv.style.cursor = 'crosshair'
    tool_toggler()
    line.style.backgroundColor = '#9392FF'
    currentstrokecolor.value = penstrokecolor
    currentstrokewidth.value = penstrokewidth
    isLineOn = true
    canvasEventSetup()
    alert('Opps, Feature is under development')

}

function stopLineDrawing() {
    isLineOn = false
    line.style.backgroundColor = 'whitesmoke'
    penstrokewidth = currentstrokewidth.value
    penstrokecolor = currentstrokecolor.value
}

function start_line(event) {
    event.preventDefault()
    cursorlocator(event)
    controlPoint.x = loc.x
    controlPoint.y = loc.y
    loadStrokedetails(canvascontext)
    strok = true
}

function draw_line(event) {
    if (!strok) {
        return
    }
    canvascontext.beginPath()
    canvascontext.moveTo(controlPoint.x, controlPoint.y)
    cursorlocator(event)
    canvascontext.lineTo(loc.x, loc.y)
    canvascontext.stroke()
}

function stop_line() {
    strok = false
    loadStrokedetails(canvascontext)
    updateActionToUndoArray()
}

// Circle Function drawing
function startCircleDrawing() {
    canv.style.cursor = 'crosshair'
    tool_toggler()
    circle.style.backgroundColor = '#9392FF'
    currentstrokecolor.value = penstrokecolor
    currentstrokewidth.value = penstrokewidth
    isCircleOn = true
    canvasEventSetup()
    alert('Opps, Feature is under development')
}

function stopCircleDrawing() {
    isCircleOn = false
    circle.style.backgroundColor = 'whitesmoke'
    penstrokewidth = currentstrokewidth.value
    penstrokecolor = currentstrokecolor.value
}

// Rectangle Function drawing
function startRectDrawing() {
    canv.style.cursor = 'crosshair'
    tool_toggler()
    rectangle.style.backgroundColor = '#9392FF'
    currentstrokecolor.value = penstrokecolor
    currentstrokewidth.value = penstrokewidth
    isRectOn = true
    canvasEventSetup()
    alert('Opps, Feature is under development')
}

function stopRectDrawing() {
    isRectOn = false
    rectangle.style.backgroundColor = 'whitesmoke'
    penstrokewidth = currentstrokewidth.value
    penstrokecolor = currentstrokecolor.value
}

document.onload = init()