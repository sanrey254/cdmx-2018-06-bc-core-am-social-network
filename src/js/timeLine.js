
socialNetwork.initializeFirebase();
let db = firebase.firestore();

document.getElementById('sign-out').addEventListener('click', event =>{
  event.preventDefault();
  socialNetwork.signOut();
})

const setUserProfile = user =>{
  document.getElementById('current-user-name').innerHTML = user.displayName;
  document.getElementById('current-user-email').innerHTML = user.email;
  userPhoto = document.getElementById('user-image');
  if (user.photoURL === null) {
    userPhoto.src = '../images/user-default2.jpg';
  } else {
    userPhoto.src = `${user.photoURL}?height=300`;
  }
};

const getCurrentUserData = () =>{
  let userPhotoLink;
  firebase.auth().onAuthStateChanged(user => {
	  if (user) {
      setUserProfile(user);
	    document.getElementById('send-post').addEventListener('click', event =>{
        event.preventDefault();
        let datePost = `${new Date()}`;
        const contentPost = document.getElementById('user-content-post').value;
        if(user.photoURL === null){
          userPhotoLink = '../images/user-default2.jpg';
        }else{
          userPhotoLink = user.photoURL;
        }
        db.collection('post').add({
				    userID: user.uid,
				    userName: user.displayName,
            userPhoto: userPhotoLink,
				    time: datePost,
            likes: 0,
				    content: contentPost
        }).then(result => {
  			    swal({
  	        	  	confirmButtonText: 'Aceptar',
  		            type: 'success',
  		            title: 'Publicación exitosa'
            		});
  			    document.getElementById('user-content-post').value = '';
  			    drawPostByUser();  
        }).catch(error => {
			       console.error('Error adding document: ', error);
        });
      });
	  } else {
      location.href = ('../index.html');
	  }
  });
};

const drawPostByUser = () =>{
  const postRef = db.collection('post').orderBy('time', 'desc');

  postRef.get()
    .then(element => {
      let result = '';
      let i = 0;
      element.forEach(post => {
       // let userInfo = getUsersTable(post.data().userID);
        //console.log(userInfo);
        result += `<div class="card mb-4 border-secondary">
          <div class="card-body">
            <p class="card-text">${post.data().content}</p>
          </div><div class="card-header small-font"><div class="container"><div class="row"><div class="col-md-8"><div class="row"><div class="col-md-2 pr-0 col-2"><img src="${post.data().userPhoto}" class="rounded-circle profile-image"></div><div class="col-10 col-md-10 pl-0"><strong>${post.data().userName}</strong><p>${post.data().time}</p></div></div></div><div class="col-md-4 text-md-right text-center">${post.data().likes} <button class="no-btn mr-4" onclick="addLikeToPost('${post.id}')"><i class="fas fa-thumbs-up"></i></button>
          <button class="no-btn" onclick="deletePost('${post.id}')"><i class="far fa-trash-alt"></i></button><button class="no-btn" onclick="updatePost('${post.id}')"><i class="ml-3 fas fa-pencil-alt"></i></button></div></div></div>
          </div>
        </div>`;
        i++;
      });
      document.getElementById('list-of-post').innerHTML = result;
    });
};

const addLikeToPost = (postID) => {
  let currentLikes;
  db.collection('post').doc(postID).get()
    .then(post => {
      db.collection('post').doc(postID).update({
        likes: post.data().likes += 1
      }).then(element => {
        drawPostByUser();
      }).catch(element => {
        console.log('Error al aumentar contador de likes');
      });
    });
};

const deletePost = (postID) =>{
  db.collection('post').doc(postID).delete()
    .then(element => {
      swal({
        confirmButtonText: 'Aceptar',
        type: 'success',
        title: 'Publicación eliminada'
      });
      drawPostByUser();
    }).catch(element => {
      swal({
        confirmButtonText: 'Aceptar',
        type: 'error',
        title: 'Error al eliminar la publicación',
        text: 'Inténtalo de nuevo'
      });
    });
};

const updatePost = (postID) =>{

};


getCurrentUserData();
drawPostByUser();