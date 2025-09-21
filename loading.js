let loadingFinished = false;

function updateLoadingStatus(message) {
    const loadingStatus = document.getElementById('loading-status');
    loadingStatus.innerText = message;
}

updateLoadingStatus('Initializing...');

function closeLoading() {
    console.log(loadingFinished)
    if (loadingFinished == false) return;
    const loadingPage = document.getElementById('loading-page');
    loadingPage.style.display = 'none';
    playTrack(newTrack.name, newTrack.artist, newTrack.url, newTrack.startTimestamp);
    trackFadeIn()
    showMusicController()
}