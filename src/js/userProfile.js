socialNetwork.initializeFirebase();
let db = firebase.firestore();

document.getElementById('sign-out').addEventListener('click', event => {
  event.preventDefault();
  socialNetwork.signOut();
});


const drawDogBreeds = () => {
  let breedElements = '<option value="" hidden> Selecciona una raza</option>';
  db.collection('dogs').orderBy('raza', 'asc').get()
    .then(breed =>{
      breed.forEach(element =>{
        breedElements += `<option value="${element.data().raza}">${element.data().raza}</option>`;
      });
      document.getElementById('select-for-dog-breed').innerHTML = breedElements;
    });
};

document.getElementById('send-user-doggy-info').addEventListener('click', event =>{
  event.preventDefault();
  const userName = document.getElementById('user-name').value;
  const userDogBreedSelect = document.getElementById('user-dog-breed');
  const userDogBreed = userDogBreedSelect.options[userDogBreedSelect.selectedIndex].value;
  const userDogName = document.getElementById('user-dog-name').value;
  const userDogAge = document.getElementById('user-dog-age').value;
  console.log(userDogBreedSelect);
});
drawDogBreeds();
