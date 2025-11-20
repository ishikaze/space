/**
 * Parses the content of an LRC file.
 * @param {string} lrcContent
 * @returns {Array<Object>}
 */
function parseLRC(lrcContent) {
  const lines = lrcContent.split('\n');
  const lyrics = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();
      if (text) {
        lyrics.push({ time, text });
      }
    }
  }
  return lyrics;
}

/**
 * Initializes and controls the lyric display synchronized with an audio element.
 * @param {Array<Object>} lyrics The parsed lyrics array.
 * @param {HTMLAudioElement} audioEl The audio element to sync with.
 * @param {HTMLElement} container The container for the lyric lines.
 */
function setupLyricsPlayer(lyrics, audioEl, container) {
  const lineElements = [
    container.querySelector('#line-1'),
    container.querySelector('#line-2')
  ];
  const lineTimeouts = [null, null];
  let currentLineSlot = 0;
  let lastLyricIndex = 0;

  const SECONDS_PER_CHARACTER = 0.125;
  const MINIMUM_DELAY = 1000;

  function handleTimeUpdate() {
    const currentTime = audioEl.currentTime;
    let newLyricIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newLyricIndex = i;
      }
    }

    if (newLyricIndex !== -1 && newLyricIndex !== lastLyricIndex) {
      const targetLine = lineElements[currentLineSlot];
      const newText = lyrics[newLyricIndex].text;
      const finalDelay = Math.max(newText.length * SECONDS_PER_CHARACTER * 1000, MINIMUM_DELAY);
      
      clearTimeout(lineTimeouts[currentLineSlot]);

      const updateAndFadeIn = () => {
        targetLine.textContent = newText;
        targetLine.classList.add('active');
        lineTimeouts[currentLineSlot] = setTimeout(() => {
          targetLine.classList.remove('active');
        }, finalDelay);
      };

      if (targetLine.classList.contains('active')) {
        targetLine.addEventListener('transitionend', updateAndFadeIn, { once: true });
        targetLine.classList.remove('active');
      } else {
        updateAndFadeIn();
      }

      lastLyricIndex = newLyricIndex;
      currentLineSlot = 1 - currentLineSlot;
    }
  }

  function handleSeek() {
    const currentTime = audioEl.currentTime;
    let currentLyricIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            currentLyricIndex = i;
        }
    }
    
    lineElements.forEach(line => {
        line.classList.remove('active');
        line.textContent = '';
    });
    clearTimeout(lineTimeouts[0]);
    clearTimeout(lineTimeouts[1]);

    if (currentLyricIndex !== -1) {
        lineElements[0].textContent = lyrics[currentLyricIndex].text;
        lineElements[0].classList.add('active');
        lastLyricIndex = currentLyricIndex;
        currentLineSlot = 1;
    } else {
        lastLyricIndex = -1;
        currentLineSlot = 0;
    }
  }

  audioEl.addEventListener('timeupdate', handleTimeUpdate);
  audioEl.addEventListener('seeked', handleSeek);
}