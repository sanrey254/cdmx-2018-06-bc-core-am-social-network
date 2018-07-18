window.socialNetwork = {

  initializeFirebase: () => {
    firebase.initializeApp({
      apiKey: 'AIzaSyBky-k8MpDNLWT569FAY2JkYbZRQ7ezVl0',
      authDomain: 'doggyfriends-254.firebaseapp.com',
      databaseURL: 'https://doggyfriends-254.firebaseio.com',
      projectId: 'doggyfriends-254',
      storageBucket: 'doggyfriends-254.appspot.com',
      messagingSenderId: '650490372910'
    });
  },

  // Ingreso con correo y contraseña
  loginWithEmailAndPassword: (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        location.href = ('views/timeLine.html');
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Contraseña invalida');
        } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
          alert('Información de ingreso invalida');
        }
      });
  },

  // Ingreso con correo de Google
  loginWithGoogle: () => {
    // Comprueba que el usaurio no haya ingresado antes, que no tenga una sesión activa.
    if (!firebase.auth().currentUser) {
      // Crear un nuevo objeto para realizar la conexión con la API de google
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      firebase.auth().signInWithPopup(provider).then(result => {
        // Datos obtenido después de hacer la conexión
        const token = result.credential.accessToken;
        const user = result.user;
        const name = result.user.displayName;
        console.log(name);
        // Errores en la conexión
      }).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('Están intentando ingresar con un usuario ya existente');
        }
      });
    } else {
      firebase.auth().signOut();
    }
  }
};
