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
        if(user){
            uid=user.uid;
            $('#userEmail').text('Welcome : '+user.email);
            var postData={'userEmail':user.email};
            $.ajax(
              {
                  url : "/getPriviledge",
                  type: "POST",
                  data : postData,
                  success:function(data, textStatus, jqXHR) 
                  {
                      if(data!=="Admin") window.location.replace('/');
                      else $('#bodyContainer').toggle();
                  },
                  error: function(jqXHR, textStatus, errorThrown) { window.alert("Connection Error"); }
              });
        }else window.location.replace('/');
    });
    $('body').on('click','#logout',()=>{
        firebase.auth().signOut();
    });
});