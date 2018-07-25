socialNetwork.initializeFirebase();

document.getElementById('register-button').addEventListener('click', event => {
  event.preventDefault();
  const userName = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value; 
  socialNetwork.createNewAccount(email, password);
});

document.getElementById('google-button').addEventListener('click', event =>{
  event.preventDefault();
  socialNetwork.loginWithGoogle();
});


document.getElementById('facebook-button').addEventListener('click', event =>{
  event.preventDefault();
  socialNetwork.loginWithFacebook();
});