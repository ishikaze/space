const debugPanel = document.getElementById('debug');
const player = document.getElementById('player');
const ambient = document.getElementById('ambient')
let day
let month
let hour
let minute
let playlist = []
let currentAvailableTracks
let isIntro = true;
let preloaded = false;
let timeOverride = localStorage.getItem("timeOverride");
let lastCheckedTimeOfDay;
let logEnabled = false;
let currentLyricsCleanup = null;

function setTimeOverride(override) {
    switch (override) {
        case 1:
            timeOverride = 'earlyMorning';
            localStorage.setItem("timeOverride", "earlyMorning");
            break;
        case 2:
            timeOverride = 'morning';
            localStorage.setItem("timeOverride", "morning");
            break;
        case 3:
            timeOverride = 'afternoon';
            localStorage.setItem("timeOverride", "afternoon");
            break;
        case 4:
            timeOverride = 'evening';
            localStorage.setItem("timeOverride", "evening");
            break;
        case 5:
            timeOverride = 'night';
            localStorage.setItem("timeOverride", "night");
            break;
        case 6:
            timeOverride = 'lateNight';
            localStorage.setItem("timeOverride", "lateNight");
            break;
        case 0:
            timeOverride = null;
            localStorage.removeItem("timeOverride");
            break;
    }
    log(`Time override set to: ${timeOverride}`);
    defaultPopup(`Time override was set to:\n${timeOverride}`);
    document.getElementById("time-override-text").innerHTML = 'time override: ' + timeOverride
}

function updateTime() {
    const now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    const timestamp = now.getTime();
    day = now.getDate();
    month = now.getMonth() + 1;
    const year = now.getFullYear();
    log(`Updated time [${timestamp}]`);
}

function preloadAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("canplaythrough", () => resolve(), { once: true });
  });
}

function shuffleQueue(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let timeOfDay;
function getNewTrack() {
    let useTrackList = tracks.default;
    if (month === 1 && day >= 15 && day <= 30) {
        useTrackList = tracks.lunarNewYear;
    }

    log(`time is ${hour}:${minute}, month is ${month}, day is ${day}`);

    if (timeOverride !== null) {
        log(`time override detected! (${timeOverride})`);
        timeOfDay = timeOverride;
    } else {
        switch (true) {
            case (hour >= 5 && hour < 8):
                timeOfDay = 'earlyMorning';
                break;
            case (hour >= 8 && hour < 12):
                timeOfDay = 'morning';
                break;
            case (hour >= 12 && hour < 17):
                timeOfDay = 'afternoon';
                break;
            case (hour >= 17 && hour < 21):
                timeOfDay = 'evening';
                break;
            case (hour >= 21 && hour < 24):
                timeOfDay = 'night';
                break;
            default:
                timeOfDay = 'lateNight';
                break;
        }
    }

    if (!lastCheckedTimeOfDay) {
        lastCheckedTimeOfDay = timeOfDay;
    }

    log(`time of day determined: ${timeOfDay}`);

    currentAvailableTracks = useTrackList[timeOfDay];
    return;
}

async function playTrack() {
    let toPlay = playlist[0]
    await preloadAudio(toPlay.url);
    player.src = toPlay.url;
    player.load();
    let timestamp = 0
    if (isIntro) {
        timestamp = toPlay.startTimestamp
        isIntro = false
    }
    updateQueue()
    log(`starting track at ${timestamp}`);
    player.currentTime = timestamp;
    let startPlayPromise = player.play();

    if (startPlayPromise !== undefined) {
    startPlayPromise.then(() => {
        updateTitle()

        if (currentLyricsCleanup) {
            currentLyricsCleanup();
        }
        playLyrics(toPlay.url)

    }).catch(error => {
        if (error.name === "NotAllowedError") {
        console.error("autoplay was prevented by the browser.");
        } else {
        console.error("error during audio playback:", error);
        }
    });
    }
}

function addNewTracks() {

    if (!currentAvailableTracks || currentAvailableTracks.length === 0) {
        log("No tracks available to add for current time of day.");
        return;
    }

    log("Checking for new tracks to add to the playlist.");

    const playlistUrls = new Set(playlist.map(track => track.url));

    let potentialNewTracks = currentAvailableTracks.filter(track => !playlistUrls.has(track.url));

    if (potentialNewTracks.length === 0 && playlist.length < currentAvailableTracks.length) {
         log("No truly new tracks. Shuffling all available tracks to repopulate.");
         potentialNewTracks = [...currentAvailableTracks];
         potentialNewTracks = potentialNewTracks.filter(track => !playlistUrls.has(track.url));
    }


    potentialNewTracks = shuffleQueue(potentialNewTracks);

    const tracksToAddCount = Math.min(potentialNewTracks.length, 5);

    for (let i = 0; i < tracksToAddCount; i++) {
        if (playlist.length >= 19) {
            log("Playlist nearly full, stopping addition of new tracks.");
            break;
        }
        const trackToAdd = potentialNewTracks[i];
        playlist.push(trackToAdd);
        log(`Added new track: ${trackToAdd.name}`);
    }
    log(`Finished adding new tracks. Playlist length: ${playlist.length}`);
    console.log("Current Playlist:", playlist);
    return;
}

let logTimeout;

function log(message) {
    if (!logEnabled) {
        debugPanel.style.pointerEvents = 'none'
        return;
    }
    debugPanel.innerHTML += `<br>> ${message}`;
    debugPanel.style.opacity = 1;
    if (logTimeout) clearTimeout(logTimeout);
    logTimeout = setTimeout(() => {
        debugPanel.style.opacity = 0;
    }, 15000);
    debugPanel.scrollTo(0, debugPanel.scrollHeight);
}

updateLoadingStatus('Music module loaded.');
log('Music module loaded.');

updateLoadingStatus('Updating time...');
updateTime();

updateLoadingStatus('Selecting new track...');
getNewTrack();

if (playlist.length === 0 && currentAvailableTracks.length > 0) {
    playlist = shuffleQueue([...currentAvailableTracks]);
    log(`Initial playlist populated and shuffled. Length: ${playlist.length}`);
    console.log("Initial Playlist:", playlist);
} else if (currentAvailableTracks.length === 0) {
    log("Warning: No tracks defined for the current time of day.");
}


(async function() {
    updateLoadingStatus('Preloading music...');
    updateSky(timeOfDay)
    if (playlist.length > 0) {
        await preloadAudio(playlist[0].url);
        updateLoadingStatus('Click to continue');
    } else {
        updateLoadingStatus('No music to preload. Check track definitions.');
    }
    loadMin()
})();

//controller logic
const playPauseBtn = document.getElementById('play-pause');
const seekSlider = document.getElementById('seek-slider');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const trackName = document.getElementById('track-name')
const trackArtist = document.getElementById('track-artist')

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

player.addEventListener('loadedmetadata', () => {
    seekSlider.max = player.duration;
    durationSpan.textContent = formatTime(player.duration);
});

player.addEventListener('timeupdate', () => {
    seekSlider.value = player.currentTime;
    currentTimeSpan.textContent = formatTime(player.currentTime);
    trackName.innerHTML = playlist[0].name
    trackArtist.innerHTML = "by " + playlist[0].artist
});

seekSlider.addEventListener('input', () => {
    player.currentTime = seekSlider.value;
});

playPauseBtn.addEventListener('click', () => {
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
});

player.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});
player.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
});

player.addEventListener('timeupdate', async () => {
    if (isNaN(player.duration) || player.duration === 0) {
        return;
    }

    if (!preloaded && (player.duration - player.currentTime) > 0) {
        preloaded = true; 

        if (playlist.length > 1) {
            let nextTrack = playlist[1];
            seekSlider.style.pointerEvents = 'none'
            seekSlider.style.opacity = '0.5'
            playPauseBtn.style.pointerEvents = 'none'
            playPauseBtn.style.opacity = '0.5'
            log(`Preloading next track: ${nextTrack.name}`);

            await preloadAudio(nextTrack.url).then(() => {
                log(`Successfully preloaded: ${nextTrack.name}`);
                seekSlider.style.pointerEvents = 'auto'
                seekSlider.style.opacity = '1'
                playPauseBtn.style.pointerEvents = 'auto'
                playPauseBtn.style.opacity = '1'
            }).catch(error => {
                log(`Error preloading ${nextTrack.name}: ${error}`);
            });

            addNewTracks();
        } else {
            log("Only one track left in playlist. Attempting to add more now.");
            addNewTracks();
            if (playlist.length > 1) {
                 let nextTrack = playlist[1];
                 log(`Preloading newly added next track: ${nextTrack.name}`);
                 await preloadAudio(nextTrack.url).then(() => {
                     log(`Successfully preloaded: ${nextTrack.name}`);
                 }).catch(error => {
                     log(`Error preloading ${nextTrack.name}: ${error}`);
                 });
            } else {
                log("Could not add more tracks, only one track remaining.");
            }
        }
    }
});
// hm? the block above looks weird? i know but it bugs out if i dont do it like this...

function updateSky(time) {
    // const sky = document.getElementById('main-container')
    // switch (time) {
    //     case 'earlyMorning':
    //         sky.style.backgroundColor = '#ff6db1ff'
    //         break;
    //     case 'morning':
    //         sky.style.backgroundColor = '#b6cbffff'
    //         break;
    //     case 'afternoon':
    //         sky.style.backgroundColor = '#80a4ffff'
    //         break;
    //     case 'evening':
    //         sky.style.backgroundColor = '#745ed6ff'
    //         break;
    //     case 'night':
    //         sky.style.backgroundColor = '#0c152bff'
    //         break;
    //     default:
    //         sky.style.backgroundColor = '#060b18'
    //         break;
    // }
    // console.log(`updated bg ${time}`)
}

function newSong() {
    log('Song ended, moving to next track...');

    updateTime();
    updateSky(timeOfDay)
    getNewTrack();

    if (timeOfDay !== lastCheckedTimeOfDay) {
        log(`Time of day has changed from ${lastCheckedTimeOfDay} to ${timeOfDay}.`);
        lastCheckedTimeOfDay = timeOfDay;
        playlist = [];
        log("Playlist cleared. Getting new tracks.");
        addNewTracks();
    } else {
        playlist.shift();
        console.log("Playlist after shift:", playlist);
    }


    if (playlist.length === 0) {
        log("Playlist empty! Attempting to repopulate.");

        addNewTracks();
        if (playlist.length === 0) {
            log("Still no tracks after repopulating. Music will stop.");
            player.pause();
            playPauseBtn.textContent = 'Play';
            return;
        }
    }

    playTrack();
    preloaded = false;
}

async function trackFadeIn() {
    player.volume = 0
    log(`track fading in`)
    for (let i = 0; i <= 50; i++) {
        player.volume = i / 100
        await sleep(35)
    }
}


function updateQueue() {
  const queue = document.getElementById('music-queue');
  const trackQueue = playlist;
  queue.innerHTML = ''

  for (let i = 1; i < trackQueue.length; i++) {
    const queueItem = trackQueue[i];

    const div = document.createElement('div');
    const divider = document.createElement('div');
    div.classList.add('queue-item');
    divider.classList.add('queue-divider');

    const trackName = document.createElement('h3');
    trackName.textContent = queueItem.name;

    const artistName = document.createElement('p');
    artistName.textContent = queueItem.artist;

    div.appendChild(trackName);
    div.appendChild(artistName);

    queue.appendChild(div);
    queue.appendChild(divider)
  }
}

function updateTitle() {
    const currentTrack = playlist[0]
    
    if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: `${currentTrack.name}`,
        artist: `${currentTrack.artist}`,
        album: ``, //soon
        artwork: [
            { src: 'https://ishikaze.space/assets/img/icons/star256.png',   sizes: '256x256',   type: 'image/png' },
        ]
    });
    }
}

function playLyrics(url) {
    try {
        const lrcFileData = lyrics[url.split('/').pop().split('.').shift()];

        const audioPlayer = document.getElementById('player');
        const lyricsContainer = document.getElementById('lyrics-container');

        if (!lrcFileData) {
            throw new Error("No lyric data found for this track.");
        }

        const parsedLyrics = parseLRC(lrcFileData);

        if (audioPlayer && parsedLyrics.length > 0) {
            currentLyricsCleanup = setupLyricsPlayer(parsedLyrics, audioPlayer, lyricsContainer);
        } else if (!audioPlayer) {
            console.error("Audio element with id 'player' not found!");
        }
    } catch (error) {
        const lyricsContainer = document.getElementById('lyrics-container');
        if (lyricsContainer) {
            const line1 = lyricsContainer.querySelector('#line-1');
            const line2 = lyricsContainer.querySelector('#line-2');
            if (line1) line1.textContent = '';
            if (line2) line2.textContent = '';
        }
        currentLyricsCleanup = null;
        console.log("No lyrics available for this track.");
    }
}