// funciones para cargar la vista del muro
socialNetwork.initializeFirebase();// este es para inciar firebase
let db = firebase.firestore(); // se crea variable para cada vez que se incie la base de datos

document.getElementById('sign-out').addEventListener('click', event => {
  event.preventDefault();
  socialNetwork.signOut();// cuando apreta el boton te manda a llamar la funcion sinOut
});

const setUserProfile = user => { // imprime los datos del perfil
  if (user.displayName === null) { // si el nombre esta vacio  imprime el correo
    document.getElementById('current-user-name').innerHTML = user.email;
  } else {// y si no si pon el nombre
    document.getElementById('current-user-name' ).innerHTML = user.displayName;
  }
  document.getElementById('current-user-email').innerHTML = user.email;// es para poner  el correo abajo del email
  userPhoto = document.getElementById('user-image');
  if (user.photoURL === null) { //cuando tneg imagen
    userPhoto.src = '../images/user-default2.jpg';// pon la imagen de default
  } else {
    userPhoto.src = `${user.photoURL}?height=300`;//pon la imagen del usuario el user.photo trae la url donde esta duarda la foto en el servidor y concateno la imagen a un tamaño grande
  }
};

const getCurrentUserData = () => {
  let userPhotoLink;
  let currentName;
  firebase.auth().onAuthStateChanged(user => { // esta comprueba si ya inciaste sesion
    if (user) { //si esta activo  mandas a llamar la funcion  que pinta el perfil (donde esta la id)
      setUserProfile(user);
      document.getElementById('send-post').addEventListener('click', event => {
        event.preventDefault(); // es el evento del boton de enviar
        let datePost = firebase.firestore.FieldValue.serverTimestamp(); // este es para la fecha que la agarra del servidor
        const contentPost = document.getElementById('user-content-post').value;// guarda lo que escribe el ususario
        if (contentPost !== '' && contentPost !== ' ') { // es para comprobar que no publique un espacio o algo en blanco
          if (user.photoURL === null) { // esta es la funcion de la foto de la publicacion
            userPhotoLink = '../images/user-default2.jpg';
          } else {
            userPhotoLink = user.photoURL;
          }
          if (user.displayName === null) {
            currentName = user.email;
          } else {
            currentName = user.displayName;
          }
          db.collection('post').add({  // variable: que incializa firestore  traeme la coleccion con el nombre post  y agregale los siguientes campos
            userID: user.uid,  //user sale de cuando comprobo qeu ya habia inciado sesion
            userName: currentName,
            userPhoto: userPhotoLink,
            time: datePost,
            likes: [],
            content: contentPost
          }).then(result => { //si fue exitoso muestra esto
            swal({ // la libreria js que saca las ventanitas
              confirmButtonText: 'Aceptar',
              type: 'success',
              title: 'Publicación exitosa'
            });
            document.getElementById('user-content-post').value = ''; //esta es para limpiar el textarea y no se queda lo que se escribe
            drawPostByUser();
          }).catch(error => { // y si no muestra esto
            console.error('Error adding document: ', error);
          });
        }
      });
    } else {  //si el usuario no esta activo redireccionalo al index
      location.href = ('../index.html');
    }
  });
};

const drawPostByUser = () => {// esta es para pintar todas las publicaciones
  firebase.auth().onAuthStateChanged(user => { //comprueba la sesion activa
    if (user) { //si esta activo  has esto..
      const currentUserID = user.uid; // guarda el id del usuario que esta activo es para saber si la publicacion es de el o no es de el
      const postRef = db.collection('post').orderBy('time', 'desc');//entrar a firebase  a los posts  y ordenalos por tiempo y por desendente
      postRef.get() // get es el metodo para traer todas las publicaciones
        .then(element => { // si la consulta fue exitosa has esto que sigue
          let result = '';
          element.forEach(post => { // trae los datos dentro de un arreglo e spor eso que se utiliza un for each para recorrerlos
            if (currentUserID === post.data().userID) { // si el id es igual al de la publicacion pon los botones siguientes
              result += `<div class="card mb-4 border-secondary">
            <div class="card-body">
              <p class="card-text" id="${post.id}">${post.data().content}</p>
            </div><div class="card-header small-font"><div class="container"><div class="row"><div class="col-md-8"><div class="row"><div class="col-md-2 px-0 px-md-2 col-2"><img src="${post.data().userPhoto}" class="rounded-circle profile-image"></div><div class="col-10 col-md-10 pl-0"><strong>${post.data().userName}</strong><p>${post.data().time}</p></div></div></div><div class="col-md-4 text-md-right text-center">${post.data().likes.length} <button class="no-btn mr-4" onclick="addLikeToPost('${post.id}')"><i class="fas fa-thumbs-up"></i></button>
            <button class="no-btn" onclick="deletePost('${post.id}')"><i class="far fa-trash-alt"></i></button><button class="no-btn" onclick="createUpdateArea('${post.id}')"><i class="ml-3 fas fa-pencil-alt"></i></button></div></div></div>
            </div>
          </div>`;
        } else { // si no es lo mismo no le pongas los botones
              result += `<div class="card mb-4 border-secondary">
            <div class="card-body">
              <p class="card-text" id="${post.id}">${post.data().content}</p>
            </div><div class="card-header small-font"><div class="container"><div class="row"><div class="col-md-8"><div class="row"><div class="col-md-2 px-0 px-md-2 col-2"><img src="${post.data().userPhoto}" class="rounded-circle profile-image"></div><div class="col-10 col-md-10 pl-0"><strong>${post.data().userName}</strong><p>${post.data().time}</p></div></div></div><div class="col-md-4 text-md-right text-center">${post.data().likes.length} <button class="no-btn mr-4" onclick="addLikeToPost('${post.id}')"><i class="fas fa-thumbs-up"></i></button></div></div></div>
            </div>
          </div>`;
            }
          });
          document.getElementById('list-of-post').innerHTML = result; // metelo en el container de list of post
        });
    } else {
      location.href = ('../index.html');
    }
  });
};

const checkUserIDforLike = (userID, likes) => {
  const positionUserID = likes.indexOf(userID);// en el agrego likes, busca el id  y retorna la posicion en donde esta, si no hay nada retorna -1
  if (positionUserID === -1) {
    return true;//no existe hay que agregar
  } else {
    return positionUserID; // dame en que posicion del arreglo esta el id
  }
}

const addLikeToPost = (postID) => {  //esta es la funcion de la manita cunado arriba le da click deotna esta funcion
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const currentUserID = user.uid;
      db.collection('post').doc(postID).get()// .doc es un filtro  y mando a llamar solo los que tienen el mismo id
        .then(post => {  // si se pudo hacer la consulta
          let currentUserLikes = post.data().likes;// guardo los likes que ya tien la publicacion
          const checkUserLike = checkUserIDforLike(currentUserID, post.data().likes);//mandale el id y el arreglo con los likes que ya tiene
          if (checkUserLike === true) { // agreegas el id si es true
            currentUserLikes.push(`${currentUserID}`); // si no esta has push y metelo
            db.collection('post').doc(postID).update({ // update es para editar
              likes: currentUserLikes // guarda el arreglo que ya teniamos mas el id que acabamos de meter
            }).then(element => {// si se hizo vuelve a dibujar todos los posts
              drawPostByUser();
            }).catch(element => {
              console.log('Error al aumentar contador de likes');
            });
          } else {  // este es el dislike
            currentUserLikes.splice(checkUserLike, 1); // la posicion y cunatos va a cortar
            db.collection('post').doc(postID).update({
              likes: currentUserLikes
            }).then(element => {
              drawPostByUser();
            }).catch(element => {
              console.log('Error al aumentar contador de likes');
            });
          }
        });
    } else {
      location.href = ('../index.html');
    }
  });
};

const deletePost = (postID) => { // es para leiminar
  swal({ // alert
    title: '¿Estas seguro de eliminar la publicación?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ffc107',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  }).then(confirm => {
    if (confirm.value) {
      db.collection('post').doc(postID).delete() // trelo solo este id y eliminalo
        .then(element => { // si se ppudo eliminar entra aqui
          swal({ // sale el segundo alert para decir que si se pudo eliminar
            confirmButtonText: 'Aceptar',
            type: 'success',
            title: 'Publicación eliminada'
          });
          drawPostByUser(); // se vuelve a imprimir  pero ya sin esa publicacion
        }).catch(element => {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'error',
            title: 'Error al eliminar la publicación',
            text: 'Inténtalo de nuevo'
          });
        });
    }
  });
};

const createUpdateArea = postID => { //  el boton de editar
  db.collection('post').doc(postID).get()
    .then(post => { // en el espacio donde estaba el texto lo ocnvierte en un text area  y agrega el boton de guardar
      document.getElementById(postID).innerHTML = `<textarea class="form-control form-textarea" id="post${postID}" rows="4">${post.data().content}</textarea><div class="ml-auto text-right"><button class="btn btn-warning" onclick="updatePostContent('${postID}')"><i class="fas fa-save"></i></button><div>`;
    }).catch(error => {
      console.log('Error al editar');
    });
};

const updatePostContent = postID => {// funcion del boton de guardar
  const postContent = document.getElementById(`post${postID}`).value; // vuelve a guardar el valor que ya se sobrecribio
  db.collection('post').doc(postID).get()
    .then(post => {
      db.collection('post').doc(postID).update({
        content: postContent
      }).then(element => {
        drawPostByUser();
      }).catch(element => {
        console.log('Error al editar la publicación');
      });
    });
};

getCurrentUserData(); //funcion que impirme el perfil
drawPostByUser();// funcion que impirme
