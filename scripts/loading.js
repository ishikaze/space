let loadingFinished = false;
let loadMinValue = 250
let maxWaitTime = 10
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
        updateLoadingStatus(`[${waitTime}/${maxWaitTime}] Connecting to chat${dots}`);
        
        await sleep(1000)
        waitTime++
        if (maxWaitTime < waitTime) {
            defaultPopup(`WARNING: can't connect to chat server in ${maxWaitTime} seconds! the server may be down or you may be offline, the chat will connect automatically if you're back online.`)
            i = 99
        }
    }

    for (let a = 1; a < 10; a++) {
        updateLoadingStatus(`Waiting for DOM${'.'.repeat(a)}`);
        if (document.readyState === 'complete') {
            loadingFinished = true;
            const loadingHeader = document.getElementById('loading-header');
            loadingHeader.innerHTML = 'Loaded!';
            updateLoadingStatus("click anywhere to continue (sound warning!)")
            a = 100
        }
        console.log(a)
        if (a === 9) {
            updateLoadingStatus('Loading error, Please refresh the page!');
            defaultPopup(`ERROR! \nloading timeout, you are offline or your connection is too slow! \nPlease refresh the page to try again.`);
        }
    await sleep(1000);
    }
    
}

async function closeLoading() {
    console.log(loadingFinished)
    if (loadingFinished == false) return;
    const loadingPage = document.getElementById('loading-page');
    playTrack();
    trackFadeIn();
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