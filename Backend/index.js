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

// Add M-Pesa credentials
const MPESA_CONFIGS = {
    ACCESS_TOKEN: 'c9SQxWWhmdVRlyh0zh8gZDTkubVF',
    SHORTCODE: '601426',
    PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    BASE_URL: 'https://sandbox.safaricom.co.ke',
    CALLBACK_URL: 'https://eccomercebackend-u1ce.onrender.com/mpesa-callback'
};

// Add M-Pesa payment endpoint
app.post('/initiate-payment', fetchUser, async (req, res) => {
    try {
        const { phoneNumber, amount, cartItems } = req.body;

        // Validate phone number (should be Kenyan format)
        const formattedPhone = phoneNumber.replace(/^0/, '254').replace(/^\+/, '');
        if (!/^254\d{9}$/.test(formattedPhone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        const timestamp = moment().format('YYYYMMDDHHmmss');
        const password = Buffer.from(`${MPESA_CONFIGS.SHORTCODE}${MPESA_CONFIGS.PASSKEY}${timestamp}`).toString('base64');

        // Initiate STK Push using the provided access token
        const stkResponse = await axios.post(
            `${MPESA_CONFIGS.BASE_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: MPESA_CONFIGS.SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount),
                PartyA: formattedPhone,
                PartyB: MPESA_CONFIGS.SHORTCODE,
                PhoneNumber: formattedPhone,
                CallBackURL: MPESA_CONFIGS.CALLBACK_URL,
                AccountReference: `Order_${Date.now()}`,
                TransactionDesc: 'Payment for order'
            },
            {
                headers: {
                    Authorization: `Bearer ${MPESA_CONFIGS.ACCESS_TOKEN}`
                }
            }
        );

        // Save payment request
        const payment = new Payment({
            userId: req.user.id,
            phoneNumber: formattedPhone,
            amount: amount,
            mpesaRequestId: stkResponse.data.CheckoutRequestID,
            cartItems: cartItems
        });
        await payment.save();

        res.json({
            success: true,
            message: 'Payment request sent. Please check your phone.',
            checkoutRequestId: stkResponse.data.CheckoutRequestID
        });

    } catch (error) {
        console.error('M-Pesa payment error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

// Add M-Pesa callback endpoint
app.post('/mpesa-callback', async (req, res) => {
    try {
        const { Body: { stkCallback: { CheckoutRequestID, ResultCode, ResultDesc } } } = req.body;

        const payment = await Payment.findOne({ mpesaRequestId: CheckoutRequestID });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (ResultCode === 0) {
            // Payment successful
            payment.status = 'completed';
            await payment.save();

            // Clear user's cart
            const emptyCart = {};
            for (let i = 0; i < 300; i++) {
                emptyCart[i] = 0;
            }
            await User.findByIdAndUpdate(payment.userId, { cartData: emptyCart });
        } else {
            payment.status = 'failed';
            payment.failureReason = ResultDesc;
            await payment.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('M-Pesa callback error:', error);
        res.status(500).json({ error: 'Callback processing failed' });
    }
});

// Add Payment Schema if not already present
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