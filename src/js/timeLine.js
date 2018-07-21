
socialNetwork.initializeFirebase();
let db = firebase.firestore();

const setUserProfile = user =>{
  document.getElementById('current-user-name').innerHTML = user.email;
  userPhoto = document.getElementById('user-image');
  if(user.photoURL === null){
      userPhoto.src = '../images/user-default2.jpg';
  }else{
    userPhoto.src = user.photoURL;
  }
}

const getCurrentUserData = () =>{
  firebase.auth().onAuthStateChanged(user => {
	  if (user) {
      setUserProfile(user);
	    
	    document.getElementById('send-post').addEventListener('click', event =>{
        event.preventDefault();
        let datePost = `${new Date()}`;
        const contentPost = document.getElementById('user-content-post').value;
        db.collection('post').add({
				    userID: user.uid,
				    userEmail: user.email,
				    time: datePost,
				    content: contentPost
        })
          .then(result => {
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
	    console.log('No hay ningun usuario registrado');
	  }
  });
};


const drawPostByUser = () =>{
  const postRef = db.collection('post');
  postRef.orderBy('time', 'asc');
  postRef.get()
    .then(element =>{
      let result = '';
      let i = 0;
      element.forEach(post =>{
          result += `<div class="card mb-4 border-secondary">
                      <div class="card-header"><strong>${post.data().userEmail}</strong><p>${post.data().time}</p></div>
                      <div class="card-body">
                        <p class="card-text">${post.data().content}</p>
                      </div>
                    </div>`
	        i++;
      });

      document.getElementById('list-of-post').innerHTML = result;
    });
};

getCurrentUserData();
drawPostByUser();