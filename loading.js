let loadingFinished = false;
let loadMinValue = 0

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
        await sleep(randomTime)
    }

    loadingFinished = true;
    const loadingHeader = document.getElementById('loading-header');
    loadingHeader.innerHTML = 'Loaded!';
    updateLoadingStatus("click anywhere to continue")
}

function closeLoading() {
    console.log(loadingFinished)
    if (loadingFinished == false) return;
    const loadingPage = document.getElementById('loading-page');
    loadingPage.style.display = 'none';
    playTrack();
    trackFadeIn();
    welcomeMessage();
    playDialogue("welcome");
    ambient.volume = 0.5
    ambient.play()
}