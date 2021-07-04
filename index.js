const canv = document.getElementById('canvas')
const canvascontext = canv.getContext('2d')
const defaultcolour = document.getElementById('boardcolor').value
console.log(defaultcolour)

function init() {
    setCanvasSize()
    setBoardColour(defaultcolour)
}

function setCanvasSize() {
    var originalsize = canvascontext.getImageData(0, 0, canv.width, canv.height)
    canv.width = window.innerWidth - 100
    canv.height = window.innerHeight - 100
    canvascontext.putImageData(originalsize, 0, 0, 0, 0, canv.width, canv.height)
}

function setBoardColour(setcolour) {
    canv.style.backgroundColor = setcolour
    canvascontext.fillStyle = setcolour
    canvascontext.fillRect(0, 0, canv.width, canv.height)
}

// function for onchange boardcolorpicker
function boardcolourpicker(target) {
    setBoardColour(target.value)
}
init()