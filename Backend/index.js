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
const stripe = require('stripe')('sk_test_51R6atKFpdo6q6bSG0buCqdgjep1xABgwEDhFByVR2TM7E6y9aonEm22KxQGbP0CXTsnZrG44Lp1Y8gLw3isnHJ7z00SnZzufUs');

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

        // Add payment endpoint after your existing endpoints
app.post('/create-checkout-session', fetchUser, async (req, res) => {
    try {
        const { cartItems } = req.body;
        let totalAmount = 0;
        const lineItems = [];

        // Get user's cart data
        const userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create line items from cart
        for (const [productId, quantity] of Object.entries(cartItems)) {
            if (quantity > 0) {
                const product = await Product.findOne({ id: parseInt(productId) });
                if (product) {
                    lineItems.push({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.name,
                                images: [product.image],
                            },
                            unit_amount: Math.round(product.new_price * 100), // Convert to cents
                        },
                        quantity: quantity,
                    });
                    totalAmount += product.new_price * quantity;
                }
            }
        }

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'https://eccomercefullstack.onrender.com/payment-success',
            cancel_url: 'https://eccomercefullstack.onrender.com/cart',
            metadata: {
                userId: req.user.id,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Payment session creation failed' });
    }
});

// Add webhook endpoint to handle successful payments
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret');
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Clear user's cart after successful payment
        try {
            const userId = session.metadata.userId;
            const cart = {};
            for (let i = 0; i < 300; i++) {
                cart[i] = 0;
            }
            await User.findByIdAndUpdate(userId, { cartData: cart });
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }

    res.json({ received: true });
});

// At the end of your server routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Admin Schema
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

// Admin signup endpoint
app.post('/admin/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // Create new admin
        const admin = new Admin({
            email,
            password // In production, hash this password
        });

        await admin.save();

        // Generate token
        const token = jwt.sign(
            { id: admin._id, isAdmin: true },
            'secret_ecom',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token
        });
    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin account'
        });
    }
});

// Admin login endpoint
app.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        if (password !== admin.password) { // In production, use proper password comparison
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id, isAdmin: true },
            'secret_ecom',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// Admin middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        }

        const verified = jwt.verify(token, 'secret_ecom');
        const admin = await Admin.findById(verified.id);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Add Order Schema after existing schemas
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: Number,
        name: String,
        quantity: Number,
        price: Number,
        image: String
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// Add these endpoints after your existing endpoints

// Endpoint to create order after successful payment
app.post('/create-order', fetchUser, async (req, res) => {
    try {
        const { cartItems } = req.body;
        let total = 0;
        const orderProducts = [];

        // Get user data
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create order items from cart
        for (const [productId, quantity] of Object.entries(cartItems)) {
            if (quantity > 0) {
                const product = await Product.findOne({ id: parseInt(productId) });
                if (product) {
                    orderProducts.push({
                        productId: product.id,
                        name: product.name,
                        quantity: quantity,
                        price: product.new_price,
                        image: product.image
                    });
                    total += product.new_price * quantity;
                }
            }
        }

        // Create new order
        const order = new Order({
            userId: user._id,
            products: orderProducts,
            total: total
        });

        await order.save();

        // Clear user's cart
        const emptyCart = {};
        for (let i = 0; i < 300; i++) {
            emptyCart[i] = 0;
        }
        await User.findByIdAndUpdate(user._id, { cartData: emptyCart });

        res.json({ success: true, orderId: order._id });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Endpoint to get all orders (admin)
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Endpoint to get order receipt
app.get('/admin/orders/:orderId/receipt', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('userId', 'name email');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const receipt = {
            orderNumber: order._id,
            date: order.createdAt,
            customer: {
                name: order.userId.name,
                email: order.userId.email
            },
            items: order.products,
            total: order.total
        };

        res.json(receipt);
    } catch (error) {
        console.error('Error generating receipt:', error);
        res.status(500).json({ error: 'Failed to generate receipt' });
    }
});

// Update your payment success webhook to create order
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const event = req.body;
        
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Create order for the successful payment
            const response = await fetch('http://localhost:4000/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': session.metadata.auth_token
                },
                body: JSON.stringify({
                    cartItems: JSON.parse(session.metadata.cartItems)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).end();
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