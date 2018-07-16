var config = {
    apiKey: "AIzaSyBjMOC7dAvOj09zlV0H20WZQ8JPVEuIkwM",
    authDomain: "befeminists.firebaseapp.com",
    databaseURL: "https://befeminists.firebaseio.com",
    projectId: "befeminists",
    storageBucket: "befeminists.appspot.com",
    messagingSenderId: "1067694465969"
};

firebase.initializeApp(config);


const loginWithGoogle = () =>{
	//Comprueba que el usaurio no haya ingresado antes, que no tenga una sesión activa.
	if(!firebase.auth().currentUser){
		//Crear un nuevo objeto para realizar la conexión con la API de google
		const provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		firebase.auth().signInWithPopup(provider).then(result => {
		//Datos obtenido después de hacer la conexión
	  	const token = result.credential.accessToken;
	  	const user = result.user;
	  	//Errores en la conexión
	  }).catch(error => {
		  	const errorCode = error.code;
		  	const errorMessage = error.message;
		  	const email = error.email;
		  	const credential = error.credential;
		  	if(errorCode === 'auth/account-exists-with-different-credential'){
		  		alert('Están intentando ingresar con un usuario ya existente')
		  	}
		});
	} else {
		firebase.auth().sign
	}
}
document.getElementById('google-btn').addEventListener('click', loginWithGoogle, false);