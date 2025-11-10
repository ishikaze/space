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
            },            {
                name: "Planet Express",
                artist: "Ujico*",
                url: "./assets/music/default/planetExpress.mp3",
                startTimestamp: 112.5
            },
        ],
        morning: [
            {
                name: "wish",
                artist: "Aiobahn and somunia ",
                url: "./assets/music/default/wish.mp3",
                startTimestamp: 170
            },
            {
                name: "Dawn",
                artist: "Couple N",
                url: "./assets/music/default/dawn.mp3",
                startTimestamp: 115.5
            },
            {
                name: "Hebi_OP",
                artist: "Hebi",
                url: "./assets/music/default/hebiOP.mp3",
                startTimestamp: 130
            },
            {
                name: "Sleeping World",
                artist: "Kyatto",
                url: "./assets/music/default/sleepingWorld.mp3",
                startTimestamp: 118.5
            },
            {
                name: "Treat",
                artist: "Kyatto",
                url: "./assets/music/default/treat.mp3",
                startTimestamp: 102
            },
            {
                name: "summer is over",
                artist: "Snail's House and potsu",
                url: "./assets/music/default/summerIsOver.mp3",
                startTimestamp: 179
            }
        ],
        afternoon: [
            {
                name: "Purple Skies (Extended Mix)",
                artist: "Mameyudoufu",
                url: "./assets/music/default/purpleSkies.mp3",
                startTimestamp: 0
            },
            {
                name: "Sakura in Tokyo",
                artist: "Gaiyu",
                url: "./assets/music/default/sakuraInTokyo.mp3",
                startTimestamp: 115.5
            },
            {
                name: "Summer ever",
                artist: "DE DE MOUSE and Pa's Lam System",
                url: "./assets/music/default/summerEver.mp3",
                startTimestamp: 121
            },
            {
                name: "There and Back",
                artist: "Protostar",
                url: "./assets/music/default/thereAndBack.mp3",
                startTimestamp: 176
            },
            {
                name: "What If",
                artist: "Stessie",
                url: "./assets/music/default/whatIf.mp3",
                startTimestamp: 160
            },
            {
                name: "Deep Blue",
                artist: "PSYQUI",
                url: "./assets/music/default/deepBlue.mp3",
                startTimestamp: 167
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
            },
            {
                name: "Choral Chambers from Hollow Knight: Silksong (Rameses B Remix)",
                artist: "Christopher Larkin, Rameses B",
                url: "./assets/music/default/choralChambers.mp3",
                startTimestamp: 128
            },
            {
                name: "The Core (Say Goodbye Mix)",
                artist: "Matthewせいじ",
                url: "./assets/music/default/theCore.mp3",
                startTimestamp: 180.5
            },
            {
                name: "Good night, Terra",
                artist: "Lappy",
                url: "./assets/music/default/goodNightTerra.mp3",
                startTimestamp: 68
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
                name: "Babaroque",
                artist: "cYsmix",
                url: "./assets/music/default/babaroque.mp3",
                startTimestamp: 201
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
                name: "Beyond the Edge",
                artist: "Xyris and 花隈千冬",
                url: "./assets/music/default/beyondTheEdge.mp3",
                startTimestamp: 52.5
            },
            {
                name: "Glacier",
                artist: "Laur",
                url: "./assets/music/default/glacier.mp3",
                startTimestamp: 123.5
            },
            {
                name: "Satellite (Sewerslvt Edit)",
                artist: "Oceanlab and Sewerslvt",
                url: "./assets/music/default/satellite.mp3",
                startTimestamp: 40
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

    if (!lastCheckedTimeOfDay) {
        lastCheckedTimeOfDay = timeOfDay;
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
    updateTitle()
    log(`starting track at ${timestamp}`);
    player.currentTime = timestamp;
    player.play();
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
    // Check if the player has valid duration before proceeding with preload logic
    if (isNaN(player.duration) || player.duration === 0) {
        return;
    }

    // Preload the next track when the current one is playing
    if (!preloaded && (player.duration - player.currentTime) > 0) {
        preloaded = true; // Set flag immediately to prevent multiple calls

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
    console.log(currentTrack)

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