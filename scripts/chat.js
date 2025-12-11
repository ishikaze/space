const usersContainer = document.getElementById('online-list');

chattable.on("connection", function(data){
  usersContainer.innerHTML = '<h3>Online users — <span id="onlineCount"></span></h3>';
  let userCount = 0;
  let currentUserIsAnonymous = false; 

  for (const uid in data) {
    if (data.hasOwnProperty(uid)) {
      const username = data[uid];
      
      const userElement = document.createElement('div');
      userElement.textContent = `${username}`;
      userElement.classList.add('user-item');
      
      if (uid === CURRENT_USER_UID) {
        userElement.classList.add('is-you');
      }
      
      usersContainer.appendChild(userElement);
      userCount ++;
    }
  }

  document.getElementById('onlineCount').innerHTML = userCount;
});

let lastUsername

setInterval(function() {
    if (!chattable.user.name) {
        return;
    } 
        if (lastUsername !== chattable.user.name && lastUsername) {
        console.log(`username changed: ${lastUsername} to ${chattable.user.name}`)
        CURRENT_USER_UID = chattable.user.uid
        try {
            chattable.reinitialize({
                stylesheet: "chattable.css",
            })
        } catch (error) {
            console.log(error)
        }
    }
    if (chattable.user.name.startsWith("Anonymous")) {
        document.getElementById('chat-blocker').style.display = 'flex'
    } else {
        document.getElementById('chat-blocker').style.display = 'none'
    }
    lastUsername = chattable.user.name
}, 100)