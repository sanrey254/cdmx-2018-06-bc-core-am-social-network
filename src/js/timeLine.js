socialNetwork.initializeFirebase();
let db = firebase.firestore();

document.getElementById('sign-out').addEventListener('click', event => {
  event.preventDefault();
  socialNetwork.signOut();
});

const getCurrentUserData = () => {
  let userPhotoLink;
  let currentName;
  firebase.auth().onAuthStateChanged(user => { 
    if (user) {
      setUserProfile();
      document.getElementById('send-post').addEventListener('click', event => {
        event.preventDefault();
        let datePost = firebase.firestore.FieldValue.serverTimestamp();
        const contentPost = document.getElementById('user-content-post').value;
        if (contentPost !== '' && contentPost !== ' ') {
          if (user.photoURL === null) { 
            userPhotoLink = '../images/user-default2.jpg';
          } else {
            userPhotoLink = user.photoURL;
          }
          if (user.displayName === null) {
            currentName = user.email;
          } else {
            currentName = user.displayName;
          }
          db.collection('post').add({
            userID: user.uid,  
            userName: currentName,
            userPhoto: userPhotoLink,
            time: datePost,
            likes: [],
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
        }
      });
    } else { 
      location.href = ('../index.html');
    }
  });
};

const drawPostByUser = () => {
  firebase.auth().onAuthStateChanged(user => { 
    if (user) { 
      const currentUserID = user.uid; 
      const postRef = db.collection('post').orderBy('time', 'desc');
      postRef.get() 
        .then(element => { 
          let result = '';
          element.forEach(post => {
            if (currentUserID === post.data().userID) {
              result += `<div class="card mb-4 border-secondary">
            <div class="card-body">
              <p class="card-text" id="${post.id}">${post.data().content}</p>
            </div><div class="card-header small-font"><div class="container"><div class="row"><div class="col-md-8"><div class="row"><div class="col-md-2 px-0 px-md-2 col-2"><img src="${post.data().userPhoto}" class="rounded-circle profile-image"></div><div class="col-10 col-md-10 pl-0"><strong>${post.data().userName}</strong><p>${post.data().time}</p></div></div></div><div class="col-md-4 text-md-right text-center">${post.data().likes.length} <button class="no-btn mr-4" onclick="addLikeToPost('${post.id}')"><i class="fas fa-thumbs-up"></i></button>
            <button class="no-btn" onclick="deletePost('${post.id}')"><i class="far fa-trash-alt"></i></button><button class="no-btn" onclick="createUpdateArea('${post.id}')"><i class="ml-3 fas fa-pencil-alt"></i></button></div></div></div>
            </div>
            <div class="card-footer"><textarea id="comment-content" class="form-control form-textarea textarea-comment" placeholder="Escribe una comentario"></textarea><div class="text-right"><button class="btn btn-warning mt-2" onclick="addCommentToPost('${post.id}')" title="Guardar cambios"><i class="fas fa-location-arrow"></i></button></div></div>
          </div>`;
              drawCommentByPost(post.id);
            } else {
              result += `<div class="card mb-4 border-secondary">
            <div class="card-body">
              <p class="card-text" id="${post.id}">${post.data().content}</p>
            </div><div class="card-header small-font"><div class="container"><div class="row"><div class="col-md-8"><div class="row"><div class="col-md-2 px-0 px-md-2 col-2"><img src="${post.data().userPhoto}" class="rounded-circle profile-image"></div><div class="col-10 col-md-10 pl-0"><strong>${post.data().userName}</strong><p>${post.data().time}</p></div></div></div><div class="col-md-4 text-md-right text-center">${post.data().likes.length} <button class="no-btn mr-4" onclick="addLikeToPost('${post.id}')"><i class="fas fa-thumbs-up"></i></button></div></div></div>
            </div>
            <div class="card-footer"><textarea id="comment${post.id}" class="form-control form-textarea textarea-comment" placeholder="Escribe una comentario"></textarea><div class="text-right"><button class="btn btn-warning mt-2 btn-comment" onclick="addCommentToPost('${post.id}')" title="Publicar comentario"><i class="fas fa-location-arrow"></i></button></div><div id="comment-area${post.id}"></div></div>
          </div>`;
              drawCommentByPost(post.id);
            }
          });
          document.getElementById('list-of-post').innerHTML = result; 
        });
    } else {
      location.href = ('../index.html');
    }
  });
};

const checkUserIDforLike = (userID, likes) => {
  const positionUserID = likes.indexOf(userID);
  if (positionUserID === -1) {
    return true;
  } else {
    return positionUserID;
  }
};

const addLikeToPost = (postID) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const currentUserID = user.uid;
      db.collection('post').doc(postID).get()
        .then(post => { 
          let currentUserLikes = post.data().likes;
          const checkUserLike = checkUserIDforLike(currentUserID, post.data().likes);
          if (checkUserLike === true) {
            currentUserLikes.push(`${currentUserID}`); 
            db.collection('post').doc(postID).update({
              likes: currentUserLikes
            }).then(element => {
              drawPostByUser();
            }).catch(element => {
              console.log('Error al aumentar contador de likes');
            });
          } else { 
            currentUserLikes.splice(checkUserLike, 1);
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

const drawCommentByPost = (postID) => {
  let result = '';
  db.collection('comment').get()
    .then(commentResult => {
      commentResult.forEach(element => {
        if (element.data().postID === postID) {
          result += `<div class="card-footer card-comment">
        <div class="small-font"><div class="container-fluid"><div class="row"><div class="col-md-2 col-2 px-0 px-md-2 text-center middle-aling"><img src="${element.data().userPhoto}" class="rounded-circle profile-small-image align-middle"></div><div class="col-md-6">${element.data().content}<p class="little-font"><strong>${element.data().userName} - ${element.data().time}</strong><p></div></div></div></div>
            </div>`;
        }
      });
      document.getElementById(`comment-area${postID}`).innerHTML = result;
    });
};

const addCommentToPost = (postID) => {
  let currentUserName = '';
  const commentContent = document.getElementById(`comment${postID}`).value;
  console.log(commentContent);
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (user.photoURL === null) {
        userPhotoLink = '../images/user-default2.jpg';
      } else {
        userPhotoLink = user.photoURL;
      }
      let dateComment = firebase.firestore.FieldValue.serverTimestamp();
      if (user.displayName === null) {
        db.collection('users').get()
          .then(userResult => {
            userResult.forEach(element => {
              if (element.data().userID === user.uid) {
                currentUserName = element.data().userName;
              }
            });
          });
      } else {
        currentUserName = user.displayName;
      }
      db.collection('comment').add({
        content: commentContent,
        postID: postID,
        userID: user.uid,
        userName: currentUserName,
        userPhoto: userPhotoLink,
        time: dateComment
      })
        .then(result => {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'success',
            title: 'Comentario existoso'
          });
          drawPostByUser();
        })
        .catch(error => {
          console.log('Error en comentario', error);
        });
    }
  });
};
const deletePost = (postID) => {
  swal({
    title: '¿Estas seguro de eliminar la publicación?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ffc107',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  }).then(confirm => {
    if (confirm.value) {
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
    }
  });
};

const createUpdateArea = postID => {
  db.collection('post').doc(postID).get()
    .then(post => {
      document.getElementById(postID).innerHTML = `<textarea class="form-control form-textarea" id="post${postID}" rows="4">${post.data().content}</textarea><div class="ml-auto text-right"><button class="btn btn-warning" onclick="updatePostContent('${postID}')"><i class="fas fa-save"></i></button><div>`;
    }).catch(error => {
      console.log('Error al editar');
    });
};

const updatePostContent = postID => {
  const postContent = document.getElementById(`post${postID}`).value; 
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

getCurrentUserData(); 
drawPostByUser();
