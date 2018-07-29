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
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Contraseña inválida',
            text: 'Inténtalo de nuevo'
          });
        } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Usuario inválido',
            text: 'Inténtalo de nuevo'
          });
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
        location.href = ('views/timeLine.html');
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
  },
  // Ingreso con cuenta de github
  loginWithGitHub: () =>{
    if (!firebase.auth().currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
      firebase.auth().signInWithPopup(provider).then(result => {
        location.href = ('views/timeLine.html');
        // Errores en la conexión
      }).catch(error => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Ya existe un usuario registrado con la dirección de correo proporcionada',
            text: 'Inténtalo de nuevo'
          });
        }
      });

    } else {
      firebase.auth().signOut();
    }
  },

  // Ingreso con correo de Google
  loginWithFacebook: () => {
    // Comprueba que el usaurio no haya ingresado antes, que no tenga una sesión activa.
    if (!firebase.auth().currentUser) {
      // Crear un nuevo objeto para realizar la conexión con la API de Facebook
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      firebase.auth().signInWithPopup(provider).then(result => {
        location.href = ('views/timeLine.html');
        // Errores en la conexión
      }).catch(error => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Ya existe un usuario registrado con la dirección de correo proporcionada',
            text: 'Inténtalo de nuevo'
          });
        }
      });
    } else {
      firebase.auth().signOut();
    }
  },

  createNewAccount: (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification().then(result => {
          console.log('Correo enviado');
          swal({
            confirmButtonText: 'Aceptar',
            type: 'success',
            title: 'Se ha enviado un enlace de verificación a tu cuenta de coreo',
            text: 'Sigue las instrucciones para ingresar a tu cuenta'
          });
          signOut();
        }).catch(error => {
          console.log('Error al enviar correo de verificación');
        });
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/invalid-email') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Dirección de correo inválida',
            text: 'Inténtalo de nuevo'
          });
        } else if (errorCode === 'auth/weak-password') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Contraseña inválida',
            text: 'Inténtalo de nuevo'
          });
        } else if (errorCode === 'auth/email-already-in-use') {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Ya existe un usuario registrado con la dirección de correo proporcionada',
            text: 'Inténtalo de nuevo'
          });
        }
      });
  },

  // Cerrar sesión
  signOut: () => {
    firebase.auth().signOut()
      .then(element => {
        location.href('../index.html');
      }).catch(error => {
        console.log('Error al cerrar sesión');
      });
  }
};
