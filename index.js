const canv = document.getElementById('canvas')
const toolbox = document.getElementById('toolbox')
const canvascontext = canv.getContext('2d')
const defaultcolour = document.getElementById('boardcolor').value
var undo_arr = []
var undo_arr_index
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
// Board clourpicker Btn function
function boardcolourpicker(target) {
    setBoardColour(target.value)
}

function canvasEventSetup() {
    canv.addEventListener('mousedown', start_draw)
    canv.addEventListener('mouseup', stop_draw)
    canv.addEventListener('mouseup', auxillary_stop_draw)
    canv.addEventListener('mouseout', stop_draw)
    canv.addEventListener('pointerdown', start_draw)
    canv.addEventListener('pointermove', draw)
    canv.addEventListener('pointerup', stop_draw)
    canv.addEventListener('pointerup', auxillary_stop_draw)
    canv.addEventListener('pointerout', stop_draw)
}

// async function update_page_image() {
//     var board_image = canvascontext.getImageData(0, 0, canv.width, canv.height)
//     if (undo_arr_index < undo_arr.length) {
//         undo_arr.splice(undo_arr_index + 1, undo_arr.length - undo_arr_index - 1)
//     }
//     undo_arr.push(board_image)
//     undo_arr_index = undo_arr.length - 1 //array indexing issue
//     button_state_checker()
//         //console.log(undo_arr.length)//for testing
// }
function cursorlocator(event) {
    loc.x = event.clientX - canv.offsetLeft
    loc.y = event.clientY - canv.offsetTop
    console.log(`${loc.x}`)
}

async function stroke_properties(canvascontext_name) {
    canvascontext_name.lineCap = 'round'
    canvascontext_name.lineWidth = document.getElementById('strokewidth').value
    canvascontext_name.strokeStyle = document.getElementById('strokecolor').value
    canvascontext_name.lineJoin = 'round'
}

function start_draw(event) {
    event.preventDefault()
    cursorlocator(event)
    stroke_properties(canvascontext)
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

function clear_page(cntx_name) {
    cntx_name.clearRect(0, 0, canv.width, canv.height)
    cntx_name.fillStyle = document.getElementById('boardcolor').value
    cntx_name.fillRect(0, 0, canv.width, canv.height)
}

document.onload = init()