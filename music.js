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

const tracks = {
    default: {
        earlyMorning: [
            {
                name: "岛屿 (Instrumental)",
                artist: "Xeuphoria",
                url: "./assets/music/default/songOfPeace.mp3",
                startTimestamp: 0
            },
            {
                name: "aer",
                artist: "Wisp X",
                url: "./assets/music/default/aer.mp3",
                startTimestamp: 0
            }
        ],
        morning: [
            {
                name: "aer",
                artist: "Wisp X",
                url: "./assets/music/default/aer.mp3",
                startTimestamp: 73
            },
            {
                name: "Planet Express",
                artist: "Ujico*",
                url: "./assets/music/default/planetExpress.mp3",
                startTimestamp: 112.5
            }
        ],
        afternoon: [
            {
                name: "arrival",
                artist: "succducc",
                url: "./assets/music/default/arrival.mp3",
                startTimestamp: 0
            },
            {
                name: "Planet Express",
                artist: "Ujico*",
                url: "./assets/music/default/planetExpress.mp3",
                startTimestamp: 0
            },
            {
                name: "Petals Fall",
                artist: "Hudson Lee and Oyeme",
                url: "./assets/music/default/petalsFall.mp3",
                startTimestamp: 0
            }
        ],
        evening: [
            {
                name: "seedless strawberries",
                artist: "floopy",
                url: "./assets/music/default/seedlessStrawberries.mp3",
                startTimestamp: 74.5
            },
            {
                name: "Cascade",
                artist: "Kubbi",
                url: "./assets/music/default/cascade.mp3",
                startTimestamp: 156.5
            },
            {
                name: "cache",
                artist: "linear ring",
                url: "./assets/music/default/cache.mp3",
                startTimestamp: 190
            },
            {
                name: "isomorph",
                artist: "linear ring",
                url: "./assets/music/default/isomorph.mp3",
                startTimestamp: 54.5
            },
            {
                name: "blueade",
                artist: "linear ring",
                url: "./assets/music/default/blueade.mp3",
                startTimestamp: 98
            },
            {
                name: "My Dearest Friend",
                artist: "ManateeCommune",
                url: "./assets/music/default/myDearestFriend.mp3",
                startTimestamp: 172
            },
            {
                name: "Breeze",
                artist: "Pretty Patterns, シャノン・SHANNON and Riemann ",
                url: "./assets/music/default/breeze.mp3",
                startTimestamp: 146
            },
            {
                name: "VOIDS",
                artist: "Pretty Patterns and vally.exe",
                url: "./assets/music/default/voids.mp3",
                startTimestamp: 71
            },
            {
                name: "Again (From Your Lie in April)",
                artist: "Skilifay",
                url: "./assets/music/default/again.mp3",
                startTimestamp: 122
            },
            {
                name: "Luv Letter",
                artist: "Wisp X",
                url: "./assets/music/default/luvLetter.mp3",
                startTimestamp: 163.5
            },
            {
                name: "Stasis",
                artist: "Wisp X ",
                url: "./assets/music/default/stasis.mp3",
                startTimestamp: 88.5
            },
            {
                name: "Ocean Blue",
                artist: "WRLD",
                url: "./assets/music/default/oceanBlue.mp3",
                startTimestamp: 176.5
            }
        ],
        night: [
            {
                name: "Main Theme (From Konatsu and Hiyori)",
                artist: "Akira Kosemura",
                url: "./assets/music/default/mainTheme.mp3",
                startTimestamp: 23
            },
            {
                name: "Guardian of the Memory (Instrumental)",
                artist: "Honor of Kings",
                url: "./assets/music/default/guardianOfTheMemory.mp3",
                startTimestamp: 56
            },
            {
                name: "Lullaby of the Sea (Instrumental)",
                artist: "Honor of Kings",
                url: "./assets/music/default/lullabyOfTheSea.mp3",
                startTimestamp: 2
            },
            {
                name: "Ataraxia",
                artist: "Pretty Patterns",
                url: "./assets/music/default/ataraxia.mp3",
                startTimestamp: 0
            },
            {
                name: "BLUESTAR",
                artist: "Pretty Patterns and TOFIE",
                url: "./assets/music/default/bluestar.mp3",
                startTimestamp: 67
            },
            {
                name: "PROXIMA",
                artist: "Pretty Patterns, Kazari Tayu and Enna Alouette",
                url: "./assets/music/default/proxima.mp3",
                startTimestamp: 0
            },
            {
                name: "Past Reflection",
                artist: "",
                url: "./assets/music/default/pastReflection.mp3",
                startTimestamp: 66.3
            },
            {
                name: "The Frosty Maple",
                artist: "",
                url: "./assets/music/default/theFrostyMaple.mp3",
                startTimestamp: 122
            },
            {
                name: "我的纸飞机 (女版伴奏)",
                artist: "",
                url: "./assets/music/default/myPaperPlane.mp3",
                startTimestamp: 143
            },
            {
                name: "Rakuen",
                artist: "ミツキヨ",
                url: "./assets/music/default/rakuen.mp3",
                startTimestamp: 35.5
            },
            {
                name: "To Far Shores",
                artist: "Lifeformed",
                url: "./assets/music/default/toFarShores.mp3",
                startTimestamp: 101
            }
        ],
        lateNight: [
            {
                name: "黒皇帝 ✦ eili - 儀 -lirile-",
                artist: "Kurokotei",
                url: "./assets/music/default/黒皇帝.mp3",
                startTimestamp: 660
            },
            {
                name: "The Last Page",
                artist: "ARForest",
                url: "./assets/music/default/theLastPage.mp3",
                startTimestamp: 98.5
            },
            {
                name: "Myths You Forgot",
                artist: "Camellia and Toby Fox",
                url: "./assets/music/default/mythsYouForgot.mp3",
                startTimestamp: 190
            },
            {
                name: "Babaroque",
                artist: "cYsmix",
                url: "./assets/music/default/babaroque.mp3",
                startTimestamp: 201
            },
            {
                name: "Good night, Terra",
                artist: "Lappy",
                url: "./assets/music/default/goodNightTerra.mp3",
                startTimestamp: 68
            },
            {
                name: "Telling The World",
                artist: "Nhato",
                url: "./assets/music/default/tellingTheWorld.mp3",
                startTimestamp: 299
            },
            {
                name: "waitingforyou",
                artist: "linear ring",
                url: "./assets/music/default/waitingforyou.mp3",
                startTimestamp: 137
            },
            {
                name: "We Want To Run",
                artist: "Frums",
                url: "./assets/music/default/weWantToRun.mp3",
                startTimestamp: 86
            },
            {
                name: "Crysta",
                artist: "Wisp X",
                url: "./assets/music/default/crysta.mp3",
                startTimestamp: 139
            },
            {
                name: "Final Moments",
                artist: "Wisp X",
                url: "./assets/music/default/finalMoments.mp3",
                startTimestamp: 117.6
            },
            {
                name: "Secret Illumination",
                artist: "Yooh",
                url: "./assets/music/default/secretIllumination.mp3",
                startTimestamp: 97
            },
            {
                name: "Can you hear me?",
                artist: "linear ring",
                url: "./assets/music/default/canYouHearMe.mp3",
                startTimestamp: 109
            }
        ]
    },
    lunarNewYear: {
        earlyMorning: [
            {
                name: "name1",
                url: "./assets/music/morning/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/morning/track2.mp3"
            }
        ],
        morning: [
            {
                name: "name1",
                url: "./assets/music/morning/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/morning/track2.mp3"
            }
        ],
        afternoon: [
            {
                name: "name1",
                url: "./assets/music/afternoon/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/afternoon/track2.mp3"
            }
        ],
        evening: [
            {
                name: "name1",
                url: "./assets/music/evening/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/evening/track2.mp3"
            }
        ],
        night: [
            {
                name: "name1",
                url: "./assets/music/night/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/night/track2.mp3"
            }
        ],
        lateNight: [
            {
                name: "name1",
                url: "./assets/music/lateNight/track1.mp3"
            },
            {
                name: "name2",
                url: "./assets/music/lateNight/track2.mp3"
            }
        ]
    }
}

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
    document.getElementById("time-override-text").innerHTML = 'time override: ' + timeOverride
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

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
    log(`time of day determined: ${timeOfDay}`);
    document.getElementById("time-override-text").innerHTML = 'time override: ' + timeOverride

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
    player.play();
}

function addNewTracks() {
    // Only proceed if there are available tracks to potentially add
    if (!currentAvailableTracks || currentAvailableTracks.length === 0) {
        log("No tracks available to add for current time of day.");
        return;
    }

    log("Checking for new tracks to add to the playlist.");

    // Create a Set of URLs already in the playlist for efficient lookup
    const playlistUrls = new Set(playlist.map(track => track.url));

    // Filter out tracks that are already in the playlist
    let potentialNewTracks = currentAvailableTracks.filter(track => !playlistUrls.has(track.url));

    // If there are no truly "new" tracks (all have been added before),
    // then consider re-adding tracks that have already been played and shifted out
    // but are still part of the currentAvailableTracks.
    // This prevents the playlist from running out if you only have a few tracks.
    if (potentialNewTracks.length === 0 && playlist.length < currentAvailableTracks.length) {
         log("No truly new tracks. Shuffling all available tracks to repopulate.");
         potentialNewTracks = [...currentAvailableTracks]; // Take all available tracks
         potentialNewTracks = potentialNewTracks.filter(track => !playlistUrls.has(track.url)); // Re-filter current playlist items
    }

    // Shuffle the potential new tracks
    potentialNewTracks = shuffleQueue(potentialNewTracks);

    const tracksToAddCount = Math.min(potentialNewTracks.length, 5); // Add up to 5 new tracks at a time, or fewer if not enough available

    for (let i = 0; i < tracksToAddCount; i++) {
        if (playlist.length >= 19) { // Keep the playlist from growing indefinitely
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
    playlist = shuffleQueue([...currentAvailableTracks]); // Create the initial shuffled playlist
    log(`Initial playlist populated and shuffled. Length: ${playlist.length}`);
    console.log("Initial Playlist:", playlist);
} else if (currentAvailableTracks.length === 0) {
    log("Warning: No tracks defined for the current time of day.");
}


(async function() {
    updateLoadingStatus('Preloading music...');
    if (playlist.length > 0) { // Ensure there's a track to preload
        await preloadAudio(playlist[0].url);
        updateLoadingStatus('Click to continue');
        loadMin() // Assuming loadMin() is defined elsewhere and prepares the UI
    } else {
        updateLoadingStatus('No music to preload. Check track definitions.');
        // Optionally handle cases where there's no music, e.g., enable play button but show no track
    }
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
    // Check if the player has valid duration before proceeding with preload logic
    if (isNaN(player.duration) || player.duration === 0) {
        return;
    }

    // Preload the next track when the current one is nearing its end
    if (!preloaded && (player.duration - player.currentTime) < 20) {
        preloaded = true; // Set flag immediately to prevent multiple calls
        
        // Ensure there's a next track to preload
        if (playlist.length > 1) { // We need at least 2 tracks: current and next
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
            
            // Now, after preloading the *next* track, check if we need to add more
            // This ensures the playlist is topped up for future tracks
            addNewTracks(); 
        } else {
            log("Only one track left in playlist. Attempting to add more now.");
            addNewTracks(); // Try to add more even if only one track remains
            if (playlist.length > 1) { // If adding was successful, preload the new next track
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

function newSong() {
    log('Song ended, moving to next track...');
    playlist.shift(); // Remove the finished song from the beginning of the playlist
    console.log("Playlist after shift:", playlist);

    if (playlist.length === 0) {
        log("Playlist empty! Attempting to repopulate.");
        // This scenario should ideally be rare if addNewTracks works well,
        // but it's a fallback.
        getNewTrack(); // Re-evaluate time of day and available tracks
        addNewTracks(); // Repopulate
        if (playlist.length === 0) {
            log("Still no tracks after repopulating. Music will stop.");
            // Optionally, handle UI for no music
            player.pause();
            playPauseBtn.textContent = 'Play';
            return;
        }
    }
    
    playTrack();
    preloaded = false; // Reset preloaded flag for the *new* track
    // selectedNewTrack is removed as it's not used/needed with this logic
}

async function trackFadeIn() {
    player.volume = 0
    log(`track fading in: 80%`)
    for (let i = 0; i <= 80; i++) {
        player.volume = i / 100
        await sleep(35)
    }
}


function updateQueue() {
  const queue = document.getElementById('music-queue');
  const trackQueue = playlist;
  queue.innerHTML = ''

  for (let i = 1; i < 4 && i < trackQueue.length; i++) {
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