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
 * @returns {Function} A cleanup function to remove the attached event listeners.
 */
function setupLyricsPlayer(lyrics, audioEl, container) {
  const lineElements = [
    container.querySelector('#line-1'),
    container.querySelector('#line-2')
  ];
  const lineTimeouts = [null, null];
  let currentLineSlot = 0;
  let lastLyricIndex = 0;

  // --- Constants for calculating display time ---
  const SECONDS_PER_LATIN_CHARACTER = 0.25; // Original value for English, etc.
  const SECONDS_PER_CJK_CHARACTER = 0.75;   // Increased time for CJK characters
  const MINIMUM_DELAY = 1000; // 1 second minimum display time
  const CJK_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/; // Regex to detect Japanese, Chinese, and full-width characters

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

      // --- NEW: Dynamic delay calculation based on content ---
      let calculatedDelay = 0;
      for (const char of newText) {
          if (CJK_REGEX.test(char)) {
              calculatedDelay += SECONDS_PER_CJK_CHARACTER * 1000; // Use CJK timing
          } else {
              calculatedDelay += SECONDS_PER_LATIN_CHARACTER * 1000; // Use standard timing
          }
      }
      const finalDelay = Math.max(calculatedDelay, MINIMUM_DELAY);
      // --- End of new calculation ---

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

  return function cleanup() {
    audioEl.removeEventListener('timeupdate', handleTimeUpdate);
    audioEl.removeEventListener('seeked', handleSeek);
    clearTimeout(lineTimeouts[0]);
    clearTimeout(lineTimeouts[1]);
    console.log("Lyric event listeners cleaned up.");
  };
}