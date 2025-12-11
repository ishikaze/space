const chatConatiner = document.getElementById('chat-container')
const musicController = document.getElementById('music-controller-overlay')
const musicControllerClose = document.getElementById('music-close-button')
const chat = document.getElementById('chat')
const dock = document.getElementById('dock')
const chatIcon = document.getElementById('chat-icon')
const musicIcon = document.getElementById('music-controller-icon')
let dockPos = 0
let dockControlOverride = false

chatConatiner.style.opacity = '0'
musicController.style.left = '-26em'

dock.addEventListener('mouseenter', async function() {
    if (dockControlOverride) return
    await sleep(10)
    dockControl(true)
})

dock.addEventListener('mouseleave', async function() {
    if (dockControlOverride) return
    await sleep(10)
    dockControl(false)
})

function dockToggle(app) {
    let isOpen = false
    let target
    switch (app) {
        case 'chat':{ 
            target = chatIcon
            const style = chatConatiner.style
            if (style.opacity === '0') {
                chatConatiner.style.opacity = '1'
                chatConatiner.style.pointerEvents = 'auto'
                chat.style.width = '100%'
                chat.style.height = '100%'
                moveDock('!right')
            } else {
                chatConatiner.style.opacity = '0'
                chatConatiner.style.pointerEvents = 'none'
                chat.style.width = '0%'
                chat.style.height = '0%'
                isOpen = true
                moveDock('left')
            }
            break;
        }
        case 'music':{
            target = musicIcon
            const style = musicController.style
            if (style.left === '-26em') {
                musicController.style.backdropFilter = 'blur(10px)'
                musicControllerClose.style.backdropFilter = 'blur(10px)'
                musicController.style.left = '1em'
                musicControllerClose.style.opacity = '1'
                musicControllerClose.style.marginRight = '-5em'
                musicControllerClose.style.padding = '1em'
                if (window.innerWidth < 720) {
                musicControllerClose.style.marginRight = '-5.5em'
                musicControllerClose.style.padding = '2em'
                }
            } else {
                musicController.style.backdropFilter = 'none'
                musicControllerClose.style.backdropFilter = 'none'
                musicController.style.left = '-26em'
                musicControllerClose.style.opacity = '0'
                musicControllerClose.style.marginRight = '10em'
                isOpen = true
            }
            break;
        }
        default:
            break;
    }
    if (isOpen === false) {
        target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
    } else {
        target.style.backgroundColor = 'rgba(0, 0, 0, 0.25)'
    }
}

async function dockControl(state, delay) {
    if (!delay || typeof delay !== Number) {
        delay = 0
    } 

    await sleep(delay)
    if (state) {
        dock.style.bottom = '0em'
    } else {
        dock.style.bottom = '-8em'
        if (window.innerWidth < 720) {
            dock.style.bottom = '0em'
        }
    }
}

async function moveDock(direction) {
    switch (direction) {
        case 'left':
            dockPos --
            break;
        case '!left':
            dockPos = -1
            break;
        case '!right':
            dockPos = 1
            break;
        default:
            dockPos ++
            break;
    }

    if (dockPos > 1) {
        dockPos = 1
    }
    if (dockPos < -1) {
        dockPos = -1
    }

    switch (dockPos) {
        case 1:
            dock.style.left = '85%'
            if (window.innerWidth < 720) {
                dock.style.left = '100%'
            }
            break;
        case -1:
            dock.style.left = '15%'
            break;
        default:
            dock.style.left = '50%'
            break;
    }

    dockControlOverride = true
    dockControl(true)
    await sleep(1500)
    dockControl(false)
    dockControlOverride = false
}