firebase.database().ref('playing').once('value', function(snapshot) {
    // dome value. 


    

    console.log(snapshot.val().lyrics);
}); 