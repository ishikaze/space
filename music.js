const debugPanel = document.getElementById('debug');
const player = document.getElementById('player');
let day
let month
let hour
let minute
let newTrack
let preloaded = false;
let timeOverride

function setTimeOverride(override) {
    switch (override) {
        case 1:
            timeOverride = 'earlyMorning';
            break;
        case 2:
            timeOverride = 'morning';
            break;
        case 3:
            timeOverride = 'afternoon';
            break;
        case 4:
            timeOverride = 'evening';
            break;
        case 5:
            timeOverride = 'night';
            break;
        case 6:
            timeOverride = 'lateNight';
            break;
        case 0:
            timeOverride = undefined;
            break;
    }
    log(`Time override set to: ${timeOverride}`);
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
                name: "arrival",
                artist: "succducc",
                url: "./assets/music/default/arrival.mp3",
                startTimestamp: 83.5
            },
            {
                name: "Paradise Ⅱ",
                artist: "Sound Souler",
                url: "./assets/music/default/paradise2.mp3",
                startTimestamp: 9.2
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
            }
        ],
        lateNight: [
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

function preloadAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("canplaythrough", () => resolve(), { once: true });
  });
}

let timeOfDay;
function getNewTrack() {
    let useTrackList = tracks.default;
    if (month === 1 && day >= 15 && day <= 30) {
        useTrackList = tracks.lunarNewYear;
    }

    log(`time is ${hour}:${minute}, month is ${month}, day is ${day}`);

    if (timeOverride !== undefined) {
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

    const trackList = useTrackList[timeOfDay];
    const randomIndex = Math.floor(Math.random() * trackList.length);

    newTrack = trackList[randomIndex];
    log(`New track selected: ${newTrack.name} by ${newTrack.artist} [${newTrack.url}]`);
    return;
}

async function playTrack(name, artist, url, timestamp) {
    await preloadAudio(url);
    player.src = url;
    player.load();
    log(`starting track at ${timestamp}`);
    player.currentTime = timestamp;
    player.play();
}

let logTimeout;

function log(message) {
    debugPanel.innerHTML += `<br>> ${message}`;
    debugPanel.style.opacity = 1;
    if (logTimeout) clearTimeout(logTimeout);
    logTimeout = setTimeout(() => {
        debugPanel.style.opacity = 0;
    }, 10000);
    debugPanel.scrollTo(0, debugPanel.scrollHeight);
}

function showMusicController() {
    const controller = document.getElementById('music-controller');
    controller.style.opacity = 1;
}

let controllerTimeout;

function hideMusicController() {
    const controller = document.getElementById('music-controller');
    if (controllerTimeout) clearTimeout(controllerTimeout);
    controllerTimeout = setTimeout(() => {
        controller.style.opacity = 0;
    }, 3000);
}

updateLoadingStatus('Music module loaded.');
log('Music module loaded.');

updateLoadingStatus('Updating time...');
updateTime();

updateLoadingStatus('Selecting new track...');
getNewTrack();

updateLoadingStatus('Preloading music...');
preloadAudio(newTrack.url);

updateLoadingStatus('Click to continue');
loadMin()

//controller logic
const playPauseBtn = document.getElementById('play-pause');
const seekSlider = document.getElementById('seek-slider');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');

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
});

seekSlider.addEventListener('input', () => {
    player.currentTime = seekSlider.value;
});

playPauseBtn.addEventListener('click', () => {
    if (player.paused) {
        player.play();
        playPauseBtn.textContent = 'Pause';
    } else {
        player.pause();
        playPauseBtn.textContent = 'Play';
    }
});

player.addEventListener('play', () => {
    playPauseBtn.textContent = 'Pause';
});
player.addEventListener('pause', () => {
    playPauseBtn.textContent = 'Play';
});

player.addEventListener('timeupdate', () => {
    if (!preloaded && (player.duration - player.currentTime) < 20) {
        updateTime()
        getNewTrack()
        preloadAudio(newTrack.url).then(() => {
            log(`Preloaded next track: ${newTrack.name}`);
        });
        preloaded = true;
    }
});

function newSong() {
    log('Song ended, playing preloaded track...');
    playTrack(newTrack.name, newTrack.artist, newTrack.url, 0);
    preloaded = false;
}

async function trackFadeIn() {
    player.volume = 0
    log(`track fading in: 80%`)
    for (let i = 0; i <= 80; i++) {
        player.volume = i / 100
        await sleep(35)
    }
}

hideMusicController()