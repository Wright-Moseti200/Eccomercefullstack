require('dotenv').config();
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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('./models/Order');

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

        // Add this after your existing endpoints
        app.post('/create-checkout-session', async (req, res) => {
          try {
            const { cartItems, userId } = req.body;
            
            // Get user's cart data
            const userData = await User.findById(userId);
            if (!userData) {
              return res.status(404).json({ error: "User not found" });
            }
        
            // Create line items for Stripe
            const lineItems = await Promise.all(
              Object.entries(cartItems).map(async ([productId, quantity]) => {
                if (quantity > 0) {
                  const product = await Product.findOne({ id: parseInt(productId) });
                  return {
                    price_data: {
                      currency: 'usd',
                      product_data: {
                        name: product.name,
                        images: [product.image],
                      },
                      unit_amount: Math.round(product.new_price * 100), // Stripe expects amount in cents
                    },
                    quantity: quantity,
                  };
                }
              })
            );
        
            // Filter out null values
            const filteredLineItems = lineItems.filter(item => item);
        
            // Create Stripe session
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: filteredLineItems,
              mode: 'payment',
              success_url: `${process.env.BACKEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.BACKEND_URL}/payment-cancel`,
            });
        
            res.json({ url: session.url });
          } catch (error) {
            console.error('Payment error:', error);
            res.status(500).json({ error: 'Payment session creation failed' });
          }
        });
        
        // Payment success endpoint
        app.get('/payment-success', async (req, res) => {
          try {
            const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
            // Clear user's cart after successful payment
            if (session.payment_status === 'paid') {
              // You might want to save the order details to your database here
              res.redirect(`${process.env.FRONTEND_URL}/order-success`);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/order-failed`);
          }
        });

        // Add this after your User schema
const Admin = mongoose.model('Admin', {
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  },
  isAdmin: {
      type: Boolean,
      default: true
  }
});

// Add admin login endpoint
app.post('/admin/login', async (req, res) => {
  try {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin) {
          return res.status(401).json({
              success: false,
              message: "Invalid credentials"
          });
      }

      if (admin.password === req.body.password) {
          const token = jwt.sign(
              { id: admin._id, isAdmin: true },
              'secret_ecom',
              { expiresIn: '24h' }
          );
          res.json({
              success: true,
              token,
              isAdmin: true
          });
      } else {
          res.status(401).json({
              success: false,
              message: "Invalid credentials"
          });
      }
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Server error"
      });
  }
});

// Add endpoint to get all orders
app.get('/admin/orders', async (req, res) => {
  try {
      const orders = await Order.find()
          .populate('user', 'name email')
          .sort({ date: -1 });
      res.json(orders);
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error fetching orders"
      });
  }
});

// Add endpoint to generate receipt
app.get('/admin/orders/:orderId/receipt', async (req, res) => {
  try {
      const order = await Order.findById(req.params.orderId)
          .populate('user', 'name email')
          .populate('items.product');
          
      if (!order) {
          return res.status(404).json({
              success: false,
              message: "Order not found"
          });
      }

      // Generate receipt data
      const receiptData = {
          orderNumber: order._id,
          date: order.date,
          customer: {
              name: order.user.name,
              email: order.user.email
          },
          items: order.items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price
          })),
          total: order.total
      };

      res.json({
          success: true,
          receipt: receiptData
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error generating receipt"
      });
  }
});

// Add this payment endpoint
app.post('/create-payment', fetchUser, async (req, res) => {
  try {
      const { cartItems } = req.body;
      
      // Calculate order total and create line items
      const lineItems = [];
      let totalAmount = 0;
      
      for (const [productId, quantity] of Object.entries(cartItems)) {
          if (quantity > 0) {
              const product = await Product.findOne({ id: parseInt(productId) });
              if (product) {
                  lineItems.push({
                      price_data: {
                          currency: 'usd',
                          product_data: {
                              name: product.name,
                              images: [product.image]
                          },
                          unit_amount: Math.round(product.new_price * 100)
                      },
                      quantity: quantity
                  });
                  totalAmount += product.new_price * quantity;
              }
          }
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/cart`,
          metadata: {
              userId: req.user.id
          }
      });

      // Create order in database
      const order = new Order({
          userId: req.user.id,
          products: lineItems.map(item => ({
              productId: item.price_data.product_data.name,
              quantity: item.quantity,
              name: item.price_data.product_data.name,
              price: item.price_data.unit_amount / 100
          })),
          total: totalAmount,
          stripePaymentId: session.id
      });
      await order.save();

      res.json({ url: session.url });
  } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Payment failed' });
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