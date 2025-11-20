const mainContainer = document.getElementById('main-container');
const popupsContainer = document.getElementById('popups-container');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

function defaultPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';

    const messageP = document.createElement('p');
    messageP.innerText = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'popup-close'; 
    closeButton.innerText = 'Okay';
    
    popup.appendChild(messageP);
    popup.appendChild(closeButton);

    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.5)';

    popupsContainer.appendChild(popup);

    closeButton.onclick = () => {
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.5)';
        popup.addEventListener('transitionend', () => {
            if (popupsContainer.contains(popup)) {
                popupsContainer.removeChild(popup);
            }
        }, { once: true });
    };

    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function checkPopups() {
    const hasPopupElements = popupsContainer && popupsContainer.querySelector('.popup') !== null;
    if (hasPopupElements) {
        popupsContainer.style.pointerEvents = 'auto';
        popupsContainer.style.backdropFilter = 'blur(5px)';
    } else {
        popupsContainer.style.pointerEvents = 'none';
        popupsContainer.style.backdropFilter = 'none';
    }
}

setInterval(checkPopups, 100);