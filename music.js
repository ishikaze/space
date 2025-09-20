const debugPanel = document.getElementById('debug');
const player = document.getElementById('player');
let day
let month
let hour
let minute
let newTrack
let preloaded = false;

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
                startTimestamp: 0
            },
            {
                name: "Planet Express",
                artist: "Ujico*",
                url: "./assets/music/default/planetExpress.mp3",
                startTimestamp: 0
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
                name: "Paradise Ⅱ",
                artist: "Sound Souler",
                url: "./assets/music/default/paradise2.mp3",
                startTimestamp: 0
            },
            {
                name: "aer",
                artist: "Wisp X",
                url: "./assets/music/default/aer.mp3",
                startTimestamp: 0
            }
        ],
        lateNight: [
            {
                name: "Paradise Ⅱ",
                artist: "Sound Souler",
                url: "./assets/music/default/paradise2.mp3",
                startTimestamp: 0
            },
            {
                name: "aer",
                artist: "Wisp X",
                url: "./assets/music/default/aer.mp3",
                startTimestamp: 0
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

function getNewTrack() {
    let useTrackList = tracks.default;
    if (month === 1 && day >= 15 && day <= 30) {
        useTrackList = tracks.lunarNewYear;
    }

    log(`time is ${hour}:${minute}, month is ${month}, day is ${day}`);

    let timeOfDay;
    if (hour >= 5 && hour < 8) {
        timeOfDay = 'earlyMorning';
    } else if (hour >= 8 && hour < 12) {
        timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
        timeOfDay = 'evening';
    } else if (hour >= 21 && hour < 24) {
        timeOfDay = 'night';
    } else {
        timeOfDay = 'lateNight';
    }

    log(`Time of day determined: ${timeOfDay}`);

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

function log(message) {
    debugPanel.innerHTML += `<br>> ${message}`;
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
loadingFinished = true; 

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