document.addEventListener('DOMContentLoaded', () => {
    const floatText = document.querySelectorAll('.float-text');
    let floatTime = 0;
    function animateTextFloat() {
        floatTime += 0.01;
        floatText.forEach((el, i) => {
            const x = Math.sin(floatTime + i) * 4;
            const y = Math.cos(floatTime + i * 1.5) * 4;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        requestAnimationFrame(animateTextFloat);
    }
    animateTextFloat();

    const filter = document.getElementById('liquid-filter');
    const feTurbulence = filter.querySelector('feTurbulence');
    
    let time = 10;
    let baseX = 0.01;
    let baseY = 0.01;
    function animateFilter() {
        time += 0.005;
        const freqX = baseX + Math.sin(time) * 0.01;
        const freqY = baseY + Math.cos(time) * 0.01;
        feTurbulence.setAttribute('baseFrequency', `${freqX} ${freqY}`);
        const feDisplacementMap = filter.querySelector('feDisplacementMap');
        if (feDisplacementMap) {
            feDisplacementMap.setAttribute('scale', 5); 
        }
    }
    function animationLoop() {
        animateFilter();
        requestAnimationFrame(animationLoop);
    }
    animationLoop();
    setInterval(animateFilter, 100);
});