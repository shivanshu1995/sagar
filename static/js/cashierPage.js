function makeTransactionTokenRows(transactions,tokens){
  $('#transactionsTokensTable').empty();
  $('#transactionsTokensTable').append('<div class="row"><div class="col-sm text-primary h1" style="text-align : center">Transactions</div><div class="col-sm text-primary h1" style="text-align : center">Tokens</div></div><br>');
  var countTransactionsRow=Object.keys(transactions).length;
  var countTokensRow=Object.keys(tokens).length;
  numberOfRows=Math.max(countTransactionsRow,countTokensRow);
  var transactionsId=[];
  for(var i in transactions) transactionsId.push(i);
  var tokensId=[];
  for(var j in tokens) tokensId.push(j);
  for(var k=0; k<numberOfRows;k+=1){
    if(countTransactionsRow>0 && countTokensRow>0){
    countTransactionsRow-=1;
    countTokensRow-=1;
      $('#transactionsTokensTable').append('<div id="" class="row"><div id="transactions" class="col-sm text-primary h5" style="text-align : center"><form id="form"  class="form-inline my-2 my-lg-0"><div class="form-group"><input name="transactions" class="form-control-plaintext mr-sm-2" value="'+transactions[transactionsId[countTransactionsRow]].transactionId+'" readonly></div><div class="form-group"><input class="form-control-plaintext mr-sm-2" value="'+transactions[transactionsId[countTransactionsRow]].name+'" readonly></div><div class="form-group"><button class="btn btn-primary" type="submit">View</button></div></form></div><div id="tokens" class="col-sm text-primary h5" style="text-align : center"><form id="form" class="form-inline my-2 my-lg-0"><div class="form-group"><input name="tokens" class="form-control-plaintext mr-sm-2" value="'+tokens[tokensId[countTokensRow]].transactionId+'" readonly></div><div class="form-group"><input class="form-control-plaintext mr-sm-2" value="'+tokens[tokensId[countTokensRow]].name+'" readonly></div><div class="form-group"><button class="btn btn-primary" type="submit">View</button></div></form></div></div>');
    }
    else if(countTransactionsRow>0 && countTokensRow<=0){
        countTransactionsRow-=1;
        $('#transactionsTokensTable').append('<div id="" class="row"><div id="transactions" class="col-sm text-primary h5" style="text-align : center"><form id="form" class="form-inline my-2 my-lg-0"><div class="form-group"><input name="transactions" class="form-control-plaintext mr-sm-2" value="'+transactions[transactionsId[countTransactionsRow]].transactionId+'" readonly></div><div class="form-group"><input class="form-control-plaintext mr-sm-2" value="'+transactions[transactionsId[countTransactionsRow]].name+'" readonly></div><div class="form-group"><button class="btn btn-primary" type="submit">View</button></div></form></div><div id="" class="col-sm text-primary h1" style="text-align : center"></div></div>');
    }
    else if(countTransactionsRow<=0 && countTokensRow>0){
        countTokensRow-=1;
        $('#transactionsTokensTable').append('<div id="" class="row"><div id="tokens" class="col-sm text-primary h5" style="text-align : center"></div><div id="" class="col-sm text-primary h5" style="text-align : center"><form id="form" class="form-inline my-2 my-lg-0"><div class="form-group"><input name="tokens" class="form-control-plaintext mr-sm-2"value="'+tokens[tokensId[countTokensRow]].transactionId+'" readonly></div><div class="form-group"><input class="form-control-plaintext mr-sm-2" value="'+tokens[tokensId[countTokensRow]].name+'" readonly></div><div class="form-group"><button class="btn btn-primary" type="submit">View</button></div></form></div></div>');
    }
  }
}

function modelTransaction(data){
  var unordered=data;
  var ordered = {};
  Object.keys(unordered).sort().forEach((key) => {
  ordered[key] = unordered[key];
  });
  data=ordered;

  var ide="contactNumber";
  var contactNumber= data[ide];
  ide="name";
  var name=data[ide];

  $('#theForm').append('<div class="row"><div class="col"><input class="form-control-plaintext mr-sm-2" type="text" value="'+name+'" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext mr-sm-2" type="text" value="'+contactNumber+'" style="text-align : center" readonly></div></div><br><div class="row"><div class="col"><input class="form-control-plaintext " type="text" value="SubCategory" placeholder="SubCategory" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext" type="text" placeholder="Price" value="Price" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Previous" value="Value" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Total Price" value="Total Price" style="text-align : center" readonly></div></div>');

  for(var i in data){
    if(i.slice(0,4)==="cate"){
        $('#theForm').append('<div id="'+i+'"><div class="row"><div class="col text-primary h2"><input class="form-control-plaintext mr-sm-2" type="text" id="'+i+'" value="'+data[i]+'" placeholder="'+data[i]+'" style="text-align : center" readonly></div></div></div>')
    }
    else if(i.slice(0,4)==="subc"){
        var priceId="price_"+i.slice(12);
        var numberId="number_"+i.slice(12);
        var sumId=i+'_sum';
        var sumValue = (parseInt(data[priceId])*parseInt(data[numberId]))
        $("#category_"+i[12]).append('<div id="'+i+'" class="row"><div class="col"><input style="text-align : center" type="text" id="'+i+'" value="'+data[i]+'" placeholder="'+data[i]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+priceId+'" value="'+data[priceId]+'" placeholder="'+data[priceId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+numberId+'" value="'+data[numberId]+'" placeholder="'+data[numberId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+sumId+'" value="'+sumValue+'" placeholder="'+sumValue+'" class="form-control-plaintext" readonly></div></div>');
    }
}



  var totalId="total";
  $('#theForm').append('<br><div class="row"><div  class="col text-primary h2">Grand Total</div><div  class="col"><input type="number" id="grandTotal" placeholder="0" value="'+data[totalId]+'"  class="form-control-plaintext" readonly></div></div>');
  
  $('#exampleModalCenter').modal();

}

function modelToken(data){

  var unordered=data;
  var ordered = {};
  Object.keys(unordered).sort().forEach((key) => {
  ordered[key] = unordered[key];
  });
  data=ordered;

  var ide="contactNumber";
  var contactNumber= data[ide];
  ide="name";
  var name=data[ide];
  $('#theForm').append('<div class="row"><div class="col"><input class="form-control-plaintext mr-sm-2" type="text" value="'+name+'" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext mr-sm-2" type="text" value="'+contactNumber+'" style="text-align : center" readonly></div></div><br><div class="row"><div class="col"><input class="form-control-plaintext " type="text" value="SubCategory" placeholder="SubCategory" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext" type="text" placeholder="Price" value="Price" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Previous" value="Previous" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Requested" value="Requested" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Total" value="Total" style="text-align : center" readonly></div><div class="col"><input class="form-control-plaintext " type="text" placeholder="Total Price" value="Total Price" style="text-align : center" readonly></div></div>');
  for(var i in data){
    if(i.slice(0,4)==="cate"){
        $('#theForm').append('<div id="'+i+'"><div class="row"><div class="col text-primary h2"><input class="form-control-plaintext mr-sm-2" type="text" id="'+i+'" value="'+data[i]+'" placeholder="'+data[i]+'" style="text-align : center" readonly></div></div></div>')
    }
    else if(i.slice(0,4)==="subc"){
        var priceId="price_"+i.slice(12);
        var numberId="number_"+i.slice(12);
        var oldId="old_"+i.slice(12);
        var netId="net_"+i.slice(12);
        var sumId=i+'_sum';
        var sumValue = (parseInt(data[netId])*parseInt(data[priceId]))
        $("#category_"+i[12]).append('<div id="'+i+'" class="row"><div class="col"><input style="text-align : center" type="text" id="'+i+'" value="'+data[i]+'" placeholder="'+data[i]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+priceId+'" value="'+data[priceId]+'" placeholder="'+data[priceId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+oldId+'" value="'+data[oldId]+'" placeholder="'+data[oldId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+numberId+'" value="'+data[numberId]+'" placeholder="'+data[numberId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+netId+'" value="'+data[netId]+'" placeholder="'+data[netId]+'" class="form-control-plaintext" readonly></div><div  class="col"><input style="text-align : center" type="number" id ="'+sumId+'" value="'+sumValue+'" placeholder="'+sumValue+'" class="form-control-plaintext" readonly></div></div>');
    }
}
var totalId="total";
$('#theForm').append('<br><div class="row"><div  class="col text-primary h2">Grand Total</div><div  class="col"><input type="number" id="grandTotal" placeholder="0" value="'+data[totalId]+'"  class="form-control-plaintext" readonly></div></div>');

$('#exampleModalCenter').modal();

}

$(document).ready(() => {
    var uid;
    var transactions;
    var tokens;
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
            $('#bodyContainer').toggle();
            uid=user.uid;
            $('#userEmail').text('Welcome : '+user.email);
            var postData={'uid':uid};
            $.ajax(
              {
                  url : "/getTransactionsTokens",
                  type: "POST",
                  data : postData,
                  success:function(data, textStatus, jqXHR) 
                  {
                      $('#transactionSearch').toggle();
                      $('#tokenSearch').toggle();
                      $('#customerSearch').toggle();
                      $('#loadingContainer').toggle();
                      if(data.priviledge==="Admin")$('#dashBoard').toggle();
                      transactions=data.transactions;
                      tokens=data.tokens; 
                      console.log(transactions,tokens);
                      makeTransactionTokenRows(transactions,tokens);
                  },
                  error: function(jqXHR, textStatus, errorThrown) { 
                    $('#error').text('Connection Error');
                    document.querySelector('.alert').style.display = 'block';
                    setTimeout(() => {
                      document.querySelector('.alert').style.display = 'none';
                    },3000);
                   }
              });
        }
        else window.location.replace('/');
      });

    $('body').on('submit','#form',function(e){
        e.preventDefault();
        var postData = $(this).serializeArray();
        var id;
        var type=$(this).parent('div').attr('id')
        jQuery.each(postData, (i, field) => {id=field.value;});
        if(type==="transactions"){console.log(transactions[id]);$('#exampleModalLongTitle').text("Transaction Id : "+id);modelTransaction(transactions[id])}
        else {console.log(tokens[id]);$('#exampleModalLongTitle').text("Token Id : "+id);modelToken(tokens[id])}
    });

    $('body').on('submit','#transactionSearch',function(e){
        e.preventDefault();
        var postData = $(this).serializeArray();
        var id;
        jQuery.each(postData, (i, field) => {id=field.value;});
        if(transactions.hasOwnProperty(id)){
          console.log(transactions[id]);
          $('#exampleModalLongTitle').text("Transaction Id : "+id);
          modelTransaction(transactions[id]);
        }
        else {
          console.log("key not found");
          $('#error').text('Transaction Not Found');
          document.querySelector('.alert').style.display = 'block';
          setTimeout(() => {
            document.querySelector('.alert').style.display = 'none';
          },3000);
      }
        
    });

    $('body').on('submit','#tokenSearch',function(e){
        e.preventDefault();
        var postData = $(this).serializeArray();
        var id;
        jQuery.each(postData, (i, field) => {id=field.value;});
        if(tokens.hasOwnProperty(id)){console.log(tokens[id]);$('#exampleModalLongTitle').text("Token Id : "+id);modelToken(tokens[id])}
        else {
          console.log("key not found");
          $('#error').text('Token Not Found');
          document.querySelector('.alert').style.display = 'block';
          setTimeout(() => {
            document.querySelector('.alert').style.display = 'none';
          },3000);
      }
    });

    $('body').on('submit','#customerSearch',function(e){
      // $('#transactionsTokensTable').toggle();
      $('#loadingContainer').toggle();
      e.preventDefault();
      var customerNumber = $("#customerNumberSearch").val();
      var transactionsJson = {};
      for(var i in transactions){
        if(transactions[i].contactNumber===customerNumber) transactionsJson[i]=transactions[i];
      }
      var tokensJson = {};
      for(var i in tokens){
        if(tokens[i].contactNumber===customerNumber) tokensJson[i]=tokens[i];
      }
      makeTransactionTokenRows(transactionsJson,tokensJson);
      // $('#transactionsTokensTable').toggle();
      $('#loadingContainer').toggle();
  });

    $('body').on('click','#logout',()=>{
        firebase.auth().signOut();
    });

    $('#exampleModalCenter').on('hidden.bs.modal', (e) => {
      $('#theForm').empty();
    })

});