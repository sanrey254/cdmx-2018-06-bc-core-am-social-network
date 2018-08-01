socialNetwork.initializeFirebase();

document.getElementById('register-button').addEventListener('click', event => {
  event.preventDefault();
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

document.getElementById('github-button').addEventListener('click', event =>{
  event.preventDefault();
  socialNetwork.loginWithGitHub();
});

document.getElementById('info-button').addEventListener('click', event => {
  event.preventDefault();
  swal({
    title: '<span>¿Qué es Doggy Friends  <i class="fas fa-paw"></i></span>?',
    type: 'info',
    html: '<p><em>¿Eres dueño de un perro y este tiene problemas de comportamiento?</em><p><p><em>¿Te gustaría interactuar con otras personas con experiencia en conflictos caninos?</em></p><p><em>¿Te interesa pertenecer a una comunidad para amantes de los perros?</em></p><p><strong>Doggy Friends</strong> es una red social para las personas que quieran compartir consejos y recomendaciones sobre la educación de su mascota, y encontrar diferentes alternativas para lidiar con los problemas de comportamiento de su perro.</p>',
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> ¡Genial, quiero unirme!',
    confirmButtonAriaLabel: '¡Genial, quiero unirme!'
  });
});
