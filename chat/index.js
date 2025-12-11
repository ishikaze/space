import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signOut, onAuthStateChanged, updateProfile, sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, 
    deleteDoc, doc, updateDoc, serverTimestamp, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCLs7v4gqPOFexVSmQV8wH-zNsHIC9YKq0",
    authDomain: "space-chat-34d67.firebaseapp.com",
    projectId: "space-chat-34d67",
    storageBucket: "space-chat-34d67.firebasestorage.app",
    messagingSenderId: "561333513128",
    appId: "1:561333513128:web:2100816713a300ff470b9d",
    measurementId: "G-RYF1RK7T0Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const MOD_UIDS = ["XPL0Gn32XgPNrrIp7M56U9f2kSY2"]; 

// --- DOM ELEMENTS ---
// Auth Views
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const verifyScreen = document.getElementById('verify-screen');

// App Views
const appContainer = document.getElementById('app-container');
const uiToast = document.getElementById('ui-toast');

// Inputs
const loginEmail = document.getElementById('login-email');
const loginPass = document.getElementById('login-pass');
const regUsername = document.getElementById('reg-username');
const regEmail = document.getElementById('reg-email');
const regPass = document.getElementById('reg-pass');

// Error Msgs
const loginError = document.getElementById('login-error');
const regError = document.getElementById('reg-error');
const verifyMsg = document.getElementById('verify-msg');

// App Elements
const headerTitle = document.getElementById('header-title');
const currentUserPfp = document.getElementById('current-user-pfp');
const msgList = document.getElementById('messages-list');
const userListEl = document.getElementById('user-list');
const typingIndicatorEl = document.getElementById('typing-indicator');
const contextMenu = document.getElementById('context-menu');
const profileModal = document.getElementById('profile-modal');
const profileBtn = document.getElementById('profile-btn');
const closeModalSpans = document.querySelectorAll('.close-modal');
const savePfpUrlBtn = document.getElementById('save-pfp-url-btn');
const syncDiscordBtn = document.getElementById('sync-discord-btn');
const pfpStatusMsg = document.getElementById('pfp-status-msg');
const editInput = document.getElementById('edit-message-input');
const confirmEditBtn = document.getElementById('confirm-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const notifyAudio = document.getElementById('notify-sound');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal'); 

// --- STATE ---
let currentUser = null;
let unsubscribeMsg = null;
let unsubscribeUsers = null;
let unsubscribePfpSync = null;
let unsubscribeTyping = null;
let heartbeatInterval = null;
let typingTimeout = null;
let pendingEditId = null;
let pendingDeleteId = null;
const userPfpCache = {};

// Rate Limits
const RATE_LIMIT_MS = 1500;
const MAX_MSG_LENGTH = 1000;
let lastMsgTime = 0;
let lastMsgText = "";

// --- UTILITIES ---
function showToast(msg, type = 'default') {
    uiToast.textContent = msg;
    uiToast.className = "show " + type;
    setTimeout(() => { uiToast.className = uiToast.className.replace("show", ""); }, 3000);
}

function showAuthError(element, msg) {
    element.textContent = msg;
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 5000);
}

// --- AUTH UI SWITCHING ---

document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

// --- AUTH LOGIC ---

// 1. REGISTER
document.getElementById('register-btn').addEventListener('click', async () => {
    const email = regEmail.value.trim();
    const pass = regPass.value;
    const rawName = regUsername.value.trim();

    if (!rawName) return showAuthError(regError, "Username required");
    if (rawName.length < 3) return showAuthError(regError, "Username too short");
    
    const usernameId = rawName.toLowerCase().replace(/\s+/g, '');

    try {
        // Check Username Uniqueness
        const usernameRef = doc(db, "usernames", usernameId);
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) throw new Error("Username already taken");

        // Create Auth User
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const user = cred.user;

        // Reserve Username
        await setDoc(usernameRef, { uid: user.uid, displayName: rawName });

        // Setup Profile
        const defaultPfp = `https://ui-avatars.com/api/?name=${rawName}&background=random`;
        await updateProfile(user, { displayName: rawName, photoURL: defaultPfp });
        await updatePublicProfile(user.uid, rawName, defaultPfp);

        // Send Verification Email
        await sendEmailVerification(user);

        // UI will be handled by onAuthStateChanged
    } catch (err) {
        showAuthError(regError, err.message);
    }
});

// 2. LOGIN
document.getElementById('login-btn').addEventListener('click', async () => {
    try {
        await signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value);
    } catch (err) {
        showAuthError(loginError, err.message);
    }
});

// 3. LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
document.getElementById('back-to-login-btn').addEventListener('click', () => signOut(auth));

// 4. VERIFICATION HANDLING
document.getElementById('resend-verify-btn').addEventListener('click', async () => {
    if (currentUser && !currentUser.emailVerified) {
        try {
            await sendEmailVerification(currentUser);
            verifyMsg.textContent = "Email resent! Check your spam folder.";
            verifyMsg.style.color = "lightgreen";
        } catch (e) {
            verifyMsg.textContent = "Error resending: " + e.message;
        }
    }
});

document.getElementById('check-verify-btn').addEventListener('click', async () => {
    if (currentUser) {
        // Force refresh user token to get updated emailVerified status
        await currentUser.reload();
        // Trigger a fake auth state change check manually, or let Firebase handle it
        if (currentUser.emailVerified) {
            window.location.reload(); // Simplest way to restart app into chat mode
        } else {
            verifyMsg.textContent = "Not verified yet. Please click the link in your email.";
            verifyMsg.style.color = "#ff4757";
        }
    }
});

// --- AUTH STATE OBSERVER ---

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    
    // RESET UI
    authContainer.style.display = 'none';
    appContainer.style.display = 'none';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    verifyScreen.style.display = 'none';

    if (user) {
        // LOGGED IN
        if (user.emailVerified) {
            // A. VERIFIED -> SHOW CHAT
            appContainer.style.display = 'flex';
            
            headerTitle.textContent = user.displayName || user.email;
            currentUserPfp.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`;
            
            updatePublicProfile(user.uid, user.displayName, user.photoURL);
            initPfpSync();
            loadMessages();
            initPresenceSystem(user);
            initTypingListener();
        } else {
            // B. NOT VERIFIED -> SHOW VERIFY SCREEN
            authContainer.style.display = 'flex';
            verifyScreen.style.display = 'flex';
            document.getElementById('verify-email-display').textContent = user.email;
        }
    } else {
        // LOGGED OUT -> SHOW LOGIN
        authContainer.style.display = 'flex';
        loginForm.style.display = 'flex';
        cleanup();
    }
});

// --- PROFILE LOGIC ---

profileBtn.onclick = () => profileModal.style.display = "block";
closeModalSpans.forEach(btn => btn.onclick = () => document.getElementById(btn.dataset.target).style.display = 'none');
window.onclick = (e) => { if(e.target.classList.contains('modal')) e.target.style.display = 'none'; };

savePfpUrlBtn.onclick = async () => {
    const url = document.getElementById('pfp-url-input').value.trim();
    if (url) await changeUserPfp(url);
};

syncDiscordBtn.onclick = async () => {
    const discordId = document.getElementById('discord-id-input').value.trim();
    if (!discordId) return;
    pfpStatusMsg.textContent = "Fetching...";
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const json = await res.json();
        if (json.success && json.data.discord_user) {
            const avatar = json.data.discord_user.avatar;
            if (avatar) {
                const ext = avatar.startsWith("a_") ? "gif" : "png";
                await changeUserPfp(`https://cdn.discordapp.com/avatars/${discordId}/${avatar}.${ext}`);
            } else {
                pfpStatusMsg.textContent = "No avatar found.";
            }
        } else {
            pfpStatusMsg.textContent = "User not found.";
        }
    } catch (e) {
        pfpStatusMsg.textContent = "Error fetching Discord data.";
    }
};

async function changeUserPfp(url) {
    try {
        await updateProfile(currentUser, { photoURL: url });
        currentUserPfp.src = url;
        await updatePublicProfile(currentUser.uid, currentUser.displayName, url);
        await updateDoc(doc(db, "status", currentUser.uid), { photoURL: url });
        pfpStatusMsg.textContent = "Success!";
        pfpStatusMsg.style.color = "lightgreen";
        setTimeout(() => profileModal.style.display = 'none', 1000);
    } catch (e) {
        pfpStatusMsg.textContent = e.message;
        pfpStatusMsg.style.color = "red";
    }
}

async function updatePublicProfile(uid, name, photoURL) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { displayName: name, photoURL: photoURL || "" }, { merge: true });
}

function initPfpSync() {
    const q = query(collection(db, "users"));
    unsubscribePfpSync = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            userPfpCache[doc.id] = data.photoURL;
            document.querySelectorAll(`.pfp-uid-${doc.id}`).forEach(img => {
                if (img.src !== data.photoURL) img.src = data.photoURL;
            });
        });
    });
}

// --- CONTEXT MENU & MODAL LOGIC ---

function handleContextMenu(e, msgId, data) {
    const isMe = data.uid === currentUser.uid;
    const isMod = MOD_UIDS.includes(currentUser.uid);

    if (!isMe && !isMod) return;

    contextMenu.innerHTML = '';
    const ul = document.createElement('ul');

    // Edit Option (Only Author)
    if (isMe) {
        const editLi = document.createElement('li');
        editLi.innerText = 'Edit Message';
        editLi.onclick = () => {
            openEditModal(msgId, data.text);
            contextMenu.style.display = 'none';
        };
        ul.appendChild(editLi);
    }

    // Delete Option (Author OR Mod)
    if (isMe || isMod) {
        const delLi = document.createElement('li');
        delLi.innerText = 'Delete Message';
        delLi.className = 'delete-option';
        delLi.onclick = () => {
            openDeleteModal(msgId);
            contextMenu.style.display = 'none';
        };
        ul.appendChild(delLi);
    }

    contextMenu.appendChild(ul);
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
}

// EDIT Handlers
function openEditModal(msgId, currentText) {
    pendingEditId = msgId;
    editInput.value = currentText;
    editModal.style.display = 'block';
    editInput.focus();
}

confirmEditBtn.onclick = async () => {
    const newText = editInput.value.trim();
    if (newText && pendingEditId) {
        await updateDoc(doc(db, "messages", pendingEditId), { text: newText, isEdited: true });
        editModal.style.display = 'none';
        pendingEditId = null;
    }
};

cancelEditBtn.onclick = () => {
    editModal.style.display = 'none';
    pendingEditId = null;
};

// DELETE Handlers
function openDeleteModal(msgId) {
    pendingDeleteId = msgId;
    deleteModal.style.display = 'block';
}

confirmDeleteBtn.onclick = async () => {
    if (pendingDeleteId) {
        await deleteDoc(doc(db, "messages", pendingDeleteId));
        deleteModal.style.display = 'none';
        pendingDeleteId = null;
    }
};

cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = 'none';
    pendingDeleteId = null;
};

// --- CHAT CORE ---

const messageInput = document.getElementById('message-input');
messageInput.addEventListener('input', () => {
    if (!currentUser) return;
    
    // Check Max Length while typing
    if (messageInput.value.length > MAX_MSG_LENGTH) {
        messageInput.value = messageInput.value.substring(0, MAX_MSG_LENGTH);
        showToast(`Max length is ${MAX_MSG_LENGTH} characters`, "error");
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setDoc(doc(db, "typing", currentUser.uid), { displayName: currentUser.displayName, timestamp: serverTimestamp() });
    typingTimeout = setTimeout(() => { deleteDoc(doc(db, "typing", currentUser.uid)); }, 2000);
});

function initTypingListener() {
    unsubscribeTyping = onSnapshot(query(collection(db, "typing")), (snapshot) => {
        const typers = [];
        const now = Date.now();
        snapshot.forEach(doc => {
            if (doc.id === currentUser.uid) return;
            const data = doc.data();
            if (data.timestamp && (now - data.timestamp.toDate().getTime() < 3000)) typers.push(data.displayName);
        });
        typingIndicatorEl.textContent = typers.length > 0 ? `${typers.join(", ")} ${typers.length > 1 ? 'are' : 'is'} typing...` : '';
    });
}

document.getElementById('input-area').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const now = Date.now();

    // 1. Check Rate Limit (Cooldown)
    if (now - lastMsgTime < RATE_LIMIT_MS) {
        const remaining = ((RATE_LIMIT_MS - (now - lastMsgTime)) / 1000).toFixed(1);
        showToast(`Slow down! Wait ${remaining}s`, "error");
        return;
    }

    // 2. Check Duplicate Message
    if (text === lastMsgText) {
        showToast("Don't spam the same message twice.", "error");
        return;
    }

    // 3. Check Max Length (Safety)
    if (text.length > MAX_MSG_LENGTH) {
        showToast("Message too long.", "error");
        return;
    }

    // Update Limit Trackers
    lastMsgTime = now;
    lastMsgText = text;

    // Clear input immediately for UX
    messageInput.value = '';
    
    // Clear typing status
    if (typingTimeout) clearTimeout(typingTimeout);
    deleteDoc(doc(db, "typing", currentUser.uid));

    try {
        await addDoc(collection(db, "messages"), {
            text: text,
            uid: currentUser.uid,
            displayName: currentUser.displayName || "User",
            photoURL: currentUser.photoURL || "", 
            createdAt: serverTimestamp(),
            isEdited: false
        });
    } catch (err) {
        console.error("Error sending:", err);
        showToast("Error sending message", "error");
        // Restore text if failed
        messageInput.value = text; 
    }
});

function loadMessages() {
    if (unsubscribeMsg) unsubscribeMsg();
    unsubscribeMsg = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "asc")), (snapshot) => {
        msgList.innerHTML = '';
        let isNewMessage = false;
        snapshot.docChanges().forEach((change) => {
             if (change.type === "added" && !change.doc.metadata.hasPendingWrites) isNewMessage = true;
        });
        snapshot.forEach((docSnap) => {
            renderMessage(docSnap.id, docSnap.data());
        });
        msgList.scrollTop = msgList.scrollHeight;
        if (isNewMessage) {
            const lastChange = snapshot.docChanges().pop();
            if (lastChange && lastChange.doc.data().uid !== currentUser.uid) notifyAudio.play().catch(e => { });
        }
    });
}

function renderMessage(id, data) {
    const li = document.createElement('li');
    li.className = 'message-item';
    const time = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...';
    const edited = data.isEdited ? '<span class="edited-tag" style="font-size:0.7em;color:#888;">(edited)</span>' : '';
    const cachedPfp = userPfpCache[data.uid];
    const pfpSrc = cachedPfp || data.photoURL || `https://ui-avatars.com/api/?name=${data.displayName}`;

    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleContextMenu(e, id, data);
    });

    li.innerHTML = `
        <img class="message-avatar pfp-uid-${data.uid}" src="${pfpSrc}" onerror="this.src='https://ui-avatars.com/api/?name=?'">
        <div class="message-body">
            <div class="message-meta"><strong>${escapeHtml(data.displayName)}</strong> ${time}</div>
            <div class="message-content">${escapeHtml(data.text)} ${edited}</div>
        </div>
    `;
    msgList.appendChild(li);
}

function initPresenceSystem(user) {
    const userStatusRef = doc(db, "status", user.uid);
    const updateHeartbeat = () => {
        setDoc(userStatusRef, {
            displayName: user.displayName || "Anon",
            photoURL: user.photoURL || "",
            state: 'online',
            last_changed: serverTimestamp()
        }, { merge: true });
    };
    updateHeartbeat();
    heartbeatInterval = setInterval(updateHeartbeat, 60000);
    unsubscribeUsers = onSnapshot(query(collection(db, "status"), orderBy("last_changed", "desc")), (snapshot) => {
        userListEl.innerHTML = '';
        const now = Date.now();
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (!data.last_changed) return;
            if (now - data.last_changed.toDate().getTime() < 120000) {
                renderOnlineUser(doc.id, data);
            }
        });
    });
}

function renderOnlineUser(uid, data) {
    const li = document.createElement('li');
    li.className = 'online-user';
    const currentSrc = userPfpCache[uid] || data.photoURL || `https://ui-avatars.com/api/?name=${data.displayName}`;
    li.innerHTML = `
        <img class="avatar-small pfp-uid-${uid}" src="${currentSrc}" style="width:25px;height:25px;">
        <span class="online-dot"></span>${escapeHtml(data.displayName)}
    `;
    userListEl.appendChild(li);
}

function cleanup() {
    if (unsubscribeMsg) unsubscribeMsg();
    if (unsubscribeUsers) unsubscribeUsers();
    if (unsubscribePfpSync) unsubscribePfpSync();
    if (unsubscribeTyping) unsubscribeTyping();
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (typingTimeout) clearTimeout(typingTimeout);
    msgList.innerHTML = '';
    userListEl.innerHTML = '';
    typingIndicatorEl.textContent = '';
}

function escapeHtml(text) {
    return text ? text.replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    }) : '';
}

window.addEventListener('click', () => { if (contextMenu) contextMenu.style.display = 'none'; });
window.addEventListener('scroll', () => { if (contextMenu) contextMenu.style.display = 'none'; }, true);