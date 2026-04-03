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
    },
    {
        version: '1.02',
        description: `Sorry about that! <br> <br>
        <ul>
            the site was down for a week or so because of some placeholder code, it is now fixed!
        </ul>
        `
    },
    {
        version: '777',
        description: `the chat will be up until firebase decides to shut it down, it will not be maintained anymore.
        `
    },
    {
        version: '888',
        description: `I am no longer working on this site. <br> <br>
        hi, everyone. due to my rapidly declining mental and physical health, i'm going off the internet for a while. i may or may not come back, but its goodbye for now. <br>
        thank you for all everyone has done for me and for anythinbg i do. i truly appreciate all of the support. <br>
        i'm sorry for the sudden annoumcement. <br> <br>
        cheerish the people around you, and tell them you love them. <br>
        you never know when it could be the last time you see them. <br> <br>
        i love you all. <br> <br>
        i hope you all have a great life, and i hope to see you again. <br> <br>
        bye now.
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