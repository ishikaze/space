const version = localStorage.getItem('appVersion') || '0';

const updates = [
    {
        version: '1',
        description: `23 November 2025  Update! <br> <br>
        <ul>
            <li>fixed the new loading screen bug</li>
            <li>added the console (press the \` key to open/close)</li>
            <li>removed time of day override buttons (now a console command: timeOverride) </li>
            <li>updates alerts! from now on, you'll get a new popup on startup for changes that has been made since the last time you were here!</li>
        </ul>
        `
    },
    {
        version: '1.01',
        description: `11 December 2025  Update! <br> <br>
        <ul>
            <li>System overhaul, everything is now accessible via the dock (hover middle bottom)</li>
            <li>New chat service ran by yours truly, account is now required</li>
            <li>New game and editor demo, I wonder where it is ;)</li>
            <li>Huge mobile update</li>
        </ul>
        `
    }
]

function checkForUpdates() {
    let newVersion = version;  
    updates.forEach(update => {
        if (Number(update.version) > Number(version)) {
            defaultPopup(`Update ${update.version} <hr>${update.description}`);
            newVersion = update.version;
        }
    });
    if (newVersion !== version) {
        localStorage.setItem('appVersion', newVersion);
    }
}

checkForUpdates()