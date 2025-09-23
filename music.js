const debugPanel = document.getElementById('debug');
const player = document.getElementById('player');
const ambient = document.getElementById('ambient')
let day
let month
let hour
let minute
let newTrack
let preloaded = false;
let timeOverride = localStorage.getItem("timeOverride");
let selectedNewTrack = false;

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

function preloadAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("canplaythrough", () => resolve(), { once: true });
  });
}

let timeOfDay;
function getNewTrack() {
    if (selectedNewTrack) {
        return;
    }
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
    ambient.volume = 0.5
    ambient.play()
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

(async function() {
    updateLoadingStatus('Preloading music...');
    await preloadAudio(newTrack.url);
})();

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

player.addEventListener('timeupdate', async () => {
if (preloaded)  {
    return;
} 
if ((player.duration - player.currentTime) < 20) {
        updateTime()
        getNewTrack()
        await preloadAudio(newTrack.url).then(() => {
            log(`Preloaded next track: ${newTrack.name}`);
            preloaded = true;
        });
    }
});
// hm? the block above looks weird? i know but it bugs out if i dont do it like this...

function newSong() {
    log('Song ended, playing preloaded track...');
    playTrack(newTrack.name, newTrack.artist, newTrack.url, 0);
    preloaded = false;
    selectedNewTrack = false;
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