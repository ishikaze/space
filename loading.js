let loadingFinished = false;
let loadMinValue = 250
let maxWaitTime = 0
let waitTime = 0

function updateLoadingStatus(message) {
    const loadingStatus = document.getElementById('loading-status');
    loadingStatus.innerText = message;
}

updateLoadingStatus('Initializing...');

async function loadMin() {
    
    for (let i = 1; i < 5; i++) {
        let dots = '...'
        switch (i) {
            case 1:
                dots = '.'
                break;
            case 2:
                dots = '..'
                break;
            case 3:
                dots = '...'
                break;
        }
        if (i === 3) {
            i = 0
        }
        randomTime = Math.random() * loadMinValue
        updateLoadingStatus(`Connecting to chat${dots}`);
        if (document.readyState === 'complete') {
            i = 100
        }
        await sleep(1000)
        waitTime++
        if (maxWaitTime < waitTime) {
            updateLoadingStatus(`WARNING: can't connect to chat server in ${maxWaitTime} seconds! the server may be down or you may be offline, the chat will connect automatically if you're back online.`)
            await sleep(5000)
            i = 100
        }
    }

    loadingFinished = true;
    const loadingHeader = document.getElementById('loading-header');
    loadingHeader.innerHTML = 'Loaded!';
    updateLoadingStatus("click anywhere to continue (sound warning!)")
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
    playLyrics('./assets/music/default/dummy.mp3');
}