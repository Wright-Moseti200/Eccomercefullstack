const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://wright:marani001@cluster0.ccyxm.mongodb.net/ecommerce');

//API creation
app.get("/",(req,res)=>
    {
        res.send("Express App is running");    
    });

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dvexzhis9', // Replace with your Cloudinary credentials
  api_key: '357754644141572',
  api_secret: 'W8QHODGRKexhcSpUXCfaHD6aVh4'
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({storage: storage});

// Keep the old local storage endpoint for backward compatibility
app.use('/images', express.static('upload/images'));

// Update the upload endpoint to use Cloudinary
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: req.file.path // Cloudinary returns the full URL in req.file.path
    });
});

// Shema for creating product
const Product = mongoose.model('Product',
  {
    id:
    {type:Number,
      require:true},

      name:
      {type:String,
        require:true},

        image:{
          type:String,
          require:true
        },

        category:
        {type:String,
          require:true},

          new_price:{type:Number,
            require:true},

            old_price:{type:Number,
              require:true},

              date:{type:Date,
                default:Date.now},

                available:{type:Boolean,
                  require:true}
  });

//Creating  Api for adding product
  app.post('/addproduct',async(req,res)=>
    {
      let products = await Product.find({});
      let id;
      if(products.length>0)
        {
          let last_product_array = products.slice(-1);
          let last_product = last_product_array[0];
          id = last_product.id+1;
        }
        else
        {
          id = 1;
        }
        
      const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
      });
      console.log(product);
      await product.save(); 
      console.log("Saved");
      res.json({
        success:true,
        name:req.body.name,
      });
    });
     
// Creating API for deleting products
app.delete('/removeproduct',async(req,res)=>
  {
   await Product.findOneAndDelete({id:req.body.id});
   console.log("Deleted");
   res.json({
     success:true,
     name:req.body.name,
   });
  });


  // Creating API for getting all products
  app.get('/allproducts',async(req,res)=>
    {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
    });

    // Schema creating for User Model
    const User = mongoose.model('Users',
      {
        name:
        {type:String,
          require:true},

          email:
          {type:String,
            unique:true},

            password:
            {type:String,
              require:true},

              cartData:{
                     type:Object,
              },

              date:{type:Date,
                default:Date.now()}
      })

      // Creating Endpoint for registering the user
      app.post('/signup', async(req, res) => {
        try {
          let check = await User.findOne({email: req.body.email});
          if(check) {
            return res.status(409).json({
              success: false,
              message: "User already exists"
            });
          }
          // Initialize cart properly in the signup endpoint
const cart = {};
for (let i = 1; i < 300; i++) {
  cart[i] = 0;
}

const user = new User({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password,
  cartData: cart // Now cart is defined
});

          
          await user.save();
          
          // Generate token and send success response
          const data = {
            user: {
              id: user.id
            }
          }
          const token = jwt.sign(data, 'secret_ecom');
          res.json({
            success: true,
            token: token
          });
        } catch (error) {
          // Handle duplicate key error
          if (error.code === 11000) {
            return res.status(409).json({
              success: false,
              message: "Email already registered"
            });
          }
        }
      })
    
        // creating endpoint for user login
        app.post('/login',async(req,res)=>
          {
            let user = await User.findOne({
              email:req.body.email
            });

            if(user)
              {
                const passCompare = req.body.password===user.password; 
                if(passCompare){
                  const data = {
                    user:{
                      id:user.id
                    }
                  }
                  const token = jwt.sign(data,'secret_ecom');
                  res.json({
                    success:true,
                    token:token
                  });
                } 
                else{
                  res.json({
                    success:false,
                    message:"Invalid Password"
                  });
                }   
              }
              else{
                res.json({
                  success:false,
                  message:"User not found"
                });
              }
          }
        );


        // creating endpint for new collection data
        app.get('/newcollections',async(req,res)=>{
          let products = await Product.find({});
          let newcollection = products.slice(1).slice(-8);
          console.log("NewCollection Fetched");
          res.send(newcollection);
        });

        // creating endpoint for popular in women section
        app.get('/popularinwomen',async(req,res)=>{
          let products = await Product.find({category:"women"});
          let popular_in_women = products.slice(0,4);
          console.log("Popular in women fetched");
          res.send(popular_in_women);
        });
        // creating middleware to fetch user
        const fetchUser = async(req,res,next)=>
          {
            const token = req.header('auth-token');
            if(!token){
              res.status(401).send({errors:"Please authenticate using valid token"})
            }
            else{
              try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user
                next();
              }
              catch(error){
                 res.status(401).send({error:"Please authenticate using valid token"})
              }
            }
          }

        // creating endpoint for adding product in cartdata
        app.post('/addtocart',fetchUser,async(req,res)=>{
          console.log("Added",req.body.itemId);
         let userData = await User.findOne({_id:req.user.id});
         userData.cartData[req.body.item]+=1;
         await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
         res.send("Added");
        });

        //creating endpoint to remove product from cartdata
        app.post('/removefromcart',fetchUser,async(req,res)=>{
          console.log("removed",req.body.itemId);
          let userData = await User.findOne({_id:req.user.id});
          if( userData.cartData[req.body.item]>0)
          {
         userData.cartData[req.body.item]-=1;
         await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
         res.send("Removed");
          }
        })
        
        //creating endpoint to get cartdata
        app.post('/getcart',fetchUser,async(req,res)=>{
          console.log("GetCart");
          let userData = await User.findOne({_id:req.user.id});
          res.json(userData.cartData);
        })

// Replace existing M-Pesa config with new one
const MPESA_CONFIG = {
    CONSUMER_KEY: '9SurPAHWbEGr2V7UiO6V87B0VjbhAXu5wKOMSO3SacICTgeV',
    CONSUMER_SECRET: '7A1Q7SviK0RueVAev49lqo8e1LLyvp4JUjGZ1khcAeDBGYbcAW3U5ArngfpAJEq8',
    SHORTCODE: '174379',
    PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    BASE_URL: 'https://sandbox.safaricom.co.ke',
    CALLBACK_URL: 'https://eccomercebackend-u1ce.onrender.com/mpesa-callback'
};

// Add utility functions
function generateTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generatePassword(shortcode, passkey, timestamp) {
    const combinedString = `${shortcode}${passkey}${timestamp}`;
    return Buffer.from(combinedString).toString('base64');
}

// Add access token generation
async function getAccessToken() {
    const auth = Buffer.from(`${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`).toString('base64');
    
    try {
        const response = await fetch(`${MPESA_CONFIG.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Access Token Error:', error);
        throw error;
    }
}

// Update Payment Schema
const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    mpesaRequestId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: String,
    resultCode: String,
    resultDesc: String,
    cartItems: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);

// Update initiate-payment endpoint
app.post('/initiate-payment', fetchUser, async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;
        const formattedPhone = phoneNumber.replace(/^0/, '254');
        
        const timestamp = generateTimestamp();
        const password = generatePassword(
            MPESA_CONFIG.SHORTCODE, 
            MPESA_CONFIG.PASSKEY, 
            timestamp
        );

        const accessToken = await getAccessToken();

        const response = await fetch(`${MPESA_CONFIG.BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BusinessShortCode: MPESA_CONFIG.SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount),
                PartyA: formattedPhone,
                PartyB: MPESA_CONFIG.SHORTCODE,
                PhoneNumber: formattedPhone,
                CallBackURL: MPESA_CONFIG.CALLBACK_URL,
                AccountReference: `Order_${Date.now()}`,
                TransactionDesc: 'Payment for order'
            })
        });

        const data = await response.json();

        const payment = new Payment({
            userId: req.user.id,
            phoneNumber: formattedPhone,
            amount: amount,
            mpesaRequestId: data.CheckoutRequestID,
            status: 'pending'
        });
        await payment.save();

        res.json({
            success: true,
            message: 'Payment request sent. Please check your phone.',
            checkoutRequestId: data.CheckoutRequestID
        });

    } catch (error) {
        console.error('M-Pesa Payment Error:', error);
        res.status(500).json({ 
            error: 'Payment initiation failed',
            details: error.message
        });
    }
});

// Update callback endpoint
app.post('/mpesa-callback', async (req, res) => {
    try {
        const { Body } = req.body;
        
        if (!Body || !Body.stkCallback) {
            return res.status(400).json({ error: 'Invalid callback data' });
        }

        const { 
            CheckoutRequestID, 
            ResultCode, 
            ResultDesc,
            CallbackMetadata 
        } = Body.stkCallback;

        const payment = await Payment.findOne({ mpesaRequestId: CheckoutRequestID });
        
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        payment.status = ResultCode === 0 ? 'completed' : 'failed';
        payment.resultCode = ResultCode;
        payment.resultDesc = ResultDesc;

        if (ResultCode === 0 && CallbackMetadata) {
            const transactionDetails = CallbackMetadata.Item.reduce((acc, item) => {
                acc[item.Name] = item.Value;
                return acc;
            }, {});

            payment.transactionId = transactionDetails.MpesaReceiptNumber;
        }

        await payment.save();
        res.json({ ResultCode: 0, ResultDesc: 'Success' });

    } catch (error) {
        console.error('Callback Processing Error:', error);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
});

// Add status check endpoint
app.get('/payment-status/:checkoutRequestId', fetchUser, async (req, res) => {
    try {
        const payment = await Payment.findOne({ 
            mpesaRequestId: req.params.checkoutRequestId,
            userId: req.user.id 
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({
            status: payment.status,
            resultDesc: payment.resultDesc
        });
    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

// Add admin orders endpoint
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Payment.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $addFields: {
                    userName: { $arrayElemAt: ['$user.name', 0] }
                }
            },
            {
                $project: {
                    user: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.listen(port,(error)=>
    {
        if(error)
        {
            console.log("Error in starting server");
        }
        else
        {
            console.log("Server started on port",port);
        }
    });
    