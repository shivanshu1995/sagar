$(document).ready(() => {
    var uid;
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

    firebase.auth().onAuthStateChanged((user) => {
        if(user){uid=user.uid;$('#loadingContainer').toggle();$('#bodyContainer').toggle();$('#userEmail').text('Welcome : '+user.email);}
        else window.location.replace('/')
    });
    $("#theForm").submit(function(e){
        $('#loadingContainer').toggle();
        $('#bodyContainer').toggle();
        var postData = $(this).serializeArray();
        postData.push({name: 'uid', value: uid});
        var number=$('#contactNumber').val();
        var formURL = '/saveCustomer'
        if(number.length===10){
            $.ajax(
            {
                url : formURL,
                type: "POST",
                data : postData,
                success:function(data, textStatus, jqXHR) 
                {
                    window.location.replace("/cashierPage");
                },
                error: function(jqXHR, textStatus, errorThrown) 
                {
                    $('#loadingContainer').toggle();
                    $('#bodyContainer').toggle();
                    $('#error').text('Number Already Registered !!!');
                    document.querySelector('.alert').style.display = 'block';
                    setTimeout(() => {
                      document.querySelector('.alert').style.display = 'none';
                    },3000);      
                }
            });
        }
        else{
        $('#loadingContainer').toggle();
        $('#bodyContainer').toggle();
        $('#error').text('Number must be 10 digits long');
        document.querySelector('.alert').style.display = 'block';
        setTimeout(() => {
          document.querySelector('.alert').style.display = 'none';
        },3000);
    }
        e.preventDefault(); //STOP default action
    });
    $('body').on('input','#contactNumber',()=>{
        $("#numberHelpBlock").text("Number must be 10 digits long");
    });
    $('body').on('click','#cancel',()=>{
        window.location.replace('/cashierPage');
    });
    $('body').on('click','#logout',()=>{
        firebase.auth().signOut();
    });
});