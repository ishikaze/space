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

function showSelections() {
    const elements = document.querySelectorAll('.selection'); 
    let delay = 1000;

    elements.forEach((element) => {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.pointerEvents = 'all'
    }, delay);
    delay += 100;
    });
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
        updateDialogue("Chilling?")
        await sleep(3000)
        updateDialogue("Alright")
        await sleep(3000)
        updateDialogue("Cya later then!")
        await sleep(5000)
        showDialogue(false)
        break;
    default:
    
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

