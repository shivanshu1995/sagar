function addDropdownCategory(data){
    $('#dropdownCategory').empty();
    $('#dropdownCategory').append('<option>Add Category</option>');
    for(var i in data) if(i.slice(0,4)=="cate"){
        $('#dropdownCategory').append('<option value='+i+'>'+data[i]+'</option>')
    }
}

function addDropdownSubCategory(val,data,id){
    $(id).empty();
    $(id).append('<option>Add SubCategory</option>');
  for(var i in data){
      var a=i.split('_');
      if(a[0]==="subcategory" && val.slice(9)===a[1]) $(id).append('<option value='+i+'>'+data[i]+'</option>');
  }
}

$(document).ready(() => {

    $('#serviceDetails').toggle();
    var addCategoryData={};
    var cashierData={};
    var customerData={};
    var uid;
    var copyCustomerData={};
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
            var subcategoryArray=[];
            var customerNumber = "7844051087";
            $.post("/getName",
            {
                uid : uid,
                number : customerNumber
            },
            (data,status) => {
                 $('#customerName').text("Customer Name : "+data.name);
                 customerData=data;
                 for(var i in customerData) copyCustomerData[i]=customerData[i];
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
                     cashierData=ordered;
                     addCategoryData = {};
                     for(var i in cashierData) addCategoryData[i]=cashierData[i];
                     addDropdownCategory(addCategoryData);
                     $('#theForm').append('<div class="row"><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" value="Previous" style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" id="previous" value='+customerData.amount+' style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" value="Amount" style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" id="grandTotal" value='+customerData.amount+' style="text-align : center" readonly></div><div class="col"><button id="cancel" type="button">Cancel</button></div><div class="col"><button id="submit" type="submit">Submit</button></div></div>');
                });
            });
        }
        else window.location.replace('/');
      });

      $('body').on('change','#dropdownCategory',()=>{
        var val=$('#dropdownCategory').val();
        delete addCategoryData[val];
        addDropdownCategory(addCategoryData);
        $('#theForm').append('<div id='+val+'><div class="row"><div class="col">'+cashierData[val]+'</div><div class="col"><select id="dropdown_'+val+'" class="dropdownSubCategory"></select></div><div class="col"><button id="remove_'+val+'" class="removeCategory">Remove Category</button></div></div></div>');
        var id="#dropdown_"+val;
        addDropdownSubCategory(val,addCategoryData,id);
      });

      $('body').on('change','.dropdownSubCategory',(e)=>{
        var id='#'+(e.target.id);
        var subcat=$(id).val();
        delete addCategoryData[subcat];
        var val=$(id).parent('div').parent('div').parent('div').attr('id');
        addDropdownSubCategory(val,addCategoryData,id);
        val="#"+val;
        var priceId="price_"+subcat.slice(12);
        var pendingId="pending_"+subcat.slice(12);
        var pending="number_"+subcat.slice(12);
        var newId="new_"+subcat.slice(12);
        var totalId="total_"+subcat.slice(12);
        var totalPriceId = "totalPrice_"+subcat.slice(12);
        var totalPrice = (parseInt(cashierData[priceId])*parseInt(customerData[pending])).toString();
        $(val).append('<div id='+subcat+' class="row"><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" value='+cashierData[subcat]+' style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" value='+cashierData[priceId]+' style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" id='+pendingId+' value='+customerData[pending]+' style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2 entryNewItem" type="text" id='+pending+' value="0" style="text-align : center" ></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2" type="text" id='+totalId+' value='+customerData[pending]+' style="text-align : center" readonly></div><div class="col text-primary h2" style="text-align : center"><input class="form-control-plaintext mr-sm-2 entryTotalPrice" type="text" id='+totalPriceId+' value='+totalPrice+' style="text-align : center" readonly></div><div class="col"><button id="remove_'+subcat+'" class="removeSubCategory">Remove Subcategory</button></div></div>');
      });


      $('body').on('input','.entryNewItem',(e)=>{
        var id=(e.target.id);
        var val=$("#"+id).val();
        var pending="number_"+id.slice(7);
        var priceId="price_"+id.slice(7);
        var price=cashierData[priceId];
        var totalId="total_"+id.slice(7);
        var total=(parseInt(val)+parseInt(customerData[pending])).toString();
        var totalPriceId="totalPrice_"+id.slice(7);
        var totalPrice=(parseInt(price)*parseInt(total));
        $("#"+totalId).attr('value',total);
        $("#"+totalPriceId).attr('value',totalPrice);
        if(isNaN(parseInt(val))===false){
          customerData[pending]=total;
          var temp=(parseInt($('#grandTotal').val())+parseInt(val)*parseInt(cashierData[priceId])).toString();
          $('#grandTotal').attr('value',temp);
          customerData.amount=temp;
        }
      });

      $('body').on('click','.removeSubCategory',(e)=>{
        var id=(e.target.id).slice(7);
        addCategoryData[id]=cashierData[id];
        var temp={};
        for(var i in addCategoryData) temp[i]=cashierData[i];
        var unordered=temp;
        var ordered = {};
        Object.keys(unordered).sort().forEach((key) => {
        ordered[key] = unordered[key];
        });
        addCategoryData=ordered;
        var val=$("#"+id).parent('div').attr('id');
        $("#"+id).remove();
        id="#dropdown_"+val;
        addDropdownSubCategory(val,addCategoryData,id);

        var numberId="number_"+(e.target.id).slice(19);
        customerData[numberId]=copyCustomerData[numberId];
        var sum=parseInt(copyCustomerData.amount);
        for(var i in customerData){
          if(i.slice(0,4)=="numb"){
            var priceId="price_"+i.slice(7);
            var numberId="number_"+i.slice(7);
            sum+=(parseInt(cashierData[priceId])*(parseInt(customerData[numberId])-parseInt(copyCustomerData[numberId])));
          }
        }
        customerData.amount=(sum.toString());
        $('#grandTotal').attr('value',sum);
      });

      $('body').on('click','.removeCategory',(e)=>{
        e.preventDefault();
        var id=(e.target.id).slice(7);
        addCategoryData[id]=cashierData[id];
        var categoryId=id.split('_');
        for(var i in cashierData){
          var a=i.split('_');
          if(a[0]==="subcategory" && a[1]===categoryId[1]) addCategoryData[i]=cashierData[i];
        }
        var temp={};
        for(var i in addCategoryData) temp[i]=cashierData[i];
        var unordered=temp;
        var ordered = {};
        Object.keys(unordered).sort().forEach((key) => {
        ordered[key] = unordered[key];
        });
        addCategoryData=ordered;
        addDropdownCategory(addCategoryData);
        id='#'+id;
        $(id).remove();


        var id=(e.target.id).slice(16);
        for(var i in copyCustomerData){
          if(i.slice(0,4)=="numb"){
            var a=i.split('_');
            if(a[1]===id){
              customerData[i]=copyCustomerData[i];
            }
          }
        }
        var sum=parseInt(copyCustomerData.amount);
        for(var i in customerData){
          if(i.slice(0,4)=="numb"){
            var priceId="price_"+i.slice(7);
            var numberId="number_"+i.slice(7);
            sum+=(parseInt(cashierData[priceId])*(parseInt(customerData[numberId])-parseInt(copyCustomerData[numberId])));
          }
        }
        customerData.amount=(sum.toString());
        $('#grandTotal').attr('value',sum);
      });

        $('body').on('click','#submit',(e)=>{
        for(var i in copyCustomerData){
          if(i.slice(0,4)=="numb"){
            customerData[i]-=copyCustomerData[i];
          }
        }
        var postData = customerData;
        var formURL = '/saveToken'
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
                console.log("lag gye");
            }
        });
        e.preventDefault(); //STOP default action
    });
});