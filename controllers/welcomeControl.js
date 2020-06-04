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

firebase = require('firebase-admin')
var serviceAccount = require("../melfire-b4cd5-firebase-adminsdk-owytx-efdfe6eee2.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://melfire-b4cd5.firebaseio.com"
});

var firestore = firebase.firestore();


function modifyJson(data){
  var category=data;
      var temp = {
        "name" : data.name,
        "contactNumber" : data.contactNumber,
        "priviledge" : data.priviledge,
        "email" : data.email,
        "password" : data.password,
        "address" : data.address,
        category
      };
      delete data.name;
      delete data.contactNumber;
      delete data.priviledge;
      delete data.email;
      delete data.password;
      delete data.address;
      return temp;
}

function getTimestamp(){
  let timestamp=firebase.firestore.Timestamp.now().toMillis();
  return timestamp;
}

function convertToDateTime(timestamp){
  var dateTimeObj=new Date(timestamp);
  var date=dateTimeObj.toDateString();
  var time=dateTimeObj.toTimeString().slice(0,8);
  var dateTime = date+" "+time;
  return dateTime;
}

function generateBillDataFormat(receivedData,timestamp,category){
  var data={
    "name" : receivedData.name,
    "contactNumber" : receivedData.contactNumber,
    "transactionId" : timestamp
  }
  var total=0;
  for(var i in category){
    if(i.slice(0,4)==="cate"){ data[i]=category[i]; }
    else if(i.slice(0,4)==="subc"){
      var priceId="price_"+i.slice(12);
      var numberId="number_"+i.slice(12);
      data[i]=category[i];
      data[priceId]=category[priceId];
      data[numberId]=receivedData[numberId];
      total = total + (parseInt(receivedData[numberId])*parseInt(category[priceId]));
    }
  }
  data["total"]=total;
  return data;
}


async function asyncGetTransactionsTokens(uid){
    var priviledge;
    var userEmail;
    var transactions={};
    var tokens={};
    try{
    let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
    let b=await firestore.collection("cashier").doc(userEmail).collection("transactions").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      transactions[doc.id]=doc.data();
    })});
    let c=await firestore.collection("cashier").doc(userEmail).collection("tokens").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    tokens[doc.id]=doc.data();})});
    let d=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc)=>{priviledge=doc.data().priviledge;});

    var data={
      "transactions" : transactions,
      "tokens" : tokens,
      "priviledge" : priviledge
    };
    return Promise.resolve(data);
    }
    catch(error){
    }
}

async function asyncGetName(uid,number){
  var userEmail;
  var data={};
  try{
    let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
    let b=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(number).collection("details").doc("details").get().then((doc) => {
      if(doc.exists){ data=doc.data();}
      else{ data=null} });
    if(data)  return Promise.resolve(data);
    else return Promise.reject();
  }catch(error){ return Promise.reject(error);}
}

async function asyncGetData(uid){
  var userEmail;
  var data={};
  try{
    let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
    let b=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc) => {
        data=doc.data().category;});
    return Promise.resolve(data);
  }catch(error){ return Promise.reject(error);}
}

async function asyncSaveCustomer(uid,number,temp){
  var data={
    "name":temp.name,
    "contactNumber":temp.contactNumber
  }
  var flag=false;
  var userEmail;
  var category;
  try{
  let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
  let b=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc) => {category=doc.data().category;});
  let c =await firestore.collection("cashier").doc(userEmail).collection("customer").doc(temp.contactNumber).collection("details").doc("details").get().then((doc) => { if(doc.exists) {flag=true}})
  if(flag){return Promise.reject();}
  else{
    for (var i in category){
        if(i.slice(0,4)==="subc"){
          var numberId="number_"+i.slice(12);
          data[numberId]="0";
        }
      }
      var amount="amount"
      data[amount]="0";
      let d = await firestore.collection("cashier").doc(userEmail).collection("customer").doc(temp.contactNumber).collection("details").doc("details").set(data).catch((error) => {});
    
      return Promise.resolve();
  }
  }catch(error){ return Promise.reject(error); }
}

async function asyncSaveToken(receivedData,timestamp){
  console.log(receivedData,timestamp);
  var uid=receivedData.uid;
  var userEmail;
  var category;
  var customerData;
  try{
    let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
    let b=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc) => {
        category=doc.data().category;});
    let z=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedData.contactNumber).collection("details").doc("details").get().then((doc) => {
      if(doc.exists){ customerData=doc.data()}}).catch((error)=>{return Promise.reject()});
  
  var data={
    "name" : receivedData.name,
    "contactNumber" : receivedData.contactNumber,
    "transactionId" : timestamp
  }
  var total=0;
  for(var i in category){
    if(i.slice(0,4)==="cate"){ data[i]=category[i]; }
    else if(i.slice(0,4)==="subc"){
      var priceId="price_"+i.slice(12);
      var numberId="number_"+i.slice(12);
      var oldId="old_"+i.slice(12);
      var netId="net_"+i.slice(12);
      var netSum=(parseInt(customerData[numberId])+parseInt(receivedData[numberId])).toString();
      data[i]=category[i];
      data[priceId]=category[priceId];
      data[oldId]=customerData[numberId];
      data[numberId]=receivedData[numberId];
      data[netId]=netSum;
      total = total + (netSum*parseInt(category[priceId]));
    }
  }
  data["total"]=total;

  if(customerData.name!==receivedData.name ||  customerData.contactNumber!==receivedData.contactNumber){return Promise.reject();}
  var numberLengthReceivedCustomerData = 0;
  var numberLengthOldCustomerData = 0;
  for(var i in receivedData){ if(i.slice(0,4)==="numb"){
    if(receivedData[i]<0){return Promise.reject();}
    numberLengthReceivedCustomerData+=1;
    if(receivedData[i]===0){numberLengthOldCustomerData+=1;}
  }
}
  if(numberLengthOldCustomerData===numberLengthReceivedCustomerData){return Promise.reject();}

  let c=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedData.contactNumber).collection("tokens").doc(timestamp).set({"tokenId" : timestamp}).catch((error) => {return Promise.reject();});

  let d=await firestore.collection("cashier").doc(userEmail).collection("tokens").doc(timestamp).set(data).catch((error) => {return Promise.reject();});

  for (var i in receivedData){var netId="net"+i.slice(6); if(i.slice(0,4)==="numb") receivedData[i]=data[netId];}
  let e=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedData.contactNumber).collection("details").doc("details").set(receivedData).catch((error) => {return Promise.reject();});
  
  return Promise.resolve();

    }catch(error){return Promise.reject()}
}

async function asyncSaveBill(receivedCustomerData){
  var uid=receivedCustomerData.uid;
  var userEmail;
  var category;
  var customerData;

  try{
    let a= await firebase.auth().getUser(uid).then((userRecord) => { userEmail = userRecord.email});
    let b=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc) => {
        category=doc.data().category;});
    let z=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedCustomerData.contactNumber).collection("details").doc("details").get().then((doc) => {
      if(doc.exists){ customerData=doc.data()}}).catch((error)=>{return Promise.reject()})
  
  
  if(customerData.name!==receivedCustomerData.name ||  customerData.contactNumber!==receivedCustomerData.contactNumber){return Promise.reject()}
  var numberLengthReceivedCustomerData = 0;
  var numberLengthOldCustomerData = 0;
  for(var i in receivedCustomerData){ if(i.slice(0,4)==="numb"){numberLengthOldCustomerData+=1;
    if(receivedCustomerData[i]===0)numberLengthReceivedCustomerData+=1;
    if((customerData[i]) < (receivedCustomerData[i]) || receivedCustomerData[i]<0){return Promise.reject()}}}
    if(numberLengthReceivedCustomerData===numberLengthOldCustomerData) return Promise.reject();

    var timestamp = getTimestamp().toString();
    var data=generateBillDataFormat(receivedCustomerData,timestamp,category);

    let c=await firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedCustomerData.contactNumber).collection("transactions").doc(timestamp).set({"timestamp" : timestamp}).catch((error)=>{return Promise.reject()});
    let d=await firestore.collection("cashier").doc(userEmail).collection("transactions").doc(timestamp).set(data).catch((error)=>{return Promise.reject()});


        for(var i in receivedCustomerData) if(i.slice(0,4)==="numb"){ receivedCustomerData[i]=customerData[i]-receivedCustomerData[i]; }
        delete receivedCustomerData.address;

    let e = firestore.collection("cashier").doc(userEmail).collection("customer").doc(receivedCustomerData.contactNumber).collection("details").doc("details").set(receivedCustomerData).catch((error)=>{return Promise.reject()});

    return Promise.resolve();
  }catch(error){return Promise.reject()}
}

async function asyncGetPriviledge(userEmail){
  var priviledge;
  let a=await firestore.collection("adminCashierDetails").doc(userEmail).get().then((doc)=>{priviledge=doc.data().priviledge;}).catch((error)=>{console.log(error)});
  return Promise.resolve(priviledge);

}

module.exports = {

    test : function(req,res,next){
        let timestamp=firebase.firestore.Timestamp.now().toMillis();
        res.render('test',{timestamp:timestamp});
    },

    showIndexPage : (req,res,next)=>{
      res.set('Cache-Control','public,max-age=300,s-maxage=600'); 
      res.render('index')
    },

    showCashierPage : function(req,res, next){
              res.set('Cache-Control','public,max-age=300,s-maxage=600');
              res.render("cashierPage");
    },

    showDashboard : function(req,res,next){
      res.render('dashboard');
    },

    showAddAdminCashier : function(req,res,next){  
        res.render('addAdminCashier',{ error : '' } );
    },

    saveAddAdminCashierData : function(req,res,next){
      var data = modifyJson(req.body);
      var email = data.email;
      var password = data.password;
      firebase.auth().createUser({
        email: email,
        password: password
      });
      var query = firestore.collection("adminCashierDetails").doc(data.email);
      query.set(data).then(() => {
        res.render('dashboard');
      }).catch((error) => {
        if(error){
          res.render('addAdminCashier',{ error : error });
        }
      })
    },

    showGenerateBill : function(req,res,next){
      res.set('Cache-Control','public,max-age=300,s-maxage=600');
      res.render('generateBill');
    },

    getData : function(req, res, next){
      asyncGetData(req.body.uid).then((data) => { res.send(data);}).catch((error) => {res.status(500).send()});
    },

    showAddCustomer : function(req, res, next){
      res.set('Cache-Control','public,max-age=300,s-maxage=600');
      res.render('addCustomer');

    },

    saveCustomer : function(req, res, next){
      var temp=req.body;
      asyncSaveCustomer(req.body.uid,req.body.number,temp).then(() => {res.status(200).send()}).catch((error) => {res.status(500).send()})
      
    },

    getName : function(req,res,next){
      asyncGetName(req.body.uid,req.body.number).then((data) => {res.send(data);}).catch((error) => {res.status(500).send()});     
    },

    saveBill : function(req,res,next){
      var receivedCustomerData=JSON.parse(JSON.stringify(req.body));
      asyncSaveBill(receivedCustomerData).then(()=>res.status(200).send()).catch(()=>res.status(500).send())
    },

    showGenerateToken : function(req,res,next){
      res.set('Cache-Control','public,max-age=300,s-maxage=600');
      res.render('generateToken');
    },

    saveToken : function(req,res,next){
      var receivedData=JSON.parse(JSON.stringify(req.body));
      var timestamp = getTimestamp().toString();
      asyncSaveToken(receivedData,timestamp).then(()=>{res.status(200).send()}).catch(()=>{res.status(500).send()});
    },

    // getConfigurationData : function(req,res,next){
    //   res.send(firebaseConfig);
    // },
    
    getTransactionsTokens : function(req,res,next){
      asyncGetTransactionsTokens(req.body.uid).then((data) => {res.send(data);}).catch((error) => {res.status(500).send()});
    },

    getPriviledge : function(req,res,next){
      asyncGetPriviledge(req.body.userEmail).then((data)=>{res.send(data)}).catch((error)=>{res.status(500).send()});
    }


}