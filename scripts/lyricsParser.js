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
 * @param {Array<Object>} lyrics 
 * @param {HTMLAudioElement} audioEl 
 * @param {HTMLElement} container 
 * @returns {Function} 
 */
function setupLyricsPlayer(lyrics, audioEl, container) {
  const lineElements = [
    container.querySelector('#line-1'),
    container.querySelector('#line-2')
  ];
  const lineTimeouts = [null, null];
  let currentLineSlot = 0;
  let lastLyricIndex = -1;

  const SECONDS_PER_LATIN_CHARACTER = 0.25;
  const SECONDS_PER_CJK_CHARACTER = 0.75;
  const MINIMUM_DELAY = 1000;
  const CJK_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/;

  function handleTimeUpdate() {
    const currentTime = audioEl.currentTime;
    let newLyricIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newLyricIndex = i;
      }
    }

    if (newLyricIndex !== -1 && newLyricIndex !== lastLyricIndex) {
      const newText = lyrics[newLyricIndex].text;

      let targetSlot;
      const line1Active = lineElements[0].classList.contains('active');
      const line2Active = lineElements[1].classList.contains('active');

      if (!line1Active) {
        targetSlot = 0;
      } else if (!line2Active) {
        targetSlot = 1;
      } else {
        targetSlot = currentLineSlot;
      }

      const targetLine = lineElements[targetSlot];

      let calculatedDelay = 0;
      for (const char of newText) {
        if (CJK_REGEX.test(char)) {
          calculatedDelay += SECONDS_PER_CJK_CHARACTER * 1000;
        } else {
          calculatedDelay += SECONDS_PER_LATIN_CHARACTER * 1000;
        }
      }
      const finalDelay = Math.max(calculatedDelay, MINIMUM_DELAY);

      clearTimeout(lineTimeouts[targetSlot]);
      const performUpdateAndFadeIn = () => {
        targetLine.textContent = newText;
        
        setTimeout(() => {
          targetLine.classList.add('active');
          lineTimeouts[targetSlot] = setTimeout(() => {
            targetLine.classList.remove('active');
          }, finalDelay);
        }, 10);
      };
      if (targetLine.classList.contains('active')) {
        targetLine.addEventListener('transitionend', performUpdateAndFadeIn, { once: true });
        targetLine.classList.remove('active'); 
      } else {
        performUpdateAndFadeIn();
      }

      lastLyricIndex = newLyricIndex;
      currentLineSlot = 1 - targetSlot;
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