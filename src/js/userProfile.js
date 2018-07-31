socialNetwork.initializeFirebase();
let db = firebase.firestore();

const drawUserAdditionalInfo = () => {
  let breedElements = '<option value="" disabled selected>Elige una raza</option>';
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection('dogs').orderBy('raza', 'asc').get()
        .then(breed => {
          breed.forEach(element => {
            breedElements += `<option value="${element.data().raza}">${element.data().raza}</option>`;
          });
          document.getElementById('select-for-dog-breed').innerHTML = breedElements;
        });
      if (user.displayName !== null) {
        const name = document.getElementById('user-name');
        name.value = user.displayName;
        name.disabled = true;
      }
      db.collection('users').get()
        .then(userResult => {
          userResult.forEach(element => {
            if (element.data().userID === user.uid) {
              if (element.data().userName !== null) {
                const name = document.getElementById('user-name');
                name.value = element.data().userName;
                name.disabled = true;
                const dogName = document.getElementById('user-dog-name');
                dogName.value = element.data().dogName;
                dogName.disabled = true;
                const dogBreed = document.getElementById('select-for-dog-breed');
                dogBreed.value = element.data().dogBreed;
                dogBreed.disabled = true;
                const dogAge = document.getElementById('user-dog-age');
                dogAge.value = element.data().dogAge;
                dogAge.disabled = true;
                document.getElementById('send-user-doggy-info').disabled = true;
              }
            }
          });
        });
    } else {
      location.href = ('../index.html');
    }
  });
};

document.getElementById('send-user-doggy-info').addEventListener('click', event => {
  event.preventDefault();
  const userName = document.getElementById('user-name').value;
  const userDogBreed = document.getElementById('select-for-dog-breed').value;
  const userDogName = document.getElementById('user-dog-name').value;
  const userDogAge = document.getElementById('user-dog-age').value;
  setUserAdditionalInfo(userName, userDogBreed, userDogName, userDogAge);
  clearInputs();
});


setUserAdditionalInfo = (name, breed, dogName, dogAge) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (user.displayName !== null) {
        name = user.displayName;
      }
      db.collection('users').add({
        userEmail: user.email,
        userID: user.uid,
        userName: name,
        dogBreed: breed,
        dogName: dogName,
        dogAge: dogAge
      })
        .then(() => {
          swal({
            confirmButtonText: 'Aceptar',
            type: 'success',
            title: 'Datos guardados'
          });
          drawUserAdditionalInfo();
        })
        .catch(error => {
          console.log('Error al editar', error);
        });
    }
  });
};

const clearInputs = () => {
  document.getElementsByClassName('clear').value = '';
};

drawUserAdditionalInfo();
setUserProfile();
