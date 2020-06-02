$(document).ready(() => {
    $('#loadingContainer').toggle();
    // var data={};
    var firebaseConfig = {
        apiKey: "AIzaSyCmAkFkoO1D64V2jnD_3rp9zuRVf49F3fM",
        authDomain: "melfire-b4cd5.firebaseapp.com",
        databaseURL: "https://melfire-b4cd5.firebaseio.com",
        projectId: "melfire-b4cd5",
        storageBucket: "melfire-b4cd5.appspot.com",
        messagingSenderId: "249394667674",
        appId: "1:249394667674:web:3ef92f5392c9a806ecbf23",
        measurementId: "G-JF1KZ6C4B5"
      };
      firebase.initializeApp(firebaseConfig);
    // $.ajaxSetup({ async: false });
    // $.getJSON('/getConfigurationData', function(receivedData) { data = receivedData; });
    // $.ajaxSetup({ async: true });
    // firebase.initializeApp(data);

    $("#form-signin").submit(function(e){
        $('#loadingContainer').toggle();
        $('#logreg-forms').toggle();
        var postData = $(this).serializeArray();
        var email = postData[0].value;
        var password = postData[1].value;
        firebase.auth().signInWithEmailAndPassword(email,password).catch((error) => {     $('#loadingContainer').toggle();  $('#logreg-forms').toggle();             $('#error').text('Wrong Email Id or Password');
        document.querySelector('.alert').style.display = 'block';
        setTimeout(() => {
          document.querySelector('.alert').style.display = 'none';
        },3000);});
        e.preventDefault(); //STOP default action
    });

    firebase.auth().onAuthStateChanged((user) => {
        if(user){   window.location.replace('/cashierPage'); }
      });
});


function toggleResetPswd(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

function toggleSignUp(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

$(()=>{
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
})