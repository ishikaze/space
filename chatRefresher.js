
const myIframe = document.getElementById('chattable');
const initialSrc = myIframe.src; 

async function reloadIframe() {
    await sleep(5000)
    console.log('Network back online. Reloading iframe...');
    myIframe.src = initialSrc; 
    chattable.initialize({
        stylesheet: "chattable.css",
    });
}

window.addEventListener('online', reloadIframe);

window.addEventListener('offline', function() {
    console.log('Network disconnected.');
});

function checkAndReloadIfEmpty() {
    try {
        if (myIframe.contentDocument && myIframe.contentDocument.body.children.length === 0) {
            console.log('Iframe appears empty. Reloading...');
            reloadIframe();
        }
    } catch (e) {
        console.log('Cannot access iframe content due to cross-origin restrictions, relying solely on network events.');
        reloadIframe();
    }
}

console.log('refresher active')
