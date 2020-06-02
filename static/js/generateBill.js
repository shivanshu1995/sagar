$(document).ready(() => {

$('#serviceDetails').toggle();
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
    if(user){uid=user.uid;
    $('#loadingContainer').toggle();
    $('#bodyContainer').toggle();
    $('#userEmail').text('Welcome : '+user.email);
}
    else window.location.replace('/');
  });

var subcategoryArray=[];
var customerNumberData={};
$('#getCustomerNameButton').on('click',(e) => {
    e.preventDefault();
    $('#loadingContainer').toggle();
    $('#bodyContainer').toggle();    
    var customerNumber = $('#customerNumber').val();
    $.post("/getName",
    {
        uid : uid,
        number : customerNumber
    },
    (data,status) => {
         $('#customerName').text(data.name);
         customerNumberData=data;
         $('#getCustomerName').toggle(); 
         $('#serviceDetails').toggle();
         $.post("/getData",
         {
             uid : uid
         },
         (data,status) => {
             var unordered=data;
             var ordered = {};
             Object.keys(unordered).sort().forEach((key) => {
             ordered[key] = unordered[key];
             });
             data=ordered;

             $('#theForm').append('<div class="row"><div class="col-3 text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" placeholder="SubCategory" style="text-align : center" readonly></div><div class="col-2 text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" placeholder="Price" style="text-align : center" readonly></div><div class="col-2 text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" placeholder="Value" style="text-align : center" readonly></div><div class="col-2 text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" placeholder="Requested" style="text-align : center" readonly></div><div class="col-3 text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" placeholder="Total Price" style="text-align : center" readonly></div></div>')

             for(var i in data){
                 if(i.slice(0,4)==="cate"){
                     $('#theForm').append('<div id="'+i+'"><div class="row"><div class="col-sm text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" id="'+i+'" placeholder="'+data[i]+'" style="text-align : center" readonly></div></div></div>');
                 }
                 else if(i.slice(0,4)==="subc"){
                     subcategoryArray.push(i);
                     var priceId="price_"+i.slice(12);
                     var numberId="number_"+i.slice(12);
                     var sumId=i+'_sum';
                     var sumValue = (parseInt(customerNumberData[numberId])*parseInt(data[priceId]))
                     $("#category_"+i[12]).append('<div id="'+i+'" class="row"><div class="col-3 text-primary h4" style="text-align : center"><input class="form-control-plaintext mr-sm-2" style="text-align : center" type="text" id="'+i+'" value="'+data[i]+'" placeholder="'+data[i]+'" readonly></div><div class="col-2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" style="text-align : center" type="number" id ="'+priceId+'" value="'+data[priceId]+'" placeholder="'+data[priceId]+'" readonly></div><div class="col-2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" style="text-align : center" type="number" value="'+customerNumberData[numberId]+'"readonly></div><div class="col-2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" style="text-align : center" type="number" id="numValue" name="'+numberId+'" placeholder="'+customerNumberData[numberId]+'"  value="'+customerNumberData[numberId]+'"></div><div class="col-3" style="text-align : center"><input class="form-control-plaintext mr-sm-2" style="text-align : center" type="number" id="'+sumId+'" value="'+sumValue+'" placeholder="'+sumValue+'" readonly></div></div>');
                 }
             }

             $('#theForm').append('<br><div class="row"><div class="col-11 text-primary h2" style="text-align : center">Grand Total</div><div class="col-1 text-primary h2" style="text-align : center"><input type="number" id="grandTotal" value="0" placeholder="0"  class="form-control-plaintext mr-sm-2" readonly></div></div>');
             var grandSum = 0;
             for(var j in subcategoryArray){
                 var id = "#"+subcategoryArray[j]+"_sum";
                 grandSum+=parseInt($(id).attr('placeholder'));
             }
             $('#grandTotal').val(grandSum);
            //  $('#grandTotal').attr("placeholder", grandSum);
 
             $('body').on("input",'#numValue' ,function(){
                 var v=$(this).parent('div').parent('div').attr('id');
                 var priceId="#price_"+v.slice(12);
                 var sumId='#'+v+'_sum';
                 var priceVal=parseInt($(priceId).attr('placeholder'));
                 var numberVal=parseInt($(this).val());
                 var num = numberVal*priceVal;
                 $(sumId).val(num);
                //  $(sumId).attr("placeholder", num);
                 var grandSum = 0;
                 for(var i in subcategoryArray){
                     var id = "#"+subcategoryArray[i]+"_sum";
                     grandSum+=parseInt($(id).val());
                 }
                 $('#grandTotal').val(grandSum);
                //  $('#grandTotal').attr("placeholder", grandSum);
             });
             $('#loadingContainer').toggle();
             $('#bodyContainer').toggle();
             $('#theForm').append('<div class="row"><div class="col-9"></div><div><button id="cancel" class="btn btn-primary">Cancel</button></div><div class="col-1"></div><div><button type="submit"class="btn btn-primary">Submit</button></div></div>');
             }).catch((error) => {
                $('#loadingContainer').toggle();
                $('#bodyContainer').toggle();
                 $('#error').text('Error in getting data.');
                 document.querySelector('.alert').style.display = 'block';
                 setTimeout(() => {
                   document.querySelector('.alert').style.display = 'none';
                 },3000);
             });
             $("#theForm").submit(function(e){
                $('#loadingContainer').toggle();
                $('#bodyContainer').toggle();
                 var postData = $(this).serializeArray();
                 postData.push({name: 'name', value: customerNumberData.name},{name: 'contactNumber', value: customerNumberData.contactNumber},{name: 'uid', value: uid});
                 var formURL = '/saveBill'
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
                         $('#error').text('Requested Value can not be less than 0 or greater than previous value. Try Again!!!');
                         document.querySelector('.alert').style.display = 'block';
                         setTimeout(() => {
                           document.querySelector('.alert').style.display = 'none';
                         },3000);
                     }
                 });
                 e.preventDefault(); //STOP default action
             });
        }).catch((error) => {
            $('#loadingContainer').toggle();
            $('#bodyContainer').toggle();
            $('#error').text('Given Customer Number is not registered.  Try Again with Correct Number !!!!');
            document.querySelector('.alert').style.display = 'block';
            setTimeout(() => {
            document.querySelector('.alert').style.display = 'none';
            },3000);
        })
    });
    $('body').on('click','#logout',()=>{
        firebase.auth().signOut();
    });
    $('body').on('click','#cancel',()=>{
        window.location.replace('/cashierPage');
    });
});