
const dialogueBox = document.getElementById('dialogue');
dialogueBox.style.opacity = 0;

function showDialogue(toggle) {
    switch(toggle) {
        case true:
            dialogueBox.style.opacity = 1
        break;
        case false:
            dialogueBox.style.opacity = 0
        break;
        default:
            dialogueBox.style.opacity = 0
        break;
    }
}

async function updateDialogue(message) {
    showDialogue(false)
    await sleep(1000)
    dialogueBox.innerHTML = message
    showDialogue(true)

    await sleep(4500)
    setInterval(() => {
        dialogueBox.scrollLeft += 1
    }, 1)
}

function showSelections(value) {
    const elements = document.querySelectorAll('.selection'); 
    let delay = 0;

    if (value === undefined || value === null) {
        value = true;
    }

    if (value) {
        elements.forEach((element) => {
        setTimeout(async () => {
            element.style.opacity = '1';
            element.style.pointerEvents = 'all'
            element.style.fontSize = '2.5em'
        }, delay);
        delay += 250;
        });
    } else {
        elements.forEach((element) => {
        setTimeout(async () => {
            element.style.opacity = '0';
            element.style.pointerEvents = 'none'
            element.style.fontSize = '0em'
        }, delay);
        delay += 250;
        });
    }

    
}

async function playDialogue(id) {
    switch(id) {
    case "welcome":
        if (timeOfDay == "earlyMorning") {
            updateDialogue("Up early, are we?")
            await sleep(3000)
        } else if (timeOfDay == "morning") {
            updateDialogue("Good morning")
            await sleep(3000)
        } else if (timeOfDay == "afternoon") {
            updateDialogue("Good afternoon")
            await sleep(3000)
        } else if (timeOfDay == "evening") {
            updateDialogue("Good evening")
            await sleep(3000)
        } else if (timeOfDay == "night") {
            updateDialogue("Sleeping soon?")
            await sleep(3000)
        } else {
            updateDialogue("Up late, are we?")
            await sleep(3000)
        }

        updateDialogue("I'm still working on this site")
        await sleep(5000)
        updateDialogue("So, what's up?")
        await sleep(2000)
        showSelections()
        break;
    case "hideDialogue":
        showSelections(false)
        await sleep(1000)
        updateDialogue("Chilling?")
        await sleep(3000)
        updateDialogue("Alright")
        await sleep(3000)
        updateDialogue("Cya later then!")
        await sleep(5000)
        showDialogue(false)
        break;
    case "chatGuide":
        showSelections(false)
        await sleep(500)
        updateDialogue("The chat?")
        await sleep(3000)
        updateDialogue("Hover your mouse at the right side of the screen,")
        await sleep(6000)
        if (checkIfDone('chatHover')) {
            return;
        }
        updateDialogue("Or tap in that area on mobile.")
        await sleep(5000)
        if (checkIfDone('chatHover')) {
            return;
        }
        updateDialogue("To close, hover off it or tap somewhere else!")
        await sleep(6000)
        if (checkIfDone('chatHover')) {
            return;
        }
        updateDialogue("Need anything else?")
        await sleep(2000)
        showSelections(true)
        break;
    case "musicGuide":
        showSelections(false)
        await sleep(500)
        updateDialogue("Yes, the music contoller!")
        await sleep(3000)
        updateDialogue("Hover your mouse at the left side of the screen,")
        await sleep(6000)
        if (checkIfDone('musicHover')) {
            return;
        }
        updateDialogue("Or tap in that area on mobile.")
        await sleep(5000)
        if (checkIfDone('musicHover')) {
            return;
        }
        updateDialogue("To close, hover off it or tap somewhere else!")
        await sleep(6000)
        if (checkIfDone('musicHover')) {
            return;
        }
        updateDialogue("Need anything else?")
        await sleep(2000)
        if (checkIfDone('musicHover')) {
            return;
        }
        showSelections(true)
        break;
    default:
        showSelections(false)
        await sleep(500)
        updateDialogue("Hmm...")
        await sleep(5000)
        updateDialogue("If you're reading this,")
        await sleep(3000)
        updateDialogue("there has been a mistake!")
        await sleep(3000)
        updateDialogue("You're not supposed to be seeing this!")
        await sleep(5000)
        showSelections(true)
    break;
    }
}

function hideDialogue() {
    const elements = document.querySelectorAll('.selection'); 
    let delay = 0;

    elements.forEach((element) => {
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none'
    }, delay);
    delay += 100;
    });
    playDialogue('hideDialogue')
}

function checkIfDone(check) {
    switch (check) {
        case 'musicHover':
            if (controllerOverlayOver === true || controllerTriggerOver === true){
                setTimeout(async () => {
                    updateDialogue('Yes, like that!')
                    await sleep(3000)
                    updateDialogue('Need anything else?')
                    await sleep(2000)
                    showSelections(true)
                }, 1000);
                console.log('intercepted dialogue')
                return true;
            } else {
                return false;
            }
            break;
        case 'chatHover':
            if (chatOverlayOver === true || chatTriggerOver === true){
                setTimeout(async () => {
                    updateDialogue('Yes, like that!')
                    await sleep(3000)
                    updateDialogue('Need anything else?')
                    await sleep(2000)
                    showSelections(true)
                }, 1000);
                console.log('intercepted dialogue')
                return true;
            } else {
                return false;
            }
            break;
        default:
            break;
    }
}


const selections = document.querySelectorAll('.selection'); 
selections.forEach((element) => {
    element.addEventListener("mouseover", () => {
        element.style.fontSize = '3em';
    });
    
    element.addEventListener("mouseout", () => {
        element.style.fontSize = '2.5em';
    });
});