
socialNetwork.initializeFirebase();
var db = firebase.firestore();

const getCurrentUserData = () =>{
	firebase.auth().onAuthStateChanged(user => {
	  if (user) {
	    document.getElementById('current-user-name').innerHTML = user.email;
	    document.getElementById('send-post').addEventListener('click', event =>{
				event.preventDefault();
				//const user = getCurrentUserData();
				const contentPost = document.getElementById('user-content-post').value;
				db.collection("post").add({
				    userID: user.uid,
				    userEmail: user.email,
				    time: firebase.firestore.FieldValue.serverTimestamp(),
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
			    console.error("Error adding document: ", error);
			});
		});
	  } else {
	    console.log('No hay ningun usuario registrado');
	  }
	});
}


const drawPostByUser = () =>{
	const postRef = db.collection('post');
	postRef.orderBy('time', 'asc')
	postRef.get()
	.then(element =>{
		let result  = '';
		let i = 0;
		element.forEach(post =>{
			result += `<div class="post-content">
            <div class="post-container">
              <img src="../images/user-default.jpg" alt="user" class="profile-photo-md pull-left" />
              <div class="post-detail">
                <div class="user-info"><h5><a href="" class="profile-link">${post.data().userEmail}</a></h5><p class="text-muted">Publicado ${post.data().time}</p>
                </div>
                <div class="reaction"><a class="btn text-green"><i class="icon ion-thumbsup"></i> 23</a>
                </div>
                <div class="line-divider"></div>
                <div class="post-text"><p><i class="em em-thumbsup"></i><i class="em em-thumbsup"></i>${post.data().content}</p></div>
                <div class="line-divider"></div></div></div></div>`;
	        i++;
		})

		document.getElementById('list-of-post').innerHTML = result;
	})
}

getCurrentUserData();
drawPostByUser();