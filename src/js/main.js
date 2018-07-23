socialNetwork.initializeFirebase();

document.getElementById('login-button').addEventListener('click', event => {
  event.preventDefault();
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value; 
  socialNetwork.loginWithEmailAndPassword(email, password);
});


document.getElementById('google-button').addEventListener('click', event =>{
  event.preventDefault();
  socialNetwork.loginWithGoogle();
});