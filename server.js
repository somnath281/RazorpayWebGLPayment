const express = require("express");
const Razorpay = require('razorpay');
var app = express();
//app.use(express.json());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://ec2-13-233-105-244.ap-south-1.compute.amazonaws.com:5500/"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var instance = new Razorpay({
    key_id: 'rzp_test_UzrsbtNQRXODlk',
    key_secret: 'IlJTD3IDDePBnhEkrULiyIXY',
  });

app.post('/payment/createOrder/', (req, res) => {
    //console.log("Success "+req.body);
    const {amount,currency,receipt, notes}  = req.body;      
        
    // STEP 2:    
    instance.orders.create({amount, currency, receipt, notes}, 
        (err, order)=>{
          
          //STEP 3 & 4: 
          if(!err){
            console.log(order);
            res.json(order)
          }
          else
            res.send(err);
        }
    )
});

app.post('/payment/verifyOrder/',  (req, res)=>{ 
      
  // STEP 7: Receive Payment Data
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature,key_secret} = req.body;
  console.log(key_secret);
  // STEP 8: Verification & Send Response to User
  var crypto = require("crypto");
  // Creating hmac object 
  let hmac = crypto.createHmac('sha256', key_secret); 

  // Passing the data to be hashed
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    
  // Creating the hmac in the required format
  const generated_signature = hmac.digest('hex');
    
    
  if(razorpay_signature===generated_signature){
      res.json({success:true, message:"Payment has been verified"})
  }
  else{
      res.json({success:false, message:"Payment verification failed"})
  }
});

app.listen(8000,()=>{
    console.log("Server Started!");
});