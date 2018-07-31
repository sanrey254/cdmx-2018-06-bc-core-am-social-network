document.getElementById('sign-out').addEventListener('click', event => {
  event.preventDefault();
  socialNetwork.signOut();
});

const setUserProfile = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (user.displayName === null) {
        db.collection('users').get()
          .then(userResult => {
            userResult.forEach(element => {
              if (element.data().userID === user.uid) {
                if (element.data().userName !== null) {
                  document.getElementById('current-user-name').innerHTML = element.data().userName;
                } else {
                  document.getElementById('current-user-name').innerHTML = user.email;
                }
              }
            });
          });
      } else {
        document.getElementById('current-user-name').innerHTML = user.displayName;
      }
      document.getElementById('current-user-email').innerHTML = user.email;
      userPhoto = document.getElementById('user-image');
      if (user.photoURL === null) {
        userPhoto.src = '../images/user-default2.jpg';
      } else {
        userPhoto.src = `${user.photoURL}?height=300`;
      }
    }
  });
};

