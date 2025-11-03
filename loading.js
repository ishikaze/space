let loadingFinished = false;
let loadMinValue = 250

function updateLoadingStatus(message) {
    const loadingStatus = document.getElementById('loading-status');
    loadingStatus.innerText = message;
}

updateLoadingStatus('Initializing...');

async function loadMin() {
    
    for (let i = 0; i < 100; i++) {
        if (loadMinValue === 0) {
            i = 100
        }
        randomTime = Math.random() * loadMinValue
        updateLoadingStatus(`Loading... ${i + 1}%`);
        if (document.readyState === 'complete') {
            i = 100
        }
        await sleep(randomTime)
    }

    loadingFinished = true;
    const loadingHeader = document.getElementById('loading-header');
    loadingHeader.innerHTML = 'Loaded!';
    updateLoadingStatus("click anywhere to continue")
}

async function closeLoading() {
    console.log(loadingFinished)
    if (loadingFinished == false) return;
    const loadingPage = document.getElementById('loading-page');
    playTrack();
    trackFadeIn();
    welcomeMessage();
    loadingPage.style.transition = 'all 0.1s'
    await sleep(50)
    loadingPage.style.backgroundColor = '#FFF';
    await sleep(50)
    loadingPage.style.transition = 'all 1s'
    await sleep(50)
    loadingPage.style.pointerEvents = 'none'
    loadingPage.style.opacity = 0
    playDialogue("welcome");
    ambient.volume = 0.5
    ambient.play()
}